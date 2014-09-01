// ==UserScript==
// @name GoEar HotLink 2014 
// @author laurenceHR
// @include *goear.com/listen/*/*
// @version 1.3
// @description Goear HotLink for download
// ==/UserScript==

// Script by Laurence HR - www.daxes.net

////// Get Song ID
var url = document.URL;
var urls = url.split('/');
var id = urls[4];
/////// Get HotLink
var hotlink = "http://www.goear.com/action/sound/get/" + id; 
////// Add HotLink
addHotLink(hotlink);
//////

/******  Function For Add Link *****/
function addHotLink(link){
    var style = document.createElement('style');
    var css = "#main.listen .actions .down {background-position-y: 8px;}" + "\n";
        style.textContent= css;
    var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    var a = document.createElement('a');
    	a.href = link;
    	a.target = "_blank";
    	a.innerHTML = 'HotLink'
    	a.className = 'btn clear pict down';
        a.id = 'hotlink';
    var li = document.createElement('li');
    	li.appendChild(a);
    var ul_actions = document.getElementsByClassName('actions')[0];
    	ul_actions.appendChild(li);  
}