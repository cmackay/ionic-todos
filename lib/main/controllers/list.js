
'use strict';

/**
 * Module dependencies
 */
var angular = require('angular');

module.exports = angular.module('todos.main')

  .controller('list', function ($scope, $log, $injector) {

    $log.debug('todos - init');

    $scope.title = 'My Todos';

    $scope.items = [{
      id: 'item 1'
    },{
      id: 'item 2'
    }];

    $scope.doRefresh = function () {
      $scope.$broadcast('scroll.refreshComplete');
    };

  });
