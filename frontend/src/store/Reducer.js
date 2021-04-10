const { REDUCER_ACTIONS } = require('../utils/constants');

const Reducer = (state, action) => {
    switch (action.type) {
        case REDUCER_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isErrorVisible: true,
            };
        case REDUCER_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                isErrorVisible: false,
            };
    }
};

export default Reducer;
