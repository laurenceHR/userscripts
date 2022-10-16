// ==UserScript==
// @name         Vimeo Analyzer
// @namespace    http://daxes.net/
// @version      2.0
// @description  Analyze sources for Vimeo video.
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
    style.innerHTML = ' .box {display: flex; justify-content: flex-end;transition: transform .15s ease-out;}' +
                      ' .box.quality-box { height: 32px;margin-top: 6px;}' +
                      ' .box .download-button { padding: 11px 0px;width: 32px;height: 32px;text-align: center; }' +
                      ' .box .download-button span { color:#fff;font-weight: bold;font-size: 1em; }' +
                      ' .box .download-button:hover, .box .download-button.active { background-color: rgb(0, 173, 239); }' +
                      ' .box .download-button .radius { z-index: 1;top: 0.25rem;right: 0.25rem;position: absolute;width: 40px;height: 40px;pointer-events: none;transform: scale(0.94);border-radius: 0.5rem;border: 0.0625rem solid rgba(0, 173, 239, 0);transition: all 150ms ease-in-out 0s;}' +
                      ' .box .download-button:focus .radius { transform: scale(1);border: 0.125rem solid rgb(0, 173, 239); display:none; }' +
     ` .box > label {
        background: rgba(0,0,0,.8);
        height: 3em;
        line-height: 3em;
        border-radius: 3px;
        transition: opacity .15s ease-out,transform .15s ease-out;
        font-family: inherit;
        border-radius: 4px;
        color: #fff;
        border: 0;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: antialiased;
        background-color: rgba(0,0,0,.8);
        display: flex;
        border-radius: 0.25rem;
        padding: 0.8em 1.2em;
        line-height: 1.88rem;
        height: 2rem;
        font-size: 1.2em;
        font-weight: 700;
        margin: 8px 0 8px 8px;
        align-items: center;
        }`;
    doc.getElementsByTagName('head')[0].appendChild(style);

    var scripts = doc.querySelectorAll('body script');
    //console.log('scripts',scripts);
    var i,x;
    for(i in scripts){
        //console.log(scripts[i].innerHTML);
        var f = scripts[i].innerHTML.indexOf('function(document, player)');
        if(f != -1){ x = 1; break;}
    }
    html = scripts[x].innerHTML;

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

        setTimeout(function(){
            var div = doc.getElementsByClassName('vp-sidedock')[0];
            //console.log('vp-sidedock', doc.getElementsByClassName('vp-sidedock'), div);

            var box = document.createElement('div');
            box.className = 'box download-box';
            //box.innerHTML += '  <label class="rounded-box download-label visible invisible" role="presentation"><span>Me gusta</span></label>';
            box.innerHTML += '  <label class="" role="presentation" style="display: none;"><span>Download</span></label>';
            var btnDownload = document.createElement('button');
            //btnDownload.className = 'download-button rounded-box';
            btnDownload.className = 'download-button sc-pVTFL cNOCbl iris-button';
            btnDownload.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none" class="stroke" />
            <path d="M176,128h48a8,8,0,0,1,8,8v64a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V136a8,8,0,0,1,8-8H80" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" class="stroke"/>
            <line x1="128" y1="24" x2="128" y2="128" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" class="stroke"/>
            <polyline points="80 80 128 128 176 80" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" class="stroke"/>
            <circle cx="188" cy="168" r="10" stroke="#fff" class="stroke"/>
            </svg>
            <div radius="8" class="radius"></div>`;
            box.appendChild(btnDownload);
            //if(sources.length > 0) {
                div.appendChild(box);
            //}

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
        },500);
    };

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

    console.log('== Embed ==');
    console.log(cf2.video.embed_code);
})();