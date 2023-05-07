
module.exports = Layer;

function Layer(path, callback) {

    if( !(this instanceof Layer) ) {
        return new Layer();
    }

    this.handle = callback;
    this.path = path;
}


Layer.prototype.handleRequest = function handleRequest(req, res, next) {

    let callback = this.handle;
    if(callback.length > 3){
        return;
    }
    try {
        callback(req, res, next);
    } catch (error) {
        next(err)
    }
}

Layer.prototype.matchPath = function match(path) {
    
    return this.path === path;
}

Layer.prototype.handleError= function (err, req, res, next) {
    let errorCallback = this.handle;
    errorCallback(err, req, res, next);
}