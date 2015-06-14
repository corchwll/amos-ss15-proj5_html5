describe('ControllerviewProject', function() {


	beforeEach(module('MobileTimeRecording.controllers.ViewProject'));

	var $controller;
	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
	}));

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

	});

});
