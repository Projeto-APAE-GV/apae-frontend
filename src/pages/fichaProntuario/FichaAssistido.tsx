import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { FaSave, FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import './FichaAssistido.css';

interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  descricao?: string;
  ordem_exibicao: number;
  ativa: boolean;
}

interface Pergunta {
  id_pergunta: number;
  id_categoria: number;
  texto_pergunta: string;
  tipo_resposta: 'texto' | 'numero' | 'opcoes' | 'data' | 'boolean' | 'sexo';
  opcoes_resposta?: string[];
  obrigatoria: boolean;
  ordem_categoria: number;
  ativa: boolean;
}

interface Assistido {
  id_assistido: number;
  nome: string;
  cpf: string;
  data_nascimento: string;
  status_ativo: boolean;
}

interface CategoriaComPerguntas extends Categoria {
  perguntas: Pergunta[];
}

interface RespostaSalvar {
  id_pergunta: number;
  resposta: string;
  id_assistido: number;
}

const FichaAssistido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [categorias, setCategorias] = useState<CategoriaComPerguntas[]>([]);
  const [assistido, setAssistido] = useState<Assistido | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [progresso, setProgresso] = useState<number>(0);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [carregandoPerguntas, setCarregandoPerguntas] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [categoriasSalvas, setCategoriasSalvas] = useState<number[]>([]);

  // Carregar dados do assistido
  useEffect(() => {
    const carregarAssistido = async () => {
      try {
        if (location.state?.assistido) {
          setAssistido(location.state.assistido);
        } else if (id) {
          const res = await api.get(`/assistidos/${id}`);
          setAssistido(res.data);
        }
      } catch (err) {
        console.error('Erro ao carregar assistido:', err);
        alert('Erro ao carregar dados do assistido.');
      }
    };

    carregarAssistido();
  }, [id, location.state]);

  // Carregar categorias e perguntas
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregandoPerguntas(true);
        
        // Buscar categorias ativas
        const resCategorias = await api.get('/categorias');
        const categoriasData: Categoria[] = resCategorias.data;
        
        // Filtrar apenas categorias ativas e ordenar pela ordem_exibicao
        const categoriasAtivas = categoriasData
          .filter(cat => cat.ativa)
          .sort((a, b) => a.ordem_exibicao - b.ordem_exibicao);
        
        // Para cada categoria, buscar suas perguntas ativas
        const categoriasComPerguntas = await Promise.all(
          categoriasAtivas.map(async (categoria) => {
            try {
              const resPerguntas = await api.get(`/perguntas/categoria/${categoria.id_categoria}`);
              const perguntas: Pergunta[] = resPerguntas.data;
              
              // Filtrar apenas perguntas ativas e ordenar pela ordem_categoria
              const perguntasAtivas = perguntas
                .filter(pergunta => pergunta.ativa)
                .sort((a, b) => a.ordem_categoria - b.ordem_categoria);
              
              return {
                ...categoria,
                perguntas: perguntasAtivas
              };
            } catch (err) {
              console.error(`Erro ao carregar perguntas da categoria ${categoria.nome_categoria}:`, err);
              return {
                ...categoria,
                perguntas: []
              };
            }
          })
        );
        
        // Filtrar categorias que têm perguntas
        const categoriasComPerguntasFiltradas = categoriasComPerguntas.filter(
          cat => cat.perguntas.length > 0
        );
        
        setCategorias(categoriasComPerguntasFiltradas);
        setCarregandoPerguntas(false);
        setCarregando(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        alert('Erro ao carregar categorias e perguntas. Verifique o console.');
        setCarregandoPerguntas(false);
        setCarregando(false);
      }
    };

    if (assistido) {
      carregarDados();
    }
  }, [assistido]);

  // Carregar respostas existentes - AGORA SÓ DEPOIS QUE O ASSISTIDO E CATEGORIAS ESTIVEREM CARREGADOS
  useEffect(() => {
    const carregarRespostasExistentes = async () => {
      // Verificar se temos todos os dados necessários
      if (!id || id === 'undefined' || !assistido || categorias.length === 0) {
        return;
      }
      
      try {
        console.log('Carregando respostas existentes para assistido:', id);
        const res = await api.get(`/respostas/assistido/${id}`);
        const respostasExistentes: Record<number, string> = {};
        
        res.data.forEach((r: any) => {
          respostasExistentes[r.id_pergunta] = r.resposta;
        });
        
        setRespostas(respostasExistentes);
        
        // Marcar categorias que já têm respostas salvas
        const categoriasComRespostas = new Set<number>();
        res.data.forEach((r: any) => {
          const pergunta = categorias.flatMap(cat => cat.perguntas).find(p => p.id_pergunta === r.id_pergunta);
          if (pergunta) {
            categoriasComRespostas.add(pergunta.id_categoria);
          }
        });
        
        setCategoriasSalvas(Array.from(categoriasComRespostas));
        console.log('Categorias com respostas salvas:', Array.from(categoriasComRespostas));
      } catch (err) {
        console.error('Erro ao carregar respostas existentes:', err);
        // Não é crítico se não conseguir carregar respostas existentes
      }
    };

    carregarRespostasExistentes();
  }, [assistido, id, categorias]); // Agora depende de categorias também

  const handleInputChange = (id_pergunta: number, value: string) => {
    setRespostas(prev => ({
      ...prev,
      [id_pergunta]: value
    }));
  };

  // Função para salvar respostas da categoria atual
  const salvarRespostasCategoria = async (categoriaIndex: number): Promise<boolean> => {
    // Verificar se o ID está disponível de múltiplas formas
    let assistidoId: number | null = null;
    
    if (id && id !== 'undefined') {
      assistidoId = parseInt(id, 10);
    } else if (assistido?.id_assistido) {
      assistidoId = assistido.id_assistido;
    } else if (location.state?.assistido?.id_assistido) {
      assistidoId = location.state.assistido.id_assistido;
    }

    if (!assistidoId || isNaN(assistidoId)) {
      console.error('ID do assistido não encontrado de nenhuma forma');
      alert('Erro: ID do assistido não encontrado. Recarregue a página.');
      return false;
    }

    const categoria = categorias[categoriaIndex];
    if (!categoria) {
      console.error('Categoria não encontrada');
      return false;
    }

    try {
      // Preparar respostas da categoria atual para enviar
      const respostasCategoria = categoria.perguntas
        .filter(pergunta => respostas[pergunta.id_pergunta] !== undefined && respostas[pergunta.id_pergunta] !== '')
        .map(pergunta => ({
          id_pergunta: pergunta.id_pergunta,
          resposta: respostas[pergunta.id_pergunta],
          id_assistido: assistidoId!
        }));

      if (respostasCategoria.length === 0) {
        console.log('Nenhuma resposta para salvar na categoria:', categoria.nome_categoria);
        // Mesmo sem respostas, marcamos a categoria como processada
        setCategoriasSalvas(prev => [...prev, categoria.id_categoria]);
        return true;
      }

      console.log('Salvando respostas da categoria:', categoria.nome_categoria, respostasCategoria);

      // TENTAR DOIS ENDPOINTS DIFERENTES - um para múltiplas respostas
      try {
        // Primeiro tenta o endpoint para salvar várias respostas de uma vez
        const response = await api.post('/respostas/salvar-varias', {
          id_assistido: assistidoId,
          respostas: respostasCategoria
        });
        console.log('Respostas salvas com sucesso (salvar-varias):', response.data);
      } catch (err: any) {
        console.log('Endpoint salvar-varias falhou, tentando salvar individualmente...');
        
        // Se falhar, tenta salvar uma por uma
        for (const resposta of respostasCategoria) {
          try {
            await api.post('/respostas', resposta);
            console.log(`Resposta salva para pergunta ${resposta.id_pergunta}`);
          } catch (err) {
            console.error(`Erro ao salvar resposta para pergunta ${resposta.id_pergunta}:`, err);
            // Continua tentando as outras
          }
        }
      }
      
      // Marcar categoria como salva
      setCategoriasSalvas(prev => [...prev, categoria.id_categoria]);
      return true;
    } catch (err: any) {
      console.error('Erro ao salvar respostas da categoria:', err);
      if (err.response) {
        console.error('Detalhes do erro:', err.response.data);
      }
      return false;
    }
  };

  const avancarCategoria = async () => {
    if (activeTab < categorias.length - 1) {
      // Salvar respostas da categoria atual antes de avançar
      const sucesso = await salvarRespostasCategoria(activeTab);
      
      if (sucesso) {
        setActiveTab(activeTab + 1);
      } else {
        alert('Erro ao salvar respostas. Tente novamente.');
      }
    }
  };

  const voltarCategoria = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Obter ID do assistido de múltiplas fontes
    let assistidoId: number | null = null;
    
    if (id && id !== 'undefined') {
      assistidoId = parseInt(id, 10);
    } else if (assistido?.id_assistido) {
      assistidoId = assistido.id_assistido;
    } else if (location.state?.assistido?.id_assistido) {
      assistidoId = location.state.assistido.id_assistido;
    }

    if (!assistidoId || isNaN(assistidoId)) {
      alert('ID do assistido não encontrado. Recarregue a página.');
      return;
    }
    
    setSalvando(true);

    try {
      // Verificar perguntas obrigatórias não respondidas
      const perguntasObrigatorias = categorias.flatMap(cat => 
        cat.perguntas.filter(p => p.obrigatoria)
      );
      
      const perguntasNaoRespondidas = perguntasObrigatorias.filter(pergunta => {
        const resposta = respostas[pergunta.id_pergunta];
        return !resposta || resposta.trim() === '';
      });
      
      if (perguntasNaoRespondidas.length > 0) {
        alert(`Por favor, responda todas as perguntas obrigatórias. Faltam: ${perguntasNaoRespondidas.length}`);
        setSalvando(false);
        return;
      }
      
      // Salvar todas as categorias que ainda não foram salvas
      const categoriasParaSalvar = categorias
        .map((cat, index) => index)
        .filter(index => !categoriasSalvas.includes(categorias[index].id_categoria));

      let todasSalvas = true;
      let erros: string[] = [];

      for (const index of categoriasParaSalvar) {
        const sucesso = await salvarRespostasCategoria(index);
        if (!sucesso) {
          todasSalvas = false;
          erros.push(categorias[index].nome_categoria);
        }
      }

      if (todasSalvas) {
        alert('Ficha salva com sucesso!');
        navigate('/ficha-prontuario');
      } else {
        alert(`Erro ao salvar respostas das categorias: ${erros.join(', ')}`);
      }
      
    } catch (err: any) {
      console.error('Erro ao salvar ficha:', err);
      if (err.response) {
        alert(`Erro ao salvar: ${err.response.status} - ${err.response.data.message}`);
      } else {
        alert('Erro ao salvar ficha. Verifique o console.');
      }
    } finally {
      setSalvando(false);
    }
  };

  // Calcular progresso
  useEffect(() => {
    if (categorias.length > 0) {
      const totalPerguntas = categorias.reduce((total, cat) => total + cat.perguntas.length, 0);
      const perguntasRespondidas = Object.values(respostas).filter(
        resposta => resposta && resposta.trim() !== ''
      ).length;
      
      const novoProgresso = Math.round((perguntasRespondidas / totalPerguntas) * 100);
      setProgresso(novoProgresso);
    }
  }, [respostas, categorias]);

  if (carregando) {
    return (
      <div className="ficha-container">
        <div className="carregando">
          <div className="spinner"></div>
          <p>Carregando ficha do assistido...</p>
        </div>
      </div>
    );
  }

  if (!assistido) {
    return (
      <div className="ficha-container">
        <div className="erro">
          <h2>Assistido não encontrado</h2>
          <button onClick={() => navigate('/ficha-prontuario')} className="btn-voltar">
            Voltar para seleção
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ficha-container">
      <div className="ficha-header">
        <button className="back-button-ficha" onClick={() => navigate('/ficha-prontuario')}>
          <FaChevronLeft size={20} /> Voltar
        </button>
        <div className="assistido-info-header">
          <div className="assistido-avatar">
            <FaUser size={24} />
          </div>
          <div>
            <h1>Ficha de Prontuário</h1>
            <h2>{assistido.nome}</h2>
            <p>CPF: {assistido.cpf} • Data Nasc: {new Date(assistido.data_nascimento).toLocaleDateString('pt-BR')}</p>
            <span className={`status ${assistido.status_ativo ? 'ativo' : 'inativo'}`}>
              {assistido.status_ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
        <div className="progresso-container">
          <div className="progresso-texto">
            <span>Preenchimento: {progresso}%</span>
          </div>
          <div className="progresso-bar">
            <div 
              className="progresso-fill" 
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>
      </div>

      {carregandoPerguntas ? (
        <div className="carregando-perguntas">
          <div className="spinner"></div>
          <p>Carregando perguntas...</p>
        </div>
      ) : categorias.length === 0 ? (
        <div className="sem-perguntas">
          <h3>Nenhuma pergunta disponível</h3>
          <p>Não há categorias com perguntas ativas no momento.</p>
        </div>
      ) : (
        <>
          <div className="tabs">
            {categorias.map((cat, idx) => (
              <button
                key={cat.id_categoria}
                className={`tab ${activeTab === idx ? 'active' : ''} ${categoriasSalvas.includes(cat.id_categoria) ? 'saved' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                <span className="tab-indicator">{idx + 1}</span>
                {cat.nome_categoria}
                {categoriasSalvas.includes(cat.id_categoria) && <span className="saved-indicator">✓</span>}
              </button>
            ))}
          </div>

          {categorias[activeTab] && (
            <form className="form-prontuario" onSubmit={handleSubmit}>
              <div className="categoria-header">
                <h2>{categorias[activeTab].nome_categoria}</h2>
                {categorias[activeTab].descricao && (
                  <p className="categoria-descricao">{categorias[activeTab].descricao}</p>
                )}
                {categoriasSalvas.includes(categorias[activeTab].id_categoria) && (
                  <span className="categoria-salva">✓ Salvo</span>
                )}
              </div>

              <div className="perguntas-container">
                {categorias[activeTab].perguntas.map((pergunta) => (
                  <div className="input-group" key={pergunta.id_pergunta}>
                    <label htmlFor={`pergunta-${pergunta.id_pergunta}`}>
                      {pergunta.texto_pergunta}
                      {pergunta.obrigatoria && <span className="obrigatorio"> *</span>}
                    </label>
                    
                    {pergunta.tipo_resposta === 'texto' && (
                      <textarea
                        id={`pergunta-${pergunta.id_pergunta}`}
                        value={respostas[pergunta.id_pergunta] || ''}
                        onChange={(e) => handleInputChange(pergunta.id_pergunta, e.target.value)}
                        className="input-field"
                        placeholder="Digite sua resposta aqui..."
                        required={pergunta.obrigatoria}
                        rows={3}
                      />
                    )}
                    
                    {pergunta.tipo_resposta === 'numero' && (
                      <input
                        id={`pergunta-${pergunta.id_pergunta}`}
                        type="number"
                        value={respostas[pergunta.id_pergunta] || ''}
                        onChange={(e) => handleInputChange(pergunta.id_pergunta, e.target.value)}
                        className="input-field"
                        placeholder="0"
                        required={pergunta.obrigatoria}
                      />
                    )}
                    
                    {pergunta.tipo_resposta === 'opcoes' && pergunta.opcoes_resposta && (
                      <select
                        id={`pergunta-${pergunta.id_pergunta}`}
                        value={respostas[pergunta.id_pergunta] || ''}
                        onChange={(e) => handleInputChange(pergunta.id_pergunta, e.target.value)}
                        className="input-field"
                        required={pergunta.obrigatoria}
                      >
                        <option value="">Selecione uma opção</option>
                        {pergunta.opcoes_resposta.map((opcao, idx) => (
                          <option key={idx} value={opcao}>
                            {opcao}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {pergunta.tipo_resposta === 'boolean' && (
                      <select
                        id={`pergunta-${pergunta.id_pergunta}`}
                        value={respostas[pergunta.id_pergunta] || ''}
                        onChange={(e) => handleInputChange(pergunta.id_pergunta, e.target.value)}
                        className="input-field"
                        required={pergunta.obrigatoria}
                      >
                        <option value="">Selecione</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                      </select>
                    )}
                    
                    {pergunta.tipo_resposta === 'sexo' && (
                      <select
                        id={`pergunta-${pergunta.id_pergunta}`}
                        value={respostas[pergunta.id_pergunta] || ''}
                        onChange={(e) => handleInputChange(pergunta.id_pergunta, e.target.value)}
                        className="input-field"
                        required={pergunta.obrigatoria}
                      >
                        <option value="">Selecione o sexo</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                        <option value="Prefiro não informar">Prefiro não informar</option>
                      </select>
                    )}
                    
                    {pergunta.tipo_resposta === 'data' && (
                      <input
                        id={`pergunta-${pergunta.id_pergunta}`}
                        type="date"
                        value={respostas[pergunta.id_pergunta] || ''}
                        onChange={(e) => handleInputChange(pergunta.id_pergunta, e.target.value)}
                        className="input-field"
                        required={pergunta.obrigatoria}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="navigation-actions">
                <button 
                  type="button" 
                  className="nav-button prev"
                  onClick={voltarCategoria}
                  disabled={activeTab === 0}
                >
                  <FaChevronLeft /> Anterior
                </button>
                
                <span className="page-indicator">
                  {activeTab + 1} de {categorias.length}
                </span>
                
                {activeTab < categorias.length - 1 ? (
                  <button 
                    type="button" 
                    className="nav-button next"
                    onClick={avancarCategoria}
                  >
                    Próximo <FaChevronRight />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={salvando}
                  >
                    {salvando ? (
                      <>
                        <div className="spinner pequeno"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <FaSave className="button-icon" /> Finalizar e Salvar
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default FichaAssistido;