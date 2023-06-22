import ActionTypes from './result.type';

export const putResults = (result) => ({
    type:ActionTypes.PUT_RESULTS,
    result: result
});