
 angular.module('wordpressContent.post.directives', [])

.directive('bcPost', ['$window',  '$state', 'utilities', '$location', '$rootScope', '$timeout', function($window, $state, utilities, $location, $rootScope, $timeout){

        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

	return{
		restrict: 'EA',
		templateUrl: directives_path+'post-template.html',
		controller: ['$scope', '$sce', function($scope, $sce){
            // $scope.post.safeContent = $sce.trustAsHtml($scope.post.content);

            // $scope.$watch('post.content', function(){
            // 	$scope.post.safeContent = $sce.trustAsHtml($scope.post.content);
            // 	console.log('fire');
            // });
            this.updateSafeContent = function(safeContent){
            	//$scope.post.safeContent = $sce.trustAsHtml(safeContent);
            }

            this.expandSidebar = function(){
            }

            

		}],
		link: function(scope, element, attrs, ctrl){

			scope.comments = {};
			scope.comments.visible = false;
			scope.post.activeMenu = false;
			scope.post.socialSharingVisible = false;

			//var pageWidth = scope.pageWidth;
			var pageWidthCategory = scope.pageWidthCategory;
			var articleContent = angular.element(element.children()[0]);
			var articleBody = angular.element(articleContent.find('div')[0]);


			var leftSideBar = angular.element(element.parent().parent().parent().find('bc-post-menu-small').find('div')[0]);
			var leftBarZipper = angular.element(leftSideBar.find('div')[1]);
			var rightBar = angular.element(element.find('bc-aside-sidebar'));

			var animationWrapper = angular.element(element.children()[5]);
			var windowElem = angular.element($window);

			var accelerationFactor = 0;
        	var destinationMargin = {};
        	var currentLeftMargin = 0;

        	var scrollPosition = window.pageYOffset;
        	var hasAsides = true;
        	var activeMenu = false;



        	scope.$on("menuPositionRequestResponse", function(event, param){

        		
        		activeMenu = !param;
				moveArticleContent(activeMenu);

        	});

        	$rootScope.$broadcast("menuPositionRequest");




        	

        	scope.$on("noAsidesEvent", function(){
				hasAsides = false;
				if(!activeMenu && pageWidthCategory !== 1){
        			//articleContent.css('margin-left', 0);
        			articleBody.css('transform', 'translateX(0px)');
        			var notesLabelBuffer = angular.element("#notes-label-bufffer");
        			notesLabelBuffer.css("opacity", 0);

				}
			});

			scope.$on("reloadPostEvent", function(event, param){
				$state.go($state.current, {postSlug: param});

			})

			checkForMobileWidth(true);

			
			

        	//element.find('div').addClass('visible');

        	$timeout(function(){
        		$timeout(function(){
        			articleContent.addClass('block-transition');
			articleContent.addClass('visible');
        			
        			if(scope.animationStyle === "scrollDown"){
	        			animationWrapper.addClass('active');
        			}
        		},0);
        	},0);

        	 $timeout(function () {
        	 		animationWrapper.css('display', 'none');
	 		}, 1000);

        	 if(scope.animationStyle === "fadeIn"){
    	 		animationWrapper.css('display', 'none');
    	 		
			}

			var articleHeight = angular.element(element.find('article')).height();
			var windowHeight = window.innerHeight;
 			if(articleHeight < windowHeight){
 				$rootScope.shortArticle = true;
 				//ctrl.toggleMenuButton(true);
 			}
 			else{
 				$rootScope.shortArticle = false;
 			}
        	//angular.element(element.find('div')[0]).scrollTop(0);

        	// scope.$on('postChangeEvent', function(args){
        	// 	var slug = args[0];
        		
        	// });

			$rootScope.$broadcast("postLoadEvent", scope.post);

        	scope.toggleSideBar = function(){
        		$rootScope.$broadcast('footerMenuToggleEvent');
        	}

        	scope.hasNotes = function(){
        	}

        	scope.$on('topbarCommentsClickEvent', function(){
        		scope.openComments();
        	});

			scope.openComments = function(){
				scope.$emit('openCommentsEvent');
				scope.comments.visible = !scope.comments.visible;
			}

			scope.nextArticle = function(){
				var indexID = scope.post.indexID;
				var nextPost = scope.posts[indexID+1];
				if (nextPost !== null){
					$location.path(nextPost.slug);

				}

			}

			

			scope.showSocialSharingOptions = function(){
				scope.post.socialSharingVisible = !scope.post.socialSharingVisible;
			}

			scope.socialShare = function(platform){

					var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
					var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

					var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
					var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

					var left = ((width / 2) - (580 / 2)) + dualScreenLeft;
					var top = ((height / 3) - (470 / 3)) + dualScreenTop;

					var url = window.location;

				if(platform === "facebook"){
					var pop = window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, 'title', 'width=580, height=470, top=' + top + ', left=' + left);
					pop.focus();

				}

				else if(platform === "twitter"){
					var pop = window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(url), 'title', 'width=550, height=420, top=' + top + ', left=' + left);
					pop.focus();
				}

				else if(platform === "linkedin"){
					var pop = window.open('https://linkedin.com/shareArticle?url=' + encodeURIComponent(url) + '&mini=true', 'title', 'width=550, height=420, top=' + top + ', left=' + left);
					pop.focus();
				}

				else if(platform === "googleplus"){
					var pop = window.open('https://plus.google.com/share?url=' + encodeURIComponent(url), 'title', 'width=550, height=420, top=' + top + ', left=' + left);
					pop.focus();
				}
			}

			
			scope.$watch('postAndMenu.menu.toggle', function(){
				//activeMenu = scope.postAndMenu.menu.toggle;
				//moveArticleContent(activeMenu);
				//checkForMobileWidth(false);
				//scope.post.activeMenu = activeMenu;

			});

			// scope.$watch('postAndMenu.menu.userActivated', function(){
			// 	if(scope.postAndMenu.menu.userActivated){
			// 		articleContent.css('padding-top', 76 + "px");
			// 		rightBar.css('margin-top', 0);

			// 		if(scrollPosition>=0 && scrollPosition<100){
			// 			window.scrollTo(0, 0);
			// 		}
			// 		else if(scrollPosition>=100){
			// 			window.scrollTo(0, scrollPosition-100);
			// 		} 
			// 	}
			// });

			scope.$on('pageWidthChangeEvent', function(){
				//pageWidth = scope.pageWidth;
				pageWidthCategory = scope.pageWidthCategory;
				scope.post.pageWidthCategory = scope.pageWidthCategory;
				checkForMobileWidth(false);

			});

			scope.$on('smallMenuToggleEvent', function(event, toggle){
				moveArticleContent(!toggle);
				activeMenu = !toggle;
				checkForMobileWidth(false);
				scope.post.activeMenu = activeMenu;
			});

			scope.$on('widescreenAsideClickEvent', function(){
				moveArticleContent(false);
				activeMenu = false;
				scope.post.activeMenu = activeMenu;
				scope.toggleSidebar();
				});
			

 				// windowElem.bind('scroll', function(){
 				// 	scrollPosition = window.pageYOffset;
 				// 	if(pageWidthCategory != 1 && !scope.postAndMenu.menu.userActivated){
 				// 		transitionWithScroll();      	
     //    			}

        			

	     //   });		

	        function moveArticleContent(toggle){
	        	if(articleContent.hasClass('block-transition')){
	        		articleContent.removeClass('block-transition');
	        	}

	        	if(toggle === false && pageWidthCategory !== 1){
		        	//rightBar.css('padding-top', 76);
	        		rightBar.css('opacity', 100); 
	        		if(hasAsides){
	        			//articleContent.css('margin-left', -200);
	        			articleBody.css('transform', 'translateX(-100px)');

        			}
        			else{
		        		//articleContent.css('margin-left', 0);
		        		articleBody.css('transform', 'translateX(0px)');

        			}
	        		//articleContent.css('margin-right',  200  + "px");
	        		//articleContent.css('padding-top', 76 + "px"); 
        		}

        		else{
        			//rightBar.css('padding-top', 76);
	        		rightBar.css('opacity', 0); 
	        		//articleContent.css('margin-left', 200);
	        		articleBody.css('transform', 'translateX(100px)');

	        		//articleContent.css('margin-right',  0  + "px");
	        		//articleContent.css('padding-top', 76 + "px"); 
        		}
    }	


	        function checkForMobileWidth(initializing){
	        	if(pageWidthCategory === 1){

	        	

				articleBody.css('transform', 'translateX(0px)');
				articleContent.css('margin-right', 0+"px");
				articleContent.css('margin-left', 0+"px");

				//articleContent.css('padding-top', 76 + "px");  
				}
				else if(pageWidthCategory !== 1) {
				//articleContent.css('margin-left', -200+"px");
			moveArticleContent(activeMenu);


					//moveArticleContent(scope.postAndMenu.menu.toggle);

				}
	        }

	        function transitionWithScroll(){
	        		            	//ctrl.updatePostScroll(scrollPosition);

	        	if(scrollPosition>100){

	            		//leftSideBar.css('left', -200 + "px");	
            			// rightBar.css('margin-top', 100);
	            		// rightBar.css('opacity', 100); 
	            		// articleContent.css('margin-left', 0);
	            		// articleContent.css('margin-right',  200  + "px");
	            		// articleContent.css('padding-top', 176 + "px");  
	            		//leftBarZipper.css('opacity', 1);

	            	}

	            	if(scrollPosition>=0 && scrollPosition <= 100){


	            	var leftBarPosition = -scrollPosition*2;
	            	articleContent.css('margin-left', 200 - (scrollPosition*2) + "px");
	            	articleContent.css('margin-right',  scrollPosition*2  + "px");
	            	articleContent.css('padding-top', scrollPosition + 76 + "px");  
	            	rightBar.css('opacity', (scrollPosition/100)); 
	            	rightBar.css('margin-top', scrollPosition);
            		// leftSideBar.css('left', leftBarPosition + "px");
            		// leftBarZipper.css('opacity', scrollPosition/100);
	            	
            	}
	        }
			//scope.$broadcast('postLoadedEvent', null);
			
		}
	}
}])


.directive('bcPostAndMenu', ['$window',  '$state', 'utilities', '$rootScope', function($window, $state, utilities, $rootScope){
        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';
    return{ 
		restrict: 'EA',
		templateUrl: directives_path+'post-and-menu-template.html',
		controller: ['$scope', '$sce', function($scope, $sce){

			$scope.postAndMenu = {};
			$scope.postAndMenu.menu = {};
			//$scope.postAndMenu.menu.userActivated = false;
			$scope.postAndMenu.post = {};


			this.updateMenuToggle = function(toggle, userActivated){
				$scope.postAndMenu.menu.toggle = toggle;
				$scope.postAndMenu.menu.userActivated = userActivated;
			}

			this.toggleMenuButton = function(toggle){
				$scope.postAndMenu.menu.showButton = toggle;
			}

			this.updatePostScroll = function(scroll){
				$scope.postAndMenu.post.scroll = scroll;
				$scope.$apply();
			}

        }],

		link: function(scope, element, attrs, ctrl){





			if($rootScope.smallSideBarActivated || $rootScope.shortArticle){
				scope.postAndMenu.menu.showButton = true;
			}
			else{
				scope.postAndMenu.menu.showButton = false;
			}




			angular.element(window).bind('scroll', function(){
                var scrollPosition = document.body.scrollTop;


                
	                if(scrollPosition >= 150){
	                    if(scope.postAndMenu.menu.showButton === false){
	                        scope.postAndMenu.menu.showButton = true;
	                        scope.$apply();

	                    }
	                }
	                else if(scrollPosition < 150 && !$rootScope.shortArticle){
	                    if(scope.postAndMenu.menu.showButton === true){
	                    	if(!scope.postAndMenu.menu.toggle && !$rootScope.smallSideBarActivated){
		                        scope.postAndMenu.menu.showButton = false;
		                        scope.$apply();
	                        }
	                    }
	                }
                
                
            });
		}
	}
}]);

