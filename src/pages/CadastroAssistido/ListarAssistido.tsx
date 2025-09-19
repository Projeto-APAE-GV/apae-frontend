import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ListarAssistido.css";
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
  FaSync
} from "react-icons/fa";

interface Assistido {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  status_ativo: boolean;
  nome_responsavel?: string;
}

function ListaAssistidos() {
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [search, setSearch] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const navigate = useNavigate(); // Adicionando o hook de navegação

  const carregarAssistidos = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/assistidos");
      setAssistidos(data);
    } catch (err) {
      alert("Erro ao carregar assistidos");
    } finally {
      setIsLoading(false);
    }
  };

  const excluirAssistido = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este assistido?")) return;
    try {
      await api.delete(`/assistidos/${id}`);
      setAssistidos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Erro ao excluir assistido");
    }
  };

  const editarAssistido = (id: number) => {
    // Navegar para a página de edição com o ID do assistido
    navigate(`/editar-assistido/${id}`);
  };

  const visualizarAssistido = (id: number) => {
    // Navegar para a página de visualização com o ID do assistido
    navigate(`/visualizar-assistido/${id}`);
  };

  useEffect(() => {
    carregarAssistidos();
  }, []);

  const filtrados = assistidos.filter((a) => {
    const matchesSearch =
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.cpf.includes(search) ||
      a.nome_responsavel?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && a.status_ativo) ||
      (statusFilter === "inactive" && !a.status_ativo);

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
                Gestão de Assisitidos
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={carregarAssistidos}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FaSync />
                Atualizar
              </button>

              <Link
                to="/assistidos/cadastro"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
                Novo Assistido
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
                placeholder="Pesquisar por nome, CPF ou responsável..."
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
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum paciente encontrado</h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Cadastre o primeiro paciente clicando no botão acima"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsável
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
                  {filtrados.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{a.nome}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{a.cpf}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaPhone className="text-gray-400 mr-2" />
                          {a.telefone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{a.nome_responsavel || "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${a.status_ativo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}>
                          {a.status_ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/editar-assistido/${a.id_assistido}`)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Editar assistido"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => excluirAssistido(a.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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