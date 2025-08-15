import React from 'react';
import Cabecalho from '../../components/cabecalho/Cabecalho';

const CadastroUsuario: React.FC = () => {
    return (
        <div>
            <Cabecalho />
            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Cadastro do Usuário</h2>
                <p>Esta é a página de cadastro de usuários. O conteúdo será implementado posteriormente.</p>
            </main>
        </div>
    );
};

export default CadastroUsuario;