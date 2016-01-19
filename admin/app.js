
(function(){

var app=angular.module('xpatcloud',[
	   'ui.router',
	   'xpatcloud.contollers',
  	   //'firebase',
  	   'ui.bootstrap'
  	   //'angularFileUpload'
  	   
  	])



app.config(function($stateProvider, $urlRouterProvider) {
  	
  	// For any unmatched url, redirect to /state1
 	 $urlRouterProvider.otherwise('/dashboard');

  	
  	$stateProvider
		  .state('dashboard',{
		  	url:'/dashboard',
		  	templateUrl: 'views/dashboard.html',
		  	controller: 'xpatcloud.dashboardCtrl'
		  })

		  .state('projectAdmin',{
		  	url:'/projectAdmin',
		  	templateUrl: 'views/project_admin.html',
		  	controller: 'xpatcloud.ProjectAdminCtrl'
		  })

		  .state('portfolioAddPicture',{
		  	url:'/portfolioAddPicture',
		  	templateUrl: 'views/portfolio_addPicture.html',
		  	controller: 'xpatcloud.PortfilioAddPictureCtrl'
		  })

		   .state('projectInfo',{
		     url:'/projectInfo/:projectID',
		     templateUrl: 'views/project_info.html',
		     controller: 'xpatcloud.ProjectInfoCtrl'
		      
		   })



	})








})();
