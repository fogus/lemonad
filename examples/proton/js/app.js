(function(angular) {
    'use strict';

    var app = angular.module('puzzleApp', ['slidingPuzzle']);

    // puzzle types
    var types = [
        { id: 'sliding-puzzle', title: 'Sliding puzzle' }
    ];

    /**
     * Config
     */
    app.config(function($routeProvider) {
        $routeProvider.when('/:type');
    });

    /**
     * Startup
     */
    app.run(function($rootScope, $route, $filter) {
        $rootScope.types = types;
        $rootScope.type = types[0].id;

        // set type on route change
        $rootScope.$on('$routeChangeSuccess', function(event, route) {
            $rootScope.type = ($filter('filter')(types, { id: route.params.type }).length ? route.params.type : types[0].id);
        });
    });
})(window.angular);