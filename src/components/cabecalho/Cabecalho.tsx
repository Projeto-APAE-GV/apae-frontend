import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { obterUsuarioLogado, removerToken } from '../../utils/AuthUtils';
import { 
  FiUserPlus, 
  FiUser, 
  FiUsers,
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
                    <Link to="/cadastro-usuario" className="logo-link">
                        <div className="logo">
                            
                        </div>
                        <span className="apae-gv">APAE-GV</span>
                    </Link>

                    <button className="menu-toggle" onClick={toggleMenu}>
                        {menuAberto ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    <nav className={`navegacao ${menuAberto ? 'aberto' : ''}`}>
                        {/* Menu Usuários - Visível apenas para admin */}
                        {usuario?.tipo === 'admin' && (
                            <div className="nav-group">
                                <div className="nav-group-header">
                                    <FiUsers className="nav-icon" />
                                    <span>Usuários</span>
                                </div>
                                <div className="nav-submenu">
                                    <Link 
                                        to="/cadastro-usuario" 
                                        className={`nav-subitem ${isActiveLink('/cadastro-usuario') ? 'ativo' : ''}`}
                                        onClick={() => setMenuAberto(false)}
                                    >
                                        <FiUserPlus className="nav-subicon" />
                                        <span>Cadastrar Usuário</span>
                                    </Link>
                                    <Link 
                                        to="/lista-usuarios" 
                                        className={`nav-subitem ${isActiveLink('/lista-usuarios') ? 'ativo' : ''}`}
                                        onClick={() => setMenuAberto(false)}
                                    >
                                        <FiUsers className="nav-subicon" />
                                        <span>Lista de Usuários</span>
                                    </Link>
                                </div>
                            </div>
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
                            to="/lista-usuario" 
                            className={`nav-item ${isActiveLink('/lista-usuario') ? 'ativo' : ''}`}
                            onClick={() => setMenuAberto(false)}
                        >
                            <FiUsers className="nav-icon" />
                            <span>Usuários</span>
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