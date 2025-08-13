import { Router } from "express";
import { generateUploadUrl } from "../../utils/generateUploadUrl.js";
import { generateDownloadUrl } from "../../utils/generateGetUrl.js";
const presignRouter = Router();

presignRouter.get("/presign-upload-url",async(req,res)=>{
    const {key,contentType} = req.body;
    return res.json(await generateUploadUrl(key,contentType));
});

presignRouter.get("/presign-get-url",async(req,res)=>{
    const {key} = req.body;
    return res.json(await generateDownloadUrl(key));
})
export default presignRouter;