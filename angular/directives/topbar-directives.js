

angular.module('wordpressContent.topbar.directives', [])

.directive('bcTopbar', ['$sce', '$window', '$state', '$rootScope', '$timeout', function($sce, $window, $state, $rootScope, $timeout) {

        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

        return{
            restrict: 'E',
            templateUrl: directives_path+'topbar-template.html',
            link: function(scope, element, attrbs, sidebarCtrl){

                scope.goToMenu = function(){
                    $state.go('blog.menu');
                }

                scope.goToHome = function(){
                    scope.$emit("homeTransitionEvent");
                    $timeout(function(){
                        $state.go('blog.home.index');
                    }, 260);
                }

                scope.openComments = function(){
                    $rootScope.$broadcast("topbarCommentsClickEvent");
                }

                scope.topBar = {};
                scope.topBar.visible = false;

                scope.comments = {};
            scope.comments.visible = false;


            
            scope.$on("loadedCommentsEvent", function(event, commentCount){
                scope.comments.length = commentCount;
            });

                console.log(scope.comments);
                // if($rootScope.smallSideBarActivated || $rootScope.shortArticle){
                //     scope.topBar.visible = true;
                // }
                // else{
                //     scope.topBar.visible = false;
                // }

                angular.element(window).bind('scroll', function(){
                        var scrollPosition = window.pageYOffset;

                        if(scrollPosition >= 150){
                            if(scope.topBar.visible === false){
                                scope.topBar.visible = true;
                                scope.$apply();

                            }
                        }
                        else{
                            if(scope.topBar.visible === true){
                                scope.topBar.visible = false;
                                scope.$apply();
                            }
                        }
                    
                });


                scope.$on("postLoadEvent", function(event, post){
                    scope.post = post;
                });

                var windowElem = angular.element($window)
                var blogTitle = element.find('div').find('div').get(1);
                console.log(blogTitle);
                var windowWidth = $window.innerWidth;
                resizeBlogTitle();
                windowElem.bind('resize', function(){
                    resizeBlogTitle();
                    

                });

                function resizeBlogTitle(){
                    windowWidth = window.innerWidth; 
                    angular.element(blogTitle).css("width", (windowWidth - 160) + 'px');
                }

                scope.comments = {};
                scope.comments.length = 0;
                scope.comments.visible = false;
                scope.commentCount = 0;
                var pagesIcon = angular.element(element[0].querySelector('.fi-page-multiple'));
                var commentIcon = angular.element(element[0].querySelector('#comment-icon-wrapper'));

                
                
            }

        }
    }])

.directive('bcTopbarHome', ['$sce', '$window', '$state', '$location', '$timeout', function($sce, $window, $state, $location, $timeout) {

        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

        return{
            restrict: 'E',
            templateUrl: directives_path+'topbar-home.html',
            link: function(scope, element, attrbs, sidebarCtrl){

                scope.goToMenu = function(){
                    $state.go('blog.menu');
                }

                scope.goToHome = function(){
                    scope.$emit("homeScrollDownEvent");
                    $state.go('blog.home.index');
                }

                scope.toggleMobilePageList = function(){
                    scope.mobilePageList.visible = !scope.mobilePageList.visible;
                }

                scope.goToPage = function(slug){
                    scope.$emit("homeScrollDownEvent");
                    $state.go("blog.home.page", {pageSlug: slug});
                }

                scope.directivesPath = directives_path;


                scope.comments = {};
                scope.comments.length = 0;
                scope.comments.visible = false;
                scope.commentCount = 0;
                scope.mobilePageList = {};
                scope.mobilePageList.visible = false;
                var pagesIcon = angular.element(element[0].querySelector('.fi-page-multiple'));
                var commentIcon = angular.element(element[0].querySelector('#comment-icon-wrapper'));

                $timeout(function() {
                  //  element.find('div').addClass('visible');
                }, 1);
               element.find('div').addClass('visible');
                
            }

        }
    }
    ]);