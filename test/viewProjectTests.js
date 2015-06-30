describe('Controller: ViewProjectController', function () {

	beforeEach(module('ngNotify'));

	// load the controller's module
	beforeEach(module('MobileTimeAccounting.controllers.ViewProject'));

	var ViewProjectController,
	scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		ViewProjectController = $controller('ViewProjectController', {
			$scope: scope,
			$routeParams: {projectId: '12345'}
		});
	}));

	it('should attach a list of awesomeThings to the scope', function () {
		expect(true).toBe(true);
	});
});