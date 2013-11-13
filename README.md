# jade-express 

**jade-express** will not change your life but help you to deal with jade view into your code. 
Compatible for ExpressJs I do not know about others.

* `cache` : compile all jade views at startup into templates.
* `middleware` specific route catcher to render these cache templates.

## Why ?

I needed it for emails templating and started by simply compile specific view in code, again and again, but for what ? Why not make it dynamicaly one time for all needed views ?

Then a lot of my "partials" view can be rendered too without the need to make a specific route, mine was

And play little bit, see how node core, express, jade are working.

```javascript
app.get('partials/:id/:name')

// and something like 
function(req, res) {
  res.render('
}

```

So I have choosed a solution with a small middleware. I will try explain you later how to use it.

## Install

~~~
npm install jade-express
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
  // all is compiled
});

...

// later in you code when you need template
req.app.get('jade-compiled-templates')['/path-to/jade-view']({email:'darul75@gmail.com'});  
// WHERE
// 'email' is your view variable
// 'jade-compiled-templates' is default cache name
```

### Middleware

Keep it mind this middleware has sense specially for "partials" template use, with no jade "variables" to be processed in view. %{var}

```javascript
var jcc = require('jcc');

app.configure(function() {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(jcc.handle);
      ...
});

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
- `routes` : routes matching middleware use, keep it mind do not handle jade variables because simply call template with no parameter, default `'partials'`
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
