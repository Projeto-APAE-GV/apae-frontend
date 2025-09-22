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
        // Redireciona para listar assistidos em vez da tela inicial
        navigate('/cadastro-assistido');
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
        <div className="login-visual-section">
          <div className="visual-content">
            <div className="welcome-message">
              <h1 className="titulo-principal">APAE</h1>
              <h2 className="subtitulo">GOVERNADOR VALADARES</h2>
              <div className="destaque-box">
                <p>Juntos transformando vidas e construindo um futuro inclusivo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Bem-vindo</h2>
              <p>Faça login para acessar o sistema</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="campo">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Seu endereço de e-mail"
                  {...register('email')}
                  className={errors.email ? 'input-erro' : ''}
                />
                {errors.email && (
                  <span className="mensagem-erro">{errors.email.message}</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="senha">Senha</label>
                <input
                  type="password"
                  id="senha"
                  placeholder="Sua senha"
                  {...register('senha')}
                  className={errors.senha ? 'input-erro' : ''}
                />
                {errors.senha && (
                  <span className="mensagem-erro">{errors.senha.message}</span>
                )}
              </div>

              {erroLogin && (
                <div className="erro-login">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#E53E3E"/>
                    <path d="M8 4V9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 12H8.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {erroLogin}
                </div>
              )}

              <button
                type="submit"
                className="btn-entrar"
                disabled={carregando}
              >
                {carregando ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    </svg>
                    Entrando...
                  </>
                ) : 'Entrar'}
              </button>
            </form>

            <div className="login-footer">
              <p>Precisa de ajuda? <a href="/ajuda">Entre em contato</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;