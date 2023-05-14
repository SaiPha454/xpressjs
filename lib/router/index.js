/**
 * Xpressjs
 * Author : Sai Marn Pha
 */
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

/**
 * 
 * Dispatch the req,res into the router
 * 
 * @private
 */
proto.handle = function (req, res, done) {
    
    //store the middlewares and routes
    let stack = this.pathLayerStack;

    //index of the stack
    let idx = 0;

    next();

    function next(err){
        let layerError = err;

        if(idx >= stack.length) {
            done();
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
                
                //checking match for http verb route
                match = layer.matchPath(path) && layer.route._hasMethod(req.method);
            }else{
                
                //checking match for middlewares that use Route#use()
                match = layer.matchPath(path);
            }

            if(!match) {
                continue;
            }
            
            
        }

        if(layerError) {
            
            /**central handler for any middleware error
             * that must be implemented at the end of all routes 
             **/
            if(layer.handle.length ==4 && layer.route == undefined){
                layer.handleError(layerError, req, res, next);
            }
        }

        if(match) {
            layer.handleRequest(req, res, next);
        }else{

            //invoke the finalHandler if there is not matching route
           done();
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

/**
 * Add middlewares in the stack
 * 
 * The default optiional path is / and will be invoked for all routes.
 * can be configed to get called only on specific route by specify the path as the first param 
 * like use('/jarvis', ()=>{})
 * 
 * @public
 */
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