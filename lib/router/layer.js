/**
 * Xpressjs
 * Author : Sai Marn Pha
 */

module.exports = Layer;

function Layer(path, callback) {

    if( !(this instanceof Layer) ) {
        return new Layer();
    }

    this.handle = callback;
    this.path = path;
    this.pathRegex = new RegExp(`^${this.path}(\/.*)?|^\/$`);
}

/**
 * 
 * handle the incomming request and response by invoking the actual callback function
 * 
 * @private 
 */
Layer.prototype.handleRequest = function handleRequest(req, res, next) {

    let callback = this.handle;
    if(callback.length > 3){
        return next();
    }
    try {
        callback(req, res, next);
    } catch (error) {
        next(error)
    }
}

/**
 * match the incomming request which is path with the layer path defined with created
 * 
 * @private
 */
Layer.prototype.matchPath = function match(path) {
    
    if(this.route != undefined) {
        return this.path === path;
    }else{
        return this.pathRegex.test(path);
    }
    
}

/**
 * Error middleware handler
 * 
 * @public
 */
Layer.prototype.handleError= function (err, req, res, next) {
    let errorCallback = this.handle;
    errorCallback(err, req, res, next);
}