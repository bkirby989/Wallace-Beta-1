angular.module('wordpressContent.postMenu.directives', [])

.directive('bcPostMenuLarge', ['$sce', '$timeout', '$location', '$state', function($sce, $timeout, $location, $state) {

        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

        return{
            restrict: 'E',
            templateUrl: directives_path+'post-menu-large.html',
            controller:  ['$scope', function ($scope) {
                $scope.menu = {};
                $scope.menu.showSearch = true;
                

            }],
            link: function(scope, elem, attrbs){
                var selectedCategory = -1;
                scope.selectedCategory = "";
                scope.listVisible = false;

                updateSelectedCategoryName();

                scope.goToPost = function(postSlug, $event){
                    fireRippleEffect($event);
                    scope.$emit("postTransitionEvent");
                    $timeout(function(){
                        $state.go('blog.posts.post',{postSlug: postSlug, animationStyle:"fadeIn"});
                    }, 500);
                }

                function fireRippleEffect(e){
                   var box = angular.element(e.currentTarget);


                    var clickX = e.pageX - box.offset().left;
                    var clickY = e.pageY - box.offset().top;
                   
                  var setX = parseInt(clickX);
                  var setY = parseInt(clickY);

                  box.find("svg").remove();
                  box.append('<svg><circle cx="'+setX+'" cy="'+setY+'" r="'+0+'"></circle></svg>');
                   
                 
                  var c = box.find("circle");
                  c.animate(
                    {
                      "r" : box.outerWidth(),

                    },
                    {
                      easing: "linear",
                      duration: 500,
                        step : function(val){
                                c.attr("r", val);
                               // c.attr("o", val/500);
                            },

                    }
                  );
                }

                var headerNav = elem.find('div').find('div').find('div');
                var headerContent = headerNav.find('div');
                var narrowCategoryList = headerContent.find('div');
                var postList = elem.find('div').find('div');
                var scrollPosition = document.body.scrollTop;
                var wideCategoryList = {};
                var lockPosition = 0;
                var wideCategoryListHeight = 0;

                // $timeout(function(){
                //         $timeout(function(){
                //     elem.find('div').addClass('visible');
                //     console.log("class go");
                //         }, 0);
                //     }, 0);

                scope.$on("scrollDownAnimationEvent", function(){
                    $timeout(function(){
                        $timeout(function(){
                            var menu = elem.find('div');
                            if(!menu.hasClass('active')){
                                menu.addClass('visible');
                            }
                        }, 0);
                    }, 0);
                });

                $timeout(function(){
                    var menu = elem.find('div');
                            if(!menu.hasClass('active')){
                                menu.addClass('visible');
                            }
                        }, 500);


                //dumb hack to make sure the DOM is loaded and populated so we can get position coords accurately

                $timeout(function () {
                    $timeout(function () {



                for(var i=0; i < elem.find('ul').length; i++){
                    var list = angular.element(elem.find('ul')[i]);
                    if (list.hasClass('wide-category-list')){
                        wideCategoryList = list;
                        wideCategoryListHeight = list.height();
                    }
                }

                if(wideCategoryListHeight > 25){
                    wideCategoryList.css("display", "none");
                    narrowCategoryList.css("display", "inline");
                }

             
             
                 
                setLockPosition();

               
                    }, 0);
                }, 0);

        scope.$on('pageWidthChangeEvent', function(){
             setLockPosition();
             testForLockPosition();
            });

        function setLockPosition(){
            headerNav.removeClass("locked");
            postList.css("padding-top", "initial");

             lockPosition = headerNav.offset().top;

             angular.element(window).bind('scroll', function(){
                   testForLockPosition();

                 });

             
        }
      
            function testForLockPosition(){
                 scrollPosition = window.pageYOffset;
                    if (scrollPosition >= lockPosition){
                        headerNav.addClass('locked');
                        postList.css("padding-top", "44px");
                    }
                    else{
                        postList.css("padding-top", "initial");
                        headerNav.removeClass("locked");

                    }
                 }
                function updateSelectedCategoryName(){
                    var id = selectedCategory;
                    if (id === -1){
                        scope.selectedCategory = "All Posts";
                        return;
                    }
                    else{
                        var categories = scope.categories;
                        for(var i=0; i<categories.length; i++){
                            if(categories[i].cat_ID === selectedCategory){
                                scope.selectedCategory = categories[i].name;
                                return;
                            }
                        }
                        // scope.selectedCategory = scope.categories[id];
                        // console.log(scope.categories);
                    }
                }


                scope.selectCategory = function(id){
                    if(scrollPosition >= lockPosition){
                        window.scrollTo(0, lockPosition);
                    }
                    selectedCategory = id;
                    updateSelectedCategoryName();
                    scope.listVisible = false;
                }

                scope.postHasCurrentCategory = function(categories){
                    if(selectedCategory === -1){
                        return true;
                    }

                    for(var i=0; i<categories.length; i++){
                        if(categories[i].cat_ID === selectedCategory){
                            return true;
                        }
                    }
                    return false;
                }

                scope.isActiveClass = function(id){
                    if(selectedCategory === id){
                        return true;
                    }
                    else{
                        return false;
                    }
                }

                                    
                    var searchBox = elem.find('input');


                scope.showSearch = function(){
                   
                    scope.menu.showSearch = true;
                    //have to give search box time to render before we can focus on it
                    $timeout(function(){
                        searchBox[0].focus();
                    }, 0);
                }

                // searchBox.keyup(function(event){
                //     executeSearch(searchBox[0].value);
                // });

                // function executeSearch(input){

                // }

                scope.search = '';
                var regex;
                scope.$watch('search', function (value) {
                    regex = new RegExp('\\b' + escapeRegExp(value), 'i');
                });

                
                scope.filterBySearch = function(post) {
                    if(scrollPosition >= 250 && scope.search){
                         window.scrollTo(0, lockPosition);
                    }

                    if (!scope.search) return true;
                    return regex.test(post.title.rendered);
                    
                };
            

               function escapeRegExp(string){
                    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                }
                

            }

        }
    }])


    .directive('bcPostMenuSmall', ['utilities', '$rootScope', '$location', '$state', '$timeout', function(utilities, $rootScope, $location, $state, $timeout) {
        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

        return{
            restrict: 'E',
           // require: ['^bcPostAndMenu','bcPostMenuSmall'],
            templateUrl: directives_path+'post-menu-small.html',
            controller: ['$scope', function ($scope) {
                $scope.leftPosition = 0;
                $scope.selectedCategory = "All Posts";
                $scope.selectedCategoryId = -1;
                $scope.showCategoryList = false;
                $scope.smallMenuToggle = true;

                //$scope.postAndMenu.menu.toggle = false;
                // if($scope.pageWidthCategory !== 1){
                //     $scope.postAndMenu.menu.toggle = false;
                // }
                // else{
                // }

                this.moveMenu = function(leftPosition){

                    $scope.leftPosition = leftPosition;
                }

                

                
            }],
            link: function(scope, element, attrbs, ctrl){


              //  var postAndMenuCtrl = ctrls[0];
                var thisCtrl = ctrl;

                var moveableContainer = angular.element(element.find('div')[0]);
               // console.log(scope.postAndMenu.post.scroll);

                moveableContainer.addClass('block-transition');

                scope.$on('menuPositionRequest', function(){
                  
                    $rootScope.$broadcast("menuPositionRequestResponse", scope.smallMenuToggle);
                });
                    

                // if($rootScope.smallSideBarActivated){
                //     scope.postAndMenu.menu.toggle = true;
                    
                // }
                // else{
                //     scope.postAndMenu.menu.toggle = false;
                // }

             //   thisCtrl.moveMenu(-200);
               // moveMenu();
               scope.selectCategory = function(category){
                if (category === -1){
                    scope.selectedCategoryId = -1;
                    scope.selectedCategory = "All Categories";
                }
                else{
                    scope.selectedCategoryId = category.term_id;
                    scope.selectedCategory = category.name;
                }

                scope.showCategoryList = false;
               }

               scope.postHasCurrentCategory = function(categories){
                    if(scope.selectedCategoryId === -1){
                        return true;
                    }

                    for(var i=0; i<categories.length; i++){
                        if(categories[i].cat_ID === scope.selectedCategoryId){
                            return true;
                        }
                    }
                    return false;
                }


               scope.goToPost = function(postSlug, $event){
                    //$rootScope.$broadcast('postChangeEvent', postSlug);
                    // console.log(postSlug);
                  //  var current_path = current_path.slice(1, current_path.length);
                   // $rootScope.$broadcast("reloadPostEvent", postSlug)
                 //  window.history.pushState(null, null, postSlug);
                
                   // console.log($state.current);
                  // var targetDiv = angular.element($event.currentTarget);

                   // targetDiv.css('background-color', 'none !important');



                fireRippleEffect($event);
                $timeout(function(){
                    var svg = angular.element($event.currentTarget).find('svg');
                    //svg.addClass('fade-out');
                    svg.remove();

                }, 500);

                $state.go('blog.posts.post',{postSlug: postSlug, animationStyle:"scrollDown"});

                $timeout(function(){

                   $rootScope.$broadcast('smallMenuToggleEvent', scope.smallMenuToggle);
                }, 0);
                   // $location.search({postSlug: postSlug});
                }

                scope.$on('footerMenuToggleEvent', function(){
                    scope.toggleSidebar();
                });


                  function fireRippleEffect(e){
                   var box = angular.element(e.currentTarget);


                    var clickX = e.pageX - box.offset().left;
                    var clickY = e.pageY - box.offset().top;
                   
                  var setX = parseInt(clickX);
                  var setY = parseInt(clickY);

                  box.find("svg").remove();
                  box.append('<svg><circle cx="'+setX+'" cy="'+setY+'" r="'+0+'"></circle></svg>');
                   
                 
                  var c = box.find("circle");
                  c.animate(
                    {
                      "r" : box.outerWidth(),

                    },
                    {
                      easing: "linear",
                      duration: 500,
                        step : function(val){
                                c.attr("r", val);
                               // c.attr("o", val/500);
                            },

                    }
                  );
                }

                // scope.$watch('postAndMenu.menu.toggle', function(){

                //     if(scope.postAndMenu.menu.userActivated){
                //         if(moveableContainer.hasClass('block-transition')){
                //             moveableContainer.removeClass('block-transition');
                //         }
                //     }

                //     var toggle = scope.postAndMenu.menu.toggle;
                //     console.log(toggle);
                //     if(toggle){
                //         thisCtrl.moveMenu(0);
                //         moveMenu();
                //     }
                //     else{
                //         console.log('fire');
                //         thisCtrl.moveMenu(-200);
                //         moveMenu();
                //     }
                // });

                // scope.$watch('postAndMenu.post.scroll', function(){
                //     console.log('see you');
                //     var scrollPosition = scope.postAndMenu.post.scroll;

                //     if(scrollPosition >= 100){
                //         thisCtrl.moveMenu(-200);
                //      //   postAndMenuCtrl.updateMenuToggle(false, false);
                //     }
                //     else if(scrollPosition === 0){
                //         thisCtrl.moveMenu(0);
                //       //  postAndMenuCtrl.updateMenuToggle(true, false);
                //      }
                //      else{   
                //      thisCtrl.moveMenu(-scope.postAndMenu.post.scroll*2);
                //     }
                //      moveMenu();
                //  });


               scope.toggleSidebar = function(){



                    if(moveableContainer.hasClass('block-transition')){
                        moveableContainer.removeClass('block-transition');
                    }

                    $rootScope.smallSideBarActivated = true;

                    var toggle = scope.smallMenuToggle;
                  //  postAndMenuCtrl.updateMenuToggle(!toggle, true);
                  //  console.log(scope.postAndMenu.post.scroll);
                    if(toggle){
                        //thisCtrl.moveMenu(0);
                        thisCtrl.moveMenu(200);

                    }
                    else{
                       // thisCtrl.moveMenu(-200);
                        thisCtrl.moveMenu(0);

                    }

                    scope.userActivated = true;

                   moveMenu();

                   scope.smallMenuToggle = !toggle;
                   $rootScope.$broadcast('smallMenuToggleEvent', scope.smallMenuToggle);
                    scope.showCategoryList = false;
               }

               function moveMenu(pos){
                    //moveableContainer.css('left', scope.leftPosition, + 'px');
                    moveableContainer.css('transform', 'translateX('+scope.leftPosition + 'px)');
                    
               }

               
               
            }
        }

    }]);