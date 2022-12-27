import type { NextPage } from "next";
import { useState } from "react";

type FilterProps = {
    previsionDateStart : string,
    previsionDateEnd : string,
    status : number,
    setPrevisionDateStart(e: string) : void,
    setPrevisionDateEnd(e: string) : void,
    setStatus(e: number) : void,
}

export const Filter : NextPage<FilterProps> = ({
    previsionDateStart, previsionDateEnd, status,
    setPrevisionDateStart, setPrevisionDateEnd, setStatus
}) => {

    const [showFilter, setShowFilters] = useState(false);

    return (
        <div className="container-filters">
            <div className="title">
                <span>Tarefas</span>
                <img src="/filter.svg" alt="Filtrar atividades" onClick={_ => setShowFilters(!showFilter)}/>
                <div className="form">
                <div>
                    <label>Data prevista de conclusão</label>
                    <input type="date" value={previsionDateStart} onChange={e => setPrevisionDateStart(e.target.value)}/>
                </div>
                <div>
                    <label>até</label>
                    <input type="date" value={previsionDateEnd} onChange={e => setPrevisionDateEnd(e.target.value)}/>
                </div>
                <div className="separator"/>
                <div>
                    <label>Status</label>
                    <select value={status} onChange={e => setStatus(parseInt(e.target.value))}>
                        <option value={0}>Todas</option>
                        <option value={1}>Ativas</option>
                        <option value={2}>Concluídas</option>
                    </select>
                </div>
                </div>
            </div>
            {showFilter && <div className="mobiles-filters">
                <div>
                    <label>Data de previsão de:</label>
                    <input type="date" value={previsionDateStart} onChange={e => setPrevisionDateStart(e.target.value)}/>
                </div>
                <div>
                    <label>Data de previsão até:</label>
                    <input type="date" value={previsionDateEnd} onChange={e => setPrevisionDateEnd(e.target.value)}/>
                </div>
                <div>
                    <label>Status:</label>
                    <select value={status} onChange={e => setStatus(parseInt(e.target.value))}>
                        <option value={0}>Todas</option>
                        <option value={1}>Ativas</option>
                        <option value={2}>Concluídas</option>
                    </select>
                </div>
            </div>}
        </div>
    );
}