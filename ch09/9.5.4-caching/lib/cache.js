/*
 * cache.js - 레디스 캐시 구현체
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
    redisDriver = require( 'redis' ), 
    redisClient = redisDriver.createClient(), 
    makeString, deleteKey, getValue, setValue;
// ------------- 모듈 스코프 변수 끝---------------

// --------------- 유틸리티 메서드 시작------------------ 
makeString = function ( key_data ) {
    return (typeof key_data === 'string' ) 
        ? key_data
        : JSON.stringify( key_data );
};
// ---------------- 유틸리티 메서드 끝-------------------

// ---------------- public 메서드 시작 ------------------ 
deleteKey = function ( key ) {
    redisClient.del( makeString( key ) );
};

getValue = function ( key, hit_callback, miss_callback ) {
    redisClient.get(
        makeString( key ),
        function( err, reply ) {
            if ( reply ) {
                console.log( 'HIT' ); 
                hit_callback( reply );
            }
            else {
                console.log( 'MISS' );
                miss_callback();
            }
        } 
    );
};
  
setValue = function ( key, value ) {
    redisClient.set(
        makeString( key ), makeString( value )
    );
};

module.exports = {
    deleteKey : deleteKey,
    getValue  : getValue,
    setValue  : setValue
};
// ----------------- public 메서드 끝-------------------
