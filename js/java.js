"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}!function(){function t(t){t.preventDefault(),e()}function e(){document.body.classList.add(o)}function n(){document.getElementById("enroll-close").addEventListener("click",t)}var o="no-fixed-bottom",a={init:n};!function(){function t(t){var o=t.target;n.indexOf(o)!==-1&&e(o)}function e(t){"number"==typeof t&&(t=n[t]);for(var e=t.dataset.num,a="",r=o.length-e.length;r>0;r--)a+="0";e=a+e,e.split("").forEach(function(t,e){var n=o[e];n.setAttribute("value",t),n.innerHTML=t})}var n=[].concat(_toConsumableArray(document.getElementsByName("job-platform"))),o=[].concat(_toConsumableArray(document.getElementsByClassName("j-jobs-num-char")));document.getElementById("platforms").addEventListener("click",t),e(0)}(),function(){function t(t){var n=boring.bubbleElement(t.target,function(t){return t.classList.contains("j-teacher")});n&&e(n)}function e(t){n.innerHTML=t.dataset.intro}var n=document.getElementById("teacher-intro");document.getElementById("teachers").addEventListener("click",t)}(),function(){function t(){r.offsetHeight<=r.parentNode.offsetHeight||(i.top=0,e(),r.onmouseenter=n,r.onmouseleave=e)}function e(t){i.top-=a,r.style.cssText+="; transform: translateY("+i.top+"px);",o(),i.id=requestAnimationFrame(e)}function n(){cancelAnimationFrame(i.id)}function o(){var t=r.rows[i.addedTimes];Math.abs(i.top)>=(i.addedTimes+1)*t.offsetHeight&&(r.tBodies[0].appendChild(t.cloneNode(!0)),i.addedTimes++)}var a=.5,r=document.getElementById("students-data"),i={id:0,top:0,addedTimes:0};t()}(),a.init()}();