import type { NextPage } from "next";

type HeaderProps = {
    sair(): void,
    showModal():void
}
export const Header : NextPage<HeaderProps> = ({sair, showModal}) => {
    return (
        <div className="container-header">
            <img src="/logo.svg" alt="Logo Fiap" className="logo"/>
            <button onClick={showModal}><span>+</span>Adicionar Tarefa</button>
            <div className="mobile">
                <span>Olá, </span>
                <img src="/exit-mobile.svg" alt="Sair" onClick={sair}/>
            </div>
            <div className="desktop">
                <span>Olá, </span>
                <img src="/exit-desktop.svg" alt="Sair" onClick={sair}/>
            </div>
        </div>
    );
}