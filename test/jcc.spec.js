var connect = require('../'), 
    expect = require('expect.js'),
    express = require('express'),
    jcc = require('../index'),
    request = require('supertest'),
    colors = require('colors');


describe('i18next.server.spec', function() {

  var app;

  before(function(done) {
    app = express({debug:true});
    app.configure(function() {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.logger('dev'));
      app.use(jcc.handle);
      
     /* app.use(function(req, res, next){    
        if (req.path.indexOf('nocompile') > -1)
          res.render(req.path.slice(1,req.path.length));
        else
          return next();
      });*/
    });

    opts = {
      debug: true
    };

    jcc.init(opts, app, function() {
      app.enable('jcc');
      done();
    });

    app.get('/nocompile/example', function(req, res){
      res.render('nocompile/example');
    });

    app.get('/nocompile/simple', function(req, res){
      res.render('nocompile/simple');
    });

  /*  app.use(function(req, res){
      res.statusCode = 404;
      res.end('sorry!');
    });*/
  });

  describe('jcc compile jade', function(){

    describe('with a malformed URL', function(){
      it('should respond with 404', function(done){
       request(app)
        .get('/zoubida/lala/')      
        .expect(404, done);
      });
    });

    describe('with small content1 not compiled first load'.red, function(){
      it('should respond with nice html', function(done){
        
        app.set('view cache', true);

       request(app)
        .get('/nocompile/simple')       
        .expect(200, '<p>hello world baby with no compile</p>', function(err, res) {                  
          done();
        });
      });
    });

    describe('with small content1 not compiled second load with cache'.red, function(){
      it('should respond with nice html', function(done){
        

       request(app)
        .get('/nocompile/simple')       
        .expect(200, '<p>hello world baby with no compile</p>', function(err, res) {        
          done();
        });
      });
    });

    describe('with small content1 not compiled third load with cache'.red, function(){
      it('should respond with nice html', function(done){        

       request(app)
        .get('/nocompile/simple')       
        .expect(200, '<p>hello world baby with no compile</p>', function(err, res) {          
          done();
        });
      });
    });

    describe('with small content1 compiled first load'.green, function(){
      it('should respond with nice html', function(done){          

          app.set('view cache', false);

         request(app)
          .get('/partials/compiled')       
          .expect(200, '<p>hello world baby with no compile</p>', function(err, res) {            
            done();
          });
      });
    });

    describe('with small content1 compiled second load with cache'.green, function(){
      it('should respond with nice html', function(done){          

         request(app)
          .get('/partials/compiled')       
          .expect(200, '<p>hello world baby with no compile</p>', function(err, res) {            
            done();
          });
      });
    });

    describe('with small content1 compiled third load with cache'.green, function(){
      it('should respond with nice html', function(done){              

         request(app)
          .get('/partials/compiled')       
          .expect(200, '<p>hello world baby with no compile</p>', function(err, res) {            
            done();
          });
      });
    });

    describe('with small content1 compiled fourth load with cache'.green, function(){
      it('should respond with nice html', function(done){          

         request(app)
          .get('/partials/compiled')       
          .expect(200, '<p>hello world baby with no compile</p>', function(err, res) {            
            done();
          });
      });
    });

    describe('with small content1 compiled five load with cache'.green, function(){
      it('should respond with nice html', function(done){
            
         request(app)
          .get('/partials/compiled')       
          .expect(200, '<p>hello world baby with no compile</p>', function(err, res) {            
            done();
          });
      });
    });

    describe('with bigger content2 not compiled'.red, function(){
      it('should respond with nice html', function(done){        

        app.set('view cache', true);

       request(app)
        .get('/nocompile/example')       
        .expect(200, function(err, res) {          
          done();
        });
      });
    });

    describe('with bigger content2 not compiled second load with cache'.red, function(){
      it('should respond with nice html', function(done){            

       request(app)
        .get('/nocompile/example')       
        .expect(200, function(err, res) {          
          done();
        });

      });
    });

    describe('with bigger content2 not compiled third load with cache'.red, function(){
      it('should respond with nice html', function(done){          

       request(app)
        .get('/nocompile/example')       
        .expect(200, function(err, res) {          
          done();
        });

      });
    });

    describe('with bigger content2 not compiled fourth load with cache'.red, function(){
      it('should respond with nice html', function(done){        

       request(app)
        .get('/nocompile/example')       
        .expect(200, function(err, res) {          
          done();
        });

      });
    });

    describe('with bigger content2 compiled first load'.green, function(){
      it('should respond with nice html', function(done){        

       request(app)
        .get('/partials/home/example')       
        .expect(200, function(err, res) {          
          done();
        });
      });
    });

    describe('with bigger content2 compiled second load'.green, function(){
      it('should respond with nice html', function(done){        

       request(app)
        .get('/partials/home/example')       
        .expect(200, function(err, res) {          
          done();
        });
      });
    });

    describe('with bigger content2 compiled third load'.green, function(){
      it('should respond with nice html', function(done){        

       request(app)
        .get('/partials/home/example')       
        .expect(200, function(err, res) {          
          done();
        });
      });
    });

    describe('with bigger content2 compiled fourth load'.green, function(){
      it('should respond with nice html', function(done){        

       request(app)
        .get('/partials/home/example')       
        .expect(200, function(err, res) {          
          done();
        });
      });
    });

    describe('with content3 compiled partial root level'.cyan, function(){
      it('should respond with nice html', function(done){

       request(app)
        .get('/partials/test') 
        .expect('Content-Type', /html/)     
        .expect(200, '<p>hello world baby</p>', function(err, res) {          
          done();
        });
      });
    });

    describe('with content4 compiled partials home/ level'.cyan, function(){
      it('should respond with nice html', function(done){
        
       request(app)
        .get('/partials/home/home') 
        .expect('Content-Type', /html/)     
        .expect(200, '<p>welcome home baby</p>', function(err, res) {          
          done();
        });
      });
    });

    describe('with content5 compiled partials home/ level'.cyan, function(){
      it('should respond with nice html', function(done){        

       request(app)
        .get('/partials/home/home2') 
        .expect('Content-Type', /html/)     
        .expect(200, '<p>welcome home baby 2</p>', function(err, res) {          
          done();
        });
      });
    });

    describe('with content6 compiled partials home/subhome/ level'.cyan, function(){
      it('should respond with nice html', function(done){
        
       request(app)
        .get('/partials/home/subhome/subhome') 
        .expect('Content-Type', /html/)
        .expect(200, '<p>welcome sub home baby</p>', function(err, res) {          
          done();
        });
      });
    });

  });

});

