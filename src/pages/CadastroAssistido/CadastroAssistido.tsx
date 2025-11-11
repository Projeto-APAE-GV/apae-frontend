import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMap, FiCalendar, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import './CadastroAssistido.css';

// Interface com todos os campos que o backend espera, com os nomes corretos
interface AssistidoFormData {
  nome: string;
  cpf: string;
  rg: string;
  data_nascimento: string;
  sexo: string;
  estado_civil: string;
  telefone: string;
  email: string;
  endereco_completo: string;
  cep: string;
  cidade: string;
  estado: string;
  nome_responsavel: string;
  cpf_responsavel: string;
  parentesco_responsavel: string;
  telefone_responsavel: string;
  status_ativo: boolean;
  observacoes_gerais: string;
}

const CadastroAssistido: React.FC = () => {
  // Inicialização do estado com os campos exatos do backend
  const [formData, setFormData] = useState<AssistidoFormData>({
    nome: '',
    cpf: '',
    rg: '',
    data_nascimento: '',
    sexo: '',
    estado_civil: '',
    telefone: '',
    email: '',
    endereco_completo: '',
    cep: '',
    cidade: '',
    estado: '',
    nome_responsavel: '',
    cpf_responsavel: '',
    parentesco_responsavel: '',
    telefone_responsavel: '',
    status_ativo: true,
    observacoes_gerais: '',
  });

  const [activeTab, setActiveTab] = useState('dados-pessoais');

  // Funções de formatação
  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatRG = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`;
  };

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Função para remover formatação (enviar apenas números para o backend)
  const removeFormatting = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    
    let formattedValue = value;
    
    // Aplica formatação conforme o tipo de campo
    switch (id) {
      case 'cpf':
      case 'cpf_responsavel':
        formattedValue = formatCPF(value);
        break;
      case 'rg':
        formattedValue = formatRG(value);
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        break;
      case 'telefone':
      case 'telefone_responsavel':
        formattedValue = formatPhone(value);
        break;
      default:
        formattedValue = value;
    }

    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : formattedValue,
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

      // Remove a formatação dos campos antes de enviar para o backend
      const payload = {
        ...formData,
        cpf: removeFormatting(formData.cpf),
        rg: removeFormatting(formData.rg),
        cep: removeFormatting(formData.cep),
        telefone: removeFormatting(formData.telefone),
        cpf_responsavel: removeFormatting(formData.cpf_responsavel),
        telefone_responsavel: removeFormatting(formData.telefone_responsavel),
        data_nascimento: new Date(formData.data_nascimento).toISOString(),
      };

      console.log("Payload enviado:", payload);
      
      const response = await axios.post(apiURL, payload, config);
      
      console.log('Paciente cadastrado com sucesso:', response.data);
      alert('Paciente cadastrado com sucesso!');
      
      // Limpa o formulário após o sucesso
      setFormData({
        nome: '',
        cpf: '',
        rg: '',
        data_nascimento: '',
        sexo: '',
        estado_civil: '',
        telefone: '',
        email: '',
        endereco_completo: '',
        cep: '',
        cidade: '',
        estado: '',
        nome_responsavel: '',
        cpf_responsavel: '',
        parentesco_responsavel: '',
        telefone_responsavel: '',
        status_ativo: true,
        observacoes_gerais: '',
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
          <FiArrowLeft size={20}  />
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
              Contato
            </button>
            <button 
              className={`tab ${activeTab === 'responsavel' ? 'active' : ''}`}
              onClick={() => setActiveTab('responsavel')}
            >
              Responsável
            </button>
            <button 
              className={`tab ${activeTab === 'observacoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('observacoes')}
            >
              Observações
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {activeTab === 'dados-pessoais' && (
              <div className="form-grid">
                <div className="input-group">
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
                  <label htmlFor="cpf" className="input-label">CPF</label>
                  <input
                    type="text"
                    id="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="rg" className="input-label">RG</label>
                  <input
                    type="text"
                    id="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="00.000.000-0"
                    maxLength={12}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="data_nascimento" className="input-label">
                    <FiCalendar className="input-icon" />
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    id="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="sexo" className="input-label">Sexo</label>
                  <select
                    id="sexo"
                    value={formData.sexo}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="estado_civil" className="input-label">Estado Civil</label>
                  <select
                    id="estado_civil"
                    value={formData.estado_civil}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Selecione</option>
                    <option value="Solteiro">Solteiro(a)</option>
                    <option value="Casado">Casado(a)</option>
                    <option value="Divorciado">Divorciado(a)</option>
                    <option value="Viúvo">Viúvo(a)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'contato' && (
              <div className="form-grid">
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
                    maxLength={15}
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
                  />
                </div>

                <div className="input-group full-width">
                  <label htmlFor="endereco_completo" className="input-label">
                    <FiMap className="input-icon" />
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    id="endereco_completo"
                    value={formData.endereco_completo}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="cep" className="input-label">CEP</label>
                  <input
                    type="text"
                    id="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="cidade" className="input-label">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="estado" className="input-label">Estado</label>
                  <select
                    id="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Selecione</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minha Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'responsavel' && (
              <div className="form-grid">
                <div className="input-group full-width">
                  <label htmlFor="nome_responsavel" className="input-label">Nome do Responsável</label>
                  <input
                    type="text"
                    id="nome_responsavel"
                    value={formData.nome_responsavel}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="cpf_responsavel" className="input-label">CPF do Responsável</label>
                  <input
                    type="text"
                    id="cpf_responsavel"
                    value={formData.cpf_responsavel}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="parentesco_responsavel" className="input-label">Parentesco</label>
                  <select
                    id="parentesco_responsavel"
                    value={formData.parentesco_responsavel}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Selecione</option>
                    <option value="Pai">Pai</option>
                    <option value="Mãe">Mãe</option>
                    <option value="Avô/Avó">Avô/Avó</option>
                    <option value="Tio/Tia">Tio/Tia</option>
                    <option value="Irmão/Irmã">Irmão/Irmã</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="telefone_responsavel" className="input-label">Telefone do Responsável</label>
                  <input
                    type="tel"
                    id="telefone_responsavel"
                    value={formData.telefone_responsavel}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
              </div>
            )}

            {activeTab === 'observacoes' && (
              <div className="form-grid">
                <div className="input-group full-width">
                  <label htmlFor="observacoes_gerais" className="input-label">
                    <FiInfo className="input-icon" />
                    Observações Gerais
                  </label>
                  <textarea
                    id="observacoes_gerais"
                    value={formData.observacoes_gerais}
                    onChange={handleInputChange}
                    className="input-field textarea"
                    rows={5}
                  ></textarea>
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
                    Paciente Ativo
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

export default CadastroAssistido;