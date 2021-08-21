(()=>{"use strict";class t{constructor(t){this.text=t,this.regExp=/([0-9]{4})|(S([0-9]*)E([0-9]*))|([0-9]*)p/}get query(){let t=[];return this._parts.forEach((e=>{null===e.match(this.regExp)&&t.push(e)})),t.join(" ")}get _parts(){const t=this.text.replace(/\./g," ").split(/[ \/]/);return""===t[t.length-1]&&t.pop(),t}}class e{constructor(t){this.element=document.createElement("div"),this.element.insertAdjacentHTML("beforeend",t)}_titleNode(t){return t.querySelector("a[slot='title']")}_title(t){return this._titleNode(t).childNodes[0].nodeValue.split("\n")[1].trim()}_url(t){return this._attribute(this._titleNode(t),"href")}_attribute(t,e){return t.attributes.getNamedItem(e).value}}class s{set title(t){this._title=t}get title(){return this._title}set year(t){this._year=t}get year(){return this._year}set score(t){this._score=t}get score(){return this._score}set state(t){this._state=t}get state(){return this._state}set url(t){this._url=t}get url(){return this._url}get contextMenuTitle(){return`${this.score?this.score:"??"} ${this.state.match(/fresh/)?":)":":("} ${this.title} (${this.year})`}}class r extends e{constructor(t){super(t),this._movies=[]}get movies(){return this._movies}parse(){this._allNodes.forEach((t=>{this._movies.push(this._parseTopNode(t))}))}get _allNodes(){return this.element.querySelectorAll("search-page-result[slot='movie'] ul[slot='list'] search-page-media-row[skeleton='panel']")}_parseTopNode(t){const e=this._title(t),r=this._attribute(t,"releaseyear"),o=this._attribute(t,"tomatometerscore"),a=this._attribute(t,"tomatometerstate"),i=this._url(t);return Object.assign(new s,{title:e,year:r,score:o,state:a,url:i})}}class o{set title(t){this._title=t}get title(){return this._title}set year(t){this._year=t}get year(){return this._year}set score(t){this._score=t}get score(){return this._score}set state(t){this._state=t}get state(){return this._state}set url(t){this._url=t}get url(){return this._url}get contextMenuTitle(){return`${this.score?this.score:"??"} ${this.state.match(/fresh/)?":)":":("} ${this.title} (${this.year})`}}class a extends e{constructor(t){super(t),this._tvShows=[]}get tvShows(){return this._tvShows}parse(){this._allNodes.forEach((t=>{this._tvShows.push(this._parseTopNode(t))}))}get _allNodes(){return this.element.querySelectorAll("search-page-result[slot='tv'] ul[slot='list'] search-page-media-row[skeleton='panel']")}_parseTopNode(t){const e=this._title(t),s=this._attribute(t,"startyear"),r=this._attribute(t,"tomatometerscore"),a=this._attribute(t,"tomatometerstate"),i=this._url(t);return Object.assign(new o,{title:e,year:s,score:r,state:a,url:i})}}class i{constructor(t){this.query=t,this.baseUrl="https://www.rottentomatoes.com/search?search="}parse(){return fetch(this.url).then((t=>t.text())).then((t=>{const e=new r(t),s=new a(t);return e.parse(),s.parse(),{movies:e,tvShows:s}}))}get url(){return`${this.baseUrl}${this._encodedQuery}`}get _encodedQuery(){return encodeURI(this.query)}}const n=new class{constructor(){this.separatorCount=0}onInit(){chrome.contextMenus.removeAll(),chrome.contextMenus.create({id:"rottenTomatoes",contexts:["selection"],title:"Rotten Tomatoes",onclick:function(e){const s=e.selectionText,r=new t(s);chrome.storage.local.remove("rottenTomatoes"),chrome.storage.local.set({rottenTomatoes:{query:r.query}})}})}addSeparator(){chrome.contextMenus.create({id:`rottenTomatesSep${this.separatorCount}`,type:"separator",contexts:["all"]}),this.separatorCount+=1}afterSearch(e){chrome.contextMenus.removeAll(),chrome.contextMenus.create({id:"rottenTomatoes",contexts:["selection"],title:"New Rotten Tomatoes Search",onclick:function(e){const s=e.selectionText,r=new t(s);chrome.storage.local.remove("rottenTomatoes"),chrome.storage.local.set({rottenTomatoes:{query:r.query}})}}),this.addSeparator()}forMovie(t){chrome.contextMenus.create({id:`rottenTomatoes${t.title}`,title:t.contextMenuTitle,contexts:["all"],onclick:function(){chrome.tabs.create({url:t.url,active:!1})}})}forTvShow(t){chrome.contextMenus.create({id:`rottenTomatoes${t.title}`,title:t.contextMenuTitle,contexts:["all"],onclick:function(){chrome.tabs.create({url:t.url,active:!1})}})}};n.onInit(),chrome.storage.onChanged.addListener(((t,e)=>{const s=t?.rottenTomatoes?.newValue?.query;s&&new i(s).parse().then((t=>{n.afterSearch(s),t.movies.movies.forEach(((t,e)=>{e<5&&n.forMovie(t)})),n.addSeparator(),t.tvShows.tvShows.forEach(((t,e)=>{e<5&&n.forTvShow(t)}))}))}))})();