import axios from "../util/axiosConfig";

export const getPapers = async (query) => {
  return await axios.get("/paper");
};

export const getShapes = async (query) => {
  return await axios.get("/shapes");
};