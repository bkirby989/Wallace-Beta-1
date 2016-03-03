

angular.module('wordpressContent.post.service', [])

// A RESTful factory for retreiving posts from wordpress JSON API
.factory('posts', ['$http', '$filter', 'utilities', function ($http,  $filter, utilities) {
  var path = 'wp-json/wp/v2/posts?per_page=9';
  var posts = $http.get(path).then(function (resp) {
    var data = resp.data;
    var sortedPosts = $filter('orderBy')(data, 'date', true);

    return sortedPosts;
  });

  var factory = {};
  factory.all = function () {
    return posts;
  };
  factory.get = function (slug) {
    return posts.then(function(){
      return utils.findBySlug(posts, slug);
    })
  };
  return factory;
}])


.factory('siteData', ['$http', '$filter', function($http, $filter){

  var sitePath = 'wp-json';
  var pagePath = 'wp-json/wp/v2/pages';
  var userPath = 'wp-json/user';
  var categoryPath = 'wp-json/wp/v2/terms/category?per_page=999'

  var siteInfo = $http.get(sitePath).then(function (resp) {
    var data = resp.data;
    return data;
  });

  var pages = $http.get(pagePath).then(function (resp) {

    var data = resp.data;
    return data;
  });


  var categories = $http.get(categoryPath).then(function (resp) {

    var data = resp.data;
  return data;    
  }) 


  var factory = {};
  factory.getSiteInfo = function(){

    
    return siteInfo;
  }

  factory.getPages = function(){
    return pages;
  }

  factory.getCategories = function(){
    return categories;
  }
  
  return factory;

}]);