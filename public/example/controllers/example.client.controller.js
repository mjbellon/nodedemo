// Invoke 'strict' JavaScript mode
'use strict';

angular.module('example').controller('ExampleController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	} 
]);