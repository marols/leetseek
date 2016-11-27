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
        .state('secure', {
            url: '/secure',
            templateUrl: 'templates/secure.html',
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

    $scope.search = function(query) {
        $scope.awaitingResponse = true;

        return getRequest('https://api.imgur.com/3/gallery/search?q=' + query)
            .then(function(response) {
                $scope.searchResult = response.data.data;
                console.log($scope.searchResult)
            }, function(error) {
                console.log(error);
                return false;
            }).finally(function() {
                $scope.awaitingResponse = false;
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

