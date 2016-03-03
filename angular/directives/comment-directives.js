
angular.module('wordpressContent.comment.directives', ['wordpressContent.comment.service'])


.directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
})

    .directive('bcCommentForm', ['$interval', '$sce', 'commentService', '$cookies', function($interval, $sce, commentService, $cookies) {

        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

        return{
            restrict: 'E',
            require: '^bcComments', 
            scope: {comment: '=', form: '='},
            templateUrl: directives_path+'comment-form-template.html',
            link: function(scope, attrbs, element, commentsCtrl){

                    scope.submission = {};
                    scope.submission.cacheLoaded = false;
                    scope.submission.valid = false;
                  //  validateInput();
                   
                    var cachedName = $cookies.name;
                    var cachedEmail = $cookies.email;

                    if(cachedEmail != null && cachedName != null){
                        scope.submission.name = cachedName; 
                        scope.submission.email = cachedEmail;
                        scope.submission.cacheLoaded = true;
                    }

                    function validateInput(){
                        var emailValid = scope.commentForm.email.$error.email;
                        console.log(emailValid);
                    }

                    scope.submit = function(){
                        submit();
                    }

                    scope.cancel = function(){
                        scope.form.newCommentFormVisibility = false;
                    }

                    function submit() {

                            $cookies.name = scope.submission.name;
                            $cookies.email = scope.submission.email;

                            console.log(scope.submission.content);

                            var scopetest = {};
                            scopetest.message = "test";
                            console.log(scopetest);


                            //hide the form
                            scope.form.newCommentFormVisibility = false;   

                            //mark the newComment as loading since we're doing an async call 
                            var newComment = {};
                            newComment.isLoading = true;
                         
                            //get the data from the form

                            newComment.date = new Date();
                            newComment.date = newComment.date.toISOString();
                            newComment.content = scope.submission.content;
                            console.log(newComment.content);

                            scope.content = "Comment...";

                            //TODO: will have to change input to <pre> or similar to automatically input <p> tags



                            //TODO: change this to user.name
                            newComment.author = {};
                            newComment.author_name = scope.submission.name;
                            newComment.author.email = scope.submission.email;

                            //determine whether the newComment is a top level comment, a reply, or an edit
                            //and call the appropriate method in our bc-comments controller
                            var parentComment = scope.comment;



                            if(parentComment.exists == false){
                                console.log('adding new comment');
                                commentsCtrl.addNewComment(newComment);
                                clearForm();
                                return;
                            }

                            if(parentComment.exists){
                                console.log('adding new reply:');
                                commentsCtrl.addNewReply(newComment, parentComment);
                                clearForm();
                                return;
                            }

                            if(parentComment.isBeingEdited){
                                commentsCtrl.edit(parentCommeent, newComment);
                                clearForm();
                                return;
                            }

                            else{
                                //TODO: throw error
                                console.log('well I dont know how to submit you then..');
                                clearForm();
                                return;
                            }

                            function clearForm(){
                                scope.submission.content = "";
                            }
                                                                      
                 }                      
            }
        };
    }])


    .directive('bcComment', ['RecursionHelper', function(RecursionHelper) {

        var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

        return{
            restrict: 'E',
            scope: {comment: '=', post: '='},

            //have to manually compile to fix infinite loop with nested recursive bcComments;
            //the service defines the link function where the event handlers are
            compile: function(element){
                return RecursionHelper.compile(element);
            },
            controller: ['$scope', function($scope){
                $scope.comment.exists = true;
                $scope.form = {};
                $scope.form.newCommentFormVisibility = false;
            }],
            templateUrl: directives_path+'single-comment-template.html'

        };
    }])

    .directive('bcComments', ['$sce', '$interval', 'commentService', function($sce, $interval, commentService) {

    	var directives_path = red_eye_theme_path.theme_path+'/angular/directives/';

    	return{
    		restrict: 'E',
            scope: {post: '=', comments: '='},
    		templateUrl: directives_path+'comments-template.html',
            controller: ['$scope', '$sce', '$interval', 'commentService',
                function ($scope, $sce, $interval, commentService) {

                    if($scope.post.comment_status === "closed"){
                        $scope.post.commentStatus = "Comments are closed for this article.";
                        $scope.post.openComments = false;
                    }

                    else{
                        $scope.post.commentStatus = "";
                        $scope.post.openComments = true;
                    }

                    

                    var userComments = [];
                    var otherComments = [];

                    getCommentData();

                    this.addNewComment = function(newComment){
                        newComment.parent = {};
                        newComment.parent.ID = 0;

                        newComment.descendants = [];
                        newComment.statusMessage = "";

                        var content = newComment.content;
                        content = '<p>' + content.replace(/\n([ \t]*\n)+/g, '</p><p>');
                        newComment.safeContent = content;
                        console.log(newComment.safeContent);

                        $scope.post.otherComments.push(newComment);
                        newComment.statusMessage = "Submitting...";

                        postNewComment(newComment, $scope.post.id);
                        
                    }

                    this.addNewReply = function(newReply, parentComment){
                        newReply.descendants = [];
                        newReply.statusMessage = "";
                        console.log('replying to comment with id '+ parentComment.ID)

                        var content = newReply.content;
                        content = '<p>' + content.replace(/\n([ \t]*\n)+/g, '</p><p>');
                        newReply.safeContent = content;

                        newReply.parent = parentComment;
                        parentComment.descendants.push(newReply);

                        newReply.isReply = true;
                        newReply.statusMessage = "Submitting...";

                        postNewComment(newReply, $scope.post.id);
                     
                    }

                    function postNewComment(commentData, postId){
                        console.log(commentData);
                        commentData.success = false;
                        $interval(function(){

                               commentService.submitNewComment(commentData, postId).then(function (resp){
                               commentData.ID = resp.data.ID; 
                               console.log(commentData.ID);
                               console.log(resp);
                               if(resp.status != 201){
                                commentData.statusMessage = "Error: Unable to submit comment";
                               }
                              else if(resp.data.status === "hold"){
                                commentData.statusMessage = "Under Review";
                               }
                               else{
                                commentData.statusMessage = "Submission successful";
                                commentData.success = true;
                               }
                               //commentData.author.name = "You";
                               commentData.isLoading = false;

                            }, function(){
                                    commentData.statusMessage = "Error: Unable to submit comment";
                                    commentData.isLoading = false;

                            });

                            }, 2000, 1);

                          
                       

                    }

                     function getCommentData(){
                        //get JSON comment data for the post then.. 
                        commentService.findByPostId($scope.post.id).then(function (resp){

                           var commentData = commentService.updateRelationalReferences(resp.data);
                           $scope.comments.length = commentData.length;
                           $scope.$emit("loadedCommentsEvent", commentData.length);
                           //navigationService.notifyLoadedComments(commentData.length);
                            //for each comment item..
                            for (var i = 0; i<commentData.length; i++){

                                //mark as trusted HTML
                                commentData[i].safeContent = $sce.trustAsHtml(commentData[i].content.rendered);

                                if(!commentData[i].isReply){

                                    //TODO: if user matches comment, add to user array
                                    if(commentData[i].author.ID == -1){
                                        userComments.push(commentData[i]);
                                    }

                                    //if not, add to other comments
                                    else{
                                        otherComments.push(commentData[i]);
                                    } 
                                }                                  
                            }    
                            //bind our newly loaded and organized comments to the scope
                             $scope.post.userComments = userComments;
                             $scope.post.otherComments = otherComments;


                             //set default value of comment.exists to false for the form that handles top level comments,
                             //replies and edits will shadow (and switch to true) this value in ngComment's controller
                             $scope.comment = {};
                             $scope.comment.exists = false;

                        }); 
                    }


                }],
            link: function(scope, element, attributes, controller){
                                           
                console.log(scope.comments);

                    scope.showAddCommentForm = function(){
                        scope.form = {};
                        scope.form.newCommentFormVisibility = true;
                        
                    };

                     scope.user = {};
                    scope.user.name = "Placeholder";

                }   		
    		};
    	}]);


