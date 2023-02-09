import mongoose from "mongoose";

const shapeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    displayname: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
     
    },
    shapedata: {
      type: String,
    },
    createdAt: {
        type:String,
      default: Date.now(),
    }
  },
  {
    timestamp: true,
  }
);

const Shapes = mongoose.model("shapes", shapeSchema);
export default Shapes;
