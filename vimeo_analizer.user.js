// ==UserScript==
// @name         Vimeo Analyzer
// @namespace    http://daxes.net/
// @version      1.2
// @description  try to take over the world!
// @author       Daxes
// @match        https://player.vimeo.com/video/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('Vimeo Analyzer by Daxes');
    var cf2, doc = window.self.document, html, html2, loadConfig;

    var style = doc.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ' .box a.download-button { padding: 10px 4px;width: 36px;text-align: center; }' +
                      ' .box a.download-button span { color:#fff;font-weight: bold;font-size: 1em; }' +
                      ' .box .download-button:hover, .box .download-button.active { background-color: rgb(0, 173, 239); }';
    doc.getElementsByTagName('head')[0].appendChild(style);

    var scripts = doc.querySelectorAll('body script');
    html = scripts[scripts.length-1].innerHTML;
    html2 = html.replaceAll('config','cf2').replace('var cf2','cf2').substr(2);
    html2 = html2.replace('var usePlayer = fullscreenSupport || IE10 || windowsPhone;', 'var usePlayer = false;'); // Prevent double play
    var sufix = '(document, document.getElementById(\'player\'))); ';
    html2 = 'loadConfig = ' + html2.substr(0,html2.length - sufix.length);
    eval(html2);
    loadConfig(doc, doc.getElementById('player'));
    console.log('== Title ==');
    console.log(cf2.video.title);
    console.log(cf2.video.share_url);
    console.log('== Files ==');
    var sources = [];
    cf2.request.files.progressive.forEach(function(vid){
        sources.push({
            px: parseInt(vid.quality.substr(0, vid.quality.length - 1)),
            quality: vid.quality,
            width: vid.width,
            height: vid.height,
            url: vid.url
        });
    });
    console.log('sources', sources);

    window.onload = function() {
        var fadeInElement = function(el){
            el.style.opacity = 0;
            el.style.display = '';
            increaseOpacity(el,10);
        }
        var fadeOutElement = function(el){
            el.style.opacity = 1;
            decreaseOpacity(el,10,function(){ el.style.display = 'none';});
        }
        var increaseOpacity = function(el,t,cb){
            var opacity = Number(el.style.opacity);
            //console.log('opacity', opacity);
            setTimeout(function(){
                if (opacity < 1) {
                    opacity += 0.05;
                    el.style.opacity = opacity
                    increaseOpacity(el,t);
                } else {
                    if(cb) cb();
                }
            },t);
        }
        var decreaseOpacity = function(el,t,cb){
            var opacity = Number(el.style.opacity);
            //console.log('opacity', opacity);
            setTimeout(function(){
                if (opacity > 0) {
                    opacity -= 0.05;
                    el.style.opacity = opacity
                    decreaseOpacity(el,t);
                } else {
                    if(cb) cb();
                }
            },t);
        }
        var showElement = function(el){
            el.style.display = '';
        }
        var hideElement = function(el){
            el.style.display = 'none';
        }
        var toggleElement = function(el){
            if(el.style.display == 'none' || el.style.opacity == 0){
                fadeInElement(el);
            } else {
                fadeOutElement(el);
            }
        }

        var toggleQuality = function(){
            console.log('toggle');
            var db = doc.getElementsByClassName('download-button')[0];
            if ( db.classList.contains('active') ) {
                db.classList.remove('active');
            } else {
                db.classList.add('active');
            };
            Array.from(doc.getElementsByClassName('quality-box')).forEach(function(box){
                //box.style.display = (box.style.display == '' ? 'none' : '');
                toggleElement(box);
            });
        }

        var div = doc.getElementsByClassName('vp-sidedock')[0];

        //setTimeout(function(){
            var box = document.createElement('div');
            box.className = 'box download-box';
            //box.innerHTML += '  <label class="rounded-box download-label visible invisible" role="presentation"><span>Me gusta</span></label>';
            var btnDownload = document.createElement('button');
            btnDownload.className = 'download-button rounded-box';
            btnDownload.innerHTML = '  <svg class="like-icon" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid" focusable="false"><path class="fill" d="M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z"/></svg>';
            box.appendChild(btnDownload);
            if(sources.length > 0) {
                div.appendChild(box);
            }

            setTimeout(function(){
                doc.getElementsByClassName('download-button')[0].addEventListener("click",toggleQuality);
            },0);

            console.log('sorting2', sources);
            sources.sort(function(a,b){
                return a.px < b.px ? 1 : -1;
            }).forEach(function(vid){
                console.log('(' + vid.quality + ') ' + vid.width + 'x' + vid.height + ': ' + vid.url);
                var btnQ = '';
                btnQ += '<div class="box quality-box" style="display: none;">';
                btnQ += '  <label class="rounded-box download-label visible invisible" role="presentation"><span>Me gusta</span></label>';
                btnQ += '  <a href="' + vid.url + '" target="_blank" class="download-button rounded-box" style="" aria-label="Downlaod" data-label-add="Descargar">';
                btnQ += '    <span style="">' + vid.quality + '</span>';
                btnQ += '  </a>';
                btnQ += '</div>';
                div.innerHTML += btnQ;
            });
        //},1000);
    };

    console.log('== Embed ==');
    console.log(cf2.video.embed_code);
})();
