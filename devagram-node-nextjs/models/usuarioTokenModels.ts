import mongoose, {Schema}from "mongoose";

const UsuarioTokenShema = new Schema({
    token: {type: String, required : true}
        
});

export const UsuarioTokenModel = (mongoose.models.usuarioToken ||
    mongoose.model('usuarioToken', UsuarioTokenShema));