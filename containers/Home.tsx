import type { NextPage } from "next";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { executeRequest } from "../services/api";
import { List } from "../components/List";
import { Modal } from "react-bootstrap";

type HomeProps = {
    setToken(s: string): void
}
export const Home: NextPage<HomeProps> = ({ setToken }) => {

    // STATES DO FILTER
    const [list, setList] = useState([]);
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState(0);

    // STATES DO MODAL
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [name, setName] = useState('');
    const [finishPrevisionDate, setFinishPrevisionDate] = useState('');

    const sair = () => {
        localStorage.clear();
        setToken('');
    }

    const getFilteredData = async () => {
        try {
            let query = '?status=' + status;

            if (previsionDateStart) {
                query += '&finishPrevisionStart=' + previsionDateStart;
            }

            if (previsionDateEnd) {
                query += '&finishPrevisionEnd=' + previsionDateEnd;
            }

            const result = await executeRequest('task' + query, 'GET');
            if (result && result.data) {
                setList(result.data);
            }
        } catch (e) {
            console.log('Ocorreu erro ao buscar tarefas:', e);
        }
    }

    useEffect(() => {
        getFilteredData();
    }, [previsionDateStart, previsionDateEnd, status]);

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setErrorMsg('');
        setName('');
        setFinishPrevisionDate('');
    }

    const doSave = async () => {
        try{
            setErrorMsg('');
            if(!name || !finishPrevisionDate){
                setErrorMsg('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                name,
                finishPrevisionDate
            };

            await executeRequest('task', 'post', body);
            await getFilteredData();
            closeModal();
        }catch(e : any){
            console.log(`Erro ao efetuar login: ${e}`);
            if(e?.response?.data?.error){
                setErrorMsg(e.response.data.error);
            }else{
                setErrorMsg(`Erro ao efetuar login, tente novamente.`);
            }
        }

        setLoading(false);
    }

    return (<>
        <Header sair={sair} showModal={() => setShowModal(true)} />
        <Filter
            previsionDateStart={previsionDateStart}
            previsionDateEnd={previsionDateEnd}
            status={status}
            setPrevisionDateStart={setPrevisionDateStart}
            setPrevisionDateEnd={setPrevisionDateEnd}
            setStatus={setStatus}
        />
        <List tasks={list} getFilteredData={getFilteredData}/>
        <Footer showModal={() => setShowModal(true)}/>
        <Modal
            show={showModal}
            className="container-modal">
            <Modal.Body>
                <p>Adicionar uma tarefa</p>
                {errorMsg && <p className="error">{errorMsg}</p>}
                <input type='text' placeholder="Nome da tarefa"
                    value={name} onChange={e => setName(e.target.value)} />
                <input type='date' placeholder="Previsão da tarefa"
                    value={finishPrevisionDate} onChange={e => setFinishPrevisionDate(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                <div className="button col-12">
                    <button onClick={doSave} disabled={loading}>{loading ? '...Carregando' : 'Salvar'}</button>
                    <span onClick={closeModal}>Cancelar</span>
                </div>
            </Modal.Footer>
        </Modal>
    </>);
}