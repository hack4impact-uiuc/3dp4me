const { REDUCER_ACTIONS } = require('../utils/constants');

const Reducer = (state, action) => {
    switch (action.type) {
        case REDUCER_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };
    }
};

export default Reducer;
