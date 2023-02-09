import express from "express";
const router = express.Router();
import Shapes from "../Model/ShapeModel.js";

router.route("/").post(async (req, res) => {
  const shape = await Shapes.create(req.body);
  res.json(shape);
});

router.route("/").get(async (req, res) => {
    const shapes = await Shapes.find();
    res.json(shapes);
  });
export default router;
