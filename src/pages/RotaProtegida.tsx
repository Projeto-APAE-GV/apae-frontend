import React from 'react';
import { Navigate } from 'react-router-dom';
import { estaLogado } from '../utils/AuthUtils';

interface RotaProtegidaProps {
    children: React.ReactNode;
}

const RotaProtegida: React.FC<RotaProtegidaProps> = ({ children }) => {
    return estaLogado() ? <>{children}</> : <Navigate to="/login" replace />;
};

export default RotaProtegida;