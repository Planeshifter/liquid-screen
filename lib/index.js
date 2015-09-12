'use strict';

var $ = require( 'jquery' );

if ( !window.hasOwnProperty( '$' ) ) {
	window.$ = $;
}

var Liquid = window.Liquid || {};

Liquid.Events = require( './Events.js' );
Liquid.Layer = require( './Layer.js' );

window.Liquid = Liquid;
