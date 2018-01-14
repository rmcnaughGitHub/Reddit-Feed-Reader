(function (){

	'use strict'

	var jsonFile = 'https://www.reddit.com/r/analog/top/.json',//https://www.reddit.com/r/analog/top/.json?limit=15
		div = document.getElementById('theDiv'),

		reloadImg = document.getElementById('load-feed'),
		favText = document.getElementById('fav-text'),
		favorites = document.getElementById('favorites'),
		output = document.getElementById('output'),
		progress = document.getElementById('progress'),
		imgLoadInterval = false,

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
	};

	// Function duplicate
	function duplicate(div, divtoAppend){
		var clone = div.cloneNode(true); // "deep" clone
		divtoAppend.appendChild(clone);
	};

	// Format Date and Time
	// ** toLocaleDateString() Returns the Date object as a string, 
	// using locale conventions: 0/01/01**
	function formatDateTime(input){
		var epoch = new Date(0);
		epoch.setSeconds(parseInt(input));
		var date = epoch.toLocaleDateString();
		date = date.replace('T', '');
		return date.split('.')[0];
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
				//console.log('png image ', currentImg);
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
	};

	// Scroll Indicator
	function scrollIndicatior(bar){
		var winScroll = document.body.scrollTop || document.documentElement.scrollTop,
			height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
			scrolled = (winScroll / height) * 100;
			bar.style.width = scrolled + '%';
	};

	// Check Window Width
	function checkWindowWidth(x){
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth;

		return x;
	}

	// Preload Image
	/* jshint browser: true */
	/* exported preload */
	function preload (arr, cb) {
	  'use strict';

	  var newimages = [], 
	    loadedimages = 0;

	  // @TODO: Will convert scalar values to an array, but does not
	  // test if a passed object is actually an array.
	  arr = (typeof arr !== 'object') ? [arr] : arr;

	  function imageloadpost(){
	    loadedimages++;
	    
	    // If we're done and were passed a callback.
	    if (loadedimages === arr.length && cb) {
	      cb(newimages);
	    }
	  }

	  for (var i = 0; i < arr.length; i++) {
	    newimages[i] = new Image();
	    newimages[i].src = arr[i];
	    newimages[i].onload = imageloadpost;
	    newimages[i].onerror = imageloadpost;
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
		    } else {
		      //console.log('aError: ' + xhr.status);
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
			preload(data.url, function (loadedImages) {
			  loadedImages.forEach(img => {
			    //console.log(img.src);
			  });
			});

			// Check if URl has .jpg - if !.jpg  add .jpg
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


				checkWindowWidth();
				if(checkWindowWidth() <= 650) {// if phone or tablet hide heart from duplicate file 
					this.style.display = 'none';
					//console.log('display none');
				};

				// add to fav num
				favText.innerHTML = ++favNum;// **If the operator appears before the variable, the value is modified before the expression is evaluated**
				duplicate(content[i], output);// add to output div
			}

			function trashClick(){
				content[i].style.display = 'none';//hide this div
			}

			//console.log('img ',img[i]);
		});

	}
	
	reloadImg.addEventListener('click', function(){
		location.reload(true);//clear cache reload
	});

	favorites.addEventListener('click', function(){
		//changebackground color
		this.classList.add('red');
		//hide main feed
		theDiv.style.display = 'none';
		//show output div
		output.style.display = 'block';	
	});

	window.onscroll = function() {
		scrollIndicatior(progress);
	};

	//Run
	run();
	
})();