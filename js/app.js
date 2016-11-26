var leetseek = angular.module("leetseek", ['ui.router', 'ngMaterial']);

var clientId = "0139c2d5a75abb5";
var clientSecret = "c9cba23d88fad34b05f5c0bb6f8a0044b7d62348";

leetseek.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('search', {
            url: '/search',
            templateUrl: 'templates/search.html',
            controller: 'SearchController'
        });
    $urlRouterProvider.otherwise('/login');

    $mdThemingProvider.theme('default')
        .primaryPalette('light-green');
});

leetseek.controller("LoginController", function($scope) {
    $scope.login = function() {
        window.location.href = "https://api.imgur.com/oauth2/authorize?client_id=" + clientId + "&response_type=token"
    }
});

leetseek.controller("SearchController", function($scope, $http) {
    $scope.userInformation = JSON.parse(window.localStorage.getItem("imgur"));
    $scope.accessToken = $scope.userInformation.oauth.access_token;

    function getRequest(url) {

        return $http({
            method: 'GET',
            url: url,
            headers: {
                'Authorization': 'Bearer ' + $scope.accessToken
            }
        });
    }

    $scope.viral = getRequest('https://api.imgur.com/3/gallery/hot/viral/0.json');

    $scope.search = function(query) {
        return getRequest('https://api.imgur.com/3/gallery/search?q=' + query)
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.searchResponse = response;
                console.log($scope.searchResponse.data.data)
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.searchResponse = response;
            });
    };
});

leetseek.controller("FooterController", function($scope) {
    $scope.links = [
        {
            name: "GitHub",
            url: "https://github.com/marols",
            icon: "mdi-github-circle"
        },
        {
            name: "LinkedIn",
            url: "https://se.linkedin.com/in/mwalter84",
            icon: "mdi-linkedin-box"
        }
    ];
});

