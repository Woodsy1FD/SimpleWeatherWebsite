
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

    var list = getCitiesList();
    alert(list);

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
                // Now draw the marker on the map
                codeAndMarkCity(response.data.city, which);
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

    // List of markers to hold
    var markers = [];

    // Setup Google Maps
    $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -36.85, lng: 174.76},
        zoom: 8
    });

    // Add a listener which places a marker where the user clicks
    $scope.map.addListener('click', function(e) {
        placeMarkerAndGetCity(e.latLng);
    });

    // If marker list greater than 4, remove the last item from map and list
    function maintainMarkers(marker, which){
        switch(arguments.length) {
            case 1:
                if(markers.length === 4)
                {
                    markers[3].setMap(null);
                    markers.pop();

                    // Remove the last item from the UI
                    $scope.city4City = "";
                    $scope.city4Weather = "";
                    $scope.city4m = "";
                }
                // Add the new marker to the list
                markers.push(marker);
                break;
            case 2:
                if (markers.length === 4){
                    markers[which - 1].setMap(null);
                    // Remove the item which has been changed
                    markers.splice(which - 1, 1, marker);
                }
                else{
                    // Add the marker to back of the list
                    markers.push(marker);
                }
                break;
        }
    }

    // Function to get city name from a marker position on the map
    function placeMarkerAndGetCity(latLng){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': latLng}, function(results, status) {
            if (status === 'OK') {
                // Place marker
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map
                });
                // Ensure still keeping max of 4 markers
                maintainMarkers(marker);

                // Find the city name from returned components
                var infoWindow = new google.maps.InfoWindow();
                var city = "";
                results[0].address_components.forEach(function (currentValue) {
                    if (currentValue.types[0] === "locality") {
                        city = currentValue.long_name;
                    }
                });
                // Show result in an info window
                infoWindow.setContent(city);
                infoWindow.open($scope.map, marker);

                // Now set city name in list of names
                var which = 0;
                // Find next empty city field OR override first field if none empty
                if($scope.city1m == null) {
                    which = 1;
                }
                else if ($scope.city2m === "" || $scope.city2m == null) {
                    which = 2;
                } else if ($scope.city3m === "" || $scope.city3m == null) {
                    which = 3;
                } else if ($scope.city4m === "" || $scope.city4m == null) {
                    which = 4;
                } else {
                    // Override first value in list
                    which = 1;
                }

                // Pass city name to API now
                $http({
                    method: "GET",
                    url: '/api/v1/getWeather?cityName=' + city
                }).then(function (response) {
                        // Change UI based on response success
                        if (response.status === 200) {
                            if (which === 1) {
                                $scope.city1m = response.data.city;
                                $scope.city1City = response.data.city;
                                $scope.city1Weather = response.data.weather;
                            } else if (which === 2){
                                $scope.city2m = response.data.city;
                                $scope.city2City = response.data.city;
                                $scope.city2Weather = response.data.weather;
                            } else if (which === 3) {
                                $scope.city3m = response.data.city;
                                $scope.city3City = response.data.city;
                                $scope.city3Weather = response.data.weather;
                            } else if (which === 4) {
                                $scope.city4m = response.data.city;
                                $scope.city4City = response.data.city;
                                $scope.city4Weather = response.data.weather;
                            }
                        }
                    }
                );
            }
        });
    }

    // Function to create a marker on the map for a city given by an input field
    function codeAndMarkCity(address, which){
        var geocoder = new google.maps.Geocoder();
        var city = address;
        // Append NZ to address to get the correct result from google API
        address += ",nz";
        geocoder.geocode({'address': address}, function(results, status){
            if (status === 'OK'){
                var infoWindow = new google.maps.InfoWindow();
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: results[0].geometry.location
                });

                // maintain list of markers
                maintainMarkers(marker, which);

                // Show city name in an info window
                infoWindow.setContent(city);
                infoWindow.open($scope.map, marker);
            }
        });
    }

    // Big bad boy function to get the cities list from db2
    function getCitiesList(){
        var api_url = "https://dashdb-txn-sbox-yp-dal09-03.services.dal.bluemix.net" + "/dbapi/v3";
        var userInfo = {
            "userid" : "dtf01766",
            "password" : "8scpj0r3r8lnk+h9"
        };
        var service = "/auth/tokens";
        var citiesList;

        // Call db2 to get access token
        $http.post(api_url + service, userInfo).then(function(response) {
            if (response.status === 200) {
                alert("Successfully got access token");
                var auth_header = {
                    "Authorization": "Bearer " + response.data.token
                };
                var sql_command = {
                    "commands": "SELECT * FROM CITIES",
                    "limit": 4,
                    "seperator": ";",
                    "stop_on_error": "yes"
                };
                var service = "/sql_jobs";

                var request = {
                    method: "POST",
                    url: api_url + service,
                    headers: auth_header,
                    data: sql_command
                };
                // Now send post request for sql job
                $http(request).then(function (response) {
                    if (response.status === 200) {
                        alert("JOB SENT");
                        request = {
                            method: "GET",
                            url: api_url + service + "/" + response.data.id,
                            headers: auth_header
                        };
                        // Get the Select statement results from the db2 instance
                        $http(request).then(function (response) {
                            if (response.status === 200) {
                                alert("Got job results")
                                citiesList =  response.data.results.rows;
                            }
                        });
                    }
                }); // Lowest
                return citiesList;
            }});
    }
}]);