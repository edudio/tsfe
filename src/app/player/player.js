/**
 * Created by solomon on 15/9/30.
 */

angular.module('teacherstage.player', [
    'ui.router'
])

    .config(function config($stateProvider) {
        $stateProvider.state('player', {
            url: '/player',
            views: {
                "main": {
                    controller: 'PlayerCtrl',
                    templateUrl: 'player/player.tpl.html'
                }
            },
            data: {pageTitle: '观看端'}
        });
    })

    .controller('PlayerCtrl', function PlayerController($scope) {
        $scope.init = function () {

            $scope.playAddr = 'rtmp://3289.lssplay.aodianyun.com/SolomonTest';
            $scope.playStream = 'stream';

            $scope._camIndexArray = [];
            $scope._micIndexArray = [];
            $scope._mediaInfo = document.getElementById("mediaInfo");
            $scope._streamInfo = document.getElementById("streamInfo");
            $scope._isUseCam = true;
            $scope._isUseMic = true;
            $scope._isHD = false;
            $scope._isUDP = false;
            $scope._rtmpAddr = document.getElementById("rtmpAddr");
            $scope._rtmpLive = document.getElementById("rtmpLive");
            $scope._rtmpStream = document.getElementById("rtmpStream");
            $scope._rtmpArea = "hangzhou";
            $scope._schedulingPing = 1500;
            $scope._limitCheckPing = 1000;
            $scope._checkPingTimer = 1000;
            $scope._userID = "10001";
            $scope._session = "123";
            $scope._width = document.getElementById("width");
            $scope._height = document.getElementById("height");
            $scope._audioKBitrate = document.getElementById("audioKBitrate");
            $scope._audioSamplerate = document.getElementById("audioSamplerate");
            $scope._videoFPS = document.getElementById("videoFPS");
            $scope._videoKBitrate = document.getElementById("videoKBitrate");
            $scope._videoQuality = 80;
            $scope._volume = document.getElementById("volume");
            $scope._isMute = document.getElementById("isMute");
            $scope._avgPing = 200;
            $scope._audioChannelCount = 2;
            $scope._audioBitPerSample = 16;
            //$scope._bufferTime = 2;
            $scope._videoCodec = "h264";
            $scope._audioCodec = "Nellymoser";
            $scope._rtmpKey = document.getElementById("rtmpKey");
            $scope._totalFlow = document.getElementById("totalFlow");
            $scope._avgBitrate = document.getElementById("avgBitrate");
            $scope._maxBitrate = document.getElementById("maxBitrate");
            $scope._playStartTimestamp = Date.parse(new Date());
            $scope._fullScreenMode = document.getElementById("fullScreenMode");
            $scope._bufferTime = document.getElementById("buffertime");
            $scope._tTimeStamp = 0;
            $scope._ctimeStamp = 0;
            $scope._ptimeStamp = 0;
            $scope._ckey = 0;
            $scope._pkey = 0;
            $scope._server = "live";
            $scope._poster = "";
            $scope._posterWidth = 0;
            $scope._posterHeight = 0;
            $scope._adveDeAddr = "";
            $scope._adveReAddr = "";


            //////////////////

            $scope._tTimeStamp = getQueryStr("t");
            $scope._ckey = getQueryStr("ck");
            $scope._ctimeStamp = getQueryStr("ct");
            $scope._pkey = getQueryStr("pk");
            $scope._ptimeStamp = getQueryStr("pt");
            $scope._server = getQueryStr("server");
            $scope._poster = getQueryStr("poster");
            $scope._adveDeAddr = getQueryStr("adLink");
            $scope._adveReAddr = getQueryStr("poster");
            $scope._posterWidth = getQueryStr("posterWidth");
            $scope._posterHeight = getQueryStr("posterHeight");

            if ($scope._tTimeStamp && !$scope._ctimeStamp)
                $scope._ctimeStamp = $scope._tTimeStamp;

            //alert("\n$scope._ckey: " + $scope._ckey+"\n$scope._ctimeStamp: " + $scope._ctimeStamp+"\n$scope._pkey: " + $scope._pkey+"\n$scope._ptimeStamp: " + $scope._ptimeStamp);
            if ($scope._ckey)
                if ($scope._ctimeStamp)
                    $scope._rtmpAddr.value = getQueryStr("addr") + "?k=" + $scope._ckey + "&t=" + $scope._ctimeStamp;
                else
                    $scope._rtmpAddr.value = getQueryStr("addr") + "?k=" + $scope._ckey;
            else
                //$scope._rtmpAddr.value = getQueryStr("addr");
                $scope._rtmpAddr.value = $scope.playAddr;


            if ($scope._pkey)
                if ($scope._ptimeStamp)
                    $scope._rtmpStream.value = getQueryStr("stream") + "?k=" + $scope._pkey + "&t=" + $scope._ptimeStamp;
                else
                    $scope._rtmpStream.value = getQueryStr("stream") + "?k=" + $scope._pkey;
            else
                //$scope._rtmpStream.value = getQueryStr("stream");
                $scope._rtmpStream.value = $scope.playStream;

            $scope._rtmpLive.value = getQueryStr("app");
            $scope._rtmpKey.value = getQueryStr("key");

            //////////////////////
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
                                    break;
                                case "NetConnection.Connect.Success":
                                case "ChangeInfo.NetConnection.Connect.Success":
                                case "new connect":
                                    break;
                                case SCHEDULE_FINISH:
                                    $scope.startPlay_();
                                    break;
                                case RTMP_PEPFLASH:
                                    alert("警告：\n\n系统检测到您正在使用 Pepper Flash Player，\n\n此版本的 Flash 并不完善，请尝试更换IE浏览器，\n\n或百度“如何禁用Pepper Flash”。");
                                    $scope.closeConnect();
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
                            $scope.initArgc();
                            break;
                        case RTMP_MEDIA_NETSTREAM_INFO:
                            $scope._streamInfo.value = info;
                            // $scope.initArgc();
                            break;
                        case RTMP_MEDIA_STATISTICS:
                            var obj = JSON.parse(info);
                            if (obj) {
                                if (obj.totalFlow >= 1048576) {
                                    $scope._totalFlow.value = (obj.totalFlow / 1048576).toFixed(2) + "MB";
                                } else {
                                    $scope._totalFlow.value = (obj.totalFlow / 1024).toFixed(2) + "KB";
                                }
                                $scope._avgBitrate.value = (obj.avgBitrate / 1000).toFixed(2) + "kb";
                                $scope._maxBitrate.value = (obj.maxBitrate / 1000).toFixed(2) + "kb";
                            }
                            break;
                        default:
                            break;
                    }
                    if (type != RTMP_MEDIA_NETSTREAM_INFO && type != RTMP_MEDIA_STATISTICS) {
                        var date = new Date();
                        $scope._mediaInfo.value = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + ' ' + info + '\n' + $scope._mediaInfo.value;
                    }
                },
                null);


        };


        var LocString = String(window.document.location.href);
        //http://demo.aodianyun.com/lss/hlsplay/player.html?addr=rtmp://3289.lssplay.aodianyun.com/SolomonTest&stream=stream
        function getQueryStr(str) {
            var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp;
            if (tmp = rs) {
                return tmp[2];
            }
            return "";
        }

        //测试接口

        // $scope.testDisplay=function(){
        // 	alert("hello");
        // 	if ($scope.player1)
        // 		$scope.player1.testDisplay();
        // }
        $scope.initArgc = function () {
            if ($scope.player1) {
                //$scope.player1.initArgc("http://www.aodianyun.com/","http://www.qqtouxiang888.com/uploads/allimg/101121/112J94056-2.jpg",320,240);
                $scope.player1.initArgc($scope._adveDeAddr, $scope._adveReAddr, $scope.$scope._posterWidth, $scope.$scope._posterHeight);
            }

        }


        // $scope.setBuffertime=function(){
        //    if ($scope.player1){
        //      $scope.player1.setBuffertime($scope.$scope._bufferTime.value*1000);
        //    }
        //  }

        $scope.onSwfReady = function () {
            function setRateFlow(){
                $scope.setByteCount();
                $scope.setAvgBitrate();
                $scope.setMaxBitrate();
                $scope.setPlayStreamInfo();
            };

            if ($scope.player1) {
                var id = window.setInterval(setRateFlow, 1000);
            }
        };



        $scope.setByteCount = function () {
            var tempTotalFlow = $scope.player1.getByteCount();

            if (tempTotalFlow > 0) {
                if (tempTotalFlow >= 1048576) {
                    $scope._totalFlow.value = (tempTotalFlow / 1048576).toFixed(2) + "MB";
                } else {
                    $scope._totalFlow.value = (tempTotalFlow / 1024).toFixed(2) + "KB";
                }
            }
        }
        $scope.setAvgBitrate = function () {
            var playTimestamp = Date.parse(new Date());
            var tempTotalFlow = $scope.player1.getByteCount();
            $scope._avgBitrate.value = ((tempTotalFlow * 8) / (playTimestamp - $scope._playStartTimestamp)).toFixed(2) + "kb";
        }
        $scope.setMaxBitrate = function () {
            var tempTotalFlow = $scope.player1.getMaxBitrate();
            $scope._maxBitrate.value = (tempTotalFlow / 1000).toFixed(2) + "kb";
        }
        $scope.setPlayStreamInfo = function () {
            //$scope._streamInfo.value =  $scope.player1.getPlayStreamInfo();
            //$scope._streamInfo.value = $scope.player1.getCurrentFPS();
            var _playStreamInfoStr = "当前帧率:	" + $scope.player1.getCurrentFPS().toFixed(2) + "\n" +
                "音频码率:	" + $scope.player1.getAudioBytesPerSecond().toFixed(2) + "(kbps)\n" +
                "视频码率:	" + $scope.player1.getVideoBytesPerSecond().toFixed(2) + "(kbps)\n" +
                "当前码率:	" + $scope.player1.getCurrentBytesPerSecond().toFixed(2) + "(kbps)\n" +
                    //"关键帧间隔:     " + $scope.player1.getKeyFrameInterval() +   "\n" +
                "接受字节数:	" + $scope.player1.getCurrentByteCount() + "(byte)\n" +
                "缓冲区时间:	" + $scope.player1.getBufferLength() + "(s)\n" +
                "音频缓冲区时间:	" + $scope.player1.getAudioBufferLength() + "(s)\n" +
                "视频缓冲区时间:	" + $scope.player1.getVideoBufferLength() + "(s)\n" +
                "音频编码:	" + $scope.player1.getAudioCodec() + "\n" +
                "视频编码:	" + $scope.player1.getVideoCodec() + "\n" +
                "原始视频宽度:	" + $scope.player1.getVideoWidth().toString() + "\n" +
                "原始视频高度:	" + $scope.player1.getVideoHeight().toString() + "\n";
            $scope._streamInfo.value = _playStreamInfoStr;

        }

        $scope.initConnect = function () {
            if ($scope.player1)
                $scope.player1.initConnect($scope._rtmpAddr.value,
                    $scope._rtmpLive.value,
                    $scope._rtmpStream.value,
                    $scope._rtmpArea,
                    $scope._schedulingPing,
                    $scope._limitCheckPing,
                    $scope._checkPingTimer,
                    $scope._userID,
                    $scope._isHD,
                    $scope._session,
                    $scope._isUDP,
                    $scope._rtmpKey.value
                );
        }

        $scope.initConnectad = function () {
            if ($scope.player1)
                $scope.player1.initConnectad();
            //alert("heiho");
        }

        $scope.closeConnect = function () {
            if ($scope.player1)
                $scope.player1.closeConnect();
        }

        $scope.startPublish = function () {
            if ($scope.player1) {
                var micID = -1;
                for (var i = 0; i < $scope._micIndexArray.length; i++) {
                    if (i == _micList.selectedIndex) {
                        micID = $scope._micIndexArray[i]
                        break;
                    }
                }
                var camID = -1;
                for (var i = 0; i < $scope._camIndexArray.length; i++) {
                    if (i == _camList.selectedIndex) {
                        camID = $scope._camIndexArray[i]
                        break;
                    }
                }
                $scope.player1.startPublish($scope._width.value,
                    $scope._height.value,
                    micID,
                    camID,
                    $scope._audioCodec,
                    $scope._videoCodec,
                    $scope._audioKBitrate.value,
                    $scope._audioSamplerate.value,
                    $scope._videoFPS.value,
                    $scope._videoFPS.value * 3,
                    $scope._videoKBitrate.value,
                    $scope._videoQuality,
                    $scope._volume.value,
                    $scope._isUseCam,
                    $scope._isUseMic,
                    $scope._isHD,
                    $scope._isUDP,
                    $scope._isMute.checked);
            }
        }
        $scope.startPlay_ = function () {
            if ($scope.player1)
                $scope.player1.startPlay_(
                    $scope._rtmpStream.value,
                    $scope.$scope._bufferTime.value,
                    0,
                    0,
                    0,
                    $scope._volume.value,
                    $scope._isMute.checked
                );
            $scope._playStartTimestamp = Date.parse(new Date());
        }
        $scope.pause = function () {
            if ($scope.player1)
                $scope.player1.pause();
        }
        $scope.stop = function () {
            if ($scope.player1)
                $scope.player1.stop();
        }
        $scope.setBuffertime = function () {
            if ($scope.player1) {
                $scope.player1.setBuffertime($scope.$scope._bufferTime.value * 1000);
            }
        }
        $scope.setFullScreenMode = function () {

            if ($scope.player1) {
                $scope.player1.setFullScreenMode($scope._fullScreenMode.value);
            }
        }
        $scope.setAudioCodec = function () {
            if ($scope.player1) {
                $scope.player1.setAudioCodec($scope._audioCodec);
            }
        }
        $scope.setVideoCodec = function () {
            if ($scope.player1) {
                $scope.player1.setVideoCodec($scope._videoCodec);
            }
        }
        $scope.setMic = function () {
            if ($scope.player1) {
                var micID = -1;
                for (var i = 0; i < $scope._micIndexArray.length; i++) {
                    if (i == _micList.selectedIndex) {
                        micID = $scope._micIndexArray[i]
                        break;
                    }
                }
                $scope.player1.setAudioCodec(micID);
            }
        }

        $scope.setCam = function () {
            if ($scope.player1) {
                var camID = -1;
                for (var i = 0; i < $scope._camIndexArray.length; i++) {
                    if (i == _camList.selectedIndex) {
                        camID = $scope._camIndexArray[i]
                        break;
                    }
                }
                $scope.player1.setVideoCodec(camID);
            }
        }
        $scope.setIsUseCam = function () {
            if ($scope.player1) {
                $scope.player1.setIsUseCam($scope._isUseCam);
            }
        }
        $scope.setIsUseMic = function () {
            if ($scope.player1) {
                $scope.player1.setIsUseMic($scope._isUseMic);
            }
        }
        $scope.setCameraMode = function () {
            if ($scope.player1) {
                $scope.player1.setCameraMode($scope._width.value, $scope._height.value, $scope._videoFPS.value);
            }
        }
        $scope.setCameraQuality = function () {
            if ($scope.player1) {
                $scope.player1.setCameraQuality($scope._videoKBitrate.value, $scope._videoQuality);
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
    });