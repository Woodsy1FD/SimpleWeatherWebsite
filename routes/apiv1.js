
var express = require('express');
var router = express.Router();
var REQUEST = require('request');

var request = REQUEST.defaults( {
    strictSSL: false
});
// Units = metric for metric units
var OPENWEATHERURL = "http://api.openweathermap.org/data/2.5/weather?appid=6b7b471967dd0851d0010cdecf28f829&units=metric";

exports.getWeather = function(req, res) {
	var cityName = req.query.cityName;
	if( (cityName === null) || (typeof(cityName) === 'undefined') ) {
		return res.status(400).send('cityName missing');
	}
    // Must include country in URL as it defaults to US
	var aurl = OPENWEATHERURL + '&q=' + cityName + ',nz';

	request({
		method: 'GET',
        url: aurl,
  		json: true
    }, function(err, resp, body) {
    	if(err) {
    		res.status(400).send('Failed to get the data');
    		//console.error("Failed to send request to openweathermap.org", err);
    	} else {
    		if(body.cod === 200) {
    			var weath = "Conditions are " + body.weather[0].main + " and temperature is " + body.main.temp + ' C';
    			var response = {city: body.name, weather: weath};
    			return res.status(200).send(response);
    		} else {
                return res.status(400).send({msg:'Failed'});
            }
    	}
    });
};

var api_url = "https://dashdb-txn-sbox-yp-dal09-03.services.dal.bluemix.net" + "/dbapi/v3";

exports.getCitiesListJob = function(req, res) {
	var token = req.query.token;
	if ((token === null || typeof(token) ==='undefined')){
		return res.status(400).send('token is missing');
	}
	var fullUrl = api_url + "/sql_jobs";

	var auth_header = {
		"Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTgwNzA0NjYsInVzZXJOYW1lIjoiZHRmMDE3NjYiLCJjb29raWUiOiIiLCJpc3N1ZSI6Imh0dHBzOi8vMTAuMTIwLjcyLjEwOjg4ODAvIn0.PUm2Cyfq5cNPY2lEKLRzBKEXmvL2ypMqVWEyFpdpdTQ"
	};

	var sql_command = {
		"commands": "SELECT * FROM CITIES",
		"limit": 4,
		"separator": ";",
		"stop_on_error": "yes"
	};

	request({
		method: 'POST',
		url: fullUrl,
		json: true,
		headers: auth_header,
		data: sql_command
	}, function (err, resp, body){
		if (err) {
			return res.status(400).send('Failed to get cities list');
		}
		else{
			if (body.cod === 200) {
                var response = {jobId: body.id};
                return res.status(200).send(response);
            }
			else{
				return res.status(400).send({msg: body.cod});
			}
		}
	});
};

exports.getCitiesList = function (req, res){
	var jobId = req.query.jobId;
	var token = req.query.token;
	var auth_header = {
		"Authorization": "Bearer " + token
	};
	var fullUrl = api_url +"/sql_jobs/" + jobId;

	request({
		method: 'GET',
		url: fullUrl,
		headers: auth_header,
		json: true,
	}, function (err, resp, body) {
		if (err) {
			res.status(400).send('Failed to get cities list');
		} else {
			if (body.cod === 200) {
				var response = {cities: body.results.rows};
				return res.status(200).send(response);
			} else {
				return res.status(400).send({msg: 'Failed'});
			}
		}
	});
};


router.get('/getWeather', exports.getWeather);
router.get('/getCitiesListJob', exports.getCitiesListJob);
router.get('/getCitiesList', exports.getCitiesList);

exports.router = router;
