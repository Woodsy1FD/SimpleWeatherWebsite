
var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);

ConsoleModule.config(['$routeProvider', '$locationProvider','$sceDelegateProvider', '$httpProvider',
    function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/Byzip.html',
        controller: 'wcontroller',
        controllerAs: 'wcontroller'
    });
}]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
    function($scope, $http) {

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

    // Setup Google Maps
    $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    // Add a listener which places a marker where the user clicks
    $scope.map.addListener('click', function(e) {
        placeMarkerAndGetCity(e.latLng);
    });


    // Function to get city name from a marker position on the map
    function placeMarkerAndGetCity(latLng){
        var geocoder = new google.maps.Geocoder;
        var infoWindow = new google.maps.InfoWindow;
        geocoder.geocode({'location': latLng}, function(results, status) {
            if (status === 'OK'){
                // Place marker
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map
                });

                // Find the city name from returned components
                var city = "";
                infoWindow.setContent(results[0].address_components.forEach(function(currentValue){
                    if(currentValue.types[0] === "locality"){
                        city = currentValue.long_name;
                    }
                }));

                // Show result in an info window
                infoWindow.open($scope.map, marker);
            }
        });
    }

    // Function to create a marker on the map for a city given by an input field
    function codeAndMarkCity(address){
        var geocoder = new google.maps.Geocoder;
        // Append NZ to address to get the correct result from google API
        address += ",nz";
        geocoder.geocode({'address': address}, function(results, status){
            if (status === google.maps.status.OK){
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: results[0].geometry.location
                });
            }
            else alert("Geocode failed");
        });
    }

}]);