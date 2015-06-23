angular.module('MobileTimeRecording.controllers.AddProject', ['MobileTimeRecording.services.Database'])

.controller('AddProjectController', function($scope, Projects, $location, ngNotify, $timeout){
	/**
	 * This variable is used to restrict the navigator.geolocation localization to using GPS only
	 * 
	 */
	var trackOptions = {
	  enableHighAccuracy: true
	};
	
	/**
	 * This function adds a new project into the database, gives a respective notification and forwards to the main screen.
	 * 
	 * @param  project Project object containing the data of the project
	 */
	$scope.addProject = function(project) {
		// convert date to unix timestamp
		project.date = Date.parse(project.date)/1000;
		
	  Projects.add(project).then(function() {
	  	ngNotify.set(project.name + ' successfully added', {
	  			type: 'success',
	  			position: 'top',
	  			duration: 3000
	  		});
	  	$timeout(function() {
	  		$location.path('#/');
	  	}, 4000);
	  });
  };

  /**
   * This function starts a GPS localization in order to get the longitude and latitude of the current position.
   * Note that by W3C standard the user has to accept the usage of this functionality explicitly.
   * 
   */
  $scope.trackProject = function() {
  	console.log("track button pressed");
	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(pushPosition, trackError, trackOptions);
    } else { 
        ngNotify.set('Geolocation is not supported by this browser', {
			type: 'error',
			position: 'top',
			duration: 3000
		});
    }
  };

  /**
   * This function is the result function of function trackProject. It pushes the values of the longitude and latitude into the respective form fields.
   * 
   * @param  position The position object created and forwarded by the getCurrentPosition function of the geolocation API
   */
  pushPosition = function(position) {
  	console.log("push position:");
  	console.log(position.coords.longitude);
  	console.log(position.coords.latitude);
  	for($i = 0; $i < 2; $i++) {
	  	$scope.project.longitude = position.coords.longitude;
	  	$scope.project.latitude = position.coords.latitude;
	 }
  };

  /**
   * This function is the error function of function trackProject. It shows a notification that the localization via GPS was unsuccessful.
   * 
   */
  trackError = function() {
	ngNotify.set('GPS localization unsuccessful', {
		type: 'error',
		position: 'top',
		duration: 3000
	});
  };
});