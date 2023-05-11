/**
 * Xpressjs
 * Author : Sai Marn Pha
 */
const methods = require("../methods");
const flattern = Array.prototype.flat;
const Layer = require('./layer')


module.exports = Route;

function Route(path){
    this.path = path;
    this.methods = {};
    this.methodStacks = [];
}

/**
 * Delegate the verb methods and push the layer with the real handler into the stack
 * 
 * @public
 */
methods.forEach(method => {
    Route.prototype[method] = function() {
        let callbacks = flattern.call(arguments);
        callbacks.forEach((cb) => {
            let layer = new Layer('/', cb);
            layer.method = method;

            this.methods[method] = true;
            this.methodStacks.push(layer);
        })

    }
    return this;
})

/**
 * Dispatch the route callback by triggering the layer#handleRequest
 * 
 * @private
 */
Route.prototype.dispatch = function dispatch(req, res, done){

    let idx = 0;
    let stack = this.methodStacks;
    let method = req.method.toLowerCase();

    next();
    function next(err){

        if(err) {
            return done(err);
        }

        if(stack.length == 0) {
            return done();
        }

        let layer = stack[idx++];

        if(layer.method && layer.method != method) {
            next(err);
        }else if(err) {
            next(err)
        }else{
            layer.handleRequest(req, res, next);
        }
    }
}

/**
 * check if the route has a verb method in the this#methods object
 * 
 * @private
 */
Route.prototype._hasMethod= function (method) {
    method = method.toLowerCase();
    return Boolean(this.methods[method]);
}