import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterUsuarioLogado, removerToken } from '../../utils/AuthUtils';
import './Cabecalho.css';

const Cabecalho: React.FC = () => {
    const navigate = useNavigate();
    const usuario = obterUsuarioLogado();

    const handleSair = () => {
        removerToken();
        navigate('/login');
    };

    return (
        <header className="cabecalho">
            <div className="cabecalho-conteudo">
                <Link to="/" className="logo-link">
                    <div className="logo">
                        <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(50, 50)">
                                <circle cx="0" cy="-20" r="8" fill="#ffd700" />
                                <ellipse cx="-15" cy="-15" rx="6" ry="4" fill="#ffd700" transform="rotate(-45)" />
                                <ellipse cx="15" cy="-15" rx="6" ry="4" fill="#ffd700" transform="rotate(45)" />
                                <ellipse cx="-20" cy="0" rx="6" ry="4" fill="#ffd700" transform="rotate(-90)" />
                                <ellipse cx="20" cy="0" rx="6" ry="4" fill="#ffd700" transform="rotate(90)" />
                                <ellipse cx="-15" cy="15" rx="6" ry="4" fill="#ffd700" transform="rotate(-135)" />
                                <ellipse cx="15" cy="15" rx="6" ry="4" fill="#ffd700" transform="rotate(135)" />
                                <ellipse cx="0" cy="20" rx="6" ry="4" fill="#ffd700" transform="rotate(180)" />
                                <ellipse cx="-8" cy="-8" rx="6" ry="4" fill="#ffd700" transform="rotate(-225)" />

                                <rect x="-2" y="-10" width="4" height="25" fill="#4CAF50" />

                                <ellipse cx="-8" cy="-5" rx="6" ry="3" fill="#4CAF50" />
                                <ellipse cx="8" cy="-5" rx="6" ry="3" fill="#4CAF50" />

                                <path d="M -35,15 Q -30,10 -25,15 Q -20,20 -15,15 Q -10,10 -5,15 Q 0,20 5,15 Q 10,10 15,15 Q 20,20 25,15 Q 30,10 35,15"
                                    stroke="none" fill="#4CAF50" />

                                <path d="M -30,25 L -35,20 M -25,25 L -30,20 M -20,25 L -25,20 M -15,25 L -20,20 M -10,25 L -15,20 M -5,25 L -10,20 M 0,25 L -5,20 M 5,25 L 0,20 M 10,25 L 5,20 M 15,25 L 10,20 M 20,25 L 15,20 M 25,25 L 20,20 M 30,25 L 25,20 M 35,25 L 30,20"
                                    stroke="#4CAF50" strokeWidth="2" fill="none" />

                                <path d="M -25,-35 Q -20,-30 -15,-35 L -10,-30 L -5,-35 L 0,-30 L 5,-35 L 10,-30 L 15,-35 Q 20,-30 25,-35"
                                    stroke="#CCCCCC" strokeWidth="8" fill="none" strokeLinecap="round" />
                                <path d="M -25,-35 Q -20,-40 -15,-35" stroke="#CCCCCC" strokeWidth="8" fill="none" strokeLinecap="round" />
                                <path d="M 15,-35 Q 20,-40 25,-35" stroke="#CCCCCC" strokeWidth="8" fill="none" strokeLinecap="round" />
                            </g>
                        </svg>
                    </div>
                    <span className="apae-gv">APAE-GV</span>
                </Link>

                <nav className="navegacao">
                    <Link to="/" className="nav-item">Tela inicial</Link>
                    {usuario?.tipo === 'admin' && (
                        <Link to="/cadastro-usuario" className="nav-item">Cadastro do Usuário</Link>
                    )}
                    <Link to="/ficha-prontuario" className="nav-item">Ficha de Prontuário</Link>
                    <Link to="/relatorio" className="nav-item">Relatório</Link>
                </nav>

                <div className="usuario-info">
                    <div className="usuario-avatar">
                        <div className="avatar-circulo">
                            {usuario?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="usuario-dados">
                        <span className="usuario-nome">{usuario?.email}</span>
                        <span className="usuario-tipo">{usuario?.tipo}</span>
                    </div>
                    <button className="btn-sair" onClick={handleSair}>
                        Sair
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Cabecalho;