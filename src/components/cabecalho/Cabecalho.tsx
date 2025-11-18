import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { obterUsuarioLogado, removerToken } from '../../utils/AuthUtils';
import { 
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
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <header className="cabecalho">
                <div className="cabecalho-conteudo">
                    {/* Logo link para página inicial */}
                    <Link to="/assistidos" className="logo-link">
                        <div className="logo">
                            
                        </div>
                        <span className="apae-gv">APAE-GV</span>
                    </Link>

                    <button className="menu-toggle" onClick={toggleMenu}>
                        {menuAberto ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    <nav className={`navegacao ${menuAberto ? 'aberto' : ''}`}>
                        {/* ✅ Menu Assistidos - Página Principal */}
                        <Link 
                            to="/assistidos" 
                            className={`nav-item ${isActiveLink('/assistidos') ? 'ativo' : ''}`}
                            onClick={() => setMenuAberto(false)}
                        >
                            <FiUser className="nav-icon" />
                            <span>Assistidos</span>
                        </Link>
                        
                        {/* ✅ Menu Usuários - SIMPLES, sem dropdown */}
                        {usuario?.tipo === 'admin' && (
                            <Link 
                                to="/usuarios/lista" 
                                className={`nav-item ${isActiveLink('/usuarios') ? 'ativo' : ''}`}
                                onClick={() => setMenuAberto(false)}
                            >
                                <FiUsers className="nav-icon" />
                                <span>Usuários</span>
                            </Link>
                        )}
                        
                        {/* ✅ Menu Prontuário */}
                        <Link 
                            to="/prontuario/ficha" 
                            className={`nav-item ${isActiveLink('/prontuario') ? 'ativo' : ''}`}
                            onClick={() => setMenuAberto(false)}
                        >
                            <FiFileText className="nav-icon" />
                            <span>Ficha de Prontuário</span>
                        </Link>
                        
                        {/* ✅ Menu Relatórios */}
                        <Link 
                            to="/relatorios" 
                            className={`nav-item ${isActiveLink('/relatorios') ? 'ativo' : ''}`}
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