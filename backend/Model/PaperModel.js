import mongoose from "mongoose";

const PaperSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    jsondata: {
      type: String,
      default: null,
    },
    createdAt: {
      type: String,
    },
  },
  {
    timestamp: true,
  }
);

const Paper = mongoose.model("paper", PaperSchema);
export default Paper;
