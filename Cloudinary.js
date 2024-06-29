import cloudinary from "cloudinary"
import dotenv from "dotenv"
dotenv.config()
cloudinary.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});

export default cloudinary.v2;