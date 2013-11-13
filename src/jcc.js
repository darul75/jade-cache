(function() {

    var jcc = {},
    fs = require('fs'),
    colors = require('colors'),
    jade = require('jade'),
    path = require('path');    

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = jcc;
    }

    // defaults
    var o = {        
        debug: true,        
        routes: ['/partialsdd'],
        views: 'views',
        exclude: ['.svn', '.DS_Store'],
        cache: 'jade-compiled-templates'        
    };    

    var compiledTemplates = {};
    var jadeExt = '.jade';
    var viewPath;

    jcc.init = function(options, app, cb) {
        options = options || {};

        // override defaults with passed in options
        f.extend(o, options);

        // start compilation
        this.compileJadeTmpl(app);

        return cb();
    };

    jcc.handle = function(req, res, next) {        
        var routes = jcc.options.routes;             

        trace('debug: route: '.yellow+req.path);
        
        if (req.app.enabled('jcc')) {       
        // check active routes            
            for (var j=0; j< routes.length;j++) 
                if (req.path.indexOf(routes[j]) !== 0) return next();                    
                   
            trace('debug: using jcc for route: '.yellow+req.path);

            try {
                var tmpl = compiledTemplates[req.path];
                if (!tmpl) {
                    trace('this route is not in cache'.red+req.path);
                    return next();
                }
                                    
                return res.send(tmpl());
            }
            catch (e) {
                throw Error('jade compiled view not found for path: ' + req.path + ' activate debug option first.');
            }
        }        
        return next();        
    };
    
    jcc.compileJadeTmpl = function(app) {                  
        var templatesDir =  path.resolve(app.get('views'));          
        viewPath = templatesDir;

        // start iterate
        compileJadeTmplRec(templatesDir);

        // store templates
        app.set(jcc.options.cache, compiledTemplates);    
    };

    var compileJadeTmplRec = function(dir, level) {
        var debug = jcc.options.debug;        
        var fn; // compiled template
        var files = fs.readdirSync(dir, 'r');            
                
        for (var i in files) {
            var file = files[i];            
            var filepath = dir+'/'+file;
            var lastPortion = path.basename(filepath);            

            if (jcc.options.exclude.indexOf(lastPortion) >= 0)                
                continue;            
            
            if (!fs.existsSync(filepath))
                continue;

            var isDir = fs.statSync(filepath).isDirectory();
            
            if (isDir) {                
                level = level ? file + '/' : level + file+'/';
                compileJadeTmplRec(filepath, level);                                
            }
            else {
                 if (path.extname(filepath) !== jadeExt) {
                    trace('debug: '.yellow+ file + ' is not a jade file, might not be placed here.'.yellow);
                    continue;
                }
                try {                    
                    fn = jade.compile(fs.readFileSync(path.resolve(dir, file), 'utf8'), {filename: dir+'/'+file});
                    var keyTemplate = filepath.replace(viewPath, '').replace(jadeExt, '');                                 
                    trace('debug: file '.yellow+ file + ' compiled, put in cache (key) route: '.yellow + keyTemplate);
                    compiledTemplates[keyTemplate] = fn;
                }
                catch (e) {
                    trace('error while compiling'.red + filepath.red);
                }
            }        
            level = '';                                
        }

        level += '/';
    };

    var trace = function(s) {
        if (jcc.options.debug)
            console.log(s);
    };

    // overriding for the functions
    var f = {

        extend: function(target, source) {
            if (!source || typeof source === 'function') {
                return target;
            }
            
            for (var attr in source) { target[attr] = source[attr]; }
                return target;
        }
    };
    
    jcc.functions = f;
    jcc.options = o;
})();
