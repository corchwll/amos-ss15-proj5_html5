describe('Controller dashboard', function() {


	beforeEach(module('MobileTimeAccounting.controllers.Dashboard'));

	var $controller;
	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
	}));

	describe('Function xxx', function() {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};
			controller = $controller('DashboardController', { $scope: $scope });
		});

		it('DummyScope', function() {
			expect(true).toBe(true);
			//console.log("Dummy test executed");
		});	

	});

});
