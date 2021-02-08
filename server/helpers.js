'use strict';

/**
 * Prepend every key of the provided object with the provided prefix.
 */
exports.prefixKeys = function prefixKeys(obj, prefix) {
    const result = Object.assign({}, obj);
    Object.keys(result).forEach(key => delete Object.assign(result, {[`${prefix}${key}`]: result[key]})[key]);
    return result;
};
