/**
 * Created by solomon on 15/10/12.
 */

angular.module( 'teacherstage.dashboard', [
        'ui.router'
    ])
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'dashboard', {
            url: '/dashboard',
                views: {
                    "main": {
                            controller: 'DashboardCtrl',
                                templateUrl: 'dashboard/dashboard.tpl.html'
                        }
                },
            data:{ pageTitle: '管理端' }
        });
})

        .controller( 'DashboardCtrl', function DashboardController( $scope ) {
    
            });