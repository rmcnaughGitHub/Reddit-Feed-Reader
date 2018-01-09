(function (){

	'use strict'

	var jsonFile = 'https://www.reddit.com/r/analog/top/.json',//https://www.reddit.com/r/analog/top/.json?limit=15
		div = document.getElementById('theDiv'),

		loader = document.getElementById('load-feed'),
		favText = document.getElementById('fav-text'),
		favorites = document.getElementById('favorites'),
		output = document.getElementById('output'),
		imgLoadInterval = false,

		// divs
		img = new Image(),
    	theMainImg = document.createElement('div'),
    	heart = document.createElement('div'),
    	trash = document.createElement('div'),

		favNum = 0,
		favArr = [],
		feedArr = [],
		time = 1,
		i  = 0,
		str = null,
		wdth = '96%';

	function run(){
		favText.innerHTML = favNum;//fav number
		loadJSON(jsonFile);//load json

		HTMLCollection.prototype.forEach = Array.prototype.forEach;
		NodeList.prototype.forEach = Array.prototype.forEach;
	};

	// Function duplicate
	function duplicate(div, divtoAppend){
		var clone = div.cloneNode(true); // "deep" clone
		divtoAppend.appendChild(clone);
		// console.log('duplicate function: Clone = ',clone);
	};

	// Format Date and Time
	// ** toLocaleDateString() Returns the Date object as a string, 
	// using locale conventions: 0/01/01**
	function formatDateTime(input){
		var epoch = new Date(0);
		epoch.setSeconds(parseInt(input));
		var date = epoch.toLocaleDateString();
		date = date.replace('T', '');
		return date.split('.')[0]//.split(' ')[0] + ' ' + epoch.toLocaleTimeString().split(' ')[0];
	};

	// Check last part of URL
	function checkLastPart(url){
		var parts = url.split("/");
	    return (url.lastIndexOf('/') !== url.length - 1 
	       ? parts[parts.length - 1]
	       : parts[parts.length - 2]);
	};

	// Set Multiple Attributes of to one element
	function setAttributes(el, attrs) {
	  for(var key in attrs) {
	    el.setAttribute(key, attrs[key]);
	  }
	};

	// Check If URl has .jpg
	function checkURlJpg(img){
		//check port of url
		var currentImg = checkLastPart(img.src);

		if ( /jpg/.test(currentImg) == false ) {
			if ( /png/.test(currentImg) == true ) {
				//replace port
				img.src.replace('.jpg',img.src);
				console.log('png image ', currentImg);
			}else if( /flickr/.test(img.src) == true ){
				str = 'The Current Image is loading from Flickr and cannot be displayed at this time. Please click the image to view on the Flickr site.';
				img.src.replace('.jpg',img.src);
				img.setAttribute('alt', str.toUpperCase());
				img.setAttribute('title', str.toUpperCase());
				img.style.padding = '10px';
				img.style.height = '';
				img.style.width = wdth;
			}
			else {
				img.src = img.src + '.jpg';
			}	
		}
		if( /instagram/.test(img.src) == true ){
			str = 'The Current Image is loading from Instagram and cannot be displayed at this time. Please click the image to view on the Instagram site.';
			img.setAttribute('alt', str.toUpperCase());
			img.setAttribute('title', str.toUpperCase());
			img.style.padding = '10px';
			img.style.height = '';
			img.style.width = wdth;
		}
	}

	// Preload Image
	function preload(arr){
	    var newimages = [], 
	    	loadedimages = 0,
	    	postaction = function(){};//declare empty function
	    var arr = (typeof arr!='object')? [arr] : arr
	    function imageloadpost(){
	        loadedimages++;
	        //console.log('This Image Loaded ',arr);
	        if (loadedimages === arr.length){
	            postaction(newimages);//on complete run postfunction
	        }
	    }
	    for (var i=0; i<arr.length; i++){
	        newimages[i] = new Image()
	        newimages[i].src = arr[i]
	        newimages[i].onload = function(){
	            imageloadpost();
	        }
	        newimages[i].onerror = function(){
	        	imageloadpost();
	        }
	    }

	    return { //return blank object with done() method
	        done:function(f){
	            postaction = f || postaction //remember user defined callback functions to be called when images load
	        }
	    }
	}

	// Load JSON
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
		    	parseArray(feedArr);//parse feed'
		    	//console.log('feedArr ',feedArr);	
		    } else {
		      console.log('aError: ' + xhr.status); // An error occurred during the request.
			}

		}

	};

	// Parse Array
	function parseArray(itm){
	    itm.data.children.forEach( function(itm, index) {

	    	var data = {
		        url: itm.data.url,
		        title: itm.data.title,
		        info: "<i class='fa fa-user' aria-hidden='true'></i> "  + itm.data.author + " ·" 
				+ " <i class='fa fa-clock-o' aria-hidden='true'></i> " + formatDateTime(itm.data.created_utc) + " ·"
				+ " <i class='fa fa-bolt' aria-hidden='true'></i> " + itm.data.score,
		        score: itm.data.score
		    },

		    newDivs = {
		    	img: new Image(),
		    	theMainImg: document.createElement('div'),
		    	theTitle: document.createElement('div'),
		    	theInfo: document.createElement('div'),
		    	heart: document.createElement('div'),
		    	trash: document.createElement('div'),

		    	styles: function() {
		    		newDivs.img.style.height = 'auto';
		    		newDivs.theTitle.innerHTML = data.title;
		    		newDivs.theInfo.innerHTML = data.info;
		    		newDivs.heart.innerHTML = '<i class="fa fa-heart" style="position:absolute;left:0; vertical-align:middle;"></i>';
		    		newDivs.trash.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true" style="position:absolute;left:0; vertical-align:middle;"></i>';
		    	}
		    }
		    newDivs.styles();

		    div.appendChild(newDivs.theMainImg).appendChild(newDivs.img);
			newDivs.theMainImg.appendChild(newDivs.theTitle);
			newDivs.theMainImg.appendChild(newDivs.theInfo);
			newDivs.theMainImg.appendChild(newDivs.heart);
			newDivs.theMainImg.appendChild(newDivs.trash);

			setAttributes(newDivs.theMainImg, {'class':'content', 'id':'mainDiv'+(index+1)});
			setAttributes(newDivs.img, {'class':'image', 'src':data.url, 'id':data.title, 'alt':data.title, 'title':data.title});
			setAttributes(newDivs.theTitle, {'class':'title'});
			setAttributes(newDivs.theInfo, {'class':'footer'});
			setAttributes(newDivs.heart, {'class':'heart','id':'heart'+(index +1)});
			setAttributes(newDivs.trash, {'class':'trash'});

			///load image
			preload(data.url).done(function(){
				//console.log('Fully Loaded ',data.url);
			});

			// Check if URl has .jpg
			// if !.jpg  add .jpg
			checkURlJpg(newDivs.img);
			
	    });

	    imgMouseEvent();
	}

	// EvenListeners
	function imgMouseEvent(arg){
		var img = document.getElementsByTagName('img'),// out put = HTMLCollection
			content = document.getElementsByClassName('content'),// out put = HTMLCollection
			heartDiv = document.getElementsByClassName('heart'),// out put = HTMLCollection
			trashDiv = document.getElementsByClassName('trash'),// out put = HTMLCollection
			imgArray = Array.from(img);// Convert an HTMLCollection to an Array

		imgArray.forEach(function(element, i){
			img[i].addEventListener('mouseover', mouseOver,false);
			img[i].addEventListener('mouseout', mouseOut,false);
			img[i].addEventListener('click', imgClick,false);
			heartDiv[i].addEventListener('mouseover', mouseOver,false);
			heartDiv[i].addEventListener('click', heartClick, false);
			trashDiv[i].addEventListener('mouseover', mouseOver,false);
			trashDiv[i].addEventListener('click', trashClick, false);

			function mouseOver(){
				if ( !heartDiv[i].classList.contains('slide-away') ){
						heartDiv[i].classList.add('slide');
				}else{
					trashDiv[i].classList.add('slide-trash');
				}
			}

			function mouseOut(){
				if ( heartDiv[i].classList.contains('slide') ){
						heartDiv[i].classList.remove('slide');
				}else{
					trashDiv[i].classList.remove('slide-trash');
				}
			}

			function imgClick(){
				window.open(img[i].src,'_new');
			}

			function heartClick(){
				this.classList.add('slide-away', 'red');// slide away each heart
				favArr.push(content[i]);// Add to favorites and push to array
				// add to fav num
				favText.innerHTML = ++favNum;// **If the operator appears before the variable, the value is modified before the expression is evaluated**
				duplicate(content[i], output, true);// add to output div
			}

			function trashClick(){
				content[i].style.display = 'none';//hide this div
			}

			//console.log('img ',img[i]);
		});

	}
	
	loader.addEventListener('click', function(){
		location.reload(true);//clear cache
		loadJSON(jsonFile);
	});

	favorites.addEventListener('click', function(){
		//changebackground color
		this.classList.add('red');
		//hide main feed
		theDiv.style.display = 'none';
		//show output div
		output.style.display = 'block';	
	});

	//run
	run();
	
})();