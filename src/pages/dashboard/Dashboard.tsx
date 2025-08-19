import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

import Cabecalho from '../../components/cabecalho/Cabecalho'; 
import { obterUsuarioLogado } from '../../utils/AuthUtils';

const agendaDoDia = [
    { hora: '09:00', nome: 'Maria Oliveira' },
    { hora: '10:30', nome: 'João Silva' },
    { hora: '13:45', nome: 'Ana Souza' },
    { hora: '15:00', nome: 'Pedro Santos' },
];

const Dashboard: React.FC = () => {
    const usuario = obterUsuarioLogado();
    
    return (
        <>   
            <Cabecalho />

            <div className="dashboard">
                <div className="dashboard-content">
                    <div className="dashboard-container">

                        <div className="main-column">
                            <section className="stats-section">
                                <div className="stat-card">
                                    <div className="stat-icon usuarios">👤</div>
                                    <div className="stat-info">
                                        <h3>Usuários cadastrados</h3>
                                        <span className="stat-number">1.250</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon prontuarios">📄</div>
                                    <div className="stat-info">
                                        <h3>Prontuários ativos</h3>
                                        <span className="stat-number">230</span>
                                    </div>
                                </div>
                            </section>

                            <section className="shortcuts-section">
                                <h2>Atalhos Rápidos</h2>
                                <div className="shortcuts-grid">
                                    <Link to="/ficha-prontuario" className="shortcut-card">
                                        <div className="shortcut-icon preencher">📝</div>
                                        <h3>Preencher Prontuário</h3>
                                    </Link>
                                    <Link to="/buscar-cpf" className="shortcut-card">
                                        <div className="shortcut-icon buscar">🔍</div>
                                        <h3>Buscar CPF</h3>
                                    </Link>

                                    {usuario?.tipo === 'admin' && (
                                        <Link to="/cadastro-usuario" className="shortcut-card">
                                            <div className="shortcut-icon cadastrar">➕</div>
                                            <h3>Cadastrar Usuário</h3>
                                        </Link>
                                    )}
                                </div>
                            </section>
                        </div>

                        <section className="agenda-section">
                            <div className="agenda-card">
                                <h3>Agenda do Dia</h3>
                                <div className="agenda-items">
                                    {agendaDoDia.map((item, index) => (
                                        <div key={index} className="agenda-item">
                                            <span className="horario">{item.hora}</span>
                                            <span className="nome">{item.nome}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="comunicados-card">
                                <h3>Comunicados</h3>
                                <div className="comunicados-items">
                                    <div className="comunicado-item">
                                        <div className="comunicado-bullet"></div>
                                        <span>Capacitação dia 10/08 às 14h.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;