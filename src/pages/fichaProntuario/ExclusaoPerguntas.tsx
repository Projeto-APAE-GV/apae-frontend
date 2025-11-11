import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaTrash, FaSearch, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import './ExclusaoPerguntas.css';

interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  ordem_exibicao: number;
  ativa: boolean;
}

interface Pergunta {
  id_pergunta: number;
  id_categoria: number;
  texto_pergunta: string;
  tipo_resposta: 'texto' | 'numero' | 'opcoes' | 'data' | 'boolean';
  opcoes_resposta: string[];
  obrigatoria: boolean;
  ordem_categoria: number;
  ativa: boolean;
  data_criacao: string;
  categoria: {
    nome_categoria: string;
  };
}

const ExclusaoPerguntas: React.FC = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [excluindo, setExcluindo] = useState<number | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number>(0);
  const [termoPesquisa, setTermoPesquisa] = useState<string>('');
  const [perguntaParaExcluir, setPerguntaParaExcluir] = useState<Pergunta | null>(null);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState<boolean>(false);

  // Carregar categorias
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const res = await api.get('/categorias');
        setCategorias(res.data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        alert('Erro ao carregar categorias.');
      }
    };

    carregarCategorias();
  }, []);

  // Carregar perguntas quando a categoria mudar
  useEffect(() => {
    const carregarPerguntas = async () => {
      try {
        setCarregando(true);
        let url = '/perguntas';
        
        if (categoriaSelecionada > 0) {
          url = `/perguntas/categoria/${categoriaSelecionada}`;
        }
        
        const res = await api.get(url);
        // Filtrar apenas perguntas ativas
        const perguntasAtivas = res.data.filter((pergunta: Pergunta) => pergunta.ativa);
        setPerguntas(perguntasAtivas);
        setCarregando(false);
      } catch (err) {
        console.error('Erro ao carregar perguntas:', err);
        alert('Erro ao carregar perguntas.');
        setCarregando(false);
      }
    };

    carregarPerguntas();
  }, [categoriaSelecionada]);

  const handleExcluirPergunta = (pergunta: Pergunta) => {
    setPerguntaParaExcluir(pergunta);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (!perguntaParaExcluir) return;

    setExcluindo(perguntaParaExcluir.id_pergunta);

    try {
      await api.delete(`/perguntas/${perguntaParaExcluir.id_pergunta}`);
      
      // Atualizar lista local
      setPerguntas(perguntas.filter(p => p.id_pergunta !== perguntaParaExcluir.id_pergunta));
      alert('Pergunta excluída com sucesso!');
    } catch (err: any) {
      console.error('Erro ao excluir pergunta:', err);
      if (err.response) {
        alert(`Erro ao excluir: ${err.response.status} - ${err.response.data.message}`);
      } else {
        alert('Erro ao excluir pergunta. Verifique o console.');
      }
    } finally {
      setExcluindo(null);
      setMostrarModalConfirmacao(false);
      setPerguntaParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setMostrarModalConfirmacao(false);
    setPerguntaParaExcluir(null);
  };

  // Filtrar perguntas baseado no termo de pesquisa
  const perguntasFiltradas = perguntas.filter(pergunta =>
    pergunta.texto_pergunta.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    pergunta.categoria.nome_categoria.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const getTipoRespostaTexto = (tipo: string) => {
    const tipos = {
      texto: 'Texto Livre',
      numero: 'Número',
      opcoes: 'Opções',
      data: 'Data',
      boolean: 'Sim/Não'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  if (carregando && perguntas.length === 0) {
    return (
      <div className="exclusao-perguntas-container">
        <div className="carregando">
          <div className="spinner"></div>
          <p>Carregando perguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exclusao-perguntas-container">
      {/* Modal de Confirmação */}
      {mostrarModalConfirmacao && perguntaParaExcluir && (
        <div className="modal-overlay">
          <div className="modal-confirmacao">
            <div className="modal-header">
              <FaExclamationTriangle className="modal-icon" />
              <h3>Confirmar Exclusão</h3>
            </div>
            
            <div className="modal-body">
              <p>Tem certeza que deseja excluir esta pergunta?</p>
              <div className="pergunta-detalhes">
                <strong>Pergunta:</strong> {perguntaParaExcluir.texto_pergunta}
              </div>
              <div className="pergunta-detalhes">
                <strong>Categoria:</strong> {perguntaParaExcluir.categoria.nome_categoria}
              </div>
              <div className="pergunta-detalhes">
                <strong>Tipo:</strong> {getTipoRespostaTexto(perguntaParaExcluir.tipo_resposta)}
              </div>
              
              <div className="aviso-exclusao">
                <FaExclamationTriangle />
                <span>Esta ação não pode ser desfeita.</span>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-cancelar"
                onClick={cancelarExclusao}
                disabled={excluindo !== null}
              >
                Cancelar
              </button>
              <button 
                className="btn-excluir-confirmar"
                onClick={confirmarExclusao}
                disabled={excluindo !== null}
              >
                {excluindo ? (
                  <>
                    <div className="spinner pequeno"></div>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <FaTrash /> Confirmar Exclusão
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="exclusao-perguntas-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} /> Voltar
        </button>
        <h1>Gerenciar Perguntas</h1>
        <p>Exclua perguntas cadastradas incorretamente</p>
      </div>

      <div className="filtros-container">
        <div className="input-group">
          <label htmlFor="categoria" className="input-label">
            Filtrar por Categoria
          </label>
          <select
            id="categoria"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(Number(e.target.value))}
            className="input-field"
          >
            <option value={0}>Todas as Categorias</option>
            {categorias.map(categoria => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nome_categoria}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group full-width">
          <label className="input-label">Pesquisar Perguntas</label>
          <div className="pesquisa-input-container">
            <FaSearch className="pesquisa-icon" />
            <input
              type="text"
              placeholder="Pesquisar por pergunta ou categoria..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              className="input-field pesquisa-input"
            />
          </div>
        </div>
      </div>

      <div className="perguntas-lista-container">
        <div className="perguntas-lista-header">
          <h3>Perguntas Cadastradas</h3>
          <span className="total-perguntas">{perguntasFiltradas.length} pergunta(s) encontrada(s)</span>
        </div>

        <div className="perguntas-lista">
          {perguntasFiltradas.length > 0 ? (
            perguntasFiltradas.map(pergunta => (
              <div key={pergunta.id_pergunta} className="pergunta-card">
                <div className="pergunta-info">
                  <div className="pergunta-texto">
                    <h4>{pergunta.texto_pergunta}</h4>
                    <div className="pergunta-metadados">
                      <span className="categoria-tag">{pergunta.categoria.nome_categoria}</span>
                      <span className="tipo-tag">{getTipoRespostaTexto(pergunta.tipo_resposta)}</span>
                      {pergunta.obrigatoria && <span className="obrigatoria-tag">Obrigatória</span>}
                      <span className="ordem-tag">Ordem: {pergunta.ordem_categoria}</span>
                    </div>
                    
                    {pergunta.tipo_resposta === 'opcoes' && pergunta.opcoes_resposta.length > 0 && (
                      <div className="opcoes-lista">
                        <strong>Opções:</strong>
                        <div className="opcoes-chips">
                          {pergunta.opcoes_resposta.map((opcao, index) => (
                            <span key={index} className="opcao-chip">{opcao}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pergunta-acoes">
                  <button 
                    className="btn-excluir-pergunta"
                    onClick={() => handleExcluirPergunta(pergunta)}
                    disabled={excluindo === pergunta.id_pergunta}
                  >
                    {excluindo === pergunta.id_pergunta ? (
                      <div className="spinner pequeno"></div>
                    ) : (
                      <FaTrash />
                    )}
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="nenhuma-pergunta">
              <FaExclamationTriangle size={48} className="icone-vazio" />
              <h3>Nenhuma pergunta encontrada</h3>
              <p>
                {termoPesquisa || categoriaSelecionada > 0 
                  ? 'Tente ajustar sua pesquisa ou selecione outra categoria' 
                  : 'Não há perguntas cadastradas para exclusão'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExclusaoPerguntas;