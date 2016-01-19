var ctrl = angular.module('xpatcloud.contollers', [])




/** ------------------------------------------------------
 *   Controller : indexCtrl
 *   controller for the landing page index.html
 */
ctrl.controller('xpatcloud.indexCtrl', function($scope, $stateParams, $http) {
    console.log("indexCtrl active");


    $scope.onClickContact = function() {
      
        $scope.sending=true;
        $scope.contact.action="send_confirmation_mail";
        $http({
            url: "/admin/php/api_home_mail.php",
            data: $scope.contact,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function(data) {
            $scope.sending=false;
            $scope.sent=true;
            $scope.contact = {};
            console.log(data.filename);
            //window.location.replace("confirmation.html");
        }).error(function(err) {
            "ERR", console.log(err)
        })
    };



});



/** ------------------------------------------------------
 *   Controller : indexCtrl
 *   controller for the landing page index.html
 */
ctrl.controller('xpatcloud.registrationCtrl', function($scope, $stateParams, $http) {
    console.log("registrationCtrl active");

     $scope.onClickRegistration = function() {
        $scope.sending=true;
        $scope.registration.action="send_registration_mail";
        $http({
            url: "/admin/php/api_registration_mail.php",
            data: $scope.registration,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function(data) {
            $scope.sending=false;
            $scope.sent=true;
            $scope.registration = {};
            console.log(data.filename);
            //window.location.replace("confirmation.html");
        }).error(function(err) {
            "ERR", console.log(err)
        })
       
    }




});




/** ------------------------------------------------------
 *   Controller : adminCtrl
 *   Controller for the admin page app/index.html
 */
ctrl.controller('xpatcloud.adminCtrl', function($scope, $firebase, $firebaseAuth, $location) {
    console.log("admin active");

    $scope.isCollapsed = true;

    // Authenticate user
    var ref2 = new Firebase('https://portfolio1.firebaseio.com');


    $scope.authObj = $firebaseAuth(ref2);
    var authData = $scope.authObj.$getAuth();
    console.log(authData);

    if (authData) {
        //User Authenticated
        console.log("Authenticated Logged in as:", authData.password.email);

    } else {
        console.log("Authentication failed");
        window.location = "/";
    } // end authentication

    $scope.onClickLogout = function() {
        console.log("logout");
        var authData = $scope.authObj.$unauth();
        window.location = "/";

    };


});





/** ------------------------------------------------------
 *   Controller : dashboardCtrl
 *   viewURL : /dashboard
 *   TemplateURL : views/dashboard.html
 *   Controller for the dahsboard view inside the admin page
 */
ctrl.controller('xpatcloud.dashboardCtrl', function($scope, $location) {
    console.log("dashboard active");



});



/** ------------------------------------------------------
 *   Controller : ProjectAdminCtrl
 *   viewURL : /dashboard
 *   TemplateURL : views/project_admin.html
 *   Controller for the project admin view inside the admin page
 */
ctrl.controller('xpatcloud.ProjectAdminCtrl', function($scope, $firebase, $location) {
    console.log("project Admin active");

    $scope.projects = {};
    var recordArray = [];
    //get data from firebase
    var ref = new Firebase('https://portfolio1.firebaseio.com/users/simplelogin:1/images');
    var pictures = $firebase(ref);

    //Get the data as an object
    var recordObject = pictures.$asObject();

    //load data object
    recordObject.$loaded().then(function() {
        //do something
    });

    //Get data as an array
    var recordArray = pictures.$asArray();

    // load data array
    recordArray.$loaded().then(function() {

        $scope.pictures = recordArray;
        console.log($scope.pictures);
    });


    $scope.onClick_getProject = function(project) {

        var key = project.$id;

        window.location = "#/projectInfo/" + key;
        console.log(window.location);
        //$location.path('/projectInfo/'+ key);

    };


});



/** ------------------------------------------------------
 *   Controller : ProjectAddPicture
 *   viewURL : /dashboard
 *   TemplateURL : views/project_admin.html
 *   Controller for the project admin view inside the admin page
 */
ctrl.controller('xpatcloud.PortfilioAddPictureCtrl', function($scope, $firebase, $log, $upload, $timeout) {
    console.log("Add project active");

    $scope.createProject = function() {
        var ref = new Firebase('https://pixelworks-app.firebaseio.com/projects');
        var projects = $firebase(ref);
        $scope.formData.dateAdded = Firebase.ServerValue.TIMESTAMP;
        projects.$push($scope.formData).then(function(ref) {
            console.log(ref.key()); // key for the new ly created record
            window.location = "#/projectAdmin";
        }, function(error) {
            console.log("Error:", error);
        });

    };
    $scope.progress = 0;

    $scope.onDocumentSelect = function($files) {

        // The $files parameter is an array which contains all the details of the files selected 
        // 
        // Create array to hold selected files
        $scope.selectedFiles = [];
        // Create an arrray to hold progress information
        $scope.progress = [];
        // Set the uploading status to false
        $scope.uploading = "false";


        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }

        $scope.upload = [];
        $scope.uploadResult = [];

        $scope.selectedFiles = $files;
        //$log.info($scope.selectedFiles);
        $scope.dataUrls = [];

        for (var j = 0; j < $files.length; j++) {
            //$log.info("** FILE **");
            //console.log("Type " + $files[j]['type']);
            //onsole.log("name " + $files[j]['name']);
        }


        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];

            $scope.progress[i] = -1;
            $scope.start(i);


        }


    };
    //-- .click_createProject --//


    $scope.start = function(index) {

        // empId: $scope.items
        // $scope.selectedFiles[index] is the actual file
        //console.log($scope.selectedFiles);
        if ($scope.selectedFiles[index].type == "image/jpeg" || $scope.selectedFiles[index].type == "image/png") {
            $scope.uploading = true;
            $scope.upload = $upload.upload({
                    url: '/admin/php/api_imageUpload.php',
                    data: {
                        fname: $scope.fname
                    },
                    file: $scope.selectedFiles[index],
                    fileFormDataName: 'myFile'
                })
                .progress(function(evt) {
                    //$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    //console.log(evt.loaded);
                    $scope.totalLoad = parseInt($scope.totalLoad + evt.loaded);
                    //$scope.totalLoaded = $scope.totalLoaded + evt.loaded;
                    $scope.selectedFiles[index].progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    console.log(totalLoad);
                })
                .success(function(data, status, headers, config) {
                    // new filename is returned in data
                    console.log("Data back : " + data['filename']);
                    //console.log(status);

                    $scope.uploading = "true";
                    //console.log($scope.selectedFiles[index].progress);
                    $scope.imagePath = data;
                    //console.log(data);

                });
        } else {
            $scope.uploading = false;
            alert("File " + $scope.selectedFiles[index].name + " is not in JPG or PNG format. All image files must be either in a JPG or PNG format, This image will not be uploaded.");
        }
    }



});





/** ------------------------------------------------------
*
       .state('projectInfo',{
         url:'/projectInfo/:projectID',
         templateUrl: 'views/project_info.html',
         controller: 'xpatcloud.ProjectInfoCtrl'

       })
*/
ctrl.controller('xpatcloud.ProjectInfoCtrl', function($scope, $firebase, $stateParams, $location) {

    var key = $stateParams.projectID;



    var projectRef = new Firebase('https://pixelworks-app.firebaseio.com/projects/' + key);
    var project = $firebase(projectRef);
    var projectObject = project.$asObject();

    projectObject.$loaded().then(function() {
        $scope.project = projectObject;
    });



    var storiesRef = new Firebase('https://pixelworks-app.firebaseio.com/projects/' + key + '/stories');
    var stories = $firebase(storiesRef);


    var storiesArray = stories.$asArray();

    storiesArray.$loaded().then(function() {
        $scope.stories = storiesArray;
        // Assign the data from Firebase to the form
        //console.log($scope.stories);
    });



    $scope.addStory = function() {
        console.log("add item : " + key);
        $scope.story = {};
        $scope.story.progDate = Firebase.ServerValue.TIMESTAMP;
        $scope.story.storyDesc = "As a <type of user>. I want <some goal>, so that <some reason>";
        $scope.story.points = 0;
        $scope.story.kanban = "backlog";
        $scope.story.location = "Page or location";


        var progRef = new Firebase('https://pixelworks-app.firebaseio.com/projects/' + key + '/stories');
        var progress = $firebase(progRef);
        progress.$push($scope.story).then(function(ref) {
            console.log(ref.key()); // key for the new ly created record
        }, function(error) {
            console.log("Error:", error);
        });
    };



    $scope.storySave = function(story) {


        var key = $stateParams.projectID;
        console.log(story.$id);



        var storyRef = new Firebase('https://pixelworks-app.firebaseio.com/projects/' + key + '/stories/' + story.$id);
        var storyF = $firebase(storyRef);
        var storyObject = storyF.$asObject();

        $scope.storyfire = storyObject;


        storyObject.$loaded().then(function() {
            $scope.storyfire = storyObject;
            var carer = angular.extend($scope.storyfire, story);
            // Assign the data from Firebase to the form

            // Save data back to Firebase
            carer.$save().then(function(storyRef) {
                storyRef.key() === $scope.storyfire.$id; // true

            }, function(error) {
                console.log("Error:", error);
            });

        });


    };

    $scope.changeStatus = function(story, kanban) {

        story.kanban = kanban;

        var key = $stateParams.projectID;
        console.log(story.$id);

        var storyRef = new Firebase('https://pixelworks-app.firebaseio.com/projects/' + key + '/stories/' + story.$id);
        var storyF = $firebase(storyRef);
        var storyObject = storyF.$asObject();

        $scope.storyfire = storyObject;



        storyObject.$loaded().then(function() {
            $scope.storyfire = storyObject;
            var carer = angular.extend($scope.storyfire, story);

            console.log(carer);
            // Assign the data from Firebase to the form

            // Save data back to Firebase
            carer.$save().then(function(storyRef) {
                storyRef.key() === $scope.storyfire.$id; // true

            }, function(error) {
                console.log("Error:", error);
            });

        });


    };

    $scope.removeStory = function(story) {


        var key = $stateParams.projectID;

        var storyRef = new Firebase('https://pixelworks-app.firebaseio.com/projects/' + key + '/stories/' + story.$id);
        var storyF = $firebase(storyRef);




        // Save data back to Firebase
        storyF.$remove().then(function(storyRef) {
            //remove data
        }, function(error) {
            console.log("Error:", error);
        });




    };


    $scope.autoSave = function() {


        console.log("blur");




    };



});










ctrl.controller('xpatcloud.loginCtrl', function($scope, $http, $firebase, $firebaseAuth) {

    // Link to firebase database
    var ref = new Firebase('https://portfolio1.firebaseio.com');
    $scope.formData = {};

    // Connect to user authentication database
    $scope.authObj = $firebaseAuth(ref);

    console.log("loginCtrl Active");

    $scope.login = function() {
        console.log("login");
        console.log($scope.formData.user_name);
        console.log($scope.formData.password);

        $scope.password = String($scope.formData.password);
        $scope.email = String($scope.formData.user_name);

        //$scope.message="Authenticating login ...";

        // Gain authorisation
        $scope.authObj.$authWithPassword({
            email: String($scope.email),
            password: String($scope.password)
        }).then(function(authData) {
            // success
            console.log("Logged in as:", authData.password.email);
            console.log(authData);
            //$location.path('/crm_home.php');
            window.location = "/admin";

        }).catch(function(error) {
            // failure
            console.error("Authentication failed:", error);
            $scope.message = "Authentication failed";
        });


    }




}); //loginCtrl
