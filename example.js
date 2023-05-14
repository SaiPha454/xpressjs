const xpress = require('./index');
const app = xpress();

/**
 * use a middleware without route and default to /;
 * will be called on every incomming request
**/
app.use((req, res, next)=> {
    //some logic go here
    req.jarvis = "mark42";
    console.log('Run on every request')
    next();
});



/**
 * Middleware for the route path /jarvis only
 */

app.use('/jarvis', (req, res, next)=> {
    //some logic go here
    req.jarvis = 'mark42_with_route';
    console.log('Jarvis middleware')
    next();
})

app.get('/jarvis', (req, res)=> {
    res.write('Get Jarvis');
    res.end();
})

app.post('/jarvis', (req, res, next)=> {
    //some logic go here; Don't forget to call next() -;
    console.log(`Jarvis : ${req.jarvis}`)
    next();
}, (req, res)=> {
        res.write('Post Jarvis');
        res.end();
    }
);

/**
 * Trigger the error and passed to the error to the error middleware for central error handling
 * 
 * Calling next method with an argument will always skip all routes and passed the error to 
 * the errror middleware
 */
app.get('/error', (req, res, next)=> {
    next('Intended Error trigger')
})


/**
 * Error Middleware
 * 
 * Must be defined at the end of all routes
 */
app.use((err, req, res, next) => {
    
    console.log('Error : ', err)
   res.write('Error middleware response');
   res.end();
})




const  PORT = 4200;
//initiate the server
app.listen(PORT, ()=> {
    console.log(`Sever is running on port : ${PORT}`)
})