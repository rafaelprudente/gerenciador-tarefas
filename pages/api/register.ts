import type { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from '../../models/User';
import { DefaultMessageResponse } from '../../types/DefaultMessageResponse';
import { User } from '../../types/User';
import CryptoJS from "crypto-js";
import jwt from 'jsonwebtoken';
import { connectToDB } from '../../middlewares/connectToDB';

const registerEndpoint = async function (requisicao: NextApiRequest, resposta: NextApiResponse<DefaultMessageResponse | any>) {
    try {
        if (requisicao.method !== 'POST') {
            return resposta.status(405).json({ error: 'Método informado não existe' });
        }

        const { MY_SECRET_KEY } = process.env;
        if (!MY_SECRET_KEY) {
            return resposta.status(500).json({ error: 'Env MY_SECRET_KEY não informada' });
        }

        if (!requisicao.body) {
            return resposta.status(400).json({ error: 'Favor informar os dados para autenticação' });
        }

        const { name, email, password, passwordConfirmation } = requisicao.body;

        if (!name || !email || !password || !passwordConfirmation) {
            return resposta.status(400).json({ error: 'Favor informar os dados para autenticação' });
        }

        if (password != passwordConfirmation) {
            return resposta.status(400).json({ error: 'A Confirmação de senha diferente da senha' });
        }

        const existsUserWithEmail = await UserModel.find({ email: email });
        if (existsUserWithEmail && existsUserWithEmail.length > 0) {
            return resposta.status(400).json({ error: 'Usuário já cadastrado' });
        }

        const newUser = {} as User;
        newUser.name = name;
        newUser.email = email;
        newUser.password = CryptoJS.AES.encrypt(password, MY_SECRET_KEY).toString();
        const savedUser = await UserModel.create(newUser);

        if (!savedUser) {
            return resposta.status(500).json({ error: 'Erro ao resgistrar o usuário' });
        }

        return resposta.status(200).json({ message: 'Usuário cadastrado com sucesso'});
    } catch (e: any) {
        console.log('Ocorreu erro ao logar usuário:', e);
        return resposta.status(500).json({ error: 'Ocorreu erro ao registrar usuário, tente novamente....' });
    }
}

export default connectToDB(registerEndpoint);