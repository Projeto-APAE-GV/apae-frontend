import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaPhone,
  FaUserCircle,
  FaFilter,
  FaSync,
  FaEnvelope
} from "react-icons/fa";

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  status_ativo: boolean;
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
    } catch (err) {
      alert("Erro ao excluir usuário");
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const filtrados = usuarios.filter((u) => {
    const matchesSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.perfil.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.status_ativo) ||
      (statusFilter === "inactive" && !u.status_ativo);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaUserCircle className="text-blue-600" />
                Gestão de Usuários
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={carregarUsuarios}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FaSync />
                Atualizar
              </button>

              <Link
                to="/cadastro-usuario"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
                Novo Usuário
              </Link>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               
              </div>
              <input
                type="text"
                placeholder="Pesquisar por nome, email ou perfil..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {filtrados.length} {filtrados.length === 1 ? 'resultado' : 'resultados'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-12 px-4">
              <FaUser className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Cadastre o primeiro usuário clicando no botão acima"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtrados.map((u) => (
                    <tr key={u.id_usuario} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{u.nome}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaEnvelope className="text-gray-400 mr-2" />
                          {u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaPhone className="text-gray-400 mr-2" />
                          {u.telefone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{u.perfil}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status_ativo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}>
                          {u.status_ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
<<<<<<< HEAD
                          <button
                            onClick={() => navigate(`/editar-usuario/${u.id_usuario}`)}
=======
                           <button
                            onClick={() => navigate(`/editar-usuario/${u.id}`)}
>>>>>>> 33cfd22901eeb030e8906520f984d7e87d73ee7e
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Editar usuário"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => excluirUsuario(u.id_usuario)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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