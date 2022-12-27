import moment from "moment";
import { NextPage } from "next";
import { Task } from "../types/Task";

type ItemProps = {
    task: Task,
    selectTask(t: Task) : void
}

export const Item : NextPage<ItemProps> = ({task, selectTask}) => {
    const isTaskFinished = task.finishDate || false;

    const getDataText = () =>{
        if(isTaskFinished){
            return `Concluída em: ${moment(task.finishDate).format('DD/MM/yyyy')}`
        }

        return `Conclusão em: ${moment(task.finishPrevisionDate).format('DD/MM/yyyy')}`
    }

    return (
        <div className={"container-item" + (isTaskFinished ? '' : ' active')}
            onClick={() => isTaskFinished ? null : selectTask(task)}>
            <img src={isTaskFinished ? '/checked.svg' : '/not-checked.svg'}
                alt={isTaskFinished ? 'Tarefa concluída' : 'Tarefa em aberto'}/>
            <div>
                <p className={isTaskFinished ? 'finished' : ''}>
                    {task.name}
                </p>
                <span>{getDataText()}</span>
            </div>
        </div>
    )
}