const methods = require("../methods");
const flattern = Array.prototype.flat;
const Layer = require('./layer')


module.exports = Route;

function Route(path){
    this.path = path;
    this.methods = {};
    this.methodStacks = [];
}

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

Route.prototype._hasMethod= function (method) {
    method = method.toLowerCase();
    return Boolean(this.methods[method]);
}