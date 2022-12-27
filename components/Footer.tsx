import type { NextPage } from "next";

type FooterProps ={
    showModal():void
}

export const Footer : NextPage<FooterProps> = ({showModal}) => {
    return (
        <div className="container-footer">
            <button onClick={showModal}><img src="/add.svg"/>Adicionar uma tarefa</button>
            <span>© Copyright {new Date().getFullYear()}. Todos os direitos reservados.</span>
        </div>
    );
}