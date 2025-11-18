import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FiArrowLeft, FiUser, FiPhone, FiFileText, FiCalendar, FiMap, FiMail } from 'react-icons/fi';
import axios from 'axios';
import './CadastroAssistido.css';

interface AssistidoFormData {
  nome_completo: string;
  cpf: string;
  rg: string;
  sexo: string;
  data_nascimento: string;
  estado_civil: string;
  contato: string;
  responsavel: string;
  observacoes: string;
}

const CadastroAssistido: React.FC = () => {
  const [formData, setFormData] = useState<AssistidoFormData>({
    nome_completo: '',
    cpf: '',
    rg: '',
    sexo: '',
    data_nascimento: '',
    estado_civil: '',
    contato: '',
    responsavel: '',
    observacoes: '',
  });

  const [activeTab, setActiveTab] = useState('dados-pessoais');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiURL = `${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/assistidos`;
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
      
      console.log('Assistido cadastrado com sucesso:', response.data);
      alert('Assistido cadastrado com sucesso!');
      
      // Reset form
      setFormData({
        nome_completo: '',
        cpf: '',
        rg: '',
        sexo: '',
        data_nascimento: '',
        estado_civil: '',
        contato: '',
        responsavel: '',
        observacoes: '',
      });

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
          <FiArrowLeft size={20} />
          Voltar
        </button>
        <h1 className="cadastro-title">
          <FiUser className="icon-title" />
          Cadastro de Assistido
        </h1>
      </div>

      <div className="cadastro-content">
        <div className="form-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'dados-pessoais' ? 'active' : ''}`}
              onClick={() => setActiveTab('dados-pessoais')}
            >
              Dados Pessoais
            </button>
            <button 
              className={`tab ${activeTab === 'contato' ? 'active' : ''}`}
              onClick={() => setActiveTab('contato')}
            >
              Contato e Observações
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {activeTab === 'dados-pessoais' && (
              <div className="form-grid">
                <div className="input-group full-width">
                  <label htmlFor="nome_completo" className="input-label">
                    <FiUser className="input-icon" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome_completo"
                    value={formData.nome_completo}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="cpf" className="input-label">
                    <FiFileText className="input-icon" />
                    CPF *
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="rg" className="input-label">
                    <FiFileText className="input-icon" />
                    RG *
                  </label>
                  <input
                    type="text"
                    id="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="00.000.000-0"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="sexo" className="input-label">
                    <FiUser className="input-icon" />
                    Sexo *
                  </label>
                  <select
                    id="sexo"
                    value={formData.sexo}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="data_nascimento" className="input-label">
                    <FiCalendar className="input-icon" />
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    id="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="estado_civil" className="input-label">
                    <FiUser className="input-icon" />
                    Estado Civil *
                  </label>
                  <select
                    id="estado_civil"
                    value={formData.estado_civil}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                    <option value="uniao_estavel">União Estável</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'contato' && (
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="contato" className="input-label">
                    <FiPhone className="input-icon" />
                    Contato
                  </label>
                  <input
                    type="text"
                    id="contato"
                    value={formData.contato}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Telefone ou email"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="responsavel" className="input-label">
                    <FiUser className="input-icon" />
                    Responsável
                  </label>
                  <input
                    type="text"
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Nome do responsável"
                  />
                </div>

                <div className="input-group full-width">
                  <label htmlFor="observacoes" className="input-label">
                    <FiMail className="input-icon" />
                    Observações
                  </label>
                  <textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    className="input-field textarea"
                    placeholder="Observações importantes"
                    rows={4}
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

export default CadastroAssistido;