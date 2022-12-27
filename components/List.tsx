import { useState } from 'react';
import type { NextPage } from "next";
import { Task } from "../types/Task";
import { Item } from "./Item";
import { executeRequest } from '../services/api';
import { Modal } from "react-bootstrap";
import moment from 'moment';

type ListProps = {
    tasks: Task[],
    getFilteredData():void
}

export const List: NextPage<ListProps> = ({ tasks, getFilteredData }) => {

    // STATES DO MODAL
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [_id, setId] = useState <string | undefined>('');
    const [name, setName] = useState('');
    const [finishPrevisionDate, setFinishPrevisionDate] = useState('');
    const [finishDate, setFinishDate] = useState('');

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setErrorMsg('');
        setName('');
        setFinishPrevisionDate('');
        setFinishDate('');
        setId('');
    }

    const selectTask = (task : Task) => {
        setShowModal(true);
        setLoading(false);
        setErrorMsg('');
        setName(task.name);
        setFinishPrevisionDate(moment(task.finishPrevisionDate).format('yyyy-MM-DD'));
        setId(task._id);
    }

    const doUpdate = async () => {
        try {
            setErrorMsg('');
            if (!_id || !name || !finishPrevisionDate) {
                setErrorMsg('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                name,
                finishPrevisionDate
            } as any;

            if(finishDate){
                body.finishDate = finishDate;
            }

            await executeRequest('task?id='+_id, 'put', body);
            await getFilteredData();
            closeModal();
        } catch (e: any) {
            console.log(`Erro ao atualizar tarefa: ${e}`);
            if (e?.response?.data?.error) {
                setErrorMsg(e.response.data.error);
            } else {
                setErrorMsg(`Erro ao atualizar tarefa, tente novamente.`);
            }
        }

        setLoading(false);
    }

    const doRemove = async () => {
        try {
            if (!_id) {
                setErrorMsg('Favor informar o id!');
                return
            }
            await executeRequest('task?id='+_id, 'delete');
            await getFilteredData();
            closeModal();
        } catch (e: any) {
            console.log(`Erro ao deletar tarefa: ${e}`);
            if (e?.response?.data?.error) {
                setErrorMsg(e.response.data.error);
            } else {
                setErrorMsg(`Erro ao deletar tarefa, tente novamente.`);
            }
        }
    }

    return (
        <>
            <div className={"container-list" + (tasks && tasks.length > 0 ? ' not-empty' : '')}>
                {tasks && tasks.length > 0
                    ?
                    tasks.map(t => <Item key={t._id} task={t} selectTask={selectTask} />)
                    :
                    <>
                        <img src="/empty.svg" alt="Nenhuma tarefa cadastrada!" />
                        <p>Você ainda não possui tarefas cadastradas!</p>
                    </>
                }
            </div>
            <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                    <p>Atualizar uma tarefa</p>
                    {errorMsg && <p className="error">{errorMsg}</p>}
                    <input type='text' placeholder="Nome da tarefa"
                        value={name} onChange={e => setName(e.target.value)} />
                    <input type='date' placeholder="Previsão da tarefa"
                        value={finishPrevisionDate} onChange={e => setFinishPrevisionDate(e.target.value)} />
                    <input type='date' placeholder="Conclusão da tarefa"
                        value={finishDate} onChange={e => setFinishDate(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="button col-12">
                        <button onClick={doUpdate} disabled={loading}>{loading ? '...Carregando' : 'Atualizar'}</button>
                        <span onClick={doRemove}>Excluir</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}