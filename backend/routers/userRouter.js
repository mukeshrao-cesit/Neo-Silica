import express from "express";
const router = express.Router()
import multer from "multer";
import Paper from "../Model/PaperModel.js";
import {s3UpdataSingle} from '../util/s3Bucket.js' 
// let data='{"cells":[{"type":"basic.Rect","position":{"x":362,"y":310},"size":{"width":130,"height":90},"angle":0,"inPorts":[""],"outPorts":["",""],"id":"91e1b88e-c9bc-4796-a58b-c52d41f7614e","z":1,"attrs":{"text":{"text":"Rectangle"}}},{"type":"basic.Rect","position":{"x":742,"y":97},"size":{"width":130,"height":90},"angle":0,"inPorts":[""],"outPorts":["",""],"id":"097a24a5-70dd-4d5c-b8c2-edb2378fa1db","z":1,"attrs":{"text":{"text":"Rectangle"}}},{"type":"basic.Rect","position":{"x":717,"y":323},"size":{"width":130,"height":90},"angle":0,"inPorts":[""],"outPorts":["",""],"id":"a999d7da-f526-485c-992c-6be473e44851","z":1,"attrs":{"text":{"text":"Rectangle"}}}]}'
let data ='{"cells":[{"type":"basic.Rect","position":{"x":164,"y":81},"size":{"width":130,"height":90},"angle":0,"inPorts":[""],"outPorts":["",""],"id":"fa117aac-de9e-4a1b-95b9-10580f4a0b2a","z":1,"attrs":{"text":{"text":"Rectangle"}}},{"type":"basic.Rect","position":{"x":501,"y":117},"size":{"width":130,"height":90},"angle":0,"inPorts":[""],"outPorts":["",""],"id":"91e1b88e-c9bc-4796-a58b-c52d41f7614e","z":1,"attrs":{"text":{"text":"Rectangle"}}},{"type":"basic.Rect","position":{"x":742,"y":97},"size":{"width":130,"height":90},"angle":0,"inPorts":[""],"outPorts":["",""],"id":"097a24a5-70dd-4d5c-b8c2-edb2378fa1db","z":1,"attrs":{"text":{"text":"Rectangle"}}},{"type":"basic.Rect","position":{"x":379,"y":308},"size":{"width":130,"height":90},"angle":0,"inPorts":[""],"outPorts":["",""],"id":"fb8b7a20-53e8-4954-af77-89afb5f3832b","z":1,"attrs":{"text":{"text":"Rectangle"}}},{"type":"basic.Rect","position":{"x":717,"y":323},"size":{"width":130,"height":90},"angle":0,"inPorts":[""],"outPorts":["",""],"id":"a999d7da-f526-485c-992c-6be473e44851","z":1,"attrs":{"text":{"text":"Rectangle"}}},{"type":"link","source":{"id":"fa117aac-de9e-4a1b-95b9-10580f4a0b2a"},"target":{"id":"91e1b88e-c9bc-4796-a58b-c52d41f7614e"},"id":"aadb50e7-7c68-4a92-adef-ebe7f3004103","z":2,"attrs":{".marker-target":{"d":"M 10 0 L 0 5 L 10 10 z"}}}]}'
const storage = multer.memoryStorage({
    destination: (req, res, cb) => {
        cb(null, "")
    }
})
const upload = multer({ storage })

router.route('/').get((req, res) => {
  
 
    res.json(data)
})

router.route('/').post((req, res) => {
    res.json({message:"sucessfull"})

})

router.route('/uploadimage').post( upload.single("background"),s3UpdataSingle, async(req,res)=>{
    const user = await Paper.create({name:"Reshi", image: req.file.path })
    res.json({imge:req.file})

})







export default router