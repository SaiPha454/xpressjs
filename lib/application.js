/**
 * Xpressjs
 * Author : Sai Marn Pha
 */
const http = require('http')
const Router = require('./router/index')
const methods = require('./methods');
const slice = Array.prototype.slice;
const flatten = Array.prototype.flat;
const debug = require('debug')('xpress:app')
const finalHandler = require('finalhandler')

var app = exports = module.exports= {};

/**
 * Create a new router if it is not created yet
 * 
 * @private
 */
app.lazyRouter = function lazyRouter(){
    if(!this._router) {
        this._router = new Router();
    }
}


/**
 * 
 * Pass the incomming request into the application and start pipline processing.
 * 
 * If no callback is provided, the default final handler will respond.
 * 
 * @private
 */
app.handle = function handle( req, res, callback) {
    let router = this._router;
    
    let done = callback || finalHandler(req, res);
    if(!router) {
        return;
    }
    router.handle(req, res, done);
}

app.listen = function listen () {
    let server = http.createServer(this);
    server.listen.apply(server, arguments);
}

/**
 * Set up the http verb method
 * 
 * @public
 */
methods.forEach((method, index) => {

    app[method] = function(path) {
        this.lazyRouter();
        let route = this._router.route(path); //Set up layer One = Path layer in router
        route[method].apply(route, slice.call(arguments, 1));
        return this;
    }
})

/**
 * Router#use() 
 * Add a middleware to the app router
 * 
 * @public
 */
app.use = function use(fn) {

    let path = '/';
    let offset = 0;

    if(typeof fn != 'function') {
        path = fn;
        offset = 1;
    }

    let fns = flatten.call(slice.call(arguments, offset));

    this.lazyRouter();
    let router = this._router;

    fns.forEach((fn) => {

        if(typeof fn != 'function') {
            return;
        }
        debug('.use app under path: ', path);
        router.use(path, fn);
    })
    
}