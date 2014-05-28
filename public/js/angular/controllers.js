angular
  .module('webmakerApp')
  .controller('navigationController', ['$scope', '$location', '$routeParams', '$rootScope', 'weblit',
    function ($scope, $location, $routeParams, $rootScope, weblit) {

      // Start with collapsed state for navigation
      $scope.isCollapsed = true;
      $scope.mobileTocCollapse = true;
      $scope.collapseAll = function () {
        $scope.isCollapsed = true;
        $scope.mobileTocCollapse = true;
      };

      $scope.clickedResource = false;
      $scope.literacies = weblit.all();

      $scope.isActive = function (tag) {
        if (tag[0] === '/') {
          return tag === $location.path();
        }
        return tag === $routeParams.id;
      };

      $scope.isUnselected = function () {
        return window.location.hash === '#/';
      };

      // Jump to top of viewport when new views load
      $rootScope.$on('$locationChangeSuccess', function (event) {
        window.scrollTo(0, 0);
      });

    }
  ])
  .controller('exploreController', ['$scope', 'CONFIG',
    function ($scope, CONFIG) {
      $scope.contributeBoxes = [{
        icon: 'book',
        title: 'Teaching kits',
        description: 'Teaching kits desc',
        target: '/' + CONFIG.lang + '/teach-templates'
      }, {
        icon: 'map-marker',
        title: 'Events',
        description: 'Events desc',
        target: 'https://events.webmaker.org/' + CONFIG.lang
      }, {
        icon: 'globe',
        title: 'Translate',
        description: 'Translate desc',
        target: 'https://support.mozilla.org/' + CONFIG.lang + '/kb/translate-webmaker'
      }, {
        icon: 'picture-o',
        title: 'Design',
        description: 'Design desc',
        target: 'https://wiki.mozilla.org/Webmaker/Design'
      }, {
        icon: 'code',
        title: 'Code',
        description: 'Code desc',
        target: 'https://support.mozilla.org/' + CONFIG.lang + '/kb/contribute-webmaker-code'
      }, {
        icon: 'rocket',
        title: 'Partner',
        description: 'Partner desc',
        target: 'http://party.webmaker.org/' + CONFIG.lang + '/partners'
      }];
    }
  ])
  .controller('competencyController', ['$rootScope', '$scope', '$location', '$routeParams', 'weblit', 'makeapi', 'CONFIG',
    function ($rootScope, $scope, $location, $routeParams, weblit, makeapi, CONFIG) {

      $scope.tag = $routeParams.id;

      $scope.skill = weblit.all().filter(function (item) {
        return item.tag === $scope.tag;
      })[0];

      $scope.content = $rootScope.content[$scope.tag];

      $scope.wlcPoints = CONFIG.wlcPoints;

      makeapi
        .tags($scope.skill.tag)
        .then(function (data) {
          $scope.makes = data;
        });

    }
  ])
  .controller('resourceFormController', ['$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {
      $scope.formData = {};
      $scope.submit = function (form) {

        var data = $scope.formData;
        data.username = $scope._user.username;
        data.email = $scope._user.email;
        data.webliteracy = $scope.skill.term;

        $http
          .post('/api/submit-resource', data)
          .success(function (ok) {
            if (ok) {
              $scope.success = true;
              $scope.formData = {};
            }
          })
          .error(function (err) {
            console.log(err);
          });
      };
    }
  ])
  .controller('resourcesHomeController', ['$scope',
    function ($scope) {
      // This is the controller for resources home
      $scope.whatever = 'blah';
    }
  ]);