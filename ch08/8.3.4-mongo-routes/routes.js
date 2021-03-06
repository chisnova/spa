/*
 * routes.js - 라우팅 제공 모듈
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
	configRoutes,
 	mongodb = require( 'mongodb' ),

    mongoServer = new mongodb.Server(
        'localhost',
        mongodb.Connection.DEFAULT_PORT
    ),
    dbHandle = new mongodb.Db(
        'spa', mongoServer, { safe : true }
    ),
    
    makeMongoId = mongodb.ObjectID;
    objTypeMap = { 'user': {} };<=
// ------------- 모듈 스코프 변수 끝---------------

// ---------------- public 메서드 시작 ------------------ 
configRoutes = function ( app, server ) {
	app.get( '/', function ( request, response ) {
		response.redirect( '/spa.html' );
	});

	app.all( '/:obj_type/*?', function ( request, response, next ) {
    	response.contentType( 'json' );
		next(); 
	});

	app.get( '/:obj_type/list', function ( request, response ) {
		dbHandle.collection(
		    request.params.obj_type,
		    function ( outer_error, collection ) {
				collection.find().toArray(
                    function ( inner_error, map_list ) {
                        response.send( map_list );
                    }
				); 
			}
		);
	});

	app.post( '/:obj_type/create', function ( request, response ) {
    	dbHandle.collection(
        request.params.obj_type,
            function ( outer_error, collection ) {
                var
                    options_map = { safe: true },
                    obj_map = request.body;

                collection.insert(
                    obj_map,
                    options_map,
                    function ( inner_error, result_map ) {
                        response.send( result_map );
					} 
				);
			} 
		);
	});

	app.get( '/:obj_type/read/:id', function ( request, response ) {
    	var find_map = { _id: makeMongoId( request.params.id ) };
    	dbHandle.collection(
        	request.params.obj_type,
            function ( outer_error, collection ) {
                collection.findOne(
                    find_map,
                    function ( inner_error, result_map ) {
                        response.send( result_map );
                    }
				);
			}
		);
    });

	app.post( '/:obj_type/update/:id', function ( request, response ) {
	var
    	find_map = { _id: makeMongoId( request.params.id ) },
    	obj_map = request.body;
	
	dbHandle.collection(
    	request.params.obj_type,
	        function ( outer_error, collection ) {
	            var
	                sort_order = [],
	                options_map = {
	                    'new' : true, upsert: false, safe: true
	                };
	            
	            collection.findAndModify(
                	find_map,
                	sort_order,
                    obj_map,
                    options_map,
                    function ( inner_error, updated_map ) {
                        response.send( updated_map );
                    }
				); 
	        }
        ); 
	});

	app.get( '/:obj_type/delete/:id', function ( request, response ) {
    	var find_map = { _id: makeMongoId( request.params.id ) };

    	dbHandle.collection(
			request.params.obj_type,
    		function ( outer_error, collection ) {
        		var options_map = { safe: true, single: true };
        
        		collection.remove(
            		find_map,
            		options_map,
            		function ( inner_error, delete_count ) {
	            		response.send({ delete_count: delete_count });	            		
					}
				); 
        	}
    	);
    });
};

module.exports = { configRoutes : configRoutes };
// ----------------- public 메서드 끝 -------------------

// ------------- 모듈 초기화 시작-------------- 
dbHandle.open( function () {
    console.log( '** Connected to MongoDB **' );
});
// -------------- 모듈 초기화 끝---------------
