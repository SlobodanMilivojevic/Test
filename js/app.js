

var app = angular.module('testApp', []);

app.controller('appController', function($scope, $http) {

    $scope.results = {};
    $scope.resultsNumber;
    $scope.resultsArray = [];
    $scope.imgLoadCounter = 0;

    $scope.bookmarkedObj = {};
    $scope.bookmarkedArray = [];

    //Checking if localStorage has any bookmarks available
    if(JSON.parse(localStorage.getItem("savedBookmarks")) !== null) {
        $scope.bookmarkedObj = JSON.parse(localStorage.getItem("savedBookmarks"));
        $scope.bookmarkedArray = $scope.bookmarkedObj.bookmarks;
    }

    //Bookmarking Marvel characters in localStorage
    $scope.bookmarking = function(bookmarkTarget) {
        $scope.bookmarkedArray.push(bookmarkTarget);
        $scope.bookmarkedObj.bookmarks = $scope.bookmarkedArray;
        localStorage.removeItem("savedBookmarks");
        localStorage.setItem("savedBookmarks", JSON.stringify($scope.bookmarkedObj));
    };

    //Removing bookmarked Marvel characters
    $scope.removeBookmarkStart = function(bookmark) {
        var indexB = $scope.bookmarkedArray.indexOf(bookmark);
        $scope.bookmarkedArray.splice(indexB, 1);
        localStorage.removeItem("savedBookmarks");
        localStorage.setItem("savedBookmarks", JSON.stringify($scope.bookmarkedObj));
    };

    //Checks if all images are loaded in the grid and continues with image resize function
    $scope.imageLoader = function() {
        $scope.imgLoadCounter++;
        if($scope.resultsNumber == $scope.imgLoadCounter){
            $scope.imgLoadCounter = 0;
            $scope.imageResizer();
        }
    };

    //Calculating which image has lowest height and applying it to all other images
    $scope.imageResizer = function() {
        var initialHeight;
        jQuery(".result-item").each(function(index, element){
            var imageHeight = jQuery(element).find(".hero-image").outerHeight();
            if(index == 0) {
                initialHeight = imageHeight;
            }
            else {
                if(imageHeight < initialHeight){
                    initialHeight = imageHeight;
                }
            }
        });
        jQuery(".result-item .image-holder").outerHeight(initialHeight);
    };

    jQuery(window).on("load resize", function(){
        $scope.imageResizer();
    });

    //API request
	$scope.sendRequest = function () {
        if($scope.searchValue !== undefined && $scope.searchValue !== "") {
            var searchParameter = "nameStartsWith=" + $scope.searchValue + "&";
            $http.get("https://gateway.marvel.com:443/v1/public/characters?" + searchParameter + "limit=12&ts=1&apikey=b72e6f1ec68db83b8dfb9db901e05e2f&hash=f07051a999374614d721c52dbff119c5")
            .then(function successCallback(response){
                $scope.results = response;
                $scope.resultsNumber = $scope.results.data.data.results.length;
                $scope.resultsArray = $scope.results.data.data.results;
                $scope.imageResizer();
            }, function errorCallback(response){
                console.log("Unable to perform get request");
            });
        } 
    };

})
.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.$apply(attrs.imageonload);
                jQuery(element).parent().removeClass("loading");
            });
        }
    };
})