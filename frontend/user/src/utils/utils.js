function findKey(arr, key) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]._id === key) {
            return i;
        }
    }
    return undefined;
};

export default findKey;

