import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaUser, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import './FichaProntuario.css';

interface Assistido {
  id: number;
  nome: string;
  cpf: string;
  data_nascimento: string;
  status_ativo: boolean;
}

const FichaProntuario: React.FC = () => {
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [termoPesquisa, setTermoPesquisa] = useState<string>('');
  const navigate = useNavigate();

  // Carregar assistidos do backend
  useEffect(() => {
    const carregarAssistidos = async () => {
      try {
        setCarregando(true);
        const res = await api.get('/assistidos');
        setAssistidos(res.data);
        setCarregando(false);
      } catch (err) {
        console.error('Erro ao carregar assistidos:', err);
        alert('Erro ao carregar assistidos. Verifique o console.');
        setCarregando(false);
      }
    };

    carregarAssistidos();
  }, []);

  const handleSelecionarAssistido = (assistido: Assistido) => {
    // CORREÇÃO: Navegar para a rota correta da ficha do assistido
    navigate(`/assistidos/ficha/${assistido.id}`, { state: { assistido } });
  };

  const handleCadastrarPergunta = () => {
    // CORREÇÃO: Navegar para a rota correta do cadastro de pergunta
    navigate('/prontuario/perguntas/cadastro');
  };

  const handleCadastrarAssistido = () => {
    // CORREÇÃO: Navegar para a rota correta do cadastro de assistido
    navigate('/assistidos/cadastro');
  };

  const handleGerenciarPerguntas = () => {
    // CORREÇÃO: Navegar para a rota correta de gerenciar perguntas
    navigate('/prontuario/perguntas/excluir');
  };

  // Filtrar assistidos baseado no termo de pesquisa
  const assistidosFiltrados = assistidos.filter(assistido =>
    assistido.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    assistido.cpf.includes(termoPesquisa)
  );

  if (carregando) {
    return (
      <div className="prontuario-container">
        <div className="carregando">
          <div className="spinner"></div>
          <p>Carregando assistidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prontuario-container">
      <div className="prontuario-header">
        <h1>Selecionar Assistido</h1>
        <p>Selecione um assistido para preencher a ficha de prontuário</p>
      </div>

      <div className="acoes-superiores">
        <div className="pesquisa-container">
          <div className="pesquisa-input">
            <input
              type="text"
              placeholder="Pesquisar por nome ou CPF..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
          </div>
        </div>

        <div className="botoes-acoes">
          <button className="btn-cadastrar-pergunta" onClick={handleCadastrarPergunta}>
            <FaPlus /> Cadastrar Pergunta
          </button>
          <button className="btn-gerenciar-perguntas" onClick={handleGerenciarPerguntas}>
            <FaTrash /> Gerenciar Perguntas
          </button>
        </div>
      </div>

      <div className="assistidos-lista">
        {assistidosFiltrados.length > 0 ? (
          assistidosFiltrados.map(assistido => (
            <div
              key={assistido.id}
              className="assistido-card"
              onClick={() => handleSelecionarAssistido(assistido)}
            >
              <div className="assistido-avatar">
                <FaUser size={24} />
              </div>

              <div className="assistido-info">
                <h3>{assistido.nome}</h3>
                <p>CPF: {assistido.cpf}</p>
                <p>Data de Nascimento: {new Date(assistido.data_nascimento).toLocaleDateString('pt-BR')}</p>
                <span className={`status ${assistido.status_ativo ? 'ativo' : 'inativo'}`}>
                  {assistido.status_ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="assistido-acao">
                <span className="btn-selecionar">Selecionar</span>
              </div>
            </div>
          ))
        ) : (
          <div className="nenhum-assistido">
            <FaUser size={48} className="icone-vazio" />
            <h3>Nenhum assistido encontrado</h3>
            <p>{termoPesquisa ? 'Tente ajustar sua pesquisa' : 'Cadastre um novo assistido para começar'}</p>
            {!termoPesquisa && (
              <button className="btn-cadastrar-assistido" onClick={handleCadastrarAssistido}>
                <FaPlus /> Cadastrar Primeiro Assistido
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FichaProntuario;