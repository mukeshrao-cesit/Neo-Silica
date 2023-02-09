import * as types from "./actionTypes";


export const paperReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_PAPER_START:
      return {
        ...state,
        loading: true,
      };
    case types.FETCH_PAPER_SUCCESS:
      return {
        ...state,
        loading: false,
        papers: action.payload,
      };
    case types.FETCH_PAPER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};


export const shapeReducers = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_SHAPES_START:
      return {
        ...state,
        loading: true,
      };
    case types.FETCH_SHAPES_SUCCESS:
      return {
        ...state,
        loading: false,
        shapes: action.payload,
      };
    case types.FETCH_SHAPES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

