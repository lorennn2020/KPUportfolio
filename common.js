import { volcanoSTART } from './seaVolcano.js';
///////  variable declaration  //////////////////

// 全域參數宣告
var gameFramePos = $("#game_frame").position();
$(window).resize(function() {
    gameFramePos = $("#game_frame").position();
});

var $bag_spaceLR;

var $gameFrameleft = $('#game_frame').offset().left;

var $desertJeff = $('#desert_Jeff');
var $desert_Jeff_drawWater = $('#desert_Jeff_drawWater');
var $desertJeffLeft = 102;
var $desertPos = 0;

var $toHome, $toSea, $toDesert;
var $taking, $clicking, $bag_spaceLR, $mousePosX, $mousePosY, $ingredientsBlock;

function init() {
    // console.log($(window).height());
    // console.log($(window).width());

    //////////// ＬＩＧＨＴＢＯＸ ////////////////////

    // 點擊lightbox底 關閉所有lightbox
    $('#game_lightbox').click(function (event) {
        $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
        // audio_clickOff.play();
        event.stopPropagation(); // 阻止泡泡事件
    });
    // 背包
    $('.btn_bag').click(function (event) {
        $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
        $('#game_lightbox').addClass('c_showLightbox bagShow');
        event.stopPropagation(); // 阻止泡泡事件
    });
    // 地圖
    $('.btn_map').click(function (event) {
        $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
        $('#game_lightbox').addClass('c_showLightbox mapShow');
        event.stopPropagation(); // 阻止泡泡事件
    });
    // home 像框
    $('#photoS').click(function (event) {
        $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
        $('#game_lightbox').addClass('c_showLightbox lightFrameShow');
        event.stopPropagation(); // 阻止泡泡事件
    });
    //////////// ＬＩＧＨＴＢＯＸ end ///////////////
    ////////////  ＢＡＧ  /////////////////////////

    $('#bag').click(function (event) {
        event.stopPropagation(); // 阻止泡泡事件
    });
    $('#bag_close').click(function (event) {
        $('.c_showLightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
        event.stopPropagation(); // 阻止泡泡事件
    });
    
    function ifCatchBothBagShine() {
        if($('#bag').children().hasClass('gotSeaWorm') && $('#bag').children().hasClass('gotDesertWorm') ){
            $('.btn_bag').addClass('jump');
        }
    }

    ////////////  ＢＡＧ end  /////////////////////
    //////////// BAG CAPSULE TO HOME STOVE ///////
    $('.bag_space.L').click(function (e) {
        $('#bag').addClass('taking');
        $bag_spaceLR = 1;

        $mousePos(e);

        $clicking = $(this);
        taking($clicking);

        // 關閉包包
        $('.c_showLightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');

        //放到爐子上，或關閉包包重置包包狀態
    });
    $('.bag_space.R').click(function (e) {
        $('#bag').addClass('taking');
        $bag_spaceLR = 2;

        $mousePos(e);

        $clicking = $(this);
        taking($clicking);

        // 關閉包包
        $('.c_showLightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
    });

    // 判別taking worm
    function taking() {
        if ($clicking.hasClass('gotSeaWorm') == true) {
            $taking = 1;
            $('#ingredientsBlock i').addClass('seaWorm');
        } else if ($clicking.hasClass('gotDesertWorm') == true) {
            $taking = 2;
            $('#ingredientsBlock i').addClass('desertWorm');
        } else {
            console.log('sth went wrong :(');
        }
        mouseMove();
    }

    // 判別滑鼠位置
    function $mousePos(e) {
        $mousePosX = e.pageX - gameFramePos.left;
        $mousePosY = e.pageY - gameFramePos.top;
        // console.log("$mousePosX:",$mousePosX," ; $mousePosY:",$mousePosY);
    }

    // 跟隨滑鼠移動 獲取數值
    function mouseMove() {
        ingredientsMove();

        $(document).mousemove(function (e) {
            if ($taking == 1 || $taking == 2) {
                console.log('$taking: ', $taking);

                $mousePos(e);
                ingredientsMove();
            }
        });
    }

    // 跟隨滑鼠移動 調整樣式
    function ingredientsMove() {
        $('#ingredientsBlock i').css({
            position: 'fixed',
            top: $mousePosY + 'px',
            left: $mousePosX + 'px',
        });
        console.log('$mousePosXtop:', $mousePosX, ' ; $mousePosY:', $mousePosY);
    }

    // worm 加入鍋子
    $('#ingredientsBlock').click(function () {
        if ($taking == 1) {
            // console.log("A");

            setTimeout(function () {
                $('#ingredientsBlock #animaSea').show();
            }, 500);
            setTimeout(function () {
                $('#ingredientsBlock #animaSea').remove();
            }, 2000);

            $('#ingredientsBlock #A').addClass('full');
            removeOrigWorm();
        } else if ($taking == 2) {
            // console.log("B");

            setTimeout(function () {
                $('#ingredientsBlock #animaDesert').show();
            }, 500);
            setTimeout(function () {
                $('#ingredientsBlock #animaDesert').remove();
            }, 2000);

            $('#ingredientsBlock #B').addClass('full');
            removeOrigWorm();
        } else {
            console.log('nothing put in');
        }
    });

    //  點其他位置，取消拿膠囊狀態
    $('#frame_home , #frame_home div:not(#ingredientsBlock)').click(function () {
        $('#bag').removeClass('taking');
        $taking, $mousePosX, ($mousePosY = 0);
    });

    // 移除背包worm
    function removeOrigWorm() {
        setTimeout(function () {
            $('#ingredientsBlock span').animate({ left: '24px' });
        }, 3000);

        // 是否finalEnding？
        if ($('#ingredientsBlock #A').hasClass('full') == true && $('#ingredientsBlock #B').hasClass('full') == true) {
            finalEnding();
        }

        $('#ingredientsBlock i').removeClass('seaWorm , desertWorm');
        $('#bag').removeClass('taking');

        if ($bag_spaceLR == 1) {
            $('.bag_space.L').removeClass('gotSeaWorm , gotDesertWorm');
            $('.bag_space.L').addClass('end');
        } else if ($bag_spaceLR == 2) {
            $('.bag_space.R').removeClass('gotSeaWorm , gotDesertWorm');
            $('.bag_space.R').addClass('end');
        } else {
            console.log('sth went wrong :(');
        }

        // 移除所有相關數值
        $ingredientsBlock, $bag_spaceLR, $mousePosX, $mousePosY, $taking, ($clicking = '');
    }
    //////////// BAG CAPSULE TO HOME STOVE end ///
    ////////////   ＭＡＰ  /////////////////////////

    $('#map').click(function (event) {
        event.stopPropagation(); // 阻止泡泡事件
    });

    $('#map_close').click(function (event) {
        $('.c_showLightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
        event.stopPropagation(); // 阻止泡泡事件
    });

    // 地圖hover 顯示文字
    $('#map #location_home').mouseenter(function () {
        // console.log(":visible ",$("#map #map_text_bg").is(':visible'));
        if ($('#map #map_text_bg').is(':visible') == false) {
            $('#map #map_text').text('Home');
            $('#map #map_btn_y , #map #map_btn_n').hide();
            $('#map #map_text_bg').show();
        }
    });
    
    $('#map #location_desert').mouseenter(function () {
        // console.log(":visible ",$("#map #map_text_bg").is(':visible'));
        if ($('#map #map_text_bg').is(':visible') == false) {
            $('#map #map_text').text('Desert');
            $('#map #map_btn_y , #map #map_btn_n').hide();
            $('#map #map_text_bg').show();
        }
    });
    $('#map #location_sea').mouseenter(function () {
        // console.log(":visible ",$("#map #map_text_bg").is(':visible'));
        if ($('#map #map_text_bg').is(':visible') == false) {
            $('#map #map_text').text('Sea');
            $('#map #map_btn_y , #map #map_btn_n').hide();
            $('#map #map_text_bg').show();
        }
    });

    $('#map #location_home , #map #location_desert , #map #location_sea').mouseout(function () {
        mapMouseout();
    });
    
    function mapMouseout() {
        if ($toHome == 1 || $toSea == 1 || $toDesert == 1) {
        } else {
            $('#map #map_text_bg').hide();
            $('#map #map_text').text('');
        }
    }

    // 點擊地圖
    $('#map #location_home').click(function () {
        $toHome = 1;
        $('#map #map_text').text('Are you sure want to go Home?');
        $('#map #map_btn_y , #map #map_btn_n').show();
        $('#map #map_text_bg').show();
    });
    $('#map #location_sea').click(function () {
        $toSea = 1;
        $('#map #map_text').text('Are you sure want to go to the Sea?');
        $('#map #map_btn_y , #map #map_btn_n').show();
        $('#map #map_text_bg').show();
    });
    $('#map #location_desert').click(function () {
        $toDesert = 1;
        $('#map #map_text').text('Are you sure want to go to Desert?');
        $('#map #map_btn_y , #map #map_btn_n').show();
        $('#map #map_text_bg').show();
    });

    // 地圖 是否前往？
    $('#map #map_btn_y').click(function () {
        $('#frame_home').removeClass('begining');

        $('#map #map_text_bg').hide();
        $('.toSea').removeClass('toSea');
        $('.toDesert').removeClass('toDesert');
        $('.desertToHome').removeClass('seaToHome desertToHome');
        $('.DesertToSea').removeClass('DesertToSea');
        $('.SeaToDesert').removeClass('SeaToDesert');
        $('.atSea').removeClass('atHome atSea atDesert');
        // $('.opening').removeClass('opening');

        // 解除 jeff, submarine 凍結（開關地圖會導致動畫重新跑）
        $('#map #map_jeff , #map #map_submarine').removeClass('paused');

        if ($('#map #location_home').hasClass('here') == true && $toSea == 1) {
            // Home to Sea 7s
            $('#map').addClass('toSea');
            $('#map .here').removeClass('here');

            setTimeout(function () {
                $('#map #location_sea').addClass('here');

                //// 前往sea
                $('.c_frameNow').removeClass('c_frameNow');
                $('#frame_volcano').addClass('c_frameNow');
                volcanoSTART();
            }, 6900);

            $toSea = 0;

            setTimeout(function () {
                $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
            }, 7400);

        } else if ($('#map #location_home').hasClass('here') == true && $toDesert == 1) {
            // Home to Desert 7s
            $('#map').addClass('toDesert');
            $('#map .here').removeClass('here');

            setTimeout(function () {
                $('#map #location_desert').addClass('here');
                $('.c_frameNow').removeClass('c_frameNow');
                $('#frame_desert').addClass('c_frameNow');
                desertSTART();
            }, 6900);

            $toDesert = 0;
            setTimeout(function () {
                $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
            }, 7900);

        } else if ($('#map #location_desert').hasClass('here') == true && $toSea == 1) {
            // Desert to Sea 15s
            $('#map').addClass('DesertToSea');
            $('#map .here').removeClass('here');

            setTimeout(function () {
                $('#map #location_sea').addClass('here');

                //// 前往sea
                // $('#frame_volcano').addClass('open');
                $('.c_frameNow').removeClass('c_frameNow');
                $('#frame_volcano').addClass('c_frameNow');
                volcanoSTART();
            }, 14900);

            $toSea = 0;
            setTimeout(function () {
                $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
            }, 15400);

        } else if ($('#map #location_desert').hasClass('here') == true && $toHome == 1) {
            // Desert to Home 6s
            $('#map').removeClass('toDesert');
            $('#map').addClass('desertToHome');
            $('#map .here').removeClass('here');

            setTimeout(function () {
                $('#map #location_home').addClass('here');
                $('.c_frameNow').removeClass('c_frameNow');
                $('#frame_home').addClass('c_frameNow');
                homeSTART();
            }, 5900);

            $toHome = 0;
            setTimeout(function () {
                ifCatchBothBagShine()
                $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
            }, 6900);

        } else if ($('#map #location_sea').hasClass('here') == true && $toHome == 1) {
            // Sea to Home 7s 不明頓點？？？
            $('#map').removeClass('toSea');
            $('#map').addClass('SeaToHome');
            $('#map .here').removeClass('here');

            setTimeout(function () {
                $('#map #location_home').addClass('here');
                $('.c_frameNow').removeClass('c_frameNow');
                $('#frame_home').addClass('c_frameNow');
                homeSTART();
            }, 6900);

            $toHome = 0;
            setTimeout(function () {
                ifCatchBothBagShine()
                $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
            }, 7900);
        } else if ($('#map #location_sea').hasClass('here') == true && $toDesert == 1) {
            // Sea to Desert 15s 測試中
            $('#map').addClass('SeaToDesert');
            $('#map .here').removeClass('here');

            setTimeout(function () {
                $('#map #location_desert').addClass('here');
                $('.c_frameNow').removeClass('c_frameNow');
                $('#frame_desert').addClass('c_frameNow');
                desertSTART();
            }, 14900);

            $toDesert = 0;
            setTimeout(function () {
                $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
            }, 15900);
        } else {
            console.log('something went wrong :(');
        }
    });
    $('#map #map_btn_n').click(function () {
        $('#map #map_text_bg').hide();
    });

    // 地圖 回家提示
    function checkGotBothworms() {
        if($('#map').hasClass('dsertFin') && $('#map').hasClass('seaFin') ){
            $('#location_home').addClass('goHomeHint');
        }
    }
    ////////////   ＭＡＰ end   //////////////////////
    ////////////   ＢＥＧＩＮＩＮＧ  ///////////////////
    $('#game_menu #menu_start').click(function () {
        $('#game_frame').addClass('starting');
        doctorSTART();
    });
    ////////////   ＢＥＧＩＮＩＮＧ end  ///////////////
    ////////////   ＤＯＣＴＯＲＳ  /////////////////////
    function doctorSTART() {
        // 模糊效果
        for (let $i = 5; $i < 21; $i++) {
            console.log('$i:', $i);

            let $doctorBurTimeout = setTimeout(function () {
                if ($('#doctors_opening feMorphology:nth-child(5)').attr('radius') == 2) {
                    setTimeout(function () {
                        $doctorBurTimeout = 0;
                        $('#doctors_opening').remove();
                    }, 100);
                } else {
                    $('#doctors_opening feMorphology:nth-child(5)').remove();
                }
            }, 90 * $i);
        }
        setTimeout(function () {
            $('#game_menu').remove();
        }, 1200);

        // 醫師診斷 貓快死了
        setTimeout(function () {
            // $('#frame_doctors #doctors_anima01').css('background-image', 'url(img/animation-doctors01.gif)');
            $('#frame_doctors #doctors_anima01').css('background-image', 'url(img/animation-doctors_900x600.gif)');
        }, 1460);

        setTimeout(function () {
            $('#frame_doctors #doctors_img01').css({ 'z-index': '2', opacity: '1' });
            $('#frame_doctors #doctors_anima01').remove();
        }, 10660);

        // 轉場
        setTimeout(function () {
            $('#frame_doctors #doctors_img01').css('top', '-100%');
            $('#frame_doctors #doctors_homeSadBegin').css({ 'z-index': '2', opacity: '1', top: '0%' });
            $('#frame_doctors #doctors_BG').css('background-color', '#2e333c');
        }, 11660);

        // 回家哭哭，撿傳單
        setTimeout(function () {
            // $('#frame_doctors #doctors_homeSad').css('background-image', 'url(img/animation-homeSad.gif)'); // 9.5s
            $('#frame_doctors #doctors_homeSad').css('background-image', 'url(img/animation-homeSad_900x600.gif)'); // 9.5s
            $('#frame_doctors #doctors_img01').remove();
        }, 12760);

        setTimeout(function () {
            $('#frame_doctors #doctors_homeSadImg').css({ 'z-index': '5', opacity: '1' });
        }, 21760);

        // 傳單pop up
        setTimeout(function () {
            $('#frame_doctors #doctors_homeSadBegin').remove();
            $('#frame_doctors #doctors_homeSad').remove();
            $('#frame_doctors #doctors_homeSadAD').css({ 'z-index': '7', top: '50%' });
        }, 22560);

        // 點擊前往怪奇實驗室
        $('#frame_doctors #doctors_homeSadCTA').click(function () {
            $('#frame_doctors #doctors_homeSadImg').css({ transition: 'top 1.0s', top: '-100%' });
            $('#frame_doctors #weirdDoctorBG').css({ top: '0%' });
            $('#frame_doctors #doctors_BG').css('background-color', '#251e35');

            // 轉場
            setTimeout(function () {
                $('#frame_doctors #doctors_homeSadAD').css('top', '160%');
                $('#frame_doctors #doctors_weirdDoctorEquip , #frame_doctors #doctors_weirdDoctorFront').css({ top: '0%' });
                $('#frame_doctors #doctors_homeSadImg').remove();
            }, 1000);

            // weirdDoctorEquip 動畫開始
            setTimeout(function () {
                // $('#frame_doctors #doctors_animaEquip').css('background-image', 'url(img/animatiom-weirdDoctorEquip.gif)'); // 8.3s
                $('#frame_doctors #doctors_animaEquip').css('background-image', 'url(img/animatiom-weirdDoctorEquip_900x600.gif)'); // 3s
                $('#frame_doctors #doctors_weirdDoctorFront').addClass('show');
            }, 2000);

            setTimeout(function () {
                $('#frame_doctors #doctors_homeSadAD').remove();
                $('#frame_doctors #doctors_animaEquip').remove();
                $('#frame_doctors #doctors_weirdDoctorEquip').addClass('fade');
            // }, 10300);
            }, 5000);

            // weirdDoctorFront 動畫開始
            setTimeout(function () {
                // $('#frame_doctors #doctors_animaFront').css('background-image', 'url(img/animatiom-weirdDoctorFront.gif)'); // 29s
                $('#frame_doctors #doctors_animaFront').css('background-image', 'url(img/animatiom-weirdDoctorFront_900x600.gif)'); // 29s
                $('#frame_doctors #doctors_weirdDoctorFront').remove();
            // }, 10800);
            }, 5500);

            setTimeout(function () {
                //返家
                $('#frame_home').addClass('begining');
            // }, 37800);
            }, 32500);

            setTimeout(function () {
                $('#frame_doctors #doctors_weirdDoctorMain').css('opacity', '1');
                $('#frame_doctors #doctors_animaFront').remove();
            // }, 39800);
            }, 34500);

            // 返家後開啟地圖
            setTimeout(function () {
                $('#game_lightbox').addClass('c_showLightbox mapShow');
                $('#map #map_text').text('Where you want to go first?');
                $('#map #map_btn_y , #map #map_btn_n').hide();
                $('#map #map_text_bg').show();

                $('#frame_btnBtm').removeClass('hide');
                $('#frame_doctors').remove();
            // }, 41500);
            }, 36200);
        });
    }

    ////////////   ＤＯＣＴＯＲＳ end  ////////////////
    ////////////   ＨＯＭＥ  /////////////////////////

    // 點擊畫面移動James
    function homeSTART() {
        $('#frame_home').addClass('opening');
        $('#frame_home').show();
    }
    ////////////   ＨＯＭＥ end  /////////////////////

    ////////////   ＳＥＡ ＶＯＬＣＡＮＯ   /////////////

    // capsule放進包包 animation
    $('#frame_volcano #success_btn').click(function () {
        $(this).fadeOut();
        $('#frame_volcano #text').removeClass('show');
        $('#frame_volcano #success_bg').addClass('hide');
        $('#frame_volcano #capsule').addClass('shrink');
        $('#frame_btnBtm .btn_bagOpen').addClass('open');

        //移除包包打開gif
        setTimeout(function () {
            $('#frame_btnBtm .btn_bagOpen').removeClass('open');
        }, 1810);

        setTimeout(function () {
            $('#map #map_text').text('Where you want to go next?');
            $('#map #map_text_bg').show();
            $('#map #map_btn_y , #map #map_btn_n').hide();

            // 自動開啟地圖
            $('#game_lightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
            $('#game_lightbox').addClass('c_showLightbox mapShow');
        }, 2210);

        setTimeout(function () {
            $('#frame_volcano #success').fadeOut();
        }, 2510);

        setTimeout(function () {
            // 移除 Map Sea
            $('#map').addClass('seaFin');
            checkGotBothworms();
        }, 4510);
    });
    
    ////////////   ＳＥＡ ＶＯＬＣＡＮＯ end   ///////////////////
    ////////////   ＤＥＳＥＲＴ   ///////////////////
    function desertSTART() {
        $('#frame_desert').addClass('opening');
        $('#frame_desert').show();

        // Start
        setTimeout(() => {
            $('#frame_desert #c_instruction').fadeIn();
        }, 3900);

        // 迴圈生成puzzle
        for (let i = 1; i < 13; i++) {
            $('#bucket_puzzle02').append('<i id="puzzle02_' + i + '" style="background-image: url(img/scene-desert_well_inner02-' + i + '.svg )"></i>');
        }
        for (let i = 1; i < 36; i++) {
            $('#bucket_puzzle03').append('<i id="puzzle03_' + i + '" style="background-image: url(img/scene-desert_well_inner03-' + i + '.svg )"></i>');
        }

        // 鍵盤控制 demo
        window.addEventListener(
            'keydown',
            function (e) {
                var desertDemoID = e.code;

                if (desertDemoID === 'KeyA') {
                    console.log('A');
                    $('#frame_desert #start_keyboard01 i:nth-child(1)').addClass('down');
                }
                if (desertDemoID === 'KeyD') {
                    console.log('D');
                    $('#frame_desert #start_keyboard01 i:nth-child(2)').addClass('down');
                }
                if (desertDemoID === 'Space') {
                    console.log('Spacebar');
                    $('#frame_desert #start_keyboard02 i:nth-child(1)').addClass('down');
                }
            },
            false
        );
        window.addEventListener(
            'keyup',
            function (e) {
                var desertDemokeyupID = e.code;
                if (desertDemokeyupID === 'KeyA') {
                    console.log('A');
                    $('#frame_desert #start_keyboard01 i:nth-child(1)').removeClass('down');
                }
                if (desertDemokeyupID === 'KeyD') {
                    console.log('D');
                    $('#frame_desert #start_keyboard01 i:nth-child(2)').removeClass('down');
                }
                if (desertDemokeyupID === 'Space') {
                    console.log('Spacebar');
                    $('#frame_desert #start_keyboard02 i:nth-child(1)').removeClass('down');
                }
            },
            false
        );

        // START!
        $('#frame_desert #start_btn').click(function () {
            window.removeEventListener('keydown,keyup', function () {
                console.log('removeEventListener keydown,keyup FAIL');
            });
            $('#frame_desert #c_instruction').fadeOut();

            // camelCaravan 1s move 1 pixel
            var $camelCaravanPos = 640;
            setInterval(() => {
                if ($camelCaravanPos < -218) {
                    $camelCaravanPos = 2010;
                }
                $camelCaravanPos = $camelCaravanPos - 3;
                // console.log($camelCaravanPos);
                $('#desert_camelCaravan').css('left', $camelCaravanPos + 'px');
            }, 1000);

            // AD Space 控制Jeff
            window.addEventListener(
                'keydown',
                function (e) {
                    var desertKeyID = e.code;
                    var $desertJeffOffsetDistance = parseInt($('#desert_Jeff').offset().left) - parseInt($gameFrameleft);

                    console.log('$desertPos: ', $desertPos);
                    // console.log("$desertJeffLeft: ",$desertJeffLeft);
                    console.log('$desertJeffOffsetDistance: ', $desertJeffOffsetDistance);

                    if (desertKeyID === 'KeyA') {
                        console.log('A');
                        $desertJeff.css('background-image', 'url(img/scene-desert_manWalk.gif)');
                        $desertJeff.css('transform', 'rotateY(180deg)');

                        if ($desertJeffOffsetDistance > 101) {
                            $desertJeffLeft = $desertJeffLeft - 12;
                            $desertJeff.css('left', $desertJeffLeft + 'px');
                        } else {
                            // 控制背景向右
                            if ($desertPos < 0) {
                                $desertPos = $desertPos + 12;
                                $('#frame_desert').css('left', $desertPos + 'px');
                                $desertJeffLeft = $desertJeffLeft - 12;
                                $desertJeff.css('left', $desertJeffLeft + 'px');
                            }
                        }
                    }
                    if (desertKeyID === 'KeyD') {
                        console.log('D');

                        $desertJeff.css('transform', 'rotateY(0deg)');

                        if ($desertPos > -1044) {
                            console.log('$desertPos:', $desertPos);

                            if ($desertJeffOffsetDistance < 700) {
                                $desertJeff.css('background-image', 'url(img/scene-desert_manWalk.gif)');

                                $desertJeffLeft = $desertJeffLeft + 12;
                                $desertJeff.css('left', $desertJeffLeft + 'px');
                            } else {
                                $desertPos = $desertPos - 12;
                                $('#frame_desert').css('left', $desertPos + 'px');
                                $desertJeffLeft = $desertJeffLeft + 12;
                                $desertJeff.css('left', $desertJeffLeft + 'px');
                            }
                        } else {
                            if ($desertJeffOffsetDistance < 700) {
                                $desertJeff.css('background-image', 'url(img/scene-desert_manWalk.gif)');

                                $desertJeffLeft = $desertJeffLeft + 12;
                                $desertJeff.css('left', $desertJeffLeft + 'px');
                            }
                        }
                    }

                    // Jeff隨沙丘改變高度
                    if (desertKeyID === 'KeyA' || desertKeyID === 'KeyD') {
                        console.log('$desertJeffLeft: ', $desertJeffLeft);

                        // 第一個沙丘開始
                        if ($desertJeffLeft > 161 && $desertJeffLeft < 187) {
                            $desertJeff.css('bottom', '27px');
                        } else if ($desertJeffLeft > 186 && $desertJeffLeft < 223) {
                            $desertJeff.css('bottom', '24px');
                        } else if ($desertJeffLeft > 221 && $desertJeffLeft < 247) {
                            $desertJeff.css('bottom', '21px');
                        } else if ($desertJeffLeft > 246 && $desertJeffLeft < 271) {
                            $desertJeff.css('bottom', '18px');
                        } else if ($desertJeffLeft > 270 && $desertJeffLeft < 295) {
                            $desertJeff.css('bottom', '15px');
                        } else if ($desertJeffLeft > 294 && $desertJeffLeft < 367) {
                            $desertJeff.css('bottom', '12px');
                        } else if ($desertJeffLeft > 365 && $desertJeffLeft < 475) {
                            $desertJeff.css('bottom', '9px');
                        } else if ($desertJeffLeft > 474 && $desertJeffLeft < 532) {
                            $desertJeff.css('bottom', '12px');
                        } else if ($desertJeffLeft > 531 && $desertJeffLeft < 571) {
                            $desertJeff.css('bottom', '15px');
                        } else if ($desertJeffLeft > 570 && $desertJeffLeft < 631) {
                            $desertJeff.css('bottom', '18px');
                        } else if ($desertJeffLeft > 630 && $desertJeffLeft < 643) {
                            $desertJeff.css('bottom', '21px');
                        } else if ($desertJeffLeft > 644 && $desertJeffLeft < 655) {
                            $desertJeff.css('bottom', '24px');
                        } else if ($desertJeffLeft > 654 && $desertJeffLeft < 655) {
                            $desertJeff.css('bottom', '27px');
                        } else if ($desertJeffLeft > 644 && $desertJeffLeft < 667) {
                            $desertJeff.css('bottom', '30px');
                        } else if ($desertJeffLeft > 666 && $desertJeffLeft < 679) {
                            $desertJeff.css('bottom', '33px');
                        } else if ($desertJeffLeft > 678 && $desertJeffLeft < 691) {
                            $desertJeff.css('bottom', '36px');
                        } else if ($desertJeffLeft > 690 && $desertJeffLeft < 703) {
                            $desertJeff.css('bottom', '39px');
                        } else if ($desertJeffLeft > 702 && $desertJeffLeft < 715) {
                            $desertJeff.css('bottom', '42px');
                        } else if ($desertJeffLeft > 714 && $desertJeffLeft < 727) {
                            $desertJeff.css('bottom', '45px');
                        } else if ($desertJeffLeft > 726 && $desertJeffLeft < 703) {
                            $desertJeff.css('bottom', '48px');
                        } else if ($desertJeffLeft > 702 && $desertJeffLeft < 739) {
                            $desertJeff.css('bottom', '51px');
                        } else if ($desertJeffLeft > 738 && $desertJeffLeft < 751) {
                            $desertJeff.css('bottom', '54px');

                            // 第二個沙丘開始
                        } else if ($desertJeffLeft > 750 && $desertJeffLeft < 775) {
                            $desertJeff.css('bottom', '51px');
                        } else if ($desertJeffLeft > 774 && $desertJeffLeft < 787) {
                            $desertJeff.css('bottom', '48px');
                        } else if ($desertJeffLeft > 786 && $desertJeffLeft < 799) {
                            $desertJeff.css('bottom', '45px');
                        } else if ($desertJeffLeft > 798 && $desertJeffLeft < 823) {
                            $desertJeff.css('bottom', '42px');
                        } else if ($desertJeffLeft > 822 && $desertJeffLeft < 847) {
                            $desertJeff.css('bottom', '39px');
                        } else if ($desertJeffLeft > 846 && $desertJeffLeft < 871) {
                            $desertJeff.css('bottom', '36px');
                        } else if ($desertJeffLeft > 870 && $desertJeffLeft < 895) {
                            $desertJeff.css('bottom', '33px');
                        } else if ($desertJeffLeft > 894 && $desertJeffLeft < 919) {
                            $desertJeff.css('bottom', '30px');
                        } else if ($desertJeffLeft > 918 && $desertJeffLeft < 943) {
                            $desertJeff.css('bottom', '27px');
                        } else if ($desertJeffLeft > 942 && $desertJeffLeft < 967) {
                            $desertJeff.css('bottom', '24px');
                        } else if ($desertJeffLeft > 966 && $desertJeffLeft < 1015) {
                            $desertJeff.css('bottom', '21px');
                        } else if ($desertJeffLeft > 1014 && $desertJeffLeft < 1123) {
                            $desertJeff.css('bottom', '24px');
                        } else if ($desertJeffLeft > 1121 && $desertJeffLeft < 1135) {
                            $desertJeff.css('bottom', '27px');
                        } else if ($desertJeffLeft > 1134 && $desertJeffLeft < 1147) {
                            $desertJeff.css('bottom', '30px');
                        } else if ($desertJeffLeft > 1145 && $desertJeffLeft < 1159) {
                            $desertJeff.css('bottom', '33px');
                        } else if ($desertJeffLeft > 1158 && $desertJeffLeft < 1171) {
                            $desertJeff.css('bottom', '36px');
                        } else if ($desertJeffLeft > 1170 && $desertJeffLeft < 1183) {
                            $desertJeff.css('bottom', '39px');
                        } else if ($desertJeffLeft > 1182 && $desertJeffLeft < 1195) {
                            $desertJeff.css('bottom', '36px');

                            // 第三個沙丘開始
                        } else if ($desertJeffLeft > 1194 && $desertJeffLeft < 1207) {
                            $desertJeff.css('bottom', '33px');
                        } else if ($desertJeffLeft > 1362 && $desertJeffLeft < 1567) {
                            $desertJeff.css('bottom', '27px');
                        } else if ($desertJeffLeft > 1566 && $desertJeffLeft < 1615) {
                            $desertJeff.css('bottom', '24px');
                        } else if ($desertJeffLeft > 1614 && $desertJeffLeft < 1664) {
                            $desertJeff.css('bottom', '24px');
                        } else if ($desertJeffLeft > 1663 && $desertJeffLeft < 1674) {
                            $desertJeff.css('bottom', '21px');
                        } else if ($desertJeffLeft > 1673 && $desertJeffLeft < 1747) {
                            $desertJeff.css('bottom', '15px');
                        } else {
                            $desertJeff.css('bottom', '30px');
                        }
                    }

                    // Jeff draw water
                    if (desertKeyID === 'Space') {
                        console.log('Spacebar');
                        if ($desertJeffLeft > 1493 && $desertJeffLeft < 1627) {
                            $desertJeff.css('transform', 'rotateY(0deg)');
                            $desertJeff.css('background-image', 'none');
                            $desertJeff.css('left', '1521px');
                            $desert_Jeff_drawWater.css('background-image', 'url(img/scene-desert_drawWater.gif');

                            //well gif
                            setTimeout(() => {
                                $('#desert_well').addClass('drawUp');
                            }, 700);

                            drawWater();
                        }
                    }
                },
                false
            );

            // 移除走路 gif
            window.addEventListener(
                'keyup',
                function (e) {
                    var desertKeyupID = e.code;
                    if (!desertKeyupID === 'Space') {
                        $desertJeff.css('background-image', 'url(img/scene-desert_man.gif)');
                    }
                },
                false
            );
        });

        function drawWater() {
            //移除draw water gif
            setTimeout(() => {
                console.log('setTimeout');
                $('#desert_Jeff_drawWater').addClass('drawUp');
                $('#desert_well').addClass('drawDone');
            }, 5700);

            setTimeout(() => {
                wellShow();
            }, 6700);
        }

        // well puzzle
        function wellShow() {
            console.log('wellShow');
            $('#frame_desert #bucket_puzzle01').addClass('now');
            $('#well_bg').fadeIn();

            $('#frame_desert #well_bg , #frame_desert #success').css('left', Math.abs($desertPos));
            $('#frame_desert #well_bucket').css('left', Math.abs($desertPos) + 184);
            $('#frame_desert #well_bucket .fontSize_28').css('left', Math.abs($desertPos) + 260);

            // 桶子上提
            setTimeout(() => {
                $('#frame_desert #well_bucket').addClass('show');
                $('#frame_desert .fontSize_28').addClass('show');
            }, 1500);
        }

        // 點擊puzzle旋轉
        $('#well_bucket i[id^="puzzle"]').click(function () {
            console.log('clicked puzzle');
            $('#frame_desert #bucket_click').fadeOut();

            let $rotateZ = $(this).css('transform');
            // console.log("be: ",$rotateZ);

            if ($rotateZ == 'matrix(1, 0, 0, 1, 0, 0)') {
                //0deg
                $(this).css({
                    transition: 'all 0s',
                    transform: 'rotate(-360deg)',
                });

                // 度數由-270deg轉至0deg時會逆著轉，故調整transition，並最小限度的延遲讓程式生效
                setTimeout(() => {
                    $(this).css('transition', 'all 0.2s ease-out');
                    $(this).css('transform', 'rotate(-270deg)');
                }, 1);

                $rotateZ = $(this).css('transform');
            } else if ($rotateZ == 'matrix(6.12323e-17, -1, 1, 6.12323e-17, 0, 0)') {
                //-90deg
                $(this).css('transform', 'rotate(0deg)');
                $rotateZ = $(this).css('transform');
            } else if ($rotateZ == 'matrix(-1, -1.22465e-16, 1.22465e-16, -1, 0, 0)') {
                //-180deg
                $(this).css('transform', 'rotate(-90deg)');
                $rotateZ = $(this).css('transform');
            } else if ($rotateZ == 'matrix(-1.83697e-16, 1, -1, -1.83697e-16, 0, 0)') {
                //-270deg
                $(this).css('transform', 'rotate(-180deg)');
                $rotateZ = $(this).css('transform');
            } else {
                console.log('X(');
            }

            // console.log("af: ",$rotateZ);
            // 過快exam會造成吐出值有誤
            setTimeout(() => {
                puzzleExam();
            }, 1000);
        });

        // 角度驗證
        function puzzleExam() {
            if ($('#frame_desert #bucket_puzzle01').hasClass('now')) {
                // puzzle01
                if ($('#puzzle01_2').css('transform') == 'matrix(1, 0, 0, 1, 0, 0)') {
                    puzzleExamCorrect();
                }
            } else if ($('#frame_desert #bucket_puzzle02').hasClass('now')) {
                // puzzle02

                var $puzzle02Num = 0;
                $('#frame_desert #bucket_puzzle02 i').each(function () {
                    if ($(this).css('transform') == 'matrix(1, 0, 0, 1, 0, 0)') {
                        $puzzle02Num++;
                        console.log('$puzzle02Num: ', $puzzle02Num);
                    }
                });
                if ($puzzle02Num == 12) {
                    puzzleExamCorrect();
                } else {
                    console.log('error :(');
                }
            } else {
                // puzzle03

                var $puzzle03Num = 0;
                $('#frame_desert #bucket_puzzle03 i').each(function () {
                    if ($(this).css('transform') == 'matrix(1, 0, 0, 1, 0, 0)') {
                        $puzzle03Num++;
                        console.log('$puzzle03Num: ', $puzzle03Num);
                    }
                });
                if ($puzzle03Num == 35) {
                    puzzleExamCorrect();
                } else {
                    console.log('error :(');
                }
            }
        }

        // 角度驗證正確
        function puzzleExamCorrect() {
            console.log('success!');

            if ($('#frame_desert #bucket_puzzle01').hasClass('now') == true) {
                // puzzle01
                $('#well_bucket #bucket_puzzle01 i').css('pointer-events', 'none');
                $('#frame_desert #puzzle01_glow').addClass('show');

                setTimeout(() => {
                    $('#frame_desert #bucket_puzzle01 i').fadeOut();
                }, 510);

                setTimeout(() => {
                    $('#frame_desert #puzzle01_glow').addClass('get');
                    $('#frame_desert #blank_Geobacter:nth-child(1)').addClass('show');
                }, 1500);

                setTimeout(() => {
                    $('#frame_desert #bucket_puzzle01').removeClass('now');
                }, 2500);

                // 切換成puzzle02
                setTimeout(() => {
                    $('#frame_desert #well_bucket').removeClass('show');
                }, 3000);

                setTimeout(() => {
                    $('#frame_desert #bucket_puzzle02').addClass('now');
                    $('#frame_desert #well_bucket').addClass('show');
                }, 4300);
            } else if ($('#frame_desert #bucket_puzzle02').hasClass('now') == true) {
                // puzzle02
                // console.log("puzzle02 now");
                $('#well_bucket #bucket_puzzle02 i').css('pointer-events', 'none');
                $('#frame_desert #puzzle02_glow').addClass('show');

                setTimeout(() => {
                    $('#frame_desert #bucket_puzzle02 i').fadeOut();
                }, 510);

                setTimeout(() => {
                    $('#frame_desert #puzzle02_glow').addClass('get');
                    $('#frame_desert #blank_Geobacter:nth-child(2) , #frame_desert #blank_Geobacter:nth-child(3)').addClass('show');
                }, 1500);

                setTimeout(() => {
                    $('#frame_desert #bucket_puzzle02').removeClass('now');
                }, 2500);

                // 切換成puzzle03
                setTimeout(() => {
                    $('#frame_desert #well_bucket').removeClass('show');
                }, 3000);

                setTimeout(() => {
                    $('#frame_desert #bucket_puzzle03').addClass('now');
                    $('#frame_desert #well_bucket').addClass('show');
                }, 4300);
            } else {
                // puzzle03
                // console.log("puzzle03 now");
                $('#well_bucket #bucket_puzzle03 i').css('pointer-events', 'none');
                $('#frame_desert #puzzle03_glow').addClass('show');

                setTimeout(() => {
                    $('#frame_desert #bucket_puzzle03 i').fadeOut();
                }, 510);

                setTimeout(() => {
                    $('#frame_desert #puzzle03_glow').addClass('get');
                    $('#frame_desert #blank_Geobacter:nth-child(4) , #frame_desert #blank_Geobacter:nth-child(5) , #frame_desert #blank_Geobacter:nth-child(6) , #frame_desert #blank_Geobacter:nth-child(7)'
                    ).addClass('show');
                }, 1500);

                setTimeout(() => {
                    $('#frame_desert #well_bucket .fontSize_28').css('transition', 'all 1.5s ease-out');
                    $('#frame_desert #bucket_puzzle03').removeClass('now');
                }, 2500);

                desertEnding();
            }
        }

        // 抓取成功 animation
        function desertEnding() {
            // 移除鍵盤控制
            window.removeEventListener('keydown', function () {
                console.log('removeEventListener keydown FAIL');
            });

            // $("#game_lightbox #bag").addClass("gotDesertWorm");
            // $gotDesertWorm = 1;
            if ($('.bag_space.L').hasClass('gotSeaWorm') == true) {
                $('.bag_space.R').addClass('gotDesertWorm');
            } else {
                $('.bag_space.L').addClass('gotDesertWorm');
            }

            //元素顯示
            setTimeout(function () {
                $('#frame_desert #success').fadeIn();
                $('#frame_desert #well_bucket .fontSize_28').css('top', '-120px');
            }, 2500);

            //capsule顯示
            setTimeout(function () {
                $('#frame_desert #capsule_top , #frame_desert #capsule_hole , #frame_desert #capsule_bottom').addClass('show');
            }, 4500);

            //膠囊闔起
            setTimeout(function () {
                $('#frame_desert #capsule_top , #frame_desert #capsule_hole , #frame_desert #capsule_bottom').addClass('close');
            }, 5300);

            //膠囊上升＋字、按鈕（回家or前往下個地點）顯示
            setTimeout(function () {
                $('#frame_desert #capsule').addClass('float');
                $('#frame_desert #text').addClass('show');
                $('#frame_desert #success_btn').addClass('show');
            }, 6500);
        }

        // capsule放進包包 animation
        $('#frame_desert #success_btn').click(function () {
            $(this).fadeOut();
            $('#frame_desert #text').removeClass('show');
            $('#frame_desert #success_bg').addClass('hide');
            $('#frame_desert #capsule').addClass('shrink');
            $('#frame_btnBtm .btn_bagOpen').addClass('open');

            //移除包包打開gif
            setTimeout(function () {
                $('#frame_btnBtm .btn_bagOpen').removeClass('open');
            }, 1810);

            setTimeout(function () {
                $('#map #map_text').text('Where you want to go next?');
                $('#map #map_text_bg').show();
                $('#map #map_btn_y , #map #map_btn_n').hide();

                // 自動開啟地圖
                $('.c_showLightbox').removeClass('c_showLightbox mapShow bagShow lightFrameShow');
                $('#game_lightbox').addClass('c_showLightbox mapShow');
            }, 2210);

            setTimeout(function () {
                $('#frame_desert #success').fadeOut();
            }, 2510);

            setTimeout(function () {
                // 移除 Map Desert
                $('#map').addClass('dsertFin');
                checkGotBothworms();

            }, 4510);
        });
    }

    ////////////   ＤＥＳＥＲＴ end   /////////////////////
    ////////////   ＥＮＤＩＮＧ   /////////////////////////
    function finalEnding() {
        // console.log("finalEnding");
        $('.btn_bag').removeClass('jump');
        $('#frame_btnBtm , #frame_btnTop').animate({ right: '-70px' });

        setTimeout(function () {
            $('#FinalEnding').show();
            $('#game_frame').css('background-color', '#1d2023');
        }, 1000);

        setTimeout(function () {
            $('#FinalEnding').css('background-image', 'url(img/scene-finalEnding.svg)');
            $('#frame_home').remove();
        }, 24300);
        $('#frame_volcano , #frame_desert , #game_lightbox').remove();

        // 感謝名單
        setTimeout(function () {
            $('#FinalEnding').addClass('scrollUp');
            $('#Credits').addClass('scrollUp');
        }, 26300);

        $('#Credits #restart').click(function () {
            location.reload(true);
        });
    }
    ////////////   ＥＮＤＩＮＧ end   /////////////////////
}

jQuery(document).ready(init());

///////////////  test  //////////////////////////
// 跳過前導動畫，直接到家裡
$('#game_menu , #frame_doctors').remove();
$('#frame_home').addClass("begining");
$('#frame_btnBtm').removeClass('hide');

//  seaVolcano 抓取測試
// $('#game_menu , #frame_doctors').remove();
// $('#frame_volcano').addClass('open');
// $('.c_frameNow').removeClass('c_frameNow');
// $('#frame_volcano').addClass('c_frameNow');
// volcanoSTART();


///////////////  test  //////////////////////////
