
const { slice } = require('../methods');
const { getPathname, flattern } = require('../utils');
const Layer = require('./layer');
const Route = require('./route');
const debug = require('debug')('xpress:router')

var proto = module.exports = function() {
    function router(req, res, next){
    }

    Object.setPrototypeOf(router, proto);
    router.pathLayerStack = [];
    return router;
}


proto.handle = function (req, res, done) {
    
    let stack = this.pathLayerStack;
    let idx = 0;

    next();

    function next(err){
        let layerError = err;

        if(idx >= stack.length) {
            return;
        }

        let path = getPathname(req);

        let match = false;
        let layer;
        while(!match == true && idx < stack.length) {
            layer = stack[idx++];
            
            if(layerError) {
                match = false;
                continue;
            }

            if(layer.route != undefined) {
                match = layer.matchPath(path) && layer.route._hasMethod(req.method);
            }else{
                
                match = layer.matchPath(path);
            }

            if(!match) {
                continue;
            }
            
            
        }

        if(layerError) {
            console.log('Error message : ', layerError)
            if(layer.handle.length ==4 && layer.route == undefined){
                layer.handleError(layerError, req, res, next);
            }
        }

        if(match) {
            layer.handleRequest(req, res, next);
        }else{
           proto.noMatchError(req, res, path)
        }
    }

}

proto.route = function route(path){

    let route = new Route(path);
    let layer = new Layer(path, route.dispatch.bind(route));

    layer.route = route;
    this.pathLayerStack.push(layer);
    return route;

}


proto.use= function use(fn) {
    let offset = 0;
    let path = '/';

    if(typeof fn != 'function') {
        path = fn;
        offset = 1;
    }


    let callbacks = flattern.call(slice.call(arguments, offset));
    debug('callbacks array under router .use: ', callbacks)

    if(callbacks.length == 0) {
        return;
    }

    callbacks.forEach(cb => {
        if(typeof cb != 'function') {
            throw new Error('Router.use() require a middeware functions but got a ' + typeof fn )
        }
        
        let layer = new Layer(path, cb);
        layer.route = undefined;

        debug('Use layer : ', layer)

        this.pathLayerStack.push(layer);
    });

    return this;
    
}


proto.noMatchError = function (req, res, path) {
    res.write(`Cannot ${req.method} ${path}`);
    res.end();
}