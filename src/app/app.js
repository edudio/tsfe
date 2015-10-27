angular.module( 'teacherstage', [
    'templates-app',
    'templates-common',
    'teacherstage.publisher',
    'teacherstage.player',
    'teacherstage.dashboard',
    'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/dashboard' );
  //$urlRouterProvider.otherwise( '/publisher' );
  //$urlRouterProvider.otherwise( '/player' );
})

.run( function run () {

        /**
         *  DMS session
         */

        /*        //连接服务器
                ROP.Enter('pub_4cae9d25f8393f274a30d608d94568d6','sub_3805063028e1d979b34b008a3c3e0ce5');

                *//*event*********************//*

        //连接成功
        ROP.On("enter_suc",function() {
            console.log("EnterSuc");
        });
        //连接失败
        ROP.On("enter_fail",function(err) {
            console.log("EnterFail:" + err);
        });
        //开始重连
        ROP.On("reconnect",function() {
            console.log("reconnect:");
        });
        //离线
        ROP.On("offline",function(err) {
            console.log("offline:" + err);
        });

        //收到关注的话题的消息
        ROP.On("publish_data",function(data,topic) {
            console.log("recv at " + topic + " -> " + data);
        });
        //与服务器断开连接的事件
        ROP.On("losed",function() {
            console.log("Losed");
        });

        *//*operation*****************//*

        //推送消息到某个话题
        ROP.Publish(data,topic);
        //关注某个话题
        ROP.Subscribe(topic);
        //取消关注某个话题
        ROP.UnSubscribe(topic);
        //断开连接
        ROP.Leave();*/
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | 直播系统' ;
    }
  });
})

;

