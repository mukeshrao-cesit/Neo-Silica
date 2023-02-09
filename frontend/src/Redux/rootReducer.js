import { combineReducers } from "redux";
import { paperReducer ,shapeReducers} from "./reducer.js";

const rootReducer = combineReducers({
  paper: paperReducer,
  shape:shapeReducers
});

export default rootReducer;
