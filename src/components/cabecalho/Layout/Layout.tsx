import React from 'react';
import { Outlet } from 'react-router-dom';
import Cabecalho from '../Cabecalho'; // caminho relativo para o cabeçalho

const Layout: React.FC = () => {
    return (
        <div>
            <Cabecalho />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
