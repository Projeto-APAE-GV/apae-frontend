import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaUserCircle,
  FaFilter,
  FaSync,
  FaEnvelope
} from "react-icons/fa";
import "./ListaUsuario.css";

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: string;
  ativo: boolean;
  data_criacao: string;
}

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const navigate = useNavigate();

  const carregarUsuarios = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/usuarios");
      setUsuarios(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      alert("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const excluirUsuario = async (id_usuario: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await api.delete(`/usuarios/${id_usuario}`);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id_usuario));
      alert("Usuário excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      alert("Erro ao excluir usuário");
    }
  };

  const toggleStatusUsuario = async (usuario: Usuario) => {
    const novoStatus = !usuario.ativo;
    const acao = novoStatus ? "ativar" : "inativar";
    
    if (!confirm(`Tem certeza que deseja ${acao} o usuário ${usuario.nome}?`)) return;
    
    try {
      await api.put(`/usuarios/${usuario.id_usuario}`, {
        ativo: novoStatus
      });
      
      setUsuarios(prev => prev.map(u => 
        u.id_usuario === usuario.id_usuario 
          ? { ...u, ativo: novoStatus }
          : u
      ));
      
      alert(`Usuário ${acao === "ativar" ? "ativado" : "inativado"} com sucesso!`);
    } catch (err) {
      console.error(`Erro ao ${acao} usuário:`, err);
      alert(`Erro ao ${acao} usuário`);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const filtrados = usuarios.filter((u) => {
    const matchesSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.tipo_usuario.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.ativo) ||
      (statusFilter === "inactive" && !u.ativo);

    return matchesSearch && matchesStatus;
  });

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const traduzirTipoUsuario = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      'admin': 'Administrador',
      'secretaria': 'Secretária',
      'psicologa': 'Psicóloga',
      'assistente': 'Assistente'
    };
    return tipos[tipo] || tipo;
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
                Gestão de Usuários
              </h1>
              <p className="subtitle">
                Gerencie os usuários do sistema
              </p>
            </div>

            <div className="header-actions">
              <button
                onClick={carregarUsuarios}
                disabled={isLoading}
                className="btn-secondary"
              >
                <FaSync className={isLoading ? "spin" : ""} />
                {isLoading ? "Carregando..." : "Atualizar"}
              </button>

              <button
                onClick={() => navigate("/usuarios/cadastro")}
                className="btn-primary"
              >
                <FaPlus />
                Novo Usuário
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
                placeholder="Pesquisar por nome, email ou perfil..."
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
                {filtrados.length} {filtrados.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
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
              <h3 className="empty-title">Nenhum usuário encontrado</h3>
              <p className="empty-description">
                {search || statusFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Cadastre o primeiro usuário clicando no botão 'Novo Usuário'"}
              </p>
              <button
                onClick={() => navigate("/usuarios/cadastro")}
                className="btn-primary"
              >
                <FaPlus />
                Cadastrar Primeiro Usuário
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Usuário</th>
                    <th className="table-head">Email</th>
                    <th className="table-head">Tipo</th>
                    <th className="table-head">Data de Criação</th>
                    <th className="table-head">Status</th>
                    <th className="table-head">Ações</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filtrados.map((u) => (
                    <tr key={u.id_usuario} className="table-row">
                      <td className="table-cell">
                        <div className="user-info">
                          <div className="user-avatar">
                            <FaUser className="avatar-icon" />
                          </div>
                          <div className="user-details">
                            <div className="user-name">{u.nome}</div>
                            <div className="user-id">ID: {u.id_usuario}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="email-info">
                          <FaEnvelope className="email-icon" />
                          {u.email}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="user-type">
                          {traduzirTipoUsuario(u.tipo_usuario)}
                        </div>
                      </td>
                      <td className="table-cell">
                        {formatarData(u.data_criacao)}
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => toggleStatusUsuario(u)}
                          className={`status-badge ${u.ativo ? "status-active" : "status-inactive"}`}
                        >
                          {u.ativo ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/editar-usuario/${u.id_usuario}`)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Editar usuário"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => excluirUsuario(u.id_usuario)}
                            className="btn-action btn-delete"
                            title="Excluir usuário"
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

export default ListaUsuarios;