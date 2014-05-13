
'use strict';

/**
 * Module dependencies
 */
var angular = require('angular');

module.exports = angular.module('todos.common')

  .directive('container', function() {
    return {
      restrict    : 'C',
      templateUrl : 'common/directives/container.html',
      link        : function (scope, element, attrs, ctrl) {

      }
    };
  });
