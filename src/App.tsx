import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import CadastroUsuario from './pages/cadastroUsuario/CadastroUsuario';
import EditarUsuario from './pages/cadastroUsuario/EditarUsuario';
import ListaUsuario from './pages/cadastroUsuario/ListaUsuario';
import ExclusaoPerguntas from './pages/fichaProntuario/ExclusaoPerguntas';
import FichaProntuario from './pages/fichaProntuario/FichaProntuario';
import CadastroPergunta from './pages/fichaProntuario/CadastroPergunta';
import EditarAssistido from './pages/CadastroAssistido/EditarAssistido';
import FichaAssistido from './pages/fichaProntuario/FichaAssistido';
import Relatorio from './pages/relatorio/Relatorio';
import ListaAssistidos from './pages/CadastroAssistido/ListarAssistido';
import CadastroAssistido from './pages/CadastroAssistido/CadastroAssistido';
import RotaProtegida from './pages/RotaProtegida';
import Layout from './components/cabecalho/Layout/Layout';
import { estaLogado } from './utils/AuthUtils';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Login fica fora do layout */}
                    <Route
                        path="/login"
                        element={estaLogado() ? <Navigate to="/assistidos" replace /> : <Login />}
                    />

                    {/* Rotas protegidas com layout */}
                    <Route element={<RotaProtegida><Layout /></RotaProtegida>}>
                        {/* Página inicial - Lista de Assistidos */}
                        <Route index element={<Navigate to="/assistidos" replace />} />
                        
                        {/* ✅ CORRIGIDO: Rotas de Usuários */}
                        <Route path="usuarios">
                            <Route path="lista" element={<ListaUsuario />} />
                            <Route path="cadastro" element={<CadastroUsuario />} />
                            <Route path="editar/:id" element={<EditarUsuario />} />
                        </Route>

                        {/* Rotas de Assistidos - Página Principal */}
                        <Route path="assistidos">
                            <Route index element={<ListaAssistidos />} />
                            <Route path="lista" element={<ListaAssistidos />} />
                            <Route path="cadastro" element={<CadastroAssistido />} />
                            <Route path="editar/:id" element={<EditarAssistido />} />
                            <Route path="ficha/:id" element={<FichaAssistido />} />
                        </Route>

                        {/* Rotas de Prontuário e Perguntas */}
                        <Route path="prontuario">
                            <Route path="ficha" element={<FichaProntuario />} />
                            <Route path="perguntas">
                                <Route path="cadastro" element={<CadastroPergunta />} />
                                <Route path="excluir" element={<ExclusaoPerguntas />} />
                            </Route>
                        </Route>

                        {/* Outras rotas */}
                        <Route path="relatorios" element={<Relatorio />} />
                    </Route>

                    {/* ✅ CORRIGIDO: Rota fallback para assistidos */}
                    <Route path="*" element={<Navigate to="/assistidos" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;