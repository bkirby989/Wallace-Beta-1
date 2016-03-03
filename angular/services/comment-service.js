angular.module('wordpressContent.comment.service', [])



.factory('commentService',['$http','$filter', function($http, $filter){
	return{

		findByPostId: function(postId){
			var path = 'wp-json/wp/v2/comments?post_id='+postId+'&per_page=99999';
			console.log(path);
			return $http.get(path);
		},

		submitNewComment: function(commentData, postId){
			var path = 'wp-json/wp/v2/comments';
			var payload = createCommentPostJson(commentData, postId);
			console.log(payload);
			return $http.post(path, payload);


			function createCommentPostJson(commentData, postId){
				var payload = {};
				payload.post = postId;

				
				payload.content = commentData.content;
				payload.author = 0;
				payload.author_name = commentData.author_name;
				payload.author_email = commentData.author.email;
				payload.parent =  commentData.parent.id;
				payload.date = commentData.date;
				payload.type = null;
				var dataString = JSON.stringify(payload);
				console.log(dataString);
				return dataString;
			}
		},

		//gives all comments an object reference to parent and descendant comments
		updateRelationalReferences: function(commentArray){
			var comments = [];

			for(var i=0; i<commentArray.length ; i++){
				//initialize some additional fields
				commentArray[i].descendants = [];
				commentArray[i].isReply = false;
			}

			for(var i=0; i<commentArray.length ; i++){

				var comment = commentArray[i];
				
				if(comment.parent != 0){
					comment.isReply = true;
					comment.parent = getCommentFromId(comment.parent, commentArray);
					console.log(comment.parent);
					addCommentToParentDescendants(comment, comment.parent);
				}
				else{
					comment.parent = {};
					comment.parent.id = 0;
				}
				comments.push(comment);
			}
			return comments;


			function getCommentFromId(_id, commentArray){
				console.log(_id);
				console.log(commentArray);

				for(var i=0; i<commentArray.length; i++){
					if (_id == commentArray[i].id){
						console.log(commentArray[i]);

						return commentArray[i];
					}
				}
			}

			function addCommentToParentDescendants(comment, parent){
				console.log(comment);
				console.log(parent);
				parent.descendants.push(comment);
			}
		}	
	}
}])

.factory('RecursionHelper', ['$compile', function($compile){
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function(element, link){
            // Normalize the link parameter
            if(angular.isFunction(link)){
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function(scope, element){

                	scope.comment.showAddReplyForm = function(){
                    console.log('fire');
                    scope.form.newCommentFormVisibility = true;
                	
                	}
                    // Compile the contents
                    if(!compiledContents){
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function(clone){
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if(link && link.post){
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);

