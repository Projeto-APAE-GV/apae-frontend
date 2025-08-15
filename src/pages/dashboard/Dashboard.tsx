import React from 'react';
import { Link } from 'react-router-dom';
import Cabecalho from '../../components/cabecalho/Cabecalho';
import { ehAdmin, obterUsuarioLogado } from '../../utils/AuthUtils';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const usuario = obterUsuarioLogado();
    const isAdmin = ehAdmin();

    return (
        <div className="dashboard">
            <Cabecalho />

            <main className="dashboard-content">
                <div className="dashboard-container">
                    <div className="stats-section">
                        <div className="stat-card">
                            <div className="stat-icon usuarios">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <h3>Usuários cadastrados</h3>
                                <span className="stat-number">1.250</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon prontuarios">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" />
                                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <h3>Prontuários ativos</h3>
                                <span className="stat-number">230</span>
                            </div>
                        </div>

                        <div className="usuario-card">
                            <div className="usuario-avatar-grande">
                                <div className="avatar-circulo-grande">
                                    {usuario?.email?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="usuario-info-card">
                                <h3>{usuario?.email}</h3>
                                <span className="usuario-tipo-card">{usuario?.tipo}</span>
                                <button className="btn-sair-card">Sair</button>
                            </div>
                        </div>
                    </div>

                    <div className="shortcuts-section">
                        <h2>Atalhos Rápidos</h2>
                        <div className="shortcuts-grid">
                            {isAdmin && (
                                <Link to="/cadastro-usuario" className="shortcut-card">
                                    <div className="shortcut-icon cadastrar">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                            <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                                            <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <h3>Cadastrar Usuário</h3>
                                </Link>
                            )}

                            <Link to="/ficha-prontuario" className="shortcut-card">
                                <div className="shortcut-icon preencher">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3>Preencher Prontuário</h3>
                            </Link>

                            <Link to="/buscar-cpf" className="shortcut-card">
                                <div className="shortcut-icon buscar">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3>Buscar CPF</h3>
                            </Link>
                        </div>
                    </div>

                    <div className="agenda-section">
                        <div className="agenda-card">
                            <h3>Agenda do Dia</h3>
                            <div className="agenda-items">
                                <div className="agenda-item">
                                    <span className="horario">09:00</span>
                                    <span className="nome">Maria Oliveira</span>
                                </div>
                                <div className="agenda-item">
                                    <span className="horario">10:30</span>
                                    <span className="nome">João Silva</span>
                                </div>
                                <div className="agenda-item">
                                    <span className="horario">13:45</span>
                                    <span className="nome">Ana Souza</span>
                                </div>
                                <div className="agenda-item">
                                    <span className="horario">15:00</span>
                                    <span className="nome">Pedro Santos</span>
                                </div>
                            </div>
                        </div>

                        <div className="comunicados-card">
                            <h3>Comunicados</h3>
                            <div className="comunicados-items">
                                <div className="comunicado-item">
                                    <div className="comunicado-bullet"></div>
                                    <span>Capacitação dia 10/08 às 14h.</span>
                                </div>
                                <div className="comunicado-item">
                                    <div className="comunicado-bullet"></div>
                                    <span>Atualização no formulário de cadastro</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;