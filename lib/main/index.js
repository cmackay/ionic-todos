
'use strict';

/**
 * Module dependencies
 */
var angular = require('angular'),
  common    = require('../common');

module.exports = angular.module('todos.main', [common.name])

  .config(function ($stateProvider) {
    $stateProvider
      .state('todos', {
        url         : '/todos',
        templateUrl : 'main/controllers/list.html',
        controller  : 'list'
      });
  })

  .config(function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/todos');
  })

  .run(function ($log) {
    $log.debug('starting todos.main');
  });

// add controllers
require('./controllers');
