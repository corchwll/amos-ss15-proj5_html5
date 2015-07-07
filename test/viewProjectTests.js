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
		it('Get correct predefined poject Vacation', function (done) {
			$routeParams =  {projectId: '00001'};
			inject(function() {
				scope.getProject()
				done();
			});
			expect(scope.title).not.toBeNull();
			expect(scope.title).toBe("Vacation");
		});

		it('Get correct predefined poject Illness', function (done) {
			$routeParams =  {projectId: '00002'};
			inject(function() {
				scope.getProject()
				done();
			});
			expect(scope.title).not.toBeNull();
			expect(scope.title).toBe("Illness");
		});

		it('Get correct predefined poject Office', function (done) {
			$routeParams =  {projectId: '00003'};
			inject(function() {
				scope.getProject()
				done();
			});
			expect(scope.title).not.toBeNull();
			expect(scope.title).toBe("Office");
		});

		it('Get correct predefined poject Training', function (done) {
			$routeParams =  {projectId: '00004'};
			inject(function() {
				scope.getProject()
				done();
			});
			expect(scope.title).not.toBeNull();
			expect(scope.title).toBe("Training");
		});
	});

	describe('Function calculateSessionDuration', function () {
		it('Test if calculation returns correct values', function (done) {
			var session = [];
			var returnValue;
			session.timestamp_start = 0;
			session.timestamp_stop = 660;
			inject(function() {
				returnValue = scope.calculateSessionDuration(session)
				done();
			});
			expect(returnValue).not.toBeNull();
			expect(returnValue).toBe("00:11");
		});
	});
});