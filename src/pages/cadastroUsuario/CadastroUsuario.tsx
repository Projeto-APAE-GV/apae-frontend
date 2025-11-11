import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiLock, FiBriefcase } from 'react-icons/fi';
import axios from 'axios';
import './CadastroUsuario.css';

// Interface com os campos esperados pelo backend
interface UsuarioFormData {
  nome: string;
  email: string;
  senha_hash: string;
  tipo_usuario: string;
}

const CadastroUsuario: React.FC = () => {
  const [formData, setFormData] = useState<UsuarioFormData>({
    nome: '',
    email: '',
    senha_hash: '',
    tipo_usuario: '',
  });

  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [activeTab, setActiveTab] = useState('dados-basicos');

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

    if (formData.senha_hash !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (formData.senha_hash.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    try {
      const apiURL = `${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/usuarios`;
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

      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha_hash: formData.senha_hash,
        tipo_usuario: formData.tipo_usuario,
      };

      console.log("Payload enviado:", payload);
      
      const response = await axios.post(apiURL, payload, config);
      
      console.log('Usuário cadastrado com sucesso:', response.data);
      alert('Usuário cadastrado com sucesso!');
      
      setFormData({
        nome: '',
        email: '',
        senha_hash: '',
        tipo_usuario: '',
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
                    Senha
                  </label>
                  <input
                    type="password"
                    id="senha_hash"
                    value={formData.senha_hash}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    minLength={6}
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
                    A senha deve ter no mínimo 6 caracteres
                  </small>
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
                    minLength={6}
                  />
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