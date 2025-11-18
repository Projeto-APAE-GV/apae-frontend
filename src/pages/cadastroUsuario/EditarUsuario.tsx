import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiBriefcase } from 'react-icons/fi';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CadastroUsuario.css';

interface UsuarioFormData {
  id?: number;
  nome: string;
  email: string;
  senha_hash: string;
  tipo_usuario: string;
}

const EditarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const usuarioId = id ? parseInt(id, 10) : 0;
  
  const [formData, setFormData] = useState<UsuarioFormData>({
    nome: '',
    email: '',
    senha_hash: '',
    tipo_usuario: '',
  });

  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [activeTab, setActiveTab] = useState('dados-basicos');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        setCarregando(true);
        
        if (!usuarioId || isNaN(usuarioId)) {
          setErro('ID do usuário inválido');
          setCarregando(false);
          return;
        }

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

        console.log('Carregando usuário com ID:', usuarioId);
        
        const response = await axios.get(`http://localhost:3000/usuarios/${usuarioId}`, config);
        const usuario = response.data;

        console.log('Dados do usuário recebidos:', usuario);

        setFormData({
          nome: usuario.nome || '',
          email: usuario.email || '',
          senha_hash: '', // Não carregamos a senha por segurança
          tipo_usuario: usuario.tipo_usuario || '',
        });

        setCarregando(false);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            alert('Sessão expirada. Por favor, faça login novamente.');
            navigate('/login');
          } else if (error.response.status === 404) {
            alert('Usuário não encontrado.');
            navigate('/usuarios/lista'); // ✅ CORRIGIDO
          } else {
            alert(`Erro ao carregar: ${error.response.status} - ${error.response.data.message}`);
          }
        } else {
          alert('Erro ao carregar usuário. Verifique o console.');
        }
        setCarregando(false);
      }
    };

    if (usuarioId) {
      carregarUsuario();
    }
  }, [usuarioId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleConfirmarSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha_hash && formData.senha_hash !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (formData.senha_hash && formData.senha_hash.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    try {
      if (!usuarioId || isNaN(usuarioId)) {
        alert('ID do usuário inválido');
        return;
      }

      const apiURL = `http://localhost:3000/usuarios/${usuarioId}`;
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
      const dadosParaEnvio: any = { 
        nome: formData.nome,
        email: formData.email,
        tipo_usuario: formData.tipo_usuario
      };
      
      // Só envia a senha se foi preenchida
      if (formData.senha_hash) {
        dadosParaEnvio.senha_hash = formData.senha_hash;
      }

      console.log("Enviando para:", apiURL);
      console.log("Payload enviado:", dadosParaEnvio);
      
      const response = await axios.put(apiURL, dadosParaEnvio, config);
      
      console.log('Usuário atualizado com sucesso:', response.data);
      alert('Usuário atualizado com sucesso!');
      
      // ✅ CORRIGIDO: Navegação para a lista de usuários
      navigate('/usuarios/lista');

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          alert('Sessão expirada. Por favor, faça login novamente.');
          navigate('/login');
        } else if (error.response.status === 403) {
          alert('Você não tem permissão para realizar esta ação.');
        } else if (error.response.status === 400) {
          console.error('Erro de validação:', error.response.data);
          alert(`Erro de validação: ${JSON.stringify(error.response.data)}`);
        } else {
          alert(`Erro ao atualizar: ${error.response.status} - ${error.response.data.message}`);
        }
      } else {
        console.error('Erro ao conectar com o backend:', error);
        alert('Erro de conexão. Verifique se o backend está em execução.');
      }
    }
  };

  // ✅ CORRIGIDO: Função específica para voltar
  const handleVoltar = () => {
    navigate('/usuarios/lista');
  };

  if (carregando) {
    return (
      <div className="cadastro-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1D4ED8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="cadastro-container">
        <div className="error-message">
          <p>{erro}</p>
          {/* ✅ CORRIGIDO: Botão voltar com rota correta */}
          <button onClick={handleVoltar} className="back-button">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        {/* ✅ CORRIGIDO: Botão voltar com função específica */}
        <button className="back-button" onClick={handleVoltar}>
          <FiArrowLeft size={20} />
          Voltar
        </button>
        <h1 className="cadastro-title">
          <FiUser className="icon-title" />
          Editar Usuário
        </h1>
      </div>

      <div className="cadastro-content">
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
                  <label htmlFor="senha_hash" className="input-label">
                    <FiLock className="input-icon" />
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="senha_hash"
                    value={formData.senha_hash}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Deixe em branco para manter a atual"
                    minLength={6}
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
                    Deixe em branco para manter a senha atual
                  </small>
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
                    placeholder="Repita a nova senha"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              {/* ✅ CORRIGIDO: Botão cancelar com função específica */}
              <button 
                type="button" 
                className="btn-cancelar"
                onClick={handleVoltar}
                style={{
                  padding: '12px 25px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginRight: '15px'
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="submit-button">
                <FaSave className="button-icon" />
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarUsuario;