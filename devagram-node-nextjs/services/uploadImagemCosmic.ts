import multer from "multer";
import cosmicjs from "cosmicjs";

const{
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICAOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env;

    const Cosmisc = cosmicjs();
    const bucketAvatares = Cosmisc.bucket({
        slug: BUCKET_AVATARES,
        write_key: CHAVE_GRAVACAO_AVATARES
    });

    const bucketPublicaoes = Cosmisc.bucket({
        slug: BUCKET_PUBLICACOES,
        write_key: CHAVE_GRAVACAO_PUBLICAOES
    });

    const storage = multer.memoryStorage();
    const upload = multer({storage : storage});

    const uploadImgemCosmic = async(req : any) => {
        console.log('uploadImgemCosmic' ,req);
        if(req?.file?.originalname){
            const media_object = {
                originalname: req.file.originalname,
                buffer : req.file.buffer
            };
            
            console.log('uploadImgemCosmic url' ,req.url);
            console.log('uploadImgemCosmic media_object' ,media_object);
            if(req.url && req.url.includes('publicacoes')){
                return await bucketPublicaoes.addMedia({media : media_object});
        }else{
            return await bucketAvatares.addMedia({media : media_object});
        }
    }
}

export{upload, uploadImgemCosmic};