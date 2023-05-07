const parseUrl = require('parseurl')
module.exports.getPathname = function getPathname(req){
    try {
        return parseUrl(req).pathname;
    } catch (error) {
        return undefined;
    }
}


module.exports.flattern = Array.prototype.flat;