const getFieldByKey = (object_list, key) => {
    for (object of object_list) {
        if (object?.key === key) {
            return object;
        }
    }

    return null;
};

module.exports = { getFieldByKey };
