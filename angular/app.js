


(function(){
	var app = angular.module('wordpressContent', ['ngTouch', 'ngAnimate', 'ngCookies', 'ngSanitize', 'ui.router', 'wordpressContent.post.service', 
        'wordpressContent.utilities.service', 'wordpressContent.comment.service', 'wordpressContent.comment.directives',
        'wordpressContent.post.directives', 'wordpressContent.postMenu.directives', 'wordpressContent.topbar.directives', 'wordpressContent.asides.directives']);

//O6Dl8a0m6dPn


console.log("here");
//todo


var partials_path = red_eye_theme_path.theme_path+'/angular/partials/';
    var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';


app.run(
  [          '$rootScope', '$state', '$stateParams', '$http', '$templateCache',
    function ($rootScope,   $state,   $stateParams, $http, $templateCache) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ui-sref-active="active }"> will set the <li> // to active whenever
    // 'contacts.list' or one of its decendents is active.
   

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.primaryColor = "#990000";
    $rootScope.smallSideBarActivated = false;

    


$http.get(partials_path+'home.html', { cache: $templateCache });
$http.get(partials_path+'home-index.html', { cache: $templateCache });

$http.get(partials_path+'blog.html', { cache: $templateCache });
$http.get(partials_path+'blog-404.html', { cache: $templateCache });
$http.get(partials_path+'blog-article.html', { cache: $templateCache });
$http.get(partials_path+'blog-page.html', { cache: $templateCache });
$http.get(directives_path+'topbar-template.html', { cache: $templateCache });
$http.get(directives_path+'topbar-home.html', { cache: $templateCache });

$http.get(directives_path+'post-template.html', { cache: $templateCache });
$http.get(directives_path+'post-menu-small.html', { cache: $templateCache });
$http.get(directives_path+'aside-sidebar-template.html', { cache: $templateCache });




    }
  ]
);


	
  
	app.config(['$urlMatcherFactoryProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider', '$anchorScrollProvider', function($urlMatcherFactoryProvider, $stateProvider, $locationProvider, $urlRouterProvider, $anchorScrollProvider) {
 
		// get those URLs nice and pretty
		$locationProvider.html5Mode(true);

$urlMatcherFactoryProvider.strictMode(false); //TODO: check for newer version of uirouter



		//prevent trailing slashes from breaking routing
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.url();

            // check to see if the path has a trailing slash
            if ('/' === path[path.length - 1]) {
                return path.replace(/\/$/, '');
            }

            if (path.indexOf('/?') > 0) {
                return path.replace('/?', '?');
            }

            return false;
       });

    $stateProvider.state('customizer', {
      url: '/wp-admin/:param',
      controller: ['$state',
        function($state){
          $state.go('blog.home.index');
        }]
    })

		$stateProvider.state('blog', {
			
			templateUrl: partials_path+'site.html',
     //url: '/:slug',
      abstract: true,
			resolve: {
	            posts: ['posts',
	              function(posts){
	                return posts.all();
	              }],
              siteInfo: ['siteData',
                function(siteData){
                  return siteData.getSiteInfo();
                }],
              pages: ['siteData',
              function(siteData){
                return siteData.getPages();
              }],
              categories: ['siteData',
                function(siteData){
                  return siteData.getCategories();
                }]
              // user: ['siteData',
              // function(siteData){
              //   return siteData.getUser();
              // }],
	          },

	          controller: ['$scope', '$state', 'posts', 'categories', 'siteInfo', 'pages', 'utilities', '$window', '$rootScope', '$filter', '$templateCache', 
	            function (  $scope,   $state, posts, categories, siteInfo, pages,  utilities, $window, $rootScope, $filter, $templateCache) {
	            var current_path = window.location.pathname.slice();
  current_path = current_path.slice(1, current_path.length);

              $scope.posts = posts;
              console.log('categories!!');
              console.log($scope.categories);
              var usedCategories = [];
              // $scope.user = user;





              for(var i=0; i<$scope.posts.length; i++){
                var post = $scope.posts[i];
                post.indexID = i;
                post.readingTime = getReadingTime(post);
                post.categoriesString = getCategoriesString(post);
                
                //console.log(post);
                $scope.posts[i] = post;
              }

              $scope.categories = usedCategories;
              console.log($scope.categories);

              function getCategoriesString(post){
                var categoryData = post.category_data;
                var categoryString = "";
                for(var i=0; i<categoryData.length; i++){
                  if(!alreadyRegistered(categoryData[i])){
                    usedCategories.push(categoryData[i]);
                  }

                  if(i !== categoryData.length-1){
                    categoryString = categoryString + categoryData[i].name + ", ";
                  }
                  else{
                    categoryString = categoryString + categoryData[i].name;
                  }
                }
                return categoryString;

                function alreadyRegistered(category){
                  for(var i=0; i<usedCategories.length; i++){
                    if(category.cat_ID === usedCategories[i].cat_ID){
                     return true;
                    }
                  }
                  return false;
                }
              }
             

              function getReadingTime(post){
                var words = post.content.rendered.length / 5;
                var minutesOfReadingTime = words/300;

                if(minutesOfReadingTime <= 1.5){
                  return "1 minute";
                }
                else{
                  return Math.round(minutesOfReadingTime).toString() + " minutes";
                }
              }


        

              console.log(posts);


               $scope.siteInfo = siteInfo;

               $rootScope.siteTitle = $scope.siteInfo.name;
               console.log($scope.siteInfo);

               if(window.parent.document.getElementById( 'customize-preview' )){

                 wp.customize( 'blogname', function( value ) {
                      value.bind(function(newval){
                        console.log('blog name changed');
                        $rootScope.siteTitle = newval;
                        $rootScope.$apply();
                      }); 
                 });
               }

               

             $scope.pages = pages;


              console.log($scope.pages);
    			

          		$scope.pageWidthCategory = 0;
                $scope.pageWidth = 0;

                $scope.smallPostMenu = {};
                $scope.largePostMenu = {};

              	var windowWidth = $window.innerWidth;
              	var windowElem = angular.element($window)
                setpageWidthCategory();
               // setCorrectSidebar(true);

                windowElem.bind('resize', function(){
                	windowWidth = $window.innerWidth;
                	setpageWidthCategory();
                	utilities.notifyPageWidthChange();
                   // setCorrectSidebar(false);
    			});

                if($scope.pageWidthCategory === 1){
                    $scope.smallPostMenu.visible = false;
                    $scope.largePostMenu.visible = true;
               }
               else{
                    $scope.smallPostMenu.visible = true;
                    $scope.largePostMenu.visible = false;
               }


             

          


    			function setpageWidthCategory(){
    			
    				$scope.pageWidth = windowWidth;
                    var initialCategory = $scope.pageWidthCategory; 
                
    		
    				  if(windowWidth >= 801){
                       
	                	$scope.pageWidthCategory = 3 //large/desktop
	                }
	               
	                else{
	                	$scope.pageWidthCategory = 1; //small/phone
	                }

                    if($scope.pageWidthCategory !== initialCategory){
                        utilities.notifyPageWidthCategoryChange();
                    }
                    
    			}

	            }]

		})

		.state('blog.home', {
			//url: '',
      abstract: true,
			templateUrl: partials_path+'home.html',
	        controller: ['$scope', '$state', 'utilities', '$window', '$rootScope', '$templateCache', '$timeout',
        	 function ($scope, $state, utilities, $window, $rootScope, $templateCache, $timeout) {
               $scope.post = utilities.findBySlug($scope.posts, utilities.getLatestSlug($scope.posts));

                $scope.smallPostMenu.visible = false;
                $scope.largePostMenu.visible = true;

                $rootScope.resourceTitle = "";
                $rootScope.smallSideBarActivated = false;
                $scope.fireHomepageFadeIn = false;

                $scope.fireHomepageScrollDown = false;

                var subPageAnimationWrapper = angular.element("#sub-page-animation-wrapper");


                $scope.$on("pageWidthChangeEvent", function(){
                  getSubPageWrapperSize();
                });

                function getSubPageWrapperSize(){
                  var topBarHome = angular.element("#top-bar-home");

                  console.log(topBarHome);
                  var windowHeight = window.innerHeight;
                  var topBarHeight = topBarHome.height();
                  var animationHeight = (windowHeight - topBarHeight) * 4;
                  var animationTopPosition = (-animationHeight / 2) + topBarHeight;

                  subPageAnimationWrapper.css("height", animationHeight);
                  subPageAnimationWrapper.css("top", animationTopPosition);

                }

                  

                $timeout(function(){
                  $timeout(function(){
                    $scope.fireHomepageFadeIn = true;

                    $scope.$apply();
                      $scope.$broadcast("scrollDownAnimationEvent");

                  },0);
                },0);

                $scope.$on("postTransitionEvent", function(){
                  $scope.fireHomepageFadeIn = false;
                });

                $scope.animationInProgress = false;

                var latestTimeout = undefined;

                $scope.$on("homeScrollDownEvent", function(){

                  getSubPageWrapperSize();
                  
                  $timeout(function(){
                  $timeout(function(){

                

                    $scope.animationInProgress = true;

                    console.log(latestTimeout);

                    if(latestTimeout != undefined){
                      console.log('canceling..');
                       $timeout.cancel(latestTimeout);
                    }


                    if($scope.fireHomepageScrollDown === true){
                      $scope.fireHomepageScrollDown = false;
                      $scope.$apply();
                    }

                    $timeout(function(){
                      $scope.fireHomepageScrollDown = true;                 
                      $scope.$apply();
                      $scope.$broadcast("scrollDownAnimationEvent");
                      console.log('scroll down fired');
                    }, 20);

                    var reset = $timeout(function(){
                      $scope.animationInProgress = false;
                      $scope.$apply();
                    }, 2000);

                    latestTimeout = reset;



                     $timeout(function(){
                        if(!$scope.animationInProgress){
                          $scope.fireHomepageScrollDown = false;
                        }
                    }, 2010);
                    
                  

                  },0);
                },0);

                });

            
                







                $scope.goToPage = function(pageSlug){

                  $timeout(function(){
                  $timeout(function(){

                    

                    $scope.fireHomepageScrollDown = true;                 
                    $scope.$apply();
                    
                  },0);
                },0);
                  $state.go("blog.home.page", {pageSlug: pageSlug});
                }

                

                window.scrollTo(0,0);
            }]
        })


    .state('blog.home.index',{
      url: '',
      templateUrl: partials_path + 'home-index.html',
      controller: ['$scope', '$templateCache', function($scope, $templateCache){
               resetActivePages();
               preLoadTemplates();


        function resetActivePages(){
                      for(var i=0; i<$scope.pages.length; i++){

                        $scope.pages[i].active = false;
                      }
                  }

            function preLoadTemplates(){
                  $templateCache.put(partials_path+'blog-article.html');
                  $templateCache.put(partials_path+'blog.html');
                  $templateCache.put(partials_path+'home-index.html');
                  $templateCache.put(partials_path+'blog-page.html');
                  $templateCache.put(directives_path+'post-template.html');
                  $templateCache.put(directives_path+'post-menu-small.html');
                  $templateCache.put(directives_path+'topbar-template.html');
            }

      }]
    })

    

    .state('blog.resource', {
    //  abstract: true,
     // url: '/:resourceSlug',
      controller: ['$scope', 'utilities', '$state', '$stateParams', '$rootScope', '$timeout',
          function($scope, utilities, $state, $stateParams, $rootScope, $timeout) {

              var current_path = window.location.pathname.slice();
              current_path = current_path.slice(1, current_path.length);
              console.log('RESOURCE STATE');
              console.log(current_path);


             if(postResource(current_path)){

              
                $state.go('blog.posts.post', {postSlug: $stateParams.resourceSlug});
            
            }
            else if(pageResource(current_path)){
              $state.transitionTo('blog.resource.page');;
            }
            else if(current_path === "wp-admin"){
              //we're probably in customizer
              $state.go('blog.home');
            }
            else{
              $state.go('blog.404');
            }


          function postResource(path){
              $scope.post = utilities.findBySlug($scope.posts, current_path);
              console.log($scope.post);
              if($scope.post !== null){
                return true;
              }
              else{
                return false;
              }
            }

            function pageResource(path){
              console.log(current_path);
              console.log($scope.pages);
              console.log($scope.page);
                              $scope.page = utilities.findBySlug($scope.pages, current_path);

              if($scope.page !== null){ 
                return true;
              }
              
              else{
                return false;
              }
            }
          }]
    })

    .state('blog.home.page', {
      templateUrl: partials_path+'blog-page.html',
      url: '/:pageSlug',
      //params: {pageData: true},
      controller: ['$scope', '$stateParams', 'utilities', '$rootScope', '$timeout',
                  function($scope, $stateParams, utilities, $rootScope, $timeout){
                    console.log('PAGE HERE');
                    $scope.page = utilities.findBySlug($scope.pages, $stateParams.pageSlug);
                    resetActivePages();

                    $scope.page.active = true;

                    $rootScope.resourceTitle = " | " + $scope.page.title.rendered;
                    $rootScope.smallSideBarActivated = false;

                     var page = angular.element("#page-content");
                     $timeout(function(){
                      page.addClass('visible');
                    }, 100);

                    function resetActivePages(){
                      for(var i=0; i<$scope.pages.length; i++){
                        $scope.pages[i].active = false;
                      }
                    }

                   console.log($scope.pages);


                  }]
    })

    .state('blog.404', {
      templateUrl: partials_path+'blog-404.html',
      controller: ['$scope', '$stateParams', 'utilities', '$rootScope',
                  function($scope, $stateParams, utilities, $rootScope){
                      $rootScope.resourceTitle = "Page Not Found";
                      $rootScope.smallSideBarActivated = false;

                  }]
    })        

		.state('blog.posts', {
		//	url: '',
      abstract: true,
			templateUrl: partials_path+'blog.html',
			
			controller: ['$scope', '$stateParams', 'utilities', '$window', '$rootScope', '$timeout',
                function ($scope,   $stateParams, utilities, $window, $rootScope, $timeout) {
                 
                    console.log('ABSTRACT POST');
                    displayCorrectMenu(false);
              console.log("ANIMATION STYLE ||" + $scope.animationStyle);
                   

                   $scope.$on('pageWidthCategoryChange', function(){
                        console.log('change');
                        displayCorrectMenu(true);
                   });

                    $scope.$on("activePostChangeEvent", function(event, activePostId){
                      console.log("ACTIVE POST CHANGE");
                      console.log(activePostId);
                      $scope.posts.active = -1;
                      $timeout(function(){
                         $scope.posts.active = activePostId;

                      }, 500);
                      console.log($scope.posts.active);
                    });

                    $scope.firePostFadeIn = false;
                    $scope.firePostScrollDown = false;


                    $scope.$on("postAnimationEvent", function(event, param){
                      $scope.animationStyle = param;

                       if($scope.animationStyle === "scrollDown"){
                        $scope.firePostScrollDown = true;
                        $scope.firePostFadeIn = false;
                      }

                      if($scope.animationStyle === "fadeIn"){
                        $timeout(function(){
                          $timeout(function(){
                            $scope.firePostFadeIn = true;
                            $scope.firePostScrollDown = false;
                            $scope.$apply();
                          }, 0);
                        }, 0);
                      }
                    });
                     

                    $scope.$on("homeTransitionEvent", function(){

                      

                      if($scope.firePostFadeIn === true){

                        $timeout(function(){
                            $timeout(function(){
                              $scope.firePostFadeIn = false;
                              $scope.$apply();
                            }, 0);
                          }, 0);  

                        }

                      else if($scope.firePostFadeIn === false){

                        $timeout(function(){
                            $timeout(function(){
                              $scope.firePostFadeIn = true;
                              $scope.firePostScrollDown = false;
                              $scope.$apply();
                              console.log($scope.firePostFadeIn + "||" + $scope.firePostScrollDown);

                            }, 0);
                          }, 0);

                        $timeout(function(){
                            $timeout(function(){
                              $scope.firePostFadeIn = false;
                              $scope.$apply();
                              console.log($scope.firePostFadeIn);
                            }, 10);
                          }, 0); 

                        }
                      
                    });


                    function displayCorrectMenu(apply){
                   
                        if($scope.pageWidthCategory === 1){
                            $scope.smallPostMenu.visible = false;
                            $scope.largePostMenu.visible = false;
                       }
                       else{
                            $scope.smallPostMenu.visible = true;
                            $scope.largePostMenu.visible = false;
                       }

                       if(apply){
                          $scope.$apply();
                        }
                   }

                  

              }]
		})


   .state('blog.posts.post', {
      url: '/blog/:postSlug',
      templateUrl: partials_path+'blog-article.html',
     params: {animationStyle: "fadeIn"},
      
      controller: ['$scope', '$stateParams', 'utilities', '$window', '$rootScope',
                function ($scope,   $stateParams, utilities, $window, $rootScope) {

                  console.log('post state here');
                //  $stateParams
              $scope.post = utilities.findBySlug($scope.posts, $stateParams.postSlug);
              $scope.animationStyle = "fadeIn";
              $scope.animationStyle = $stateParams.animationStyle;

              $scope.$emit("postAnimationEvent", $scope.animationStyle);

                  //$scope.post = $stateParams.postData;
                   // $scope.post = utilities.findBySlug($scope.posts, current_path);

                   $rootScope.resourceTitle = " | " + $scope.post.title.rendered;
                  // $scope.post = $stateParams.postData;
                  //  // $scope.post = utilities.findBySlug($scope.posts, current_path);

                  //  $rootScope.resourceTitle = " | " + $scope.post.title.rendered;

                  $scope.$emit("activePostChangeEvent", $scope.post.id);

                  //   displayCorrectMenu(false);
                  //   setThisPostToActive();

                  //  $scope.$on('pageWidthCategoryChange', function(){
                  //       console.log('change');
                  //       displayCorrectMenu(true);
                  //  });

                  //   function displayCorrectMenu(apply){
                   
                  //       if($scope.pageWidthCategory === 1){
                  //           $scope.smallPostMenu.visible = false;
                  //           $scope.largePostMenu.visible = false;
                  //      }
                  //      else{
                  //           $scope.smallPostMenu.visible = true;
                  //           $scope.largePostMenu.visible = false;
                  //      }

                  //      if(apply){
                  //         $scope.$apply();
                  //       }
                  //  }

                  //  function setThisPostToActive(){
                  //     $scope.posts.active = $scope.post.id;
                  //     console.log($scope.posts.active);
                  //  }

              }]
    });
    //$urlRouterProvider.otherwise('');

	}]);

})();