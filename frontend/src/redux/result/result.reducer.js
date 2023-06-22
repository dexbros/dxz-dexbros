import ActionTypes from './result.type';

const INITIAL_STATE = {
    results:[],
}

export const resultReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.PUT_RESULTS:
          return {
                results: [...state.results, action.result]
            };
          break;
        default:
            return state;
      }
}