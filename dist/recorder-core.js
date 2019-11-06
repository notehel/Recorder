/*
录音
https://github.com/xiangyuecn/Recorder
src: recorder-core.js
*/
!function(l){"use strict";var v=function(){},R=function(e){return new t(e)};R.IsOpen=function(){var e=R.Stream;if(e){var t=(e.getTracks&&e.getTracks()||e.audioTracks||[])[0];if(t){var n=t.readyState;return"live"==n||n==t.LIVE}}return!1},R.Destroy=function(){for(var e in console.log("Recorder Destroy"),n)n[e]()};var n={};function t(e){var t={type:"mp3",bitRate:16,sampleRate:16e3,bufferSize:4096,onProcess:v};for(var n in e)t[n]=e[n];this.set=t,this._S=9}R.BindDestroy=function(e,t){n[e]=t},R.Support=function(){var e=l.AudioContext;if(e||(e=l.webkitAudioContext),!e)return!1;var t=navigator.mediaDevices||{};return t.getUserMedia||(t=navigator).getUserMedia||(t.getUserMedia=t.webkitGetUserMedia||t.mozGetUserMedia||t.msGetUserMedia),!!t.getUserMedia&&(R.Scope=t,R.Ctx&&"closed"!=R.Ctx.state||(R.Ctx=new e,R.BindDestroy("Ctx",function(){var e=R.Ctx;e&&e.close&&e.close()})),!0)},R.SampleData=function(e,t,n,a,r){a||(a={});var s=a.index||0,o=a.offset||0,i=a.frameNext||[];r||(r={});var c=r.frameSize||1;r.frameType&&(c="mp3"==r.frameType?1152:1);for(var f=0,u=s;u<e.length;u++)f+=e[u].length;f=Math.max(0,f-Math.floor(o));var p=t/n;1<p?f=Math.floor(f/p):(p=1,n=t),f+=i.length;var l=new Int16Array(f),v=0;for(u=0;u<i.length;u++)l[v]=i[u],v++;for(var m=e.length;s<m;s++){for(var h=e[s],d=(u=o,h.length);u<d;){var S=Math.floor(u),g=Math.ceil(u),M=u-S;l[v]=h[S]+(h[g]-h[S])*M,v++,u+=p}o=u-d}i=null;var x=l.length%c;if(0<x){var _=2*(l.length-x);i=new Int16Array(l.buffer.slice(_)),l=new Int16Array(l.buffer.slice(0,_))}return{index:s,offset:o,frameNext:i,sampleRate:n,data:l}},R.Sync={O:9,C:9},R.prototype=t.prototype={open:function(e,n){var t=this;e=e||v,n=n||v;var a=function(){e(),t._SO=0},r=function(e,t){/Permission|Allow/i.test(e)?n("用户拒绝了录音权限",!0):!1===l.isSecureContext?n("无权录音(需https)"):/Found/i.test(e)?n(t+"，无可用麦克风"):n(t)},s=R.Sync,o=++s.O,i=s.C;t._O=t._O_=o,t._SO=t._S;var c=function(){if(i!=s.C||!t._O){var e="open被取消";return o==s.O?t.close():e="open被中断",n(e),!0}};if(R.IsOpen())a();else if(R.Support()){var f=function(e){R.Stream=e,c()||setTimeout(function(){c()||(R.IsOpen()?a():n("录音功能无效：无音频流"))},100)},u=function(e){var t=e.name||e.message||e.code+":"+e;console.error(e),r(t,"无法录音："+t)},p=R.Scope.getUserMedia({audio:!0},f,u);p&&p.then&&p.then(f)[e&&"catch"](u)}else r("","此浏览器不支持录音")},close:function(e){e=e||v;this._stop();var t=R.Sync;if(this._O=0,this._O_!=t.O)return console.warn("close被忽略"),void e();t.C++;var n=R.Stream;if(n){for(var a=n.getTracks&&n.getTracks()||n.audioTracks||[],r=0;r<a.length;r++){var s=a[r];s.stop&&s.stop()}n.stop&&n.stop()}R.Stream=0,e()},mock:function(e,t){var n=this;return n._stop(),n.isMock=1,n.buffers=[e],n.recSize=e.length,n.srcSampleRate=t,n},envStart:function(e,t){var n=this,a=n.set;if(n.isMock=e?1:0,n.buffers=[],n.recSize=0,n.envInLast=0,n.envInFirst=0,n.envInFix=0,n.envInFixTs=[],a.sampleRate=Math.min(t,a.sampleRate),n.srcSampleRate=t,n.engineCtx=0,n[a.type+"_start"]){var r=n.engineCtx=n[a.type+"_start"](a);r&&(r.pcmDatas=[],r.pcmSize=0)}},envResume:function(){this.envInFixTs=[]},envIn:function(e,t){var n=this,a=n.set,r=n.engineCtx,s=e.length;n.recSize+=s;var o=n.buffers;o.push(e);var i,c=t/s;i=c<1251?Math.round(c/1250*10):Math.round(Math.min(100,Math.max(0,100*(1+Math.log(c/1e4)/Math.log(10)))));var f=n.srcSampleRate,u=n.recSize,p=Date.now(),l=Math.round(s/f*1e3);n.envInLast=p,1==n.buffers.length&&(n.envInFirst=p-l);var v=n.envInFixTs;v.splice(0,0,{t:p,d:l});for(var m=p,h=0,d=0;d<v.length;d++){var S=v[d];if(3e3<p-S.t){v.length=d;break}m=S.t,h+=S.d}var g=v[1],M=p-m;if(M/3<M-h&&(g&&1e3<M||6<=v.length)){var x=p-g.t-l;if(l/5<x){var _=!a.disableEnvInFix;if(console.warn("["+p+"]"+(_?"":"未")+"补偿"+x+"ms"),n.envInFix+=x,_){var y=new Int16Array(x*f/1e3);n.recSize+=y.length,o.push(y)}}}if(r){var I=R.SampleData(o,f,a.sampleRate,r.chunkInfo);r.chunkInfo=I,r.pcmSize+=I.data.length,u=r.pcmSize,(o=r.pcmDatas).push(I.data),f=I.sampleRate,n[a.type+"_encode"](r,I.data)}var w=Math.round(u/f*1e3);a.onProcess(o,i,w,f)},start:function(){if(R.IsOpen()){console.log("["+Date.now()+"]Start");var e=this,t=(e.set,R.Ctx);e._stop(),e.state=0,e.envStart(0,t.sampleRate),e._SO&&e._SO+1!=e._S?console.warn("start被中断"):(e._SO=0,"suspended"==t.state?t.resume().then(function(){console.log("ctx resume"),e._start()}):e._start())}else console.error("未open")},_start:function(){var i=this,e=i.set,t=(i.engineCtx,R.Ctx),n=i.media=t.createMediaStreamSource(R.Stream),a=i.process=(t.createScriptProcessor||t.createJavaScriptNode).call(t,e.bufferSize,1,1);a.onaudioprocess=function(e){if(1==i.state){for(var t=e.inputBuffer.getChannelData(0),n=t.length,a=new Int16Array(n),r=0,s=0;s<n;s++){var o=Math.max(-1,Math.min(1,t[s]));o=o<0?32768*o:32767*o,a[s]=o,r+=Math.abs(o)}i.envIn(a,r)}},n.connect(a),a.connect(t.destination),i.state=1},pause:function(e){this.state&&(this.state=e||2)},resume:function(){this.pause(1),this.envResume()},_stop:function(e){var t=this,n=t.set;t.isMock||t._S++,t.state&&(t.state=0,t.media.disconnect(),t.process.disconnect()),!e&&t[n.type+"_stop"]&&(t[n.type+"_stop"](t.engineCtx),t.engineCtx=0)},stop:function(n,t,e){var a,r=this,s=r.set;console.log("["+Date.now()+"]Stop "+(r.envInLast?r.envInLast-r.envInFirst+"ms 补"+r.envInFix+"ms":"-"));var o=function(){r._stop(),e&&r.close()},i=function(e){t&&t(e),o()},c=function(e,t){console.log("["+Date.now()+"]结束 编码"+(Date.now()-a)+"ms 音频"+t+"ms/"+e.size+"b"),e.size<Math.max(100,t/2)?i("生成的"+s.type+"无效"):(n&&n(e,t),o())};if(!r.isMock){if(!r.state)return void i("未开始录音");r._stop(!0)}var f=r.recSize;if(f)if(r.buffers[0])if(r[s.type]){var u=r.engineCtx;if(r[s.type+"_complete"]&&u){u.pcmDatas;var p=Math.round(u.pcmSize/s.sampleRate*1e3);return a=Date.now(),void r[s.type+"_complete"](u,function(e){c(e,p)},i)}a=Date.now();var l=R.SampleData(r.buffers,r.srcSampleRate,s.sampleRate);s.sampleRate=l.sampleRate;var v=l.data;p=Math.round(v.length/s.sampleRate*1e3);console.log("采样"+f+"->"+v.length+" 花:"+(Date.now()-a)+"ms"),setTimeout(function(){a=Date.now(),r[s.type](v,function(e){c(e,p)},function(e){i(e)})})}else i("未加载"+s.type+"编码器");else i("音频被释放");else i("未采集到录音")}},l.Recorder&&l.Recorder.Destroy(),(l.Recorder=R).LM="2019-11-2 21:37:21"}(window);