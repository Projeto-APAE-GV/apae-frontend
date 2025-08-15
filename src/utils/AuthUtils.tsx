import { jwtDecode } from 'jwt-decode';
import { UsuarioDto } from './dto/UsuarioDto';

export const salvarToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const obterToken = (): string | null => {
    return localStorage.getItem('token');
};

export const removerToken = (): void => {
    localStorage.removeItem('token');
};

export const decodificarToken = (token: string): UsuarioDto | null => {
    try {
        return jwtDecode < UsuarioDto > (token);
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
    }
};

export const obterUsuarioLogado = (): UsuarioDto | null => {
    const token = obterToken();
    if (!token) return null;

    return decodificarToken(token);
};

export const estaLogado = (): boolean => {
    const usuario = obterUsuarioLogado();
    if (!usuario) return false;

    const agora = Date.now() / 1000;
    return usuario.exp > agora;
};

export const ehAdmin = (): boolean => {
    const usuario = obterUsuarioLogado();
    return usuario?.tipo === 'admin';
};