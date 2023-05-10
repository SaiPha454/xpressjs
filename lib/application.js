
const http = require('http')
const Router = require('./router/index')
const methods = require('./methods');
const slice = Array.prototype.slice;
const flatten = Array.prototype.flat;
const debug = require('debug')('xpress:app')
const finalHandler = require('finalhandler')

var app = exports = module.exports= {};

app.lazyRouter = function lazyRouter(){
    if(!this._router) {
        this._router = new Router();
    }
}

app.handle = function handle( req, res, callback) {
    let router = this._router;
    
    //final handler
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


methods.forEach((method, index) => {

    app[method] = function(path) {
        this.lazyRouter();
        let route = this._router.route(path); //Set up layer One = Path layer in router
        route[method].apply(route, slice.call(arguments, 1));
        return this;
    }
})


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