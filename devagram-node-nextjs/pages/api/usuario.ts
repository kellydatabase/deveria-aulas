import type { NextApiRequest, NextApiResponse } from "next";
import {validarTkenJWT} from '../../middlewares/validarTokenJwt';

const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse) =>{

    return res.status(200).json('usuário autenticado com sucesso');
}
export default validarTkenJWT(usuarioEndpoint);