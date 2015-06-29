angular.module('MobileTimeAccounting.controllers.EditUser', ['MobileTimeAccounting.services.Database'])

.controller('EditUserController', function($scope, User, $location, ngNotify, $timeout){
	
	var origUser = {};

	/**
	 * This function loads the data on the user from the database.
	 * 
	 * @return Empty return, if no user data available, else no return
	 */
	$scope.getUser = function() {
		User.all().then(function(user) {
			if($.isEmptyObject(user)) {
				return;
			}
			origUser.employee_id = user[0].employee_id;
			$scope.editUser = user[0];
		});
	};

	/**
	 * This function either creates a new user in the database or updates the current user, depending on the existence of data on a user
	 * 
	 * @param   editUser An object containing user data
	 */
	$scope.editProfile = function(editUser) {
		if($.isEmptyObject(origUser)) {
			// Create new user
	  	editUser.registration_date = Math.floor(Date.now() / 1000);
	  	if(editUser.location_sort_is_used === true) {
	  		editUser.location_sort_is_used = 1;
	  	} else {
	  		editUser.location_sort_is_used = 0;
	  	}
	  	User.add(editUser).then(function() {
	  		ngNotify.set('User profile successfully created', {
	  			type: 'success',
	  			position: 'top',
	  			duration: 3000
	  		});
	  		$timeout(function() {
		  		$location.path('#/');
		  	}, 3500);
	  	});
	  } else {
	  	// Update existing user
	  	if(editUser.location_sort_is_used === true) {
	  		editUser.location_sort_is_used = 1;
	  	} else {
	  		editUser.location_sort_is_used = 0;
	  	}
  		User.update(origUser, editUser).then(function() {
	  		ngNotify.set('User profile successfully updated', {
	  			type: 'success',
	  			position: 'top',
	  			duration: 3000
	  		});
				$timeout(function() {
	  			$location.path('#/');
	  		}, 3500);
	  	});
	  }
  };
});