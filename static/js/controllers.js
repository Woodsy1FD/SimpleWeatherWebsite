
var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);

ConsoleModule.config(['$routeProvider', '$locationProvider','$sceDelegateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/Byzip.html',
        controller: 'wcontroller',
        controllerAs: 'wcontroller'
    });
}]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
    function($scope, $http, $routeParams, $timeout, $sce) {

    $scope.somemessage = "Some weather";
    $scope.city1City = "";
    $scope.city1Weather = "";

    $scope.cityName = function(which) {

        var data = "";
        if(which === 1) {
            data = $scope.city1m;
        } else if(which === 2) {
            data = $scope.city2m;
        } else if(which === 3) {
            data = $scope.city3m;
        } else if(which === 4) {
            data = $scope.city4m;
        }
        // Pass city name to API now
        $http({
            method: "GET",
            url: '/api/v1/getWeather?cityName=' + data
        }).then( function(response) {
            // Change UI based on response success
            if(response.status ===  200) {
                if (which === 1) {
                    $scope.city1City = response.data.city;
                    $scope.city1Weather = response.data.weather;
                } else if (which === 2) {
                    $scope.city2City = response.data.city;
                    $scope.city2Weather = response.data.weather;
                } else if (which === 3) {
                    $scope.city3City = response.data.city;
                    $scope.city3Weather = response.data.weather;
                } else if (which === 4) {
                    $scope.city4City = response.data.city;
                    $scope.city4Weather = response.data.weather;
                }
            }
            else {
                if (which === 1) {
                    $scope.city1City = "";
                    $scope.city1Weather = "";
                } else if (which === 2) {
                    $scope.city2City = "";
                    $scope.city2Weather = "";
                } else if (which === 3) {
                    $scope.city3City = "";
                    $scope.city3Weather = "";
                } else if (which === 4) {
                    $scope.city4City = "";
                    $scope.city4Weather = "";
                }
            }
        });
    };
}]);