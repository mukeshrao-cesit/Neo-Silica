import express from "express";
const router = express.Router();
import multer from "multer";
import Paper from "../Model/PaperModel.js";
import { s3UpdataSingle } from "../util/s3Bucket.js";
const storage = multer.memoryStorage({
  destination: (req, res, cb) => {
    cb(null, "");
  },
});
const upload = multer({ storage });

router.route("/").get(async (req, res) => {
  const paper = await Paper.find();
  res.json(paper);
});

router
  .route("/")
  .post(upload.single("background"), s3UpdataSingle, async (req, res) => {
    const paper = await Paper.create({
      name: req.body.name,
      image: req.file.path,
      createdAt: Date.now(),
    });
    res.json(paper);
  });
router.route("/:id").get(async (req, res) => {
  const paper = await Paper.findById(req.params.id);
  res.json(paper);
});

router.route("/:id").post(async (req, res) => {
  const paper = await Paper.findById(req.params.id);
  paper.jsondata = req.body.data;
  await paper.save();
  res.json({ message: "sucessfull" });
});


router.route("/:id").delete(async (req, res) => {
  const paper = await Paper.findById(req.params.id);
  console.log(paper);
  paper.jsondata = req.body.data;
  await paper.remove();
  res.json({ message: "sucessfull" });
});
export default router;
