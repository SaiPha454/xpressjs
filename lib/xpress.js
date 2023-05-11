/**
 * Xpressjs
 * Author : Sai Marn Pha
 */
const proto = require('./application');

exports = module.exports = createApplication;


function createApplication() {

    let app = function (req, res) {
        
        app.handle(req, res);
    }

    Object.assign(app, proto)
    return app; 
}