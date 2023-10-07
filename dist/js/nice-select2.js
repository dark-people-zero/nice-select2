!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.NiceSelect=t():e.NiceSelect=t()}(self,(()=>(()=>{"use strict";var e={d:(t,i)=>{for(var s in i)e.o(i,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:i[s]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function i(e){var t=document.createEvent("MouseEvents");t.initEvent("click",!0,!1),e.dispatchEvent(t)}function s(e){var t=document.createEvent("HTMLEvents");t.initEvent("change",!0,!1),e.dispatchEvent(t)}function o(e){var t=document.createEvent("FocusEvent");t.initEvent("focusin",!0,!1),e.dispatchEvent(t)}function n(e){var t=document.createEvent("FocusEvent");t.initEvent("focusout",!0,!1),e.dispatchEvent(t)}function l(e){var t=document.createEvent("UIEvent");t.initEvent("modalclose",!0,!1),e.dispatchEvent(t)}function d(e,t){"invalid"==t?(c(this.dropdown,"invalid"),h(this.dropdown,"valid")):(c(this.dropdown,"valid"),h(this.dropdown,"invalid"))}function r(e,t){return null!=e[t]?e[t]:e.getAttribute(t)}function a(e,t){return!!e&&e.classList.contains(t)}function c(e,t){if(e)return e.classList.add(t)}function h(e,t){if(e)return e.classList.remove(t)}e.r(t),e.d(t,{bind:()=>f,default:()=>u});var p={data:null,searchable:!1,showSelectedItems:!1,serverSide:!1,fetchUri:null,fetchOpt:{},fetchRes:null};function u(e,t){this.el=e,this.config=Object.assign({},p,t||{}),this.data=this.config.data,this.selectedOptions=[],this.controller=null,this.search="",this.fetch=null,this.config.serverSide&&(this.config.searchable=void 0===t.searchable||t.searchable),this.placeholder=r(this.el,"placeholder")||this.config.placeholder||"Select an option",this.searchtext=r(this.el,"searchtext")||this.config.searchtext||"Search",this.selectedtext=r(this.el,"selectedtext")||this.config.selectedtext||"selected",this.dropdown=null,this.dropdownInfo=null,this.dropdownNoresult=null,this.multiple=r(this.el,"multiple"),this.disabled=r(this.el,"disabled"),this.create()}function f(e,t){return new u(e,t)}return u.prototype.create=function(){this.el.style.opacity="0",this.el.style.width="0",this.el.style.padding="0",this.el.style.height="0",this.config.serverSide?this.fetchData():(this.data?this.processData(this.data):this.extractData(),this.renderDropdown(),this.bindEvent())},u.prototype.fetchData=function(e="",t=!0){this.controller=new AbortController;const i=this.config.fetchOpt;i.signal=this.controller.signal,this.fetch=fetch(this.config.fetchUri+"?q="+e,i).then((e=>e.json())).then((e=>{null!=this.config.fetchRes?(this.data=this.config.fetchRes(!1,e),this.processData(this.data,t),t?(this.renderDropdown(),this.bindEvent()):(this._renderItems(t),this.showHideInfo(),this.showHideNoResult(0==this.data.length))):(this.data=e,t?(this.renderDropdown(),this.bindEvent()):(this._renderItems(t),this.showHideInfo(),this.showHideNoResult(0==this.data.length))),this.fetch=null})).catch((e=>{this.showHideInfo(),this.showHideNoResult(),this.fetch=null,null!=this.config.fetchRes&&this.config.fetchRes(e,null),console.error(e.message)}))},u.prototype.processData=function(e,t=!0){if(t){var i=this.el.querySelectorAll("option,optgroup");this.selectedOptions=[...i].map((e=>({data:{text:e.innerHTML??"",value:e.getAttribute("value")??"",selected:null!=e.getAttribute("selected"),disabled:null!=e.getAttribute("disabled")},attributes:{selected:null!=e.getAttribute("selected"),disabled:null!=e.getAttribute("disabled"),optgroup:"optgroup"==e.value}})))}else if(this.selectedOptions.length>0&&""==this.search){let t=this.selectedOptions.filter((t=>!e.find((e=>e.value==t.data.value)))).map((e=>(e.data.selected=e.attributes.selected,e.data.disabled=e.attributes.disabled,e.data)));e=[...t,...e]}this.options=e.map((e=>{let t=this.selectedOptions.find((t=>t.data.value==e.value&&t.attributes.selected));if(e.selected=!!t,this.config.serverSide){let t=new Option(e.text,e.value,!1,!!e.selected);this.el.append(t)}return{data:e,attributes:{selected:!!e.selected,disabled:!!e.disabled,optgroup:"optgroup"==e.value}}}))},u.prototype.extractData=function(){var e=this.el.querySelectorAll("option,optgroup");this.options=[...e].map((e=>"OPTGROUP"==e.tagName?{data:{text:e.label,value:"optgroup"},attributes:{selected:null!=e.getAttribute("selected"),disabled:null!=e.getAttribute("disabled"),optgroup:"OPTGROUP"==e.tagName}}:{data:{text:null!=e.dataset.display?e.dataset.display:e.innerHTML,value:e.value},attributes:{selected:null!=e.getAttribute("selected"),disabled:null!=e.getAttribute("disabled"),optgroup:"OPTGROUP"==e.tagName}})),this.data=this.options.reduce(((e,t)=>(e.push(t.data),e)),[]),this.selectedOptions=this.options.filter((e=>e.attributes.selected))},u.prototype.renderDropdown=function(){var e=["nice-select",r(this.el,"class")||"",this.disabled?"disabled":"",this.multiple?"has-multiple":""];let t=`\n\t\t<div class="nice-select-search-box">\n\t\t\t<input type="text" class="nice-select-search" placeholder="${this.searchtext}..." title="search"/>\n\t\t\t<div class="nice-select-info">Searching...</div>\n\t\t\t<div class="nice-select-info-noResult">No result found: <b>${this.search}</b></div>\n\t\t</div>\n\t`;var i=`\n\t\t<div class="${e.join(" ")}" tabindex="${this.disabled?null:0}">\n\t\t\t<span class="${this.multiple?"multiple-options":"current"}"></span>\n\t\t\t<div class="nice-select-dropdown">\n\t\t\t\t${this.config.searchable?t:""}\n\t\t\t\t<ul class="list"></ul>\n\t\t\t</div>\n\t\t</div>\n\t`;this.el.insertAdjacentHTML("afterend",i),this.dropdown=this.el.nextElementSibling,this.dropdownInfo=this.dropdown.querySelector(".nice-select-info"),this.dropdownNoresult=this.dropdown.querySelector(".nice-select-info-noResult"),this._renderSelectedItems(),this._renderItems()},u.prototype._renderSelectedItems=function(){if(this.multiple){var e="";this.config.showSelectedItems||this.config.showSelectedItems||"auto"==window.getComputedStyle(this.dropdown).width||this.selectedOptions.length<2?(this.selectedOptions.forEach((function(t){e+=`<span class="current">${t.data.text}</span>`})),e=""==e?this.placeholder:e):e=this.selectedOptions.length+" "+this.selectedtext,this.dropdown.querySelector(".multiple-options").innerHTML=e}else{var t=this.selectedOptions.length>0?this.selectedOptions[0].data.text:this.placeholder;this.dropdown.querySelector(".current").innerHTML=t}},u.prototype._renderItems=function(e){var t=this.dropdown.querySelector("ul");[...t.children].forEach((e=>e.remove())),this.options.forEach((e=>{t.appendChild(this._renderItem(e))})),this.config.serverSide&&!e&&(this.dropdown.querySelectorAll(".focus").forEach((function(e){h(e,"focus")})),c(this._findNext(null),"focus"))},u.prototype._renderItem=function(e){var t=document.createElement("li");if(t.innerHTML=e.data.text,e.attributes.optgroup)c(t,"optgroup");else{t.setAttribute("data-value",e.data.value);var i=["option",e.attributes.selected?"selected":null,e.attributes.disabled?"disabled":null];t.addEventListener("click",this._onItemClicked.bind(this,e)),t.classList.add(...i)}return e.element=t,t},u.prototype.update=function(){if(this.extractData(),this.dropdown){var e=a(this.dropdown,"open");this.dropdown.parentNode.removeChild(this.dropdown),this.create(),e&&i(this.dropdown)}r(this.el,"disabled")?this.disable():this.enable()},u.prototype.disable=function(){this.disabled||(this.disabled=!0,c(this.dropdown,"disabled"))},u.prototype.enable=function(){this.disabled&&(this.disabled=!1,h(this.dropdown,"disabled"))},u.prototype.clear=function(){this.resetSelectValue(),this.selectedOptions=[],this._renderSelectedItems(),this.update(),s(this.el)},u.prototype.destroy=function(){this.dropdown&&(this.dropdown.parentNode.removeChild(this.dropdown),this.el.style.display="")},u.prototype.bindEvent=function(){this.dropdown.addEventListener("click",this._onClicked.bind(this)),this.dropdown.addEventListener("keydown",this._onKeyPressed.bind(this)),this.dropdown.addEventListener("focusin",o.bind(this,this.el)),this.dropdown.addEventListener("focusout",n.bind(this,this.el)),this.el.addEventListener("invalid",d.bind(this,this.el,"invalid")),window.addEventListener("click",this._onClickedOutside.bind(this)),this.config.searchable&&this._bindSearchEvent()},u.prototype._bindSearchEvent=function(){var e=this.dropdown.querySelector(".nice-select-search");e&&e.addEventListener("click",(function(e){return e.stopPropagation(),!1})),e.addEventListener("input",this._onSearchChanged.bind(this))},u.prototype._onClicked=function(e){var t,i;e.preventDefault(),a(this.dropdown,"open")?this.multiple?e.target==this.dropdown.querySelector(".multiple-options")&&(h(this.dropdown,"open"),l(this.el)):(h(this.dropdown,"open"),l(this.el)):(c(this.dropdown,"open"),t=this.el,(i=document.createEvent("UIEvent")).initEvent("modalopen",!0,!1),t.dispatchEvent(i));var s=this.dropdown.querySelector(".nice-select-search");if(a(this.dropdown,"open")){s&&(s.value="",s.focus());var o=this.dropdown.querySelector(".focus");h(o,"focus"),c(o=this.dropdown.querySelector(".selected"),"focus"),this.dropdown.querySelectorAll("ul li").forEach((function(e){e.style.display=""}))}else this.dropdown.focus(),this._resetDataServerSide()},u.prototype._onItemClicked=function(e,t){var i=t.target;a(i,"disabled")||(this.multiple?a(i,"selected")?(h(i,"selected"),this.selectedOptions.splice(this.selectedOptions.indexOf(e),1),this.el.querySelector(`option[value="${i.dataset.value}"]`).removeAttribute("selected")):(c(i,"selected"),this.selectedOptions.push(e)):(this.options.forEach((function(e){h(e.element,"selected")})),this.selectedOptions.forEach((function(e){h(e.element,"selected")})),c(i,"selected"),e.attributes.selected=!0,this.selectedOptions=[e]),this._renderSelectedItems(),this.updateSelectValue())},u.prototype.updateSelectValue=function(){if(this.multiple){var e=this.el;this.selectedOptions.forEach((function(t){var i=e.querySelector(`option[value="${t.data.value}"]`);i&&i.setAttribute("selected",!0)}))}else this.selectedOptions.length>0&&(this.el.value=this.selectedOptions[0].data.value);s(this.el)},u.prototype.resetSelectValue=function(){if(this.multiple){var e=this.el;this.selectedOptions.forEach((function(t){var i=e.querySelector(`option[value="${t.data.value}"]`);i&&i.removeAttribute("selected")}))}else this.selectedOptions.length>0&&(this.el.selectedIndex=-1);s(this.el)},u.prototype._onClickedOutside=function(e){this.dropdown.contains(e.target)||(a(this.dropdown,"open")&&this._resetDataServerSide(),h(this.dropdown,"open"),l(this.el))},u.prototype._onKeyPressed=function(e){var t=this.dropdown.querySelector(".focus"),s=a(this.dropdown,"open");if(13==e.keyCode)i(s?t:this.dropdown);else if(40==e.keyCode){if(s){var o=this._findNext(t);o&&(h(this.dropdown.querySelector(".focus"),"focus"),c(o,"focus"))}else i(this.dropdown);e.preventDefault()}else if(38==e.keyCode){if(s){var n=this._findPrev(t);n&&(h(this.dropdown.querySelector(".focus"),"focus"),c(n,"focus"))}else i(this.dropdown);e.preventDefault()}else if(27==e.keyCode&&s)i(this.dropdown);else if(32===e.keyCode&&s)return!1;return!1},u.prototype._findNext=function(e){for(e=e?e.nextElementSibling:this.dropdown.querySelector(".list .option");e;){if(!a(e,"disabled")&&"none"!=e.style.display)return e;e=e.nextElementSibling}return null},u.prototype._findPrev=function(e){for(e=e?e.previousElementSibling:this.dropdown.querySelector(".list .option:last-child");e;){if(!a(e,"disabled")&&"none"!=e.style.display)return e;e=e.previousElementSibling}return null},u.prototype._onSearchChanged=function(e){var t=a(this.dropdown,"open"),i=e.target.value;if(this.search=i,this.config.serverSide)null!=this.controller&&null!=this.fetch&&this.controller.abort(),this.dropdownNoresult.innerHTML=`No result found: <b>${this.search}</b>`,this.showHideInfo(!0),this.showHideNoResult(),this.fetchData(i,!1);else{if(""==(i=i.toLowerCase()))this.options.forEach((function(e){e.element.style.display=""}));else if(t){var s=new RegExp(i);this.options.forEach((function(e){var t=e.data.text.toLowerCase(),i=s.test(t);e.element.style.display=i?"":"none"}))}this.dropdown.querySelectorAll(".focus").forEach((function(e){h(e,"focus")})),c(this._findNext(null),"focus")}},u.prototype._resetDataServerSide=function(){this.search="",this.showHideInfo(),this.showHideNoResult(),this.fetchData("",!1)},u.prototype.showHideInfo=function(e=!1){this.dropdownInfo.style.display=e?"block":"none"},u.prototype.showHideNoResult=function(e=!1){this.dropdownNoresult.style.display=e?"block":"none"},t})()));