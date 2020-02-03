'use strict';
import debounce from './debounce.js';

// Play music when 'mouseenter' something
// Write this according to https://me.ursb.me/ and remove the `jquery` dependence
// Thanks to @Airing

var audioWhenMouseenter = function ( windowInput, classStr ){
    windowInput.AudioContext = windowInput.AudioContext || windowInput.webkitAudioContext;
    if (!windowInput.AudioContext) { 
        // alert('当前浏览器不支持Web Audio API');
        return;
    }
    
    var audioCtx = new AudioContext();
    // 发出的声音频率数据，表现为音调的高低
    // var arrFrequency = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    // 欢乐颂
    var arrFrequency = '329.628 329.628 349.228 391.995 391.995 349.228 329.628 293.665 261.626 261.626 293.665 329.628 329.628 293.665 293.665 329.628 329.628 349.228 391.995 391.995 349.228 329.628 293.665 261.626 261.626 293.665 329.628 293.665 261.626 261.626 293.665 293.665 329.628 261.626 293.665 329.628 349.228 329.628 261.626 293.665 329.628 349.228 329.628 293.665 261.626 293.665 195.998 329.628 329.628 349.228 391.995 391.995 349.228 329.628 293.665 261.626 261.626 293.665 329.628 293.665 261.626 261.626'.split(' ');
    
    var start = 0, direction = 1;

    var musicFont = '♩ ♪ ♫ ♬ ♭ ♮ ♯'.split(' ');

    var play = false;
    var musicPlayFunc = function(e) {
        var frequency = arrFrequency[start];
        if (!frequency) {
            // direction = -1 * direction;
            // start = start + 2 * direction;
            start = 0;
            frequency = arrFrequency[start];
        }
        start = start + direction;
        
        // 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
        var oscillator = audioCtx.createOscillator();
        // 创建一个GainNode,它可以控制音频的总音量
        var gainNode = audioCtx.createGain();
        // 把音量，音调和终节点进行关联
        oscillator.connect(gainNode);
        // audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
        gainNode.connect(audioCtx.destination);
        // 指定音调的类型，其他还有square|triangle|sawtooth
        oscillator.type = 'sine';
        // 设置当前播放声音的频率，也就是最终播放声音的调调
        oscillator.frequency.value = frequency;
        // 当前时间设置音量为0
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        // 0.01秒后音量为1
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
        // 音调从当前时间开始播放
        oscillator.start(audioCtx.currentTime);
        // 1秒内声音慢慢降低，模拟钢琴回响的音色
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        // 1秒后完全停止声音
        oscillator.stop(audioCtx.currentTime + 1);
        play = true;
        if (play) {
            var musicSignDomStr = "b";
            var n = Math.floor(Math.random() * (7-0) + 0); 
            var musicPlayEle = document.createElement(musicSignDomStr);
            musicPlayEle.innerHTML = musicFont[n];
            // var $i = $(musicSignDomStr).text(musicFont[n]);
            var x = e.pageX, y = e.pageY - 5;
            musicPlayEle.style.zIndex = 99999;
            musicPlayEle.style.position = "absolute";
            musicPlayEle.style.top = y - 40 + "px";
            musicPlayEle.style.left = x + "px";
            musicPlayEle.style.color = "#E94F06";
            

            // $i.css({
            //     "z-index":99999,
            //     "top":y - 40,
            //     "left":x,
            //     "position":"absolute",
            //     "color":"#E94F06",
            // });
            document.querySelector("body").appendChild(musicPlayEle);
            window.Velocity(musicPlayEle, 
                { "top": y - 180 + "px", "opacity": 0 },
                {
                    duration: 1500,
                    complete: function() { musicPlayEle.parentNode.removeChild(musicPlayEle);}
                }
            );

            // $i.animate(
            //     { "top": y - 180, "opacity": 0 },
            //     1500,
            //     function() { $i.remove(); }
            // );
            e.stopPropagation();
        }
        play = false;
    }
    var debounceMusicPlayFunc = debounce.debounce(musicPlayFunc, 80);
    var targets = document.querySelectorAll(classStr);
    for (var target of targets){
        target.onmouseenter = debounceMusicPlayFunc;
    };
}

export default audioWhenMouseenter;