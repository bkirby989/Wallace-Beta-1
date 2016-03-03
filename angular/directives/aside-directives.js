	
angular.module('wordpressContent.asides.directives', [])

.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
    	console.log('compile link')
   
                element.html(scope.$eval(attrs.compile));
                 console.log('compile begin');          
                $compile(element.contents())(scope);
                console.log('compile end');
        
    };
}])

.directive('bcAside', [ function(){
	return{
		restrict: 'EA',

		//template: '<sup class="aside-superscript">{{bcAsideCtrl.getID()}}</sup>',
		controller: ['$scope',  function($scope){
			
		}],
		controllerAs: "bcAsideCtrl",
		link: function(scope, elem, attrs, bcAsides){

			var aside = {};
			console.log('aside link');
			//console.log(scope.post);
			//wait for post data to be inherited
			if(scope.post != undefined){
				aside.id = scope.post.asides.length + 1;
			//	console.log(aside.id);
			
				aside.content = elem.html();
			//	console.log(aside.content);

				scope.post.asides.push(aside);
			//	console.log(aside.id);
				var superscriptContent = '<sup class="aside-superscript">'+aside.id+'</sup>';
				elem[0].outerHTML = superscriptContent;
			}
		}
	}

}])


.directive('bcAsideSidebar', ['$window', '$rootScope', function($window, $rootScope){

	       var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

	return{
		restrict: 'E',
		scope: {post: '='},
		templateUrl: directives_path + "aside-sidebar-template.html",
		controller: ['$scope', function($scope){

		}],
		link: function(scope, elem, attrs){

			var unWatch = scope.$watch('scope.post.asides', function(){
				var asides = scope.post.asides;
				for(var i=0; i<asides.length; i++){

					//TODO: replace <p> with <aside>
					var appendedAside = '<p class="aside"><b>' + asides[i].id + '</b> ' + asides[i].content + '</p>';
					elem.append(appendedAside);
				}

				if(asides.length < 1){
					scope.$emit("noAsidesEvent");
				}
				positionAsides();
				unWatch();
			});
            var windowElem = angular.element($window);

            // scope.$on('postLoadedEvent', function(){
            // 	console.log('I SEE YOU');
            // });

			
            windowElem.bind('resize', function(){
				positionAsides();
			});

			scope.showNotesLabel = false;
			

            angular.element(window).bind('scroll', function(asides){
            	var scrollPosition = document.body.scrollTop;

            	if(scrollPosition >= 150 && verifiedSuperscripts.length > 0){
            		if(scope.showNotesLabel === false){
            			scope.showNotesLabel = true;
            			scope.$apply();

            		}
            	}
            	else{
            		if(scope.showNotesLabel === true){
            			scope.showNotesLabel = false;
            			scope.$apply();
            		}
            	}
        	});


			// scope.$watch('postAndMenu.menu.userActivated', function(){
			// 	console.log('fire?');
			// 	positionAsides();
			// });
			
			
			scope.hasNotes = function(){
				console.log("i'm here yo");
			}

			var verifiedSuperscripts = [];

            function positionAsides(){


            	var asides = elem.find('p');
				resetPosition(asides);
				var superscripts = elem.parent().find('sup');
				verifiedSuperscripts = [];
				for(var i=0; i<superscripts.length; i++){
					if(angular.element(superscripts[i]).hasClass('aside-superscript')){
						verifiedSuperscripts.push(angular.element(superscripts[i]));
					}
				}

				for(var i=0; i<asides.length; i++){
					var aside = angular.element(asides[i]);
					var superscript = verifiedSuperscripts[i];


					aside.yPosition = superscript.position().top + 50;

										checkAndFixCollisions(aside);

					aside.css("top", aside.yPosition + "px");


				}
			}

				function checkAndFixCollisions(aside){

					var placedAsides = elem.find('p');

					for(var i=0; i<placedAsides.length; i++){

						var checked = {};
						checked = aside;
						checked.begin = checked.yPosition;
						checked.end = checked.begin + checked.height();


						var compared = {};
						compared = angular.element(placedAsides[i]);
						compared.begin = compared.position().top;
						compared.end = compared.begin + compared.height();



						if((checked.begin < compared.end) && (checked.end > compared.begin)){
							aside.yPosition = compared.end + 10;
							checkAndFixCollisions(aside); 

						}

					}						
				}

				function resetPosition(asides){
					for(var i=0; i<asides.length; i++){

						var aside = angular.element(asides[i]);

						aside.yPosition = 100;
						aside.css('top', aside.yPosition + "px");

					}
				}
				console.log('end link aside sidebar');
			}
		}
}])


.directive('bcAsides', ['$window', '$compile', '$sce', 'utilities', '$rootScope',  '$timeout', function($window, $compile, $sce, utilities, $rootScope, $timeout){
	return{
		restrict: 'A',
		scope: {post: '='},
		controller: ['$scope', '$element', function($scope, $element){

			$scope.post.asides = [];
			$scope.post.activeModal = 0;
			

		}],
		link: function (scope, elem, attrs, ctrl){
			//var cachedArticle = elem.parent().find('article').html();
                var	windowWidth = $window.innerWidth;
                var activeMenu = false;
                var bcPostAndMenu = ctrl;
				scope.decoratedAsides = false;

			$timeout(function(){
				$timeout(function(){
					decorateWordsPrecedingAsides();
					decorateAsidesIfNeeded();

				}, 0);

			}, 0);



			scope.$watch('post.activeMenu', function(){
				console.log('WATTTCH' + scope.post.activeMenu)
				decorateAsidesIfNeeded();				
			})

			scope.$on('pageWidthChangeEvent', function(){
				if(scope.post.pageWidthCategory === 1){
					scope.decoratedAsides = true;
				}
				else{
					decorateAsidesIfNeeded();
				}

				scope.$apply();
				
			});

			function decorateAsidesIfNeeded(){
				activeMenu = scope.post.activeMenu;
				windowWidth = $window.innerWidth;
				if(windowWidth < 801){
					scope.decoratedAsides = true;
				}

				else if(!activeMenu){
					scope.decoratedAsides = false;
				}
				else{
					scope.decoratedAsides = true;
				}

			}

			scope.handleAsideClick = function(id){
                windowWidth = $window.innerWidth;
			activeMenu = scope.post.activeMenu;


				if(windowWidth < 801){
					$rootScope.$broadcast('modalActivationEvent', id);
				}
				else{
					//bcPostAndMenu.updateMenuToggle(false, true);
					//send event to toggle menu
					scope.$emit('widescreenAsideClickEvent');
				}
			}

			function decorateWordsPrecedingAsides(){
				
				var asides = elem.parent().find('sup');
			
				for(var i=0; i<asides.length; i++){
					console.log(asides[i]);
					if (!angular.element(asides[i]).hasClass('aside-superscript')){
						//console.log("IGNORING NON ASIDE SUPERSCRIPT")
						asides.splice(i, 1);
					}

				}
				console.log("NUMBER OF ASIDES: " + asides.length);
				var articleElem = elem.parent().find('article');
				

				for(var i=0; i<asides.length; i++){
					var article = {};
					article = elem.parent().find('article').html();
						//console.log(article);
										var aside = angular.element(asides[i]);
					//console.log(asides[i].outerHTML);
					var asideId = i+1;
					var endDecoration = article.indexOf(aside[0].outerHTML);
					var startDecoration = article.lastIndexOf(" ", endDecoration) + 1;
					var targetWord = article.slice(startDecoration, (endDecoration));
					var decoratedWord = "<span class='aside-link' ng-class='{active: decoratedAsides}' ng-click='handleAsideClick("+ asideId +")'>" + targetWord + "</span>";

				
					var segment1 = article.slice(0, startDecoration);
					var segment2 = article.slice(startDecoration + targetWord.length, article.length);
					var combined = segment1 + decoratedWord + segment2;
				//	console.log(startDecoration + "||" + endDecoration);
				//console.log(segment1);


			//	console.log(asides[0]);
			//	console.log(asides[1]);
				//	console.log(targetWord);
					articleElem.empty().append(combined);

				}

				var asideLinks = articleElem.find('span');
				for (var i=0; i<asideLinks.length; i++){
					if(!angular.element(asideLinks[i]).hasClass("aside-link")){
						asideLinks.splice(i, 1);
					}
				}

				//compile all <a> tags with 'aside-link' classes to activate ng-click directives
				for(var i=0; i<asideLinks.length; i++){
					if(!angular.element(asideLinks[i]).hasClass('aside-link')){
						asideLinks.splice(i);
					}
					else{
						$compile(angular.element(asideLinks[i]))(scope);
					}
				}


			}
			console.log('asides link end');	
		}
	}			
}])

.directive('bcAsideModals', ['$compile', function($compile){

        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

	return{
		restrict: 'E',
		templateUrl: directives_path+'modal-template.html',
		controller: ['$scope', function($scope){

				$scope.showThis = false;
			
		}],
		link: function(scope, elem, attrs, ctrl){

			var cachedArticle = elem.parent().find('article').html();

			//activateModalForMobileScreens();

			scope.$on('pageWidthChangeEvent', function(){
			//	activateModalForMobileScreens();
			});

			scope.$on('modalActivationEvent', function(event, id){
				setActiveModal(id);
			});


			function activateModalForMobileScreens(){
				if(scope.pageWidth < 801){
					resetArticle();
					decorateWordsPrecedingAsides();
				}

				else{
					resetArticle();
				}
			}
				
			function setActiveModal(id){
				scope.post.activeModal = id;
				scope.showThis = true;
				scope.asideNumber = id;
				scope.asideContent = scope.post.asides[id-1].content;
			}

			function resetArticle(){
				elem.parent().find('article').html(cachedArticle);
			}

			function decorateWordsPrecedingAsides(){
				
				var asides = elem.parent().find('bc-aside');
				var articleElem = elem.parent().find('article');

				for(var i=0; i<asides.length; i++){
					var article = elem.parent().find('article').html();
					var aside = angular.element(asides[i]).html();

					var asideId = i+1;
					var endDecoration = article.indexOf(aside);
					var startDecoration = article.lastIndexOf(" ", endDecoration) + 1;
					var targetWord = article.slice(startDecoration, (endDecoration - 10));
					var decoratedWord = "<a class='aside-link active' ng-click='setActiveModal("+ asideId +")'>" + targetWord + "</a>";

				
					var segment1 = article.slice(0, startDecoration);
					var segment2 = article.slice(startDecoration + targetWord.length, article.length);
					var combined = segment1 + decoratedWord + segment2;


		
					articleElem.html(combined);

				}

				var asideLinks = articleElem.find('a');

				//compile all <a> tags with 'aside-link' classes to activate ng-click directives
				for(var i=0; i<asideLinks.length; i++){
					if(!angular.element(asideLinks[i]).hasClass('aside-link')){
						asideLinks.splice(i);
					}
					else{
						$compile(angular.element(asideLinks[i]))(scope);
					}
				}


			}
		}
	}

}]);