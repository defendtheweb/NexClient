var Utils = function() {
    // Constructor
}

Utils.prototype.shortID = function(ID) {
    if (ID.length < 12) {
        return ID;
    }

    return ID.substr(0,5) + '...' + ID.substr(ID.length - 5);
}

module.exports = Utils;