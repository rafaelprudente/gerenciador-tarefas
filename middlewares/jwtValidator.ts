import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import { DefaultMessageResponse } from '../types/DefaultMessageResponse';
import jwt, {JwtPayload} from 'jsonwebtoken';

export const jwtValidator = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse>) => {
    
    const {MY_SECRET_KEY} = process.env;
    if(!MY_SECRET_KEY){
        return res.status(500).json({error : 'Env MY_SECRET_KEY não informada'});
    }

    if(!req || !req.headers){
        return res.status(401).json({error : 'Não foi possível validar token de acesso!'});
    }

    if(req.method !== 'OPTIONS'){
        const authorization = req.headers['authorization'];

        if(!authorization){
            return res.status(401).json({error : 'Não foi possível validar token de acesso!'});
        }

        const token = authorization.substring(7);
        if(!token){
            return res.status(401).json({error : 'Não foi possível validar token de acesso!'});
        }

        try{
            const decoded = jwt.verify(token, MY_SECRET_KEY) as JwtPayload;
            if(!decoded){
                return res.status(401).json({error : 'Não foi possível validar token de acesso!'});
            }

            if(req.body){
                req.body.userId = decoded._id;
            }else if(req.query){
                req.query.userId = decoded._id;
            }

        }catch(e){
            console.log('Não foi possível validar token de acesso:', e);
            return res.status(500).json({error : 'Não foi possível validar token de acesso!'});
        }
    }

    return handler(req,res);
}