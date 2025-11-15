import React, { useState } from 'react';
import { FaUserCircle, FaCamera, FaSave } from 'react-icons/fa';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiLock, FiBriefcase } from 'react-icons/fi';
import axios from 'axios';
import './CadastroUsuario.css';

// Interface com os campos esperados pelo backend de usuários
interface UsuarioFormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  tipo_usuario: string;
  status_ativo: boolean;
}

const CadastroUsuario: React.FC = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar se as senhas coincidem
    if (formData.senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const apiURL = 'http://localhost:3000/usuarios';
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Você não está autenticado. Por favor, faça login.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Payload enviado:", formData);
      
      const response = await axios.post(apiURL, formData, config);
      
      console.log('Usuário cadastrado com sucesso:', response.data);
      alert('Usuário cadastrado com sucesso!');
      
      // Limpa o formulário após o sucesso
      setFormData({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        tipo_usuario: '',
        status_ativo: true,
      });
      setConfirmarSenha('');

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          alert('Sessão expirada. Por favor, faça login novamente.');
        } else if (error.response.status === 403) {
          alert('Você não tem permissão para realizar esta ação.');
        } else {
          alert(`Erro ao cadastrar: ${error.response.status} - ${error.response.data.message}`);
        }
      } else {
        console.error('Erro ao conectar com o backend:', error);
        alert('Erro de conexão. Verifique se o backend está em execução.');
      }
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <button className="back-button" onClick={() => window.history.back()}>
          <FiArrowLeft size={20}  />
          Voltar
        </button>
        <h1 className="cadastro-title">
          <FiUser className="icon-title" />
          Cadastro de Usuário
        </h1>
      </div>

      <div className="cadastro-content">
        <div className="photo-section">
          <div className="photo-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="photo-preview" />
            ) : (
              <FaUserCircle className="photo-placeholder" />
            )}
            <label htmlFor="file-upload" className="upload-button">
              <FaCamera className="camera-icon" />
              Alterar Imagem
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
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
                  <label htmlFor="senha" className="input-label">
                    <FiLock className="input-icon" />
                    Senha
                  </label>
                  <input
                    type="password"
                    id="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="confirmarSenha" className="input-label">
                    <FiLock className="input-icon" />
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    value={confirmarSenha}
                    onChange={handleConfirmarSenhaChange}
                    className="input-field"
                    required
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
                    />
                    <span className="checkbox-custom"></span>
                    Usuário Ativo
                  </label>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="submit-button">
                <FaSave className="button-icon" />
                Salvar Cadastro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroUsuario;