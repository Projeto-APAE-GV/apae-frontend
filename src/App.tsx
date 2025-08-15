import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CadastroUsuario from './pages/cadastroUsuario/CadastroUsuario';
import FichaProntuario from './pages/fichaProntuario/FichaProntuario';
import Relatorio from './pages/relatorio/Relatorio';
import BuscarCpf from './pages/buscarCpf/BuscarCpf';
import RotaProtegida from './pages/RotaProtegida';
import { estaLogado } from './utils/AuthUtils';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/login"
                        element={estaLogado() ? <Navigate to="/" replace /> : <Login />}
                    />

                    <Route path="/" element={
                        <RotaProtegida>
                            <Dashboard />
                        </RotaProtegida>
                    } />

                    <Route path="/cadastro-usuario" element={
                        <RotaProtegida>
                            <CadastroUsuario />
                        </RotaProtegida>
                    } />

                    <Route path="/ficha-prontuario" element={
                        <RotaProtegida>
                            <FichaProntuario />
                        </RotaProtegida>
                    } />

                    <Route path="/relatorio" element={
                        <RotaProtegida>
                            <Relatorio />
                        </RotaProtegida>
                    } />

                    <Route path="/buscar-cpf" element={
                        <RotaProtegida>
                            <BuscarCpf />
                        </RotaProtegida>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;