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
        case REDUCER_ACTIONS.SET_ADMIN_STATUS:
            return {
                ...state,
                isAdmin: action.isAdmin,
            };
        case REDUCER_ACTIONS.SET_USERNAME:
            return {
                ...state,
                username: action.username,
            };
        default:
            return state;
    }
};

export default Reducer;
