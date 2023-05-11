/**
 * Xpressjs
 * Author : Sai Marn Pha
 */
const proto = require('./application');

exports = module.exports = createApplication;


function createApplication() {

    let app = function (req, res, done) {
        
        app.handle(req, res, done);
    }

    Object.assign(app, proto)
    return app; 
}