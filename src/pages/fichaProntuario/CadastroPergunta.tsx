import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaSave, FaPlus, FaArrowLeft } from 'react-icons/fa';
import './CadastroPergunta.css';

interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  ordem_exibicao: number;
  ativa: boolean;
}

interface PerguntaFormData {
  texto_pergunta: string;
  id_categoria: number;
  tipo_resposta: 'texto' | 'numero' | 'opcoes' | 'data' | 'boolean';
  opcoes_resposta: string[];
  obrigatoria: boolean;
  ordem_categoria: number;
  ativa: boolean;
}

const CadastroPergunta: React.FC = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [opcoesTemp, setOpcoesTemp] = useState<string>('');
  
  const [formData, setFormData] = useState<PerguntaFormData>({
    texto_pergunta: '',
    id_categoria: 0,
    tipo_resposta: 'texto',
    opcoes_resposta: [],
    obrigatoria: false,
    ordem_categoria: 1,
    ativa: true
  });

  // Carregar categorias do backend
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        setCarregando(true);
        const res = await api.get('/categorias');
        // Filtrar apenas categorias ativas
        const categoriasAtivas = res.data.filter((cat: Categoria) => cat.ativa);
        setCategorias(categoriasAtivas);
        setCarregando(false);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        alert('Erro ao carregar categorias. Verifique o console.');
        setCarregando(false);
      }
    };

    carregarCategorias();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'id_categoria' || name === 'ordem_categoria' ? Number(value) : value
      });
    }
  };

  const handleTipoRespostaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as PerguntaFormData['tipo_resposta'];
    setFormData({
      ...formData,
      tipo_resposta: tipo,
      // Limpar opções se não for do tipo opcoes
      opcoes_resposta: tipo !== 'opcoes' ? [] : formData.opcoes_resposta
    });
  };

  const handleAdicionarOpcao = () => {
    if (opcoesTemp.trim() && formData.tipo_resposta === 'opcoes') {
      setFormData({
        ...formData,
        opcoes_resposta: [...formData.opcoes_resposta, opcoesTemp.trim()]
      });
      setOpcoesTemp('');
    }
  };

  const handleRemoverOpcao = (index: number) => {
    const novasOpcoes = formData.opcoes_resposta.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      opcoes_resposta: novasOpcoes
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.texto_pergunta.trim()) {
      alert('Por favor, informe o texto da pergunta.');
      return;
    }
    
    if (!formData.id_categoria) {
      alert('Por favor, selecione uma categoria.');
      return;
    }
    
    if (formData.tipo_resposta === 'opcoes' && formData.opcoes_resposta.length < 2) {
      alert('Para perguntas de opção, é necessário pelo menos 2 opções.');
      return;
    }
    
    setSalvando(true);

    try {
      // Preparar payload para enviar
      const payload = {
        texto_pergunta: formData.texto_pergunta.trim(),
        id_categoria: formData.id_categoria,
        tipo_resposta: formData.tipo_resposta,
        opcoes_resposta: formData.tipo_resposta === 'opcoes' ? formData.opcoes_resposta : undefined,
        obrigatoria: formData.obrigatoria,
        ordem_categoria: formData.ordem_categoria,
        ativa: formData.ativa
      };

      await api.post('/perguntas', payload);
      alert('Pergunta cadastrada com sucesso!');
      
      // Redirecionar para a ficha do assistido ou para lista de perguntas
      navigate('/ficha-prontuario');
      
    } catch (err: any) {
      console.error('Erro ao cadastrar pergunta:', err);
      if (err.response) {
        alert(`Erro ao cadastrar: ${err.response.status} - ${err.response.data.message}`);
      } else {
        alert('Erro ao cadastrar pergunta. Verifique o console.');
      }
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="cadastro-pergunta-container">
        <div className="carregando">
          <div className="spinner"></div>
          <p>Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-pergunta-container">
      <div className="cadastro-pergunta-header">
        <button className="back-button-pergunta" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} /> Voltar
        </button>
        <h1>Cadastrar Nova Pergunta</h1>
        <p>Preencha os dados abaixo para criar uma nova pergunta</p>
      </div>

      <form className="form-pergunta" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group full-width">
            <label htmlFor="texto_pergunta" className="input-label">
              Texto da Pergunta *
            </label>
            <textarea
              id="texto_pergunta"
              name="texto_pergunta"
              value={formData.texto_pergunta}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Digite o texto da pergunta..."
              rows={3}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="id_categoria" className="input-label">
              Categoria *
            </label>
            <select
              id="id_categoria"
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value={0}>Selecione uma categoria</option>
              {categorias.map(categoria => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nome_categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="tipo_resposta" className="input-label">
              Tipo de Resposta *
            </label>
            <select
              id="tipo_resposta"
              name="tipo_resposta"
              value={formData.tipo_resposta}
              onChange={handleTipoRespostaChange}
              className="input-field"
              required
            >
              <option value="texto">Texto</option>
              <option value="numero">Número</option>
              <option value="opcoes">Opções</option>
              <option value="data">Data</option>
              <option value="boolean">Sim/Não</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="ordem_categoria" className="input-label">
              Ordem na Categoria
            </label>
            <input
              id="ordem_categoria"
              name="ordem_categoria"
              type="number"
              min="1"
              value={formData.ordem_categoria}
              onChange={handleInputChange}
              className="input-field"
              placeholder="1"
            />
          </div>

          {formData.tipo_resposta === 'opcoes' && (
            <div className="input-group full-width">
              <label className="input-label">Opções de Resposta *</label>
              <div className="opcoes-container">
                <div className="adicionar-opcao">
                  <input
                    type="text"
                    value={opcoesTemp}
                    onChange={(e) => setOpcoesTemp(e.target.value)}
                    className="input-field"
                    placeholder="Digite uma opção..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdicionarOpcao();
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={handleAdicionarOpcao}
                    className="btn-adicionar-opcao"
                    disabled={!opcoesTemp.trim()}
                  >
                    <FaPlus /> Adicionar
                  </button>
                </div>
                
                {formData.opcoes_resposta.length > 0 && (
                  <div className="lista-opcoes">
                    <p>Opções adicionadas:</p>
                    {formData.opcoes_resposta.map((opcao, index) => (
                      <div key={index} className="opcao-item">
                        <span>{opcao}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoverOpcao(index)}
                          className="btn-remover-opcao"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="obrigatoria" className="checkbox-label">
              <input
                type="checkbox"
                id="obrigatoria"
                name="obrigatoria"
                checked={formData.obrigatoria}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Pergunta Obrigatória
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="ativa" className="checkbox-label">
              <input
                type="checkbox"
                id="ativa"
                name="ativa"
                checked={formData.ativa}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Pergunta Ativa
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancelar"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={salvando}
          >
            {salvando ? (
              <>
                <div className="spinner pequeno"></div>
                Cadastrando...
              </>
            ) : (
              <>
                <FaSave className="button-icon" /> Cadastrar Pergunta
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroPergunta;