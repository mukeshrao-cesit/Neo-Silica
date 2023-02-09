import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import createSagaMiddileware from "redux-saga";
import rootReducer from "./rootReducer.js";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddileware();

const middlware = [sagaMiddleware];
if (process.env.NODE_ENV === "development") {
  middlware.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middlware));
sagaMiddleware.run(rootSaga);

export default store;
