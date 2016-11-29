var leetseek = angular.module("leetseek", ['ui.router', 'ngMaterial']);
var clientId = "0139c2d5a75abb5";

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
    var accessToken = JSON.parse(window.localStorage.getItem("imgur")).oauth.access_token;

    $scope.searchResultPage = 0;

    function getRequest(url) {

        return $http({
            method: 'GET',
            url: url,
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    function getImageUrl(element) {
        if (element.is_album) {
            getRequest("https://api.imgur.com/3/image/" + element.cover)
                .then(function(image) {
                    return element['cover_link'] = image.data.data.link;
                });
        } else {
            return element['cover_link'] = element.link;
        }
    }

    $scope.search = function(query) {
        $scope.awaitingResponse = true;

        return getRequest('https://api.imgur.com/3/gallery/search/time/' + $scope.searchResultPage + '?q=' + query)
            .then(function(response) {
                $scope.searchResult = response.data.data;

                $scope.searchResult.map(function(element) {
                    return getImageUrl(element);
                });
            }, function(error) {
                console.log(error);
                return false;
            }).finally(function() {
                $scope.awaitingResponse = false;
            });
    };

    $scope.previousPage = function(query) {
        if ($scope.searchResultPage >= 0) {
            $scope.searchResultPage--;
        }
        $scope.search(query);
    };

    $scope.nextPage = function(query) {
        $scope.searchResultPage++;
        $scope.search(query);
    };

    $scope.disablePreviousButton = function() {
        return !$scope.searchResult || $scope.searchResultPage === 0 || $scope.awaitingResponse;
    };

    $scope.disableNextButton = function() {
        return !$scope.searchResult || $scope.awaitingResponse;
    };

    $scope.getLink = function(entity) {
        return entity.is_album ? entity.link : "//imgur.com/" + entity.id;
    };
});

leetseek.controller("FooterController", function($scope) {
    $scope.links = [
        {
            name: "E-mail",
            url: "mailto:martin.walter.swe@gmail.com",
            icon: "mdi-email-outline"
        },
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
    ]
    ;
})
;

