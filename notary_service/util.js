/* ============ Util Class ============
|  Class with different util methods  |
=====================================*/

function isASCII (string) {
    return /^[\x00-\x7F]*$/.test(string);
}

function equals(string1, string2) {
    if (string1.length != string2.length) {
        return false;
    }
    for (let i = 0; i < string1.length; i++) {
        if (string1.charCodeAt(i) != string2.charCodeAt(i)) {
            return false;
        }
    }
    return true;
}

module.exports.isASCII = isASCII;
module.exports.equals = equals;
