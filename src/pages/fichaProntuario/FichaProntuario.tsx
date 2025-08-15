
import React from 'react';
import Cabecalho from '../../components/cabecalho/Cabecalho';

const FichaProntuario: React.FC = () => {
    return (
        <div>
            <Cabecalho />
            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Ficha de Prontuário</h2>
                <p>Esta é a página de ficha de prontuário. O conteúdo será implementado posteriormente.</p>
            </main>
        </div>
    );
};

export default FichaProntuario;