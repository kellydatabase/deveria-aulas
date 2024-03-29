import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMSG';
import jwt, {JwtPayload } from "jsonwebtoken";
import { UsuarioTokenModel } from "@/models/usuarioTokenModels";

export const validarTokenJWT = (handler : NextApiHandler) =>
async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{

    try{
        const {MINHA_CHAVE_JWT} = process.env;
        if (!MINHA_CHAVE_JWT){
            return res.status(500).json({erro: 'Env chave JWT não informada na execução do processo'});
        }
        
        if (!req.headers){
            return res.status(401).json({erro: 'Não foi possivel validar o token de acesso'});
        }
        
        if(req.method !== 'OPTIONS'){
        const authorization = req.headers['authorization'];
        if(!authorization){
            return res.status(400).json({erro: 'Não foi possível validar o token de acesso'});
        }
        
        const token = authorization.substring(7);
        if(!token){
            return res.status(401).json({erro: 'Não foi possivel vlaidar o token de acesso'})
        }
        
        const tokenEncontrado = await UsuarioTokenModel.find({token});
        if(tokenEncontrado && tokenEncontrado.length > 0) {
            return res.status(401).json({erro: 'o token já foi inválidado'})
        }
        
        const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
        if(!decoded){
            return res.status(401).json({erro: 'Não foi possivel validar o token de acesso'});
        }
        
        if (!req.query){
            req.query = {};
        }
                
        req.query.userId = decoded._id;
            }
        }catch(e){
        console.log(e)
        return res.status(401).json({erro: 'Não foi possível validar o token de acesso'});
    
}


return handler (req, res);
    }
