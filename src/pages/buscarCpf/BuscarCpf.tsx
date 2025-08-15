
import React from 'react';
import Cabecalho from '../../components/cabecalho/Cabecalho';

const BuscarCpf: React.FC = () => {
    return (
        <div>
            <Cabecalho />
            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Buscar CPF</h2>
                <p>Esta é a página de busca por CPF. O conteúdo será implementado posteriormente.</p>
            </main>
        </div>
    );
};

export default BuscarCpf;