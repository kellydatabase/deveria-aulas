import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJwt';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMSG';
import { conectarMongoDB } from "@/middlewares/conectaMongodb";
import { UsuarioModel } from "@/models/UsuarioModels";
import { PublicacaoModel } from "@/models/publicacaoModels";


const feedEndpoint = async(req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query.id){
                 //agora tenho o id do usuario
                //como eu valido se o usuario é válido                
                const usuario = await UsuarioModel.findById(req?.query?.id);          
                if(!usuario){
                    return res.status(400).json({erro : 'Usuario nao encontrado'});                  
                }
                // e como eu busco as publicações
                const publicacoes = await PublicacaoModel
                .find({idUsuario : usuario._id})
                .sort({data : -1});
                return res.status(200).json(publicacoes);
            }        
        }
        res.status(405).json({erro: 'Metodo informado não é válido'});
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({erro: 'Não foi possivel obter o feed'});

}

export default validarTokenJWT(conectarMongoDB(feedEndpoint));