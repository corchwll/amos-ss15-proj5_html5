angular.module('MobileTimeRecording.controllers.Main', ['MobileTimeRecording.services.Database'])

.controller('MainController', function($scope, Projects, $location){
  $scope.projects = [];
  $scope.project = null;
  
  /**
   * This function refreshes the view of the project lists and, therefore, loads all projects from the database.
   * 
   */
  $scope.updateProjects = function() {
  	Projects.all().then(function(projects) {
      $scope.delete = false;
  		$scope.projects = projects;
  	});
  };

  /**
   * This function is used to arrange the projects in alphabetical order them with exception of the four predefined projects which are listed on top.
   * 
   * @param   project An object containing a project
   * @return          The project name
   */
  $scope.orderProjects = function(project) {
    if(project.id === '00001') {
      return -1;
    } else if(project.id === '00002') {
      return -1;
    } else if(project.id === '00003') {
      return -1;
    } else if(project.id === '00004') {
      return -1;
    } 
    return project.name;
  };

  /**
   * This function is used to forward to the display of individual projects
   * 
   * @param   projectId The 5 digit id of a project
   */
  $scope.viewProject = function(projectId) {
    $location.path('/viewProject/' + projectId);
  };

  /**
   * This function is used to forward to the add project screen
   * 
   */
  $scope.addProject = function() {
  	$location.path('/addProject');
  };


  /**
   * This function deletes (internally archives) a project specified by its id
   * 
   * @param  project An object containing a five digit id of a project
   */
   $scope.deleteProject = function(project) {
     Projects.archive(project.id).then(function() {
       $scope.updateProjects();
     });
   };

   /**
    * This function calculates the distance between the two positions.
    * The algorithm is based on: http://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates?answertab=active#tab-top
    * 
    * @param   currentPosition An Object containing latitude and longitude
    * @param   project         An Object containing latitude and longitude
    * @return                  The distance between the two postitons
    */
   calculateDistance = function(currentPosition, project) {
      var lat1 = currentPosition.latitude;
      var lon1 = currentPosition.longitude;
      var lat2 = project.latitude;
      var lon2 = project.longitude;

      var R = 6371; // km
      var dLat = (lat2-lat1).toRad();
      var dLon = (lon2-lon1).toRad();
      lat1 = lat1.toRad();
      lat2 = lat2.toRad();

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return R * c;
   }
})

.controller('ModalController', function($scope, close) {
  $scope.close = function(result) {
    close(result);
  };
});
