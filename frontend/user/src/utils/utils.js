Array.prototype.findKey = function (key) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].id == key) {
            return i;
        }
    }
    return undefined;
};

export default Array;

