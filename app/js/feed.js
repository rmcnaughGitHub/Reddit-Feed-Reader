var feed = (function (app){

	'use strict'

	var jsonFile = 'https://www.reddit.com/r/analog/top/.json',//https://www.reddit.com/r/analog/top/.json?limit=15
		div = document.getElementById('theDiv'),
		loader = document.getElementById('load-feed'),
		favText = document.getElementById('fav-text'),
		favorites = document.getElementById('favorites'),
		output = document.getElementById('output'),
		favNum = 0,
		favArr = [],
		feedArr = [],
		time = 1,
		i  = 0,
		str = null,
		wdth = '96%';

	function Run(){
		//ChecklocalStorage();//ChecklocalStorage
		//CheckJSONSupport();////checkx JSON support
		favText.innerHTML = favNum;//fav number
		loadJSON(jsonFile);//load json
	}

	//Check if localStorage has elements
	function ChecklocalStorage(){
		if( localStorage.getItem('item') === null){
			consloe.log('You have no favorites Stored!!');
		}
	}

	//Check JSON support
	//JSON is not supported in all browser
	function CheckJSONSupport(){
		if(!(window.JSON && window.JSON.parse))
			{
			    (function() {
				  function g(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
				  else if("function"==b&&"undefined"==typeof a.call)return"object";return b};function h(a){a=""+a;if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function i(a,b){var c=[];j(new k(b),a,c);return c.join("")}function k(a){this.a=a}
				  function j(a,b,c){switch(typeof b){case "string":l(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if("array"==g(b)){var f=b.length;c.push("[");for(var d="",e=0;e<f;e++)c.push(d),d=b[e],j(a,a.a?a.a.call(b,""+e,d):d,c),d=",";c.push("]");break}c.push("{");f="";for(e in b)Object.prototype.hasOwnProperty.call(b,e)&&(d=b[e],"function"!=typeof d&&(c.push(f),l(e,c),c.push(":"),
				    j(a,a.a?a.a.call(b,e,d):d,c),f=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var m={'"':'\\"',"\\":"\\\\","/":"\\/","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},n=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
				  function l(a,b){b.push('"',a.replace(n,function(a){if(a in m)return m[a];var b=a.charCodeAt(0),d="\\u";16>b?d+="000":256>b?d+="00":4096>b&&(d+="0");return m[a]=d+b.toString(16)}),'"')};window.JSON||(window.JSON={});"function"!==typeof window.JSON.stringify&&(window.JSON.stringify=i);"function"!==typeof window.JSON.parse&&(window.JSON.parse=h);
			})();
		}
	}

	//Function Duplicate
	function Duplicate(div, divtoAppend){
		var clone = div.cloneNode(true); // "deep" clone
		divtoAppend.appendChild(clone);
		// console.log('Duplicate function: Clone = ',clone);
	}

	//Format Date and Time
	//** toLocaleDateString() Returns the Date object as a string, 
	// using locale conventions: 0/01/01**
	function FormatDateTime(input){
		var epoch = new Date(0);
		epoch.setSeconds(parseInt(input));
		var date = epoch.toLocaleDateString();
		date = date.replace('T', '');
		return date.split('.')[0]//.split(' ')[0] + ' ' + epoch.toLocaleTimeString().split(' ')[0];
	};

	//Check last part of URL
	function checkLastPart(url){
		var parts = url.split("/");
	    return (url.lastIndexOf('/') !== url.length - 1 
	       ? parts[parts.length - 1]
	       : parts[parts.length - 2]);
	}

	//Load JSON
	function loadJSON(file, callBack){
		var xhr = new XMLHttpRequest();
		//    
		xhr.open('GET', file);
		xhr.send(null);

		xhr.onreadystatechange = function () {
		  var DONE = 4; // readyState 4 means the request is done.
		  var OK = 200; // status 200 is a successful return.
		  if (xhr.readyState === DONE) {
		    if (xhr.status === OK)
		    	feedArr =  JSON.parse(xhr.responseText);//push info to the array
		    	//
			    feedArr.data.children.forEach( function(obj, index) {
						var img = new Image(),
							imdiv = document.createElement('div'),
							tdiv = document.createElement('div'),
							indiv = document.createElement('div'),
							heart = document.createElement('div'),
							trash = document.createElement('div');


						//image
						img.src = obj.data.url;
						//check port of url
						var currentImg = checkLastPart(img.src);
						//check regular expression
						if ( /jpg/.test(currentImg) == false ) {
							if ( /png/.test(currentImg) == true ) {
								//replace port
								img.src.replace('.jpg',img.src);
								console.log('png image ', currentImg);
							}else if( /flickr/.test(img.src) == true ){
								str = 'The Current Image is loading from Flickr and cannot be displayed at this time. Please click the image to view on the Flickr site.';
								img.src.replace('.jpg',img.src);
								img.setAttribute('alt', str.toUpperCase());
								img.style.padding = '10px';
								img.style.width = wdth;
							}
							else {
								img.src = img.src + '.jpg';
							}	
						}
						if( /instagram/.test(img.src) == true ){
							str = 'The Current Image is loading from Instagram and cannot be displayed at this time. Please click the image to view on the Instagram site.';
							img.setAttribute('alt', str.toUpperCase());
							img.style.padding = '10px';
							img.style.width = wdth;
						}
						img.setAttribute('class', 'image');
						img.setAttribute('id', 'slide'+index);//
						img.style.maxHeight = '100%';
						img.style.maxWidth = '100%';
						div.appendChild(imdiv);// add each image div to "theDiv"
						imdiv.appendChild(img);// add images
						imdiv.setAttribute('class', 'content');
						imdiv.setAttribute('id', 'mainDiv'+index);

						//title
						tdiv.setAttribute('class', 'title');
						imdiv.appendChild(tdiv);
						tdiv.innerHTML = obj.data.title;

						//info
						indiv.setAttribute('class', 'footer');
						imdiv.appendChild(indiv);
						indiv.innerHTML = "<i class='fa fa-user' aria-hidden='true'></i> "  + obj.data.author + " ·" 
							+ " <i class='fa fa-clock-o' aria-hidden='true'></i> " + FormatDateTime(obj.data.created_utc) + " ·"
							+ " <i class='fa fa-bolt' aria-hidden='true'></i> " + obj.data.score;

						//favorite (heart)
						imdiv.appendChild(heart);
						heart.setAttribute('id', 'heart');
						heart.setAttribute('class', 'heart');
						heart.innerHTML = '<i class="fa fa-heart" style="position:absolute;left:0; vertical-align:middle;"></i>';

						//trash
						imdiv.appendChild(trash);
						trash.setAttribute('class', 'trash');
						trash.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true" style="position:absolute;left:0; vertical-align:middle;"></i>';

						//mouse events
						imdiv.addEventListener('mouseover', function(){
							if ( !heart.classList.contains('slide-away') ){
								heart.classList.add('slide');
							}else{
								trash.classList.add('slide-trash');
							}
						});

						imdiv.addEventListener('mouseout', function(){
							if ( heart.classList.contains('slide') ){
								heart.classList.remove('slide');
							}else{
								trash.classList.remove('slide-trash');
							}
						});

						img.addEventListener('click', function(){
							window.open(obj.data.url,'_new');
						});

						//heart
						heart.addEventListener('click', function(){
							//slide away each heart
							this.classList.add('slide-away', 'red');
							// console.log('Heart Clicked ',index, ' class ', this.classList);
							
							//Add to favorites and push to array
							favArr.push(imdiv);
							//add to fav num
							//**If the operator appears before the variable, 
							//the value is modified before the expression is evaluated**
							favText.innerHTML = ++favNum;
							// console.log('favNum = ', favNum);
							//add to output div
							Duplicate(imdiv, output, true);
							// console.log('favArr = ', favArr[index]);
						});

						//trash
						trash.addEventListener('click', function(){
							favArr.splice(imdiv);//remove from array
							imdiv.remove();//delete this div
							// console.log('Feed ',index, ' removed');
						});

						//favorites
						favorites.addEventListener('click', function(){
							//changebackground color
							this.classList.add('red');
							//hide main feed
							theDiv.style.display = 'none';
							//show output div
							output.style.display = 'block';	
						});

						//load json from load
						loader.addEventListener('click', function(){
							location.reload(true);//clear cache
							loadJSON(jsonFile);
						});

				});

		      	//console.log(xhr.responseText); // 'This is the returned text.'
		      	//console.log('feedArr ', feedArr);
		      	
		    } else {
		      console.log('aError: ' + xhr.status); // An error occurred during the request.
		    }

			return feedArr;
		  
		}


	}

	//Run
	Run();
	
})();