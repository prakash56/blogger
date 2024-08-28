import mongoose from "mongoose";


export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://prakashgupta56:12345@cluster0.gardx.mongodb.net/blog-app');
    console.log("DB Connected");
}