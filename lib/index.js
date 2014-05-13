
'use strict';

/**
 * Module dependencies
 */
var angular = require('angular'),
  common    = require('./common'),
  main      = require('./main'),
  pkg       = require('../package.json');

module.exports = angular.module('todos', [common.name, main.name])

  .constant('version', pkg.version)

  .run(function ($log) {
    $log.debug('todos module started');
  });

/**
 * Defer Angular bootstrap until after deviceready event if on a device
 */
(function (window) {

  if (!window || !window.document) {
    throw new Error('window and document objects required.');
  }

  function onWindowLoad() {

    if (!(!window.cordova && !window.PhoneGap && !window.phonegap)) {
      // when on device add document deviceready listener
      window.document.addEventListener('deviceready', onDeviceReady, false);

    } else {
      // when on browser trigger onDeviceReady
      onDeviceReady();
    }

    // remove window load listener
    window.removeEventListener('load', onWindowLoad, false);
  }

  // add window load listener
  window.addEventListener('load', onWindowLoad, false);

  function onDeviceReady() {

    // bootstrap angular app
    angular.element(window.document).ready(function () {
      angular.bootstrap(window.document, [module.exports.name]);
    });

    // remove document deviceready listener
    window.document.removeEventListener('deviceready', onDeviceReady, false);
  }

})(global || {});
