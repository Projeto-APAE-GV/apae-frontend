import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CadastroUsuario from './pages/cadastroUsuario/CadastroUsuario';
import FichaProntuario from './pages/fichaProntuario/FichaProntuario';
import CadastroPergunta from './pages/fichaProntuario/CadastroPergunta';
import EditarAssistido from './pages/CadastroAssistido/EditarAssistido';
import FichaAssistido from './pages/fichaProntuario/FichaAssistido';
import Relatorio from './pages/relatorio/Relatorio';
import ListaAssistidos from './pages/CadastroAssistido/ListarAssistido';
import CadastroAssistido from './pages/CadastroAssistido/CadastroAssistido';
import RotaProtegida from './pages/RotaProtegida';
import Layout from './components/cabecalho/Layout/Layout';// novo layout
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
                        element={estaLogado() ? <Navigate to="/" replace /> : <Login />}
                    />

                    {/* Rotas protegidas com layout */}
                    <Route element={<RotaProtegida><Layout /></RotaProtegida>}>
                        <Route index element={<Dashboard />} />
                        <Route path="cadastro-usuario" element={<CadastroUsuario />} />
                        <Route path="cadastro-assistido" element={<ListaAssistidos />} />
                        <Route path="/assistidos/cadastro" element={<CadastroAssistido />} />
                        <Route path="/editar-assistido/:id" element={<EditarAssistido />} />
                        <Route path="/ficha-prontuario" element={<FichaProntuario />} />
                        <Route path="/ficha-assistido/:id" element={<FichaAssistido />} />
                        <Route path="/cadastro-pergunta" element={<CadastroPergunta />} />
                        <Route path="relatorio" element={<Relatorio />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
