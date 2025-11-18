import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUser,
  FaPhone,
  FaIdCard,
  FaUserCircle,
  FaFilter,
  FaSync,
  FaEnvelope
} from "react-icons/fa";
import "./ListarAssistido.css";

interface Assistido {
  id_assistido: number;
  nome: string;
  cpf: string;
  telefone: string;
  status_ativo: boolean;
  nome_responsavel?: string;
  email?: string;
  data_criacao?: string;
}

function ListaAssistidos() {
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const navigate = useNavigate();

  const carregarAssistidos = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/assistidos");
      setAssistidos(data);
    } catch (err) {
      console.error("Erro ao carregar assistidos:", err);
      alert("Erro ao carregar assistidos");
    } finally {
      setIsLoading(false);
    }
  };

  const excluirAssistido = async (id_assistido: number) => {
    if (!confirm("Tem certeza que deseja excluir este assistido?")) return;
    try {
      await api.delete(`/assistidos/${id_assistido}`);
      setAssistidos((prev) => prev.filter((a) => a.id_assistido !== id_assistido));
      alert("Assistido excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir assistido:", err);
      alert("Erro ao excluir assistido");
    }
  };

  const toggleStatusAssistido = async (assistido: Assistido) => {
    const novoStatus = !assistido.status_ativo;
    const acao = novoStatus ? "ativar" : "inativar";
    
    if (!confirm(`Tem certeza que deseja ${acao} o assistido ${assistido.nome}?`)) return;
    
    try {
      await api.put(`/assistidos/${assistido.id_assistido}`, {
        status_ativo: novoStatus
      });
      
      setAssistidos(prev => prev.map(a => 
        a.id_assistido === assistido.id_assistido 
          ? { ...a, status_ativo: novoStatus }
          : a
      ));
      
      alert(`Assistido ${acao === "ativar" ? "ativado" : "inativado"} com sucesso!`);
    } catch (err) {
      console.error(`Erro ao ${acao} assistido:`, err);
      alert(`Erro ao ${acao} assistido`);
    }
  };

  useEffect(() => {
    carregarAssistidos();
  }, []);

  const filtrados = assistidos.filter((a) => {
    const matchesSearch =
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.cpf.includes(search) ||
      a.nome_responsavel?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && a.status_ativo) ||
      (statusFilter === "inactive" && !a.status_ativo);

    return matchesSearch && matchesStatus;
  });

  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return "-";
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="lista-container">
      <div className="container-max">
        {/* Header */}
        <div className="card-header">
          <div className="header-content">
            <div className="header-title">
              <h1 className="title">
                <FaUserCircle className="title-icon" />
                Gestão de Assistidos
              </h1>
              <p className="subtitle">
                Gerencie os assistidos da APAE
              </p>
            </div>

            <div className="header-actions">
              <button
                onClick={carregarAssistidos}
                disabled={isLoading}
                className="btn-secondary"
              >
                <FaSync className={isLoading ? "spin" : ""} />
                {isLoading ? "Carregando..." : "Atualizar"}
              </button>

              <button
                onClick={() => navigate("/assistidos/cadastro")}
                className="btn-primary"
              >
                <FaPlus />
                Novo Assistido
              </button>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="card-filters">
          <div className="filters-grid">
            <div className="search-container">
              <div className="search-icon">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Pesquisar por nome, CPF, responsável ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <FaFilter className="filter-icon" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                className="filter-select"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>

            <div className="results-count">
              <div className="count-text">
                {filtrados.length} {filtrados.length === 1 ? 'assistido encontrado' : 'assistidos encontrados'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="card-table">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="empty-state">
              <FaUser className="empty-icon" />
              <h3 className="empty-title">Nenhum assistido encontrado</h3>
              <p className="empty-description">
                {search || statusFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Cadastre o primeiro assistido clicando no botão 'Novo Assistido'"}
              </p>
              <button
                onClick={() => navigate("/assistidos/cadastro")}
                className="btn-primary"
              >
                <FaPlus />
                Cadastrar Primeiro Assistido
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Assistido</th>
                    <th className="table-head">CPF</th>
                    <th className="table-head">Contato</th>
                    <th className="table-head">Responsável</th>
                    <th className="table-head">Data de Cadastro</th>
                    <th className="table-head">Status</th>
                    <th className="table-head">Ações</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filtrados.map((a) => (
                    <tr key={a.id_assistido} className="table-row">
                      <td className="table-cell">
                        <div className="user-info">
                          <div className="user-avatar">
                            <FaUser className="avatar-icon" />
                          </div>
                          <div className="user-details">
                            <div className="user-name">{a.nome}</div>
                            <div className="user-id">ID: {a.id_assistido}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="cpf-info">
                          <FaIdCard className="cpf-icon" />
                          {formatarCPF(a.cpf)}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="contact-info">
                          <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            {a.telefone}
                          </div>
                          {a.email && (
                            <div className="contact-item email">
                              <FaEnvelope className="contact-icon" />
                              {a.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="responsible-name">
                          {a.nome_responsavel || "-"}
                        </div>
                      </td>
                      <td className="table-cell">
                        {formatarData(a.data_criacao || "")}
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => toggleStatusAssistido(a)}
                          className={`status-badge ${a.status_ativo ? "status-active" : "status-inactive"}`}
                        >
                          {a.status_ativo ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="table-cell">
                        <div className="action-buttons">
                          <button
                            onClick={() => navigate(`/assistidos/editar/${a.id_assistido}`)}
                            className="btn-action btn-edit"
                            title="Editar assistido"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => navigate(`/assistidos/ficha/${a.id_assistido}`)}
                            className="btn-action btn-view"
                            title="Ver ficha"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => excluirAssistido(a.id_assistido)}
                            className="btn-action btn-delete"
                            title="Excluir assistido"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListaAssistidos;