const { REDUCER_ACTIONS } = require('../utils/constants');

const Reducer = (state, action) => {
    switch (action.type) {
        case REDUCER_ACTIONS.SET_LANGUAGE:
            return {
                ...state,
                language: action.language,
            };
        case REDUCER_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.error,
                isErrorVisible: true,
            };
        case REDUCER_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                isErrorVisible: false,
            };
        default:
            return state;
    }
};

export default Reducer;
