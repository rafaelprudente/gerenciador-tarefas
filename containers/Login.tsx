import type { NextPage } from "next";
import { useState } from "react";
import { executeRequest } from "../services/api";

type LoginProps = {
    setToken(s: string): void
}

export const Login: NextPage<LoginProps> = ({ setToken }) => {

    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [onRegistrationScreen, setOnRegistrationScreen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [registering, setRegistering] = useState(false);

    const doLogin = async () => {
        try {
            setError('');
            if (!email || !password) {
                setError('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                email,
                password
            };

            const result = await executeRequest('login', 'post', body);
            if (result && result.data) {
                const obj = result.data;
                localStorage.setItem('accessToken', obj.token);
                localStorage.setItem('name', obj.name);
                localStorage.setItem('email', obj.email);
                setToken(obj.token);
            }
        } catch (e: any) {
            console.log(`Erro ao efetuar login: ${e}`);
            if (e?.response?.data?.error) {
                setError(e.response.data.error);
            } else {
                setError(`Erro ao efetuar login, tente novamente.`);
            }
        }

        setLoading(false);
    }

    const doRegister = async () => {
        try {
            setError('');
            if (!name || !email || !password || !passwordConfirmation) {
                setError('Favor preencher os campos!');
                return
            }
            if (password != passwordConfirmation) {
                setError('A confirmação de senha diferente da senha!');
                return
            }

            setRegistering(true);

            const body = {
                name,
                email,
                password
            };

            const result = await executeRequest('user', 'post', body);
            if (result && result.data) {
                const obj = result.data;
                localStorage.setItem('accessToken', obj.token);
                localStorage.setItem('name', obj.name);
                localStorage.setItem('email', obj.email);
                setToken(obj.token);

                setError('Usuário registrado com sucesso!');
            }

            setName('');
            setPassword('');
            setPasswordConfirmation('');

            setOnRegistrationScreen(false);
        } catch (e: any) {
            console.log(`Erro ao efetuar registro: ${e}`);
            if (e?.response?.data?.error) {
                setError(e.response.data.error);
            } else {
                setError(`Erro ao efetuar registro, tente novamente.`);
            }
        }

        setRegistering(false);
    }

    const doChangeScreen = async () => {
        setError('');

        setName('');
        setPassword('');
        setPasswordConfirmation('');

        setOnRegistrationScreen(true);
    }

    return (
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {error && <p className="error">{error}</p>}
                <div className="input" hidden={!onRegistrationScreen} >
                    <img src="/user.svg" alt="User Icone" />
                    <input type='text' placeholder="Nome"
                        value={name}
                        onChange={evento => setName(evento.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/mail.svg" alt="Login Icone" />
                    <input type='text' placeholder="Email"
                        value={email}
                        onChange={evento => setEmail(evento.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Senha Icone" />
                    <input type='password' placeholder="Senha"
                        value={password}
                        onChange={evento => setPassword(evento.target.value)}
                    />
                </div>
                <div className="input" hidden={!onRegistrationScreen}>
                    <img src="/lock.svg" alt="Senha Icone" />
                    <input type='password' placeholder="Confirmação da Senha"
                        value={passwordConfirmation}
                        onChange={evento => setPasswordConfirmation(evento.target.value)}
                    />
                </div>
                <button onClick={doLogin} disabled={loading} hidden={onRegistrationScreen}>{loading ? '...Carregando' : 'Login'}</button>
                <button onClick={doRegister} disabled={loading} hidden={!onRegistrationScreen}>{loading ? '...Registrando' : 'Registrar'}</button>
                <div className="registration" hidden={onRegistrationScreen}>
                    <span>Crie uma conta clicando</span>&nbsp;<a onClick={doChangeScreen}>aqui</a>
                </div>
            </div>
        </div>
    );
}