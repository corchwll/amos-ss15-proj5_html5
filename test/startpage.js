describe('ControllerviewProject', function() {


	/*beforeEach(function() {
	    module(angular.module.name);

	    module(function($provide) {
	      $provide.service('MobileTimeRecording.services.Database', myServiceName);
	    });

	    inject(function($injector) {
	      $controller = $injector.get('MobileTimeRecording.controllers.ViewProject');
	    });
	 });*/
	//beforeEach(module('ngNotifyProvider.ngNotify'));
	beforeEach(module('MobileTimeRecording.controllers.ViewProject'));
	//beforeEach(module('MobileTimeRecording.controllers.ViewProject', ['MobileTimeRecording.services.Database']));
	var $controller;
	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
	}));

	/*var ViewProjectController, $rootScope;
	beforeEach(inject(function($injector) {
		ViewProjectController = $injector.get('ViewProjectController');
		$rootScope = $injector.get('$rootScope');
	}));*/
/*
	describe('Dummy', function() {
		it('DummyScope', function() {
			expect(true).toBe(true);
			//console.log("Dummy test executed");
		});	
	});
*/

	describe('Function getProject', function() {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};
			controller = $controller('ViewProjectController', { $scope: $scope });
		});


		it('DummyScope', function() {
			expect(true).toBe(true);
			//console.log("Dummy test executed");
		});	

		/*
		it('Get project with id == 1', function() {
			//var $scope = {};
			//var controller = $controller('ViewProjectController', { $scope: $scope });
			//$scope.getById(1);
			//expect($scope.project).toEqual('Holiday');
		});
*/
	});

});
