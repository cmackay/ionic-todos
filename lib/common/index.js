
'use strict';

/**
 * Module dependencies
 */
var angular = require('angular'),
  ionicModule = require('ionic-angular');

module.exports = angular.module('todos.common', ['ionic'])

  .run(function ($log, $ionicPlatform, $ionicBackdrop, $timeout) {
    $log.debug('starting todos.common module');
    $ionicBackdrop.retain();
    $timeout(function() {
      $ionicBackdrop.release();
    }, 600);
  });

// add directives
require('./directives');

// add services
require('./services');
