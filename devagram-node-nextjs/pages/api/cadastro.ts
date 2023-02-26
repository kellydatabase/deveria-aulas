import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMSG';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModels';
import{conectarMongoDB} from '../../middlewares/conectaMongodb';
import md5 from 'md5';
import{upload, uploadImgemCosmic} from '../../services/uploadImagemCosmic';
import nc from 'next-connect';

const handler = nc()
    .use(upload.single('file'))
    .post(async(req : NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) =>{
        try {
            console.log('cadastro endpoint', req.body);
            const usuario = req.body as CadastroRequisicao;
                
                if(!usuario.nome || usuario.nome.length < 2){
                    return res.status(400).json({erro:'Nome invalido'});
                }
        
                if (!usuario.email || usuario.email.length < 5
                    ||!usuario.email.includes('@')
                    ||!usuario.email.includes('.')){
                    return res.status(400).json({erro: 'Email invalido'});
                    }
    
                   if (!usuario.senha || usuario.senha.length < 4){
                    return res.status(400).json({erro: 'Senha invalida'});     
            }
    //validacao se ja existe usuario com o mesmo email
    const usuariosComMesmoEmail = await UsuarioModel.find({email: usuario.email});
    if (usuariosComMesmoEmail && usuariosComMesmoEmail.length >0){
        return res.status(400).json({erro: 'email ja cadastrado'});
    }
    
    //enviar imagem do multer para o cosmic
    const image= await uploadImgemCosmic(req);
    
    const usuarioASerSalvo ={
        nome : usuario.nome,
        email : usuario.email,
        senha : md5(usuario.senha),
        avatar : image?.media?.url
    }
    
    await UsuarioModel.create(usuarioASerSalvo);
    return res.status(200).json({msg : 'usuario criado com sucesso'});        
 }catch (e) {
            console.log(e)
            return res.status(500).json({erro : 'erro ao cadastrar usuario'});
 }});
export const config = {
    api : {
        bodyParser : false
    }

}

export default conectarMongoDB(handler);