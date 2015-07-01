describe('Controller: ViewProjectController', function () {

	beforeEach(module('ngNotify'));

	// load the controller's module
	beforeEach(module('MobileTimeAccounting.controllers.ViewProject'));

	// load the database module
	beforeEach(module('MobileTimeAccounting.services.Database'));

	var ViewProjectController,
	scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, DB, Projects) {
		scope = $rootScope.$new();
		ViewProjectController = $controller('ViewProjectController', {
			$scope: scope,
			$routeParams: {projectId: '02976'}
		});
		DB.init();
		Projects.populate();
	}));

	describe('Function getProject', function () {
		/*
		it('PRETEST', function () {
			$routeParams =  {projectId: '00001'};
			expect($routeParams.projectId).toBe('00001');
		});
		*/
		/*beforeEach(function(done) {
			scope.getProject().then(function() {
				done();
			});
		});*/
	
		it('Get correct predefined poject Vacation', function (done) {
			$routeParams =  {projectId: '00001'};
			console.log("BEGIN");
			inject(function() {
				console.log("Call me Injector");
				scope.getProject()
				done();
			});
			expect(scope.title).not.toBeNull();
			console.log(scope.title);
			console.log("Finite");
			expect(scope.title).toBe("Vacation");
		});
	});
	
});