/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/publisher`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'teacherstage.publisher', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'publisher', {
    url: '/publisher',
    views: {
      "main": {
        controller: 'PublisherCtrl',
        templateUrl: 'publisher/publisher.tpl.html'
      }
    },
    data:{ pageTitle: '发布端' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'PublisherCtrl', function PublisherController( $scope ) {
        $scope.init = function(){

            $scope._camIndexArray = [];
            $scope._micIndexArray = [];

            $scope._mediaInfo = document.getElementById("mediaInfo");
            $scope._streamInfo = document.getElementById("streamInfo");
            $scope._audioCodecList = document.getElementById("audioCodecList");
            $scope._videoCodecList = document.getElementById("videoCodecList");
            $scope._micList = document.getElementById("micList");
            $scope._camList = document.getElementById("camList");
            $scope._isUseCam = document.getElementById("isUseCam");
            $scope._isUseMic = document.getElementById("isUseMic");
            $scope._isHD = document.getElementById("isHD");
            $scope._isUDP = document.getElementById("isUDP");
            $scope._rtmpAddr = document.getElementById("rtmpAddr");
            $scope._rtmpLive = document.getElementById("rtmpLive");
            $scope._rtmpStream = document.getElementById("rtmpStream");
            $scope._userID = document.getElementById("userID");
            $scope._session = document.getElementById("session");
            $scope._width = document.getElementById("width");
            $scope._height = document.getElementById("height");
            $scope._audioKBitrate = document.getElementById("audioKBitrate");
            $scope._audioSamplerate = document.getElementById("audioSamplerate");
            $scope._videoFPS = document.getElementById("videoFPS");
            $scope._videoKeyFrameInterval = document.getElementById("videoKeyFrameInterval");
            $scope._videoKBitrate = document.getElementById("videoKBitrate");
            $scope._videoQuality = document.getElementById("videoQuality");
            $scope._volume = document.getElementById("volume");
            $scope._isMute = document.getElementById("isMute");
            $scope._bufferTime = document.getElementById("bufferTime");
            $scope._audioChannelCount = document.getElementById("audioChannelCount");
            $scope._audioBitPerSample = document.getElementById("audioBitPerSample");
            $scope._clientVersion = document.getElementById("clientVersion");
            $scope._flashVersion = document.getElementById("flashVersion");
            $scope._lowestSupportHQVersion = document.getElementById("lowestSupportHQVersion");
            $scope._HQVersion = document.getElementById("HQVersion");
            $scope._serverVersion = document.getElementById("serverVersion");
            $scope._currentServer = document.getElementById("currentServer");
            $scope._changeServerList = document.getElementById("changeServerList");
            $scope._key = document.getElementById("key");

            /////////////////////////////
            try {
                var width = document.getElementById("width").value;
                var height = document.getElementById("height").value;
            }
            catch (e) {
            }
            $scope.player1 = new Video("player1",	//名称必须与 DIV id 一致，否则无法显示视频
                (width || 640),
                (height || 480),
                function (type, info) {
                    switch (type) {
                        case RTMP_MEDIA_INFO:
                            switch (info) {
                                case "Svr.Version.Success":
                                    $scope._serverVersion.value = $scope.player1.getServerVersion();
                                    break;
                                case "NetConnection.Connect.Success":
                                case "ChangeInfo.NetConnection.Connect.Success":
                                case "new connect":
                                    $scope._currentServer.value = $scope.player1.getCurrentServer();
                                    for (var i = _changeServerList.options.length - 1; i >= 0; i--) {
                                        $scope._changeServerList.options.remove(i);
                                    }
                                    var serverList = $scope.player1.getChangeSvrList();
                                    var serverListArray = serverList.split(',');
                                    for (index in serverListArray) {
                                        var item = new Option(serverListArray[index], serverListArray[index]);
                                        $scope._changeServerList.options.add(item);
                                    }
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case RTMP_MEDIA_ERROR:
                            break;
                        case MEDIA_DEVICE_INFO:
                            switch (info) {
                                case "AVHardwareDisable":
                                    alert("flash player 全局设置了禁用硬件设置，修改方法：\nC:\WINDOWS\system32\Macromed\Flash\mms.cfg\n文件，修改为 AVHardwareDisable=0");
                                    ;
                                    break;
                                //需要添加其他摄像头麦克风禁用的消息
                                default:
                                    break;
                            }
                            break;
                        case RTMP_MEDIA_READY:	//swf加载完成消息
                            $scope.player1.onSwfReady();
                            $scope.onSwfReady();
                            break;
                        case RTMP_MEDIA_NETSTREAM_INFO:
                            $scope._streamInfo.value = info;
                            break;
                        default:
                            break;
                    }
                    if (type != RTMP_MEDIA_NETSTREAM_INFO) {
                        var date = new Date();
                        $scope._mediaInfo.value = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + ' ' + info + '\n' + $scope._mediaInfo.value;
                    }
                },
                null);

            //////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////

            //登陆成功
            ROP.On("enter_suc",
                function() {
                    ShowMsg("EnterSuc");
                })
            //重连中
            ROP.On("reconnect",
                function() {
                    ShowMsg("reconnect:");
                })
            //离线状态，之后会重连
            ROP.On("offline",
                function(err) {
                    ShowMsg("offline:" + err);
                })
            //登陆失败
            ROP.On("enter_fail",
                function(err) {
                    ShowMsg("EnterFail:" + err);
                })
            //收到消息
            ROP.On("publish_data",
                function(data, topic) {
                    ShowMsg("recv at " + topic + " -> " + data);
                })
            //彻底断线了
            ROP.On("losed",
                function() {
                    ShowMsg("Losed");
                })
            function ShowMsg(str) {
                document.getElementById("chat_show").value = str + '\n' + document.getElementById("chat_show").value
            }
            $scope.Publish = function() {
                ROP.Publish(document.getElementById("idtext").value, document.getElementById("idscope").value);
            }
            $scope.OnEnter = function() {
                ROP.Enter(document.getElementById("id_pubkey").value, document.getElementById("id_subkey").value);
            }
            $scope.OnJoin = function() {
                ROP.Subscribe(document.getElementById("idgroup").value);
            }
            $scope.OnUnJoin = function() {
                ROP.UnSubscribe(document.getElementById("idgroup").value);
            }
            $scope.Clear = function(){
                document.getElementById("chat_show").value = ""
            }
        };

        $scope.onSwfReady = function () {
            if ($scope.player1) {
                // audioCodecList
                for (var i = $scope._audioCodecList.options.length - 1; i >= 0; i--) {
                    $scope._audioCodecList.options.remove(i);
                }
                var audioCodecSet = $scope.player1.getAudioCodecSet();
                var audioCodecArray = audioCodecSet.split(',');
                for (audioCodec in audioCodecArray) {
                    var item = new Option(audioCodecArray[audioCodec], audioCodecArray[audioCodec]);
                    $scope._audioCodecList.options.add(item);
                }
                // videoCodecList
                for (var i = $scope._videoCodecList.options.length - 1; i >= 0; i--) {
                    $scope._videoCodecList.options.remove(i);
                }
                var videoCodecSet = $scope.player1.getVideoCodecSet();
                var videoCodecArray = videoCodecSet.split(',');
                for (videoCodec in videoCodecArray) {
                    var item = new Option(videoCodecArray[videoCodec], videoCodecArray[videoCodec]);
                    $scope._videoCodecList.options.add(item);
                }
                // micList
                for (var i = $scope._micList.options.length - 1; i >= 0; i--) {
                    $scope._micList.options.remove(i);
                }
                var micListArray = $scope.player1.getMicList();
                for (var index in micListArray) {
                    var item = new Option(micListArray[index], micListArray[index]);
                    $scope._micList.options.add(item);
                    $scope._micIndexArray.push(index);
                }
                // camList
                for (var i = $scope._camList .options.length - 1; i >= 0; i--) {
                    $scope._camList .options.remove(i);
                }
                var camListArray = $scope.player1.getCamList();
                for (var index in camListArray) {
                    var item = new Option(camListArray[index], camListArray[index]);
                    $scope._camList .options.add(item);
                    $scope._camIndexArray.push(index);
                }
                //vvMediaVersion | clientVersion
                $scope._clientVersion.value = $scope.player1.getClientVersion();
                //HQVersion
                $scope._lowestSupportHQVersion.value = $scope.player1.getLowestSupportHQVersion();
                $scope._HQVersion.value = $scope.player1.getHQVersion();
            }
        }
        $scope.initConnect = function () {
            if ($scope.player1)
                $scope.player1.initConnect($scope._rtmpAddr.value,
                    $scope._rtmpLive.value,
                    $scope._rtmpStream.value,
                    "hangzhou",
                    1500,
                    300,
                    1000,
                    $scope._userID.value,
                    $scope._isHD.checked,
                    $scope._session.value,
                    $scope._isUDP.checked,
                    $scope._key.value);
            $scope._flashVersion.value = $scope.player1.getFlashVersion();
        }
        $scope.closeConnect = function () {
            if ($scope.player1)
                $scope.player1.closeConnect();
        }
        $scope.startPublish = function () {
            if ($scope.player1) {
                var micID = -1;
                for (var i = 0; i < $scope._micIndexArray.length; i++) {
                    if (i == $scope._micList.selectedIndex) {
                        micID = $scope._micIndexArray[i]
                        break;
                    }
                }
                var camID = -1;
                for (var i = 0; i < $scope._camIndexArray.length; i++) {
                    if (i == $scope._camList .selectedIndex) {
                        camID = $scope._camIndexArray[i]
                        break;
                    }
                }
                $scope.player1.startPublish($scope._width.value,
                    $scope._height.value,
                    micID,
                    camID,
                    $scope._audioCodecList.options[$scope._audioCodecList.selectedIndex].value,
                    $scope._videoCodecList.options[$scope._videoCodecList.selectedIndex].value,
                    $scope._audioKBitrate.value,
                    $scope._audioSamplerate.value,
                    $scope._videoFPS .value,
                    $scope._videoKeyFrameInterval.value,
                    $scope._videoKBitrate.value,
                    $scope._videoQuality.value,
                    $scope._volume.value,
                    $scope._isUseCam.checked,
                    $scope._isUseMic.checked,
                    $scope._isHD.checked,
                    $scope._isUDP.checked,
                    $scope._isMute.checked);
            }
        }
        $scope.startPlay = function () {
            if ($scope.player1)
                $scope.player1.startPlay($scope._rtmpStream.value,
                    $scope._bufferTime.value,
                    0,
                    0,
                    0,
                    $scope._volume.value,
                    $scope._isMute.checked);
        }
        $scope.pause = function () {
            if ($scope.player1)
                $scope.player1.pause();
        }
        $scope.stop = function () {
            if ($scope.player1)
                $scope.player1.stop();
        }
        $scope.setAudioCodec = function () {
            if ($scope.player1) {
                var audioCodec = $scope._audioCodecList.options[$scope._audioCodecList.selectedIndex].value;
                $scope.player1.setAudioCodec(audioCodec);
            }
        }
        $scope.setVideoCodec = function () {
            if ($scope.player1) {
                var videoCodec = $scope._videoCodecList.options[$scope._videoCodecList.selectedIndex].value;
                $scope.player1.setVideoCodec(videoCodec);
            }
        }
        $scope.setMic = function () {
            if ($scope.player1) {
                var micID = -1;
                for (var i = 0; i < $scope._micIndexArray.length; i++) {
                    if (i == $scope._micList.selectedIndex) {
                        micID = $scope._micIndexArray[i]
                        break;
                    }
                }
                $scope.player1.setVideoCodec(micID);
            }
        }
        $scope.setCam = function () {
            if ($scope.player1) {
                var camID = -1;
                for (var i = 0; i < $scope._camIndexArray.length; i++) {
                    if (i == $scope._camList .selectedIndex) {
                        camID = $scope._camIndexArray[i]
                        break;
                    }
                }
                $scope.player1.setVideoCodec(camID);
            }
        }
        $scope.setIsUseCam = function () {
            if ($scope.player1) {
                var checked = $scope._isUseCam.checked;
                $scope.player1.setIsUseCam(checked);
            }
        }
        $scope.setIsUseMic = function () {
            if ($scope.player1) {
                var checked = $scope._isUseMic.checked;
                $scope.player1.setIsUseMic(checked);
            }
        }
        $scope.downloadHD = function () {
            if ($scope.player1) {
                $scope.player1.downloadHD();
            }
        }
        $scope.checkPlugin = function () {
            if ($scope.player1) {
                var result = $scope.player1.checkPlugin();
                if (result) {
                    switch (result.status) {
                        case 1:
                            $scope._mediaInfo.value = 'HQPlugin is ready\n' + $scope._mediaInfo.value;
                            break;
                        default:
                            $scope._mediaInfo.value = 'HQPlugin need help: ' + result.info + '\n' + $scope._mediaInfo.value;
                            break;
                    }
                }
                else {
                    document.getElementById("mediaInfo").value += 'HQPlugin check error\n';
                }
            }
        }
        $scope.setCameraMode = function () {
            if ($scope.player1) {
                $scope.player1.setCameraMode($scope._width.value, $scope._height.value, $scope._videoFPS .value);
            }
        }
        $scope.setKeyFrameInterval = function () {
            if ($scope.player1) {
                $scope.player1.setKeyFrameInterval($scope._videoKeyFrameInterval.value);
            }
        }
        $scope.setCameraQuality = function () {
            if ($scope.player1) {
                $scope.player1.setCameraQuality($scope._videoKBitrate.value, $scope._videoQuality.value);
            }
        }
        $scope.setAudioBitrate = function () {
            if ($scope.player1) {
                $scope.player1.setAudioBitrate($scope._audioKBitrate.value);
            }
        }
        $scope.setAudioSamplerate = function () {
            if ($scope.player1) {
                $scope.player1.setAudioSamplerate($scope._audioSamplerate.value);
            }
        }
        $scope.setAudioChannelCount = function () {
            if ($scope.player1) {
                $scope.player1.setAudioChannelCount($scope._audioChannelCount.value);
            }
        }
        $scope.setAudioBitPerSample = function () {
            if ($scope.player1) {
                $scope.player1.setAudioBitPerSample($scope._audioBitPerSample.value);
            }
        }
        $scope.changeServer = function () {
            if ($scope.player1) {
                var addr;
                var lineType;
                var serverString = $scope._changeServerList.options[$scope._changeServerList.selectedIndex].value;
                var serverArray = serverString.split('#');
                if (serverArray.length >= 3) {
                    addr = serverArray[1];
                    lineType = serverArray[2];
                    $scope.player1.changeServer(addr, lineType);
                }
            }
        }
        $scope.setMute = function () {
            if ($scope.player1) {
                $scope.player1.setMute($scope._isMute.checked);
            }
        }
        $scope.setVolume = function () {
            if ($scope.player1) {
                $scope.player1.setVolume($scope._volume.value);
            }
        }
        $scope.setPlayMode = function () {
            if ($scope.player1) {
                $scope.player1.setPlayMode($scope._bufferTime.value, 0, 0, 0);
            }
        }
        $scope.setCapAudioFromMic = function () {
            if ($scope.player1) {
                $scope.player1.setCapAudioFromMic();
            }
        }
        $scope.setCapAudioFromStereo = function () {
            if ($scope.player1) {
                $scope.player1.setCapAudioFromStereo();
            }
        }


})

;

