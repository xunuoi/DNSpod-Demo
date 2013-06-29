/*
 * For DNSPOD DEMO
 * xwlxyjk@gmail.com
 */

var express = require('express'),
    fs      = require('fs'),
    pageRoutes = require('./routes.js'),
    path = require('path');

/**
 *  Define the sample application.
 */
var nodeApp = function() {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function(_ENV_IP) {
        self.port      = 3000;
        self.rootDir = __dirname;
        self.ipaddress = _ENV_IP || "127.0.0.1";
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        typeof self.zcache == 'undefined' ?  self.zcache = { } : '';
        var cacheDict = self.zcache;
        var cacheRoot = self.rootDir;//path.join(__dirname, 'views');
        //  Local cache for static content.
        for(var _item in cacheDict){
            //read in to memory binaries to cache
            var viewPath = path.join(cacheRoot, cacheDict[_item]);
            cacheDict[_item] = fs.readFileSync(viewPath);
        }
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { 
        console.log('>>>use cache_get, key: '+key);
        return self.zcache[key]; 
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = pageRoutes;
    };
    /**
     *  set the views render engine and other conf
     */
    self.setViews = function(viewPath, viewEng){
        var viewPath = viewPath || (__dirname + '/views'),
            viewEng = viewEng || 'ejs';
        var app = self.app;
        app.set('views', viewPath);
        app.set('view engine', viewEng);
        //render html
        //for jade
        app.engine('jade', require('jade').__express);
        //for ejs: html
        app.engine('html', require('ejs').renderFile);
        app.configure('production', function(){    
            app.set('view cache', true);
        });
    };
    /**
     *  export the app to global config
    */
    self.setApp = function(){
        //set config
        var app = self.app;
        app.configure(function(){
            // app.use(express.bodyParser());
            app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, 'upload', 'tmp' ) }));
            app.use(express.methodOverride());
            app.use("/static", express.static(__dirname + '/static'));
            app.use(app.router);
        });
        //use develp or production Env
        //self.connectMongo();
        self.setViews();

        global.mainServer = self;
    };
    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();//express.createServer();
        //set the global attr
        self.setApp();
        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.all(r, self.routes[r]);

        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
        delete self.createRoutes;
        delete self.initializeServer;
        delete self.initialize;
        delete self.setApp;
        delete self.start;
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new nodeApp();
zapp.initialize();
zapp.start();

