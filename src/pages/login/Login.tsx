import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { realizarLogin } from '../../services/clients/LoginClient';
import { salvarToken } from '../../utils/AuthUtils';
import './Login.css';

interface LoginFormData {
    email: string;
    senha: string;
}

const esquemaValidacao = yup.object().shape({
    email: yup
        .string()
        .required('Email é obrigatório')
        .email('Email deve ser válido'),
    senha: yup
        .string()
        .required('Senha é obrigatória')
        .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(false);
    const [erroLogin, setErroLogin] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(esquemaValidacao),
    });

    const onSubmit = async (dados: LoginFormData) => {
        setCarregando(true);
        setErroLogin('');

        try {
            const resultado = await realizarLogin(dados);
            
            console.log(resultado);

            if (resultado && resultado.access_token) {
                salvarToken(resultado.access_token);
                navigate('/');
            } else {
                setErroLogin('Credenciais inválidas. Tente novamente.');
            }
        } catch (error) {
            setErroLogin('Erro ao conectar com o servidor. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-form-section">
                    <div className="login-header">
                        <div className="logo">
                            <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
                        <h1 className="titulo-principal">APAE BRASIL</h1>
                        <p className="subtitulo">Federação Nacional das Apaes</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <div className="campo">
                            <label htmlFor="email">Nome:</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Nome"
                                {...register('email')}
                                className={errors.email ? 'input-erro' : ''}
                            />
                            {errors.email && (
                                <span className="mensagem-erro">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="campo">
                            <label htmlFor="senha">Senha:</label>
                            <input
                                type="password"
                                id="senha"
                                placeholder="Senha"
                                {...register('senha')}
                                className={errors.senha ? 'input-erro' : ''}
                            />
                            {errors.senha && (
                                <span className="mensagem-erro">{errors.senha.message}</span>
                            )}
                        </div>

                        {erroLogin && (
                            <div className="erro-login">{erroLogin}</div>
                        )}

                        <button
                            type="submit"
                            className="btn-entrar"
                            disabled={carregando}
                        >
                            {carregando ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>

                <div className="login-visual-section">
                    <div className="visual-content">
                        <div className="coracao-container">
                            <div className="coracao">
                                <div className="logo-coracao">
                                    <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
                                <h2 className="apae-titulo">APAE</h2>
                                <p className="apae-localizacao">GOVERNADOR VALADARES/MG</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;