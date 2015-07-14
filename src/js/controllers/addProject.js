angular.module('MobileTimeAccounting.controllers.AddProject', [])

.controller('AddProjectController', function($scope, Projects, $location, Notify, $timeout, $routeParams){
	
	/**
	 * This variable is used to restrict the navigator.geolocation localization to using GPS only
	 * 
	 */
	var trackOptions = {
	  enableHighAccuracy: true
	};

	/**
	 * This function searches a project specified by its id in the database and fills the current values into the edit project form.
	 * 
	 */
	$scope.getProject = function() {
		Projects.getById($routeParams.projectId).then(function(project) {
			$scope.project = project;
			$scope.origDate = project.timestamp_final_date*1000;
		});
	};
	
	/**
	 * This function adds a new project into the database, gives a respective notification and forwards to the main screen.
	 * 
	 * @param  project Project object containing the data of the project
	 */
	$scope.addProject = function(project) {
		// convert date to unix timestamp
		project.date = moment(project.date).add(23, 'hours').add(59, 'minutes').unix();
		
	  Projects.add(project).then(function() {
	  	Notify.success(project.name + ' successfully added');
	  	$timeout(function() {
	  		$location.path('#/');
	  	}, 4000);
	  });
  };

    /**
     * This function updates a specified project, gives a respective notification and forwards to the main screen.
     * 
     * @param  project Project object containing the data of the edited project
     */
    $scope.editProject = function(project) {
    	// convert date to unix timestamp
  		project.date = moment(project.date).add(23, 'hours').add(59, 'minutes').unix();

  		Projects.update(project, project).then(function() {
  			Notify.success(project.name + ' successfully edited');
  			$timeout(function() {
  				$(location).attr('href', '#/');
  			}, 3500);
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
      Notify.error('Geolocation is not supported by this browser');
    }
  };

  /**
   * This function is the result function of function trackProject. It pushes the values of the longitude and latitude into the respective form fields.
   * 
   * @param  position The position object created and forwarded by the getCurrentPosition function of the geolocation API
   */
  pushPosition = function(position) {
	Notify.success('Localization in progress...');
  	$timeout(function() {
  		console.log("push position:");
	  	console.log(position.coords.longitude);
	  	console.log(position.coords.latitude);
  		$scope.project.longitude = position.coords.longitude;
  		$scope.project.latitude = position.coords.latitude;
  	}, 3000);
  };

  /**
   * This function is the error function of function trackProject. It shows a notification why the localization was unsuccessful.
   * 
   */
  trackError = function(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
          Notify.error('GPS usage denied');
          break;
        case error.TIMEOUT:
          Notify.error('GPS timed out');
          break;
        case error.POSITION_UNAVAILABLE:
          Notify.error('GPS data is unavailable');
          break;
        case error.UNKNOWN_ERROR:
          Notify.error('GPS localization unsuccessful due to unknown error');
          break;
    }
  };

});