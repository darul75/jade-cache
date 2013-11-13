# jade-cache 

**jade-cache** purpose is help you to deal with jade view into your code, made for ExpressJs I do not know about others.

* `cache` : compile all jade views at startup into templates in one shot and recursive.
* `middleware` specific route catcher to render these cached templates.

## Why ?

I needed it for emails templating and started by simply compile specific view in code, again and again, but for what ? Why not make it dynamicaly one time for all needed views ?

Then a lot of my "partials" view can be rendered without the need to make a specific route. My "partials" folder has also some sub folders to make it organized and my code was something like:

```javascript
app.get('/partials/:type/:name', function (req, res) {
  var type = req.params.type;
  var name = req.params.name;
  res.render('partials/' + type + '/' + name);
  // calling jade render method then...
}
```

What can be easily done with a small middleware, I will try explain you later how to use it.

And play little bit, see how node core, express, jade are working.

## Install

~~~
npm install jade-cache
~~~

## Usage

### Cache

Done by default, all your views are put in cache at application boot.

```javascript
var jcc = require('jcc');

app.configure(function() {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      ...
});

var options = {};

jcc.init(options, app, function() {
  // all jade are compiled and cached
});

...

// later in your code when you need template
req.app.get('jade-compiled-templates')['/path-to/jade-view']({email:'darul75@gmail.com'});  
// WHERE
// 'email' is your view variable
// 'jade-compiled-templates' is default cache name
```
With debug mode set console output show template `key` to use with cache '/partials/home/example' for instance.

```
- file .DS_Store' is not a jade file, might not be placed here.
- file compiled.jade' has been compiled and put in cache (key) for route:'/partials/compiled'
- file example.jade' has been compiled and put in cache (key) for route:'/partials/home/example'
- file home.jade' has been compiled and put in cache (key) for route:'/partials/home/home'
- file home2.jade' has been compiled and put in cache (key) for route:'/partials/home/home2'
- file subhome.jade' has been compiled and put in cache (key) for route:'/partials/home/subhome/subhome'
- file notjade.txt' is not a jade file, might not be placed here.
- file test.jade' has been compiled and put in cache (key) for route:'/partials/test'
```

### Middleware

Keep it mind this middleware has sense specially for "partials" jade views with no jade "variables" to be processed in view: #{var}

See http://jade-lang.com/api/ for more info.

By default all `/partials/...` route will use this middleware, `/partials/view1.jade', '/partials/folder1/view2'.

But you can add some route or change it in options.

```javascript
var jcc = require('jcc');

app.configure(function() {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(jcc.handle);
      ...
});

// NO NEED TO MAKE SPECIFIC ROUTE 
/*
app.get('/partials/folder1/view1', function (req, res) {
  var type = req.params.type;
  var name = req.params.name;
  res.render('partials/' + type + '/' + name);
  calling jade render method then...
}*/

var options = {};

jcc.init(options, app, function() {
  // all is compiled
  app.enable('jcc'); // mandatory for middleware to be activated
});
...

// later in you code can still use this:
 // 'email' is your view variable
req.app.get('jade-compiled-templates')['/path-to/jade-view']({email:'darul75@gmail.com'});
```

## Options

- `debug` : see trace, useful at startup you will see all your routes path and check for errors compiling views, default `false`.
- `exclude` : file or directory to exclude from jade compile processing, default `['.svn', '.DS_Store']`.
- `routes` : routes matching middleware use, keep it mind do not handle jade variables because simply call template with no parameter, default `'/partials'`
- `cache`: cache name, default `'jade-compiled-templates'`  

## License

The MIT License (MIT)

Copyright (c) 2013 Julien Valéry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
