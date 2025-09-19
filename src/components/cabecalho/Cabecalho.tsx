import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { obterUsuarioLogado, removerToken } from '../../utils/AuthUtils';
import { 
  FiHome, 
  FiUserPlus, 
  FiUser, 
  FiFileText, 
  FiBarChart2, 
  FiLogOut, 
  FiMenu,
  FiX,
  FiChevronDown
} from 'react-icons/fi';
import './Cabecalho.css';

const Cabecalho: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const usuario = obterUsuarioLogado();
    const [menuAberto, setMenuAberto] = useState(false);
    const [dropdownAberto, setDropdownAberto] = useState(false);

    const handleSair = () => {
        removerToken();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const toggleDropdown = () => {
        setDropdownAberto(!dropdownAberto);
    };

    const isActiveLink = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
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

                    <button className="menu-toggle" onClick={toggleMenu}>
                        {menuAberto ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    <nav className={`navegacao ${menuAberto ? 'aberto' : ''}`}>
                        <Link 
                            to="/" 
                            className={`nav-item ${isActiveLink('/') ? 'ativo' : ''}`}
                            onClick={() => setMenuAberto(false)}
                        >
                            <FiHome className="nav-icon" />
                            <span>Tela inicial</span>
                        </Link>
                        {usuario?.tipo === 'admin' && (
                            <Link 
                                to="/cadastro-usuario" 
                                className={`nav-item ${isActiveLink('/cadastro-usuario') ? 'ativo' : ''}`}
                                onClick={() => setMenuAberto(false)}
                            >
                                <FiUserPlus className="nav-icon" />
                                <span>Cadastro do Usuário</span>
                            </Link>
                        )}
                        <Link 
                            to="/cadastro-assistido" 
                            className={`nav-item ${isActiveLink('/cadastro-assistido') ? 'ativo' : ''}`}
                            onClick={() => setMenuAberto(false)}
                        >
                            <FiUser className="nav-icon" />
                            <span>Assistido</span>
                        </Link>
                        <Link 
                            to="/ficha-prontuario" 
                            className={`nav-item ${isActiveLink('/ficha-prontuario') ? 'ativo' : ''}`}
                            onClick={() => setMenuAberto(false)}
                        >
                            <FiFileText className="nav-icon" />
                            <span>Ficha de Prontuário</span>
                        </Link>
                        <Link 
                            to="/relatorio" 
                            className={`nav-item ${isActiveLink('/relatorio') ? 'ativo' : ''}`}
                            onClick={() => setMenuAberto(false)}
                        >
                            <FiBarChart2 className="nav-icon" />
                            <span>Relatório</span>
                        </Link>
                    </nav>

                    <div className="usuario-info">
                        <div 
                            className="usuario-toggle" 
                            onClick={toggleDropdown}
                            onBlur={() => setTimeout(() => setDropdownAberto(false), 200)}
                            tabIndex={0}
                        >
                            <div className="usuario-avatar">
                                <div className="avatar-circulo">
                                    {usuario?.email?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="usuario-dados">
                                <span className="usuario-nome">{usuario?.email}</span>
                                <span className="usuario-tipo">{usuario?.tipo}</span>
                            </div>
                            <FiChevronDown className={`dropdown-arrow ${dropdownAberto ? 'aberto' : ''}`} />
                        </div>
                        
                        <div className={`dropdown-menu ${dropdownAberto ? 'aberto' : ''}`}>
                            <button className="dropdown-item" onClick={handleSair}>
                                <FiLogOut className="dropdown-icon" />
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            {menuAberto && <div className="overlay" onClick={() => setMenuAberto(false)}></div>}
        </>
    );
};

export default Cabecalho;