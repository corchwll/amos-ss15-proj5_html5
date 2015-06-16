angular.module('MobileTimeRecording.controllers.Main', ['MobileTimeRecording.services.Database'])

.controller('MainController', function($scope, Projects, $location, ModalService){
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
   * This function is used to delete (internally archive) projects
   * 
   * @param   project An object containing a project
   */
  $scope.deleteOverlay = function(project) {
    ModalService.showModal({
      templateUrl: 'modal.html',
      controller: 'ModalController'
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        if(result === 'Yes') {
          deleteProject(project.id);
        } else {        
          $scope.updateProjects();
        }
      });
    });
  };

  /**
   * THis function deletes (internally archives) a project specified by its id
   * @param  projectId The 5 digit id of a project
   */
  var deleteProject = function(projectId) {
    Projects.archive(projectId).then(function() {
      $scope.updateProjects();
    });
  };
})

.controller('ModalController', function($scope, close) {
  $scope.close = function(result) {
    close(result);
  };
});
