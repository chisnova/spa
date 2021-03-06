/*
 * app.js - 범용 라우팅을 지원하는 익스프레스 서버
 */

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global */

// ------------ 모듈 스코프 변수 시작-------------- 
'use strict';
var
	http  	= require( 'http' ),
	express = require( 'express' ),
	
   	app 	= express(),
   	server  = http.createServer( app );
// ------------- 모듈 스코프 변수 끝---------------

// ------------- 서버 설정 시작--------------- 
app.configure( function () {
    app.use( express.bodyParser() );
    app.use( express.methodOverride() );
    app.use( express.static( __dirname + '/public' ) ); 
    app.use( app.router );
});

app.configure( 'development', function () {
    app.use( express.logger() );
    app.use( express.errorHandler({
        dumpExceptions : true,
        showStack      : true
    }) );
});

app.configure( 'production', function () {
    app.use( express.errorHandler() );
});

//아래 있는 모든 설정은 라우트 설정이다
app.get( '/', function ( request, response ) {
	response.redirect( '/spa.html' );
});

app.all( '/:obj_type/*?', function ( request, response, next ) {
    response.contentType( 'json' );
    next();
});

app.get( '/:obj_type/list', function ( request, response ) {
    response.send({ title: request.params.obj_type + ' list' });
});

app.post( '/:obj_type/create', function ( request, response ) {
    response.send({ title: request.params.obj_type + ' created' });
});

app.get( '/:obj_type/read/:id([0-9]+)', 
    function ( request, response ) {
        response.send({
            title: request.params.obj_type
              + ' with id ' + request.params.id + ' found'
        });
    }
);

app.post( '/:obj_type/update/:id([0-9]+)', 
    function ( request, response ) {
        response.send({
            title: request.params.obj_type
              + ' with id ' + request.params.id + ' updated'
        });
    }
);

app.get( '/:obj_type/delete/:id([0-9]+)', 
    function ( request, response ) {
        response.send({
            title: request.params.obj_type
              + ' with id ' + request.params.id + ' deleted'
        });
    } 
);
// -------------- 서버 설정 끝----------------

// ----------------- 서버 구동 시작-------------------
server.listen( 3000 );
console.log(
	'Express server listening on port %d in %s mode',
	server.address().port, app.settings.env
);
// ------------------ 서버 구동 끝--------------------
