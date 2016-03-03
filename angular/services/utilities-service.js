
angular.module('wordpressContent.utilities.service', [

])
.factory('utilities',['$rootScope', function ($rootScope) {
  return {
    // Util for finding an object by its 'slug' property among an array
    findBySlug: function findBySlug(a, slug) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].slug == slug) {
            return a[i];
          }
        }
       return null;

      },

    getLatestSlug: function getLatestSlug(a){
        console.log(a[a.length-1]);
        return a[0].slug;
      },

      notifyPageWidthChange: function(){
      $rootScope.$broadcast('pageWidthChangeEvent');
    },

      notifyPageWidthCategoryChange: function(){
        $rootScope.$broadcast('pageWidthCategoryChange');
      },

      notifyAsidesLoaded: function(asides){
        $rootScope.$broadcast('asidesLoadedEvent', asides);
      },

      // notifySidebarToggled: function(expanded){
      //   $rootScope.$broadcast('sidebarToggledEvent', expanded);

      // }

    }
}]);