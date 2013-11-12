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
        routes: ['partials'],
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

        this.compileJadeTmpl(app);

        return cb();        
    };

    jcc.handle = function(req, res, next) {        
        var routes = jcc.options.routes;        
        var debug = jcc.options.debug;        
        
        if (req.app.enabled('jcc')) {                 
        // check active routes            
            for (var j=0; j< routes.length;j++) 
                if (req.path.indexOf(routes[j]) < 0) return next();                    
                   
            if (debug)
                console.log('debug: using jcc for route: '.blue+req.path);

            try {
                if (!req.app.get(jcc.options.cache)[req.path]) {
                    if (debug)
                        console.log('this route is not in cache'.red+req.path);                    
                    return next();
                }
                    
                var html = req.app.get(jcc.options.cache)[req.path]();                    
                return res.send(html);                       
            }
            catch (e) {
                throw Error('jade compiled view not found for path: ' + req.path + ' activate debug option first.');
            }
        }        
        return next();        
    };
    
    jcc.compileJadeTmpl = function(app) {        
        var debug = jcc.options.debug;        

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
                    if (debug)
                        console.log('debug: '.blue+ file + ' is not a jade file, might not be placed here.'.blue);
                    continue;
                }
                try {                    
                    fn = jade.compile(fs.readFileSync(path.resolve(dir, file), 'utf8'), {filename: dir+'/'+file});
                    var keyTemplate = filepath.replace(viewPath, '').replace(jadeExt, '');                                 
                    if (debug)
                        console.log('debug: file '.blue+ file + ' compiled, put in cache (key) route: '.blue + keyTemplate);
                    compiledTemplates[keyTemplate] = fn;
                }
                catch (e) {
                    console.log('error while compiling'.red + filepath.red);
                }
            }        
            level = '';                                
        }

        level += '/';
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
