import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaCamera, FaSave, FaEdit } from 'react-icons/fa';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiLock, FiBriefcase } from 'react-icons/fi';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CadastroUsuario.css';

// Interface com os campos esperados pelo backend de usuários
interface UsuarioFormData {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  telefone: string;
  tipo_usuario: string;
  status_ativo: boolean;
}

const EdicaoUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Inicialização do estado com os campos do backend
  const [formData, setFormData] = useState<UsuarioFormData>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    tipo_usuario: '',
    status_ativo: true,
  });

  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [activeTab, setActiveTab] = useState('dados-basicos');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar dados do usuário ao inicializar o componente
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Você não está autenticado. Por favor, faça login.');
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`http://localhost:3000/usuarios/${id}`, config);
        const usuario = response.data;
        
        setFormData({
          nome: usuario.nome || '',
          email: usuario.email || '',
          senha: '', // Não carregamos a senha por segurança
          telefone: usuario.telefone || '',
          tipo_usuario: usuario.tipo_usuario || '',
          status_ativo: usuario.status_ativo !== undefined ? usuario.status_ativo : true,
        });
        
        setCarregando(false);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setErro('Não foi possível carregar os dados do usuário.');
        setCarregando(false);
      }
    };

    if (id) {
      carregarUsuario();
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleConfirmarSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleModoEdicao = () => {
    setModoEdicao(!modoEdicao);
    // Se estiver saindo do modo edição, recarregar os dados originais
    if (modoEdicao) {
      // Recarregar dados do usuário
      const carregarUsuario = async () => {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/usuarios/${id}`, config);
          const usuario = response.data;
          
          setFormData({
            nome: usuario.nome || '',
            email: usuario.email || '',
            senha: '', // Não carregamos a senha por segurança
            telefone: usuario.telefone || '',
            tipo_usuario: usuario.tipo_usuario || '',
            status_ativo: usuario.status_ativo !== undefined ? usuario.status_ativo : true,
          });
          
          setConfirmarSenha('');
        } catch (error) {
          console.error('Erro ao recarregar usuário:', error);
        }
      };

      carregarUsuario();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar se as senhas coincidem (apenas se uma nova senha foi fornecida)
    if (formData.senha && formData.senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const apiURL = `${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/usuarios/${id}`;
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Você não está autenticado. Por favor, faça login.');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Preparar dados para envio - se a senha estiver vazia, não a enviamos
      const dadosParaEnvio = { ...formData };
      if (!dadosParaEnvio.senha) {
        delete dadosParaEnvio.senha;
      }

      console.log("Payload enviado:", dadosParaEnvio);
      
      const response = await axios.put(apiURL, dadosParaEnvio, config);
      
      console.log('Usuário atualizado com sucesso:', response.data);
      alert('Usuário atualizado com sucesso!');
      
      // Sair do modo de edição após salvar
      setModoEdicao(false);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          alert('Sessão expirada. Por favor, faça login novamente.');
          navigate('/login');
        } else if (error.response.status === 403) {
          alert('Você não tem permissão para realizar esta ação.');
        } else {
          alert(`Erro ao atualizar: ${error.response.status} - ${error.response.data.message}`);
        }
      } else {
        console.error('Erro ao conectar com o backend:', error);
        alert('Erro de conexão. Verifique se o backend está em execução.');
      }
    }
  };

  if (carregando) {
    return (
      <div className="cadastro-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="cadastro-container">
        <div className="error-message">
          <p>{erro}</p>
          <button onClick={() => navigate('/usuarios')} className="back-button">
            Voltar para a lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <button className="back-button" onClick={() => navigate('/usuarios')}>
          <FiArrowLeft size={20}  />
          Voltar
        </button>
        <h1 className="cadastro-title">
          <FiUser className="icon-title" />
          {modoEdicao ? 'Editando Usuário' : 'Detalhes do Usuário'}
        </h1>
        <button 
          className={`edit-toggle-button ${modoEdicao ? 'cancel' : 'edit'}`}
          onClick={toggleModoEdicao}
        >
          <FaEdit className="button-icon" />
          {modoEdicao ? 'Cancelar Edição' : 'Editar Usuário'}
        </button>
      </div>

      <div className="cadastro-content">
        <div className="photo-section">
          <div className="photo-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="photo-preview" />
            ) : (
              <FaUserCircle className="photo-placeholder" />
            )}
            <label htmlFor="file-upload" className="upload-button" style={!modoEdicao ? {display: 'none'} : {}}>
              <FaCamera className="camera-icon" />
              Alterar Imagem
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={!modoEdicao}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'dados-basicos' ? 'active' : ''}`}
              onClick={() => setActiveTab('dados-basicos')}
            >
              Dados Básicos
            </button>
            <button 
              className={`tab ${activeTab === 'acesso' ? 'active' : ''}`}
              onClick={() => setActiveTab('acesso')}
            >
              Acesso
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {activeTab === 'dados-basicos' && (
              <div className="form-grid">
                <div className="input-group full-width">
                  <label htmlFor="nome" className="input-label">
                    <FiUser className="input-icon" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={!modoEdicao}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email" className="input-label">
                    <FiMail className="input-icon" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={!modoEdicao}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="telefone" className="input-label">
                    <FiPhone className="input-icon" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="(00) 00000-0000"
                    disabled={!modoEdicao}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="tipo_usuario" className="input-label">
                    <FiBriefcase className="input-icon" />
                    Tipo de Usuário
                  </label>
                  <select
                    id="tipo_usuario"
                    value={formData.tipo_usuario}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={!modoEdicao}
                  >
                    <option value="">Selecione</option>
                    <option value="admin">Administrador</option>
                    <option value="secretaria">Secretária</option>
                    <option value="psicologa">Psicóloga</option>
                    <option value="assistente">Assistente</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'acesso' && (
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="senha" className="input-label">
                    <FiLock className="input-icon" />
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder={modoEdicao ? "Deixe em branco para manter a atual" : "••••••••"}
                    disabled={!modoEdicao}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="confirmarSenha" className="input-label">
                    <FiLock className="input-icon" />
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    value={confirmarSenha}
                    onChange={handleConfirmarSenhaChange}
                    className="input-field"
                    placeholder={modoEdicao ? "Repita a nova senha" : "••••••••"}
                    disabled={!modoEdicao}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="status_ativo" className="checkbox-label">
                    <input
                      type="checkbox"
                      id="status_ativo"
                      checked={formData.status_ativo}
                      onChange={handleInputChange}
                      className="checkbox-input"
                      disabled={!modoEdicao}
                    />
                    <span className="checkbox-custom"></span>
                    Usuário Ativo
                  </label>
                </div>
              </div>
            )}

            {modoEdicao && (
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  <FaSave className="button-icon" />
                  Salvar Alterações
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EdicaoUsuario;