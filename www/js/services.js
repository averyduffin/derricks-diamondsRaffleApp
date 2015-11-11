angular.module('starter.services', [])

.factory('Participants', function ($resource) {
	return $resource('http://www.derricksanddiamonds.org/api/index.php/participants/:personId', {personId: '@id'}, {
    //return $resource('http://localhost:8086/Slim/index.php/participants/:personId', {personId: '@id'}, {
  create: {method:'POST'}
 });
});