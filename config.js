module.exports = function(config) {

  // Output directory
  config.dest = 'www';
  
  // Inject cordova script into html
  config.cordova = false;
  
  // Images minification
  config.minify_images = false;

  // Development web server

  config.server.host = '0.0.0.0';
  config.server.port = '8000';
  
  // Set to false to disable it:
  // config.server = false;

  // Weinre Remote debug server
  
  config.weinre.httpPort = 8001;
  config.weinre.boundHost = 'localhost';

  // Set to false to disable it:
  config.weinre = false;
    
  // 3rd party components
  // config.vendor.js.push('.bower_components/lib/dist/lib.js');
  // config.vendor.fonts.push('.bower_components/font/dist/*');
  config.vendor.js.push('bower_components/ng-notify/dist/ng-notify.min.js');
  config.vendor.js.push('bower_components/angular-modal-service/dst/angular-modal-service.min.js');
  config.vendor.js.push('bower_components/moment/moment.js');
  config.vendor.js.push('bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js');
  config.vendor.js.push('bower_components/angular-bootstrap-datetimepicker-directive/angular-bootstrap-datetimepicker-directive.min.js');
  config.vendor.fonts.push('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.*');
};