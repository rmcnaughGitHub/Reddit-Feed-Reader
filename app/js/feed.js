(function (){

	'use strict'

	var jsonFile = 'https://www.reddit.com/r/analog/top/.json',//https://www.reddit.com/r/analog/top/.json?limit=15
		div = document.getElementById('theDiv'),
		loader = document.getElementById('load-feed'),
		favText = document.getElementById('fav-text'),
		favorites = document.getElementById('favorites'),
		output = document.getElementById('output'),
		pBar = document.createElement('div'),
		imgLoadInterval = null,
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

	//Function duplicate
	function duplicate(div, divtoAppend){
		var clone = div.cloneNode(true); // "deep" clone
		divtoAppend.appendChild(clone);
		// console.log('duplicate function: Clone = ',clone);
	};

	//Format Date and Time
	//** toLocaleDateString() Returns the Date object as a string, 
	// using locale conventions: 0/01/01**
	function formatDateTime(input){
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
	};

	//Preload Image
	function preload(imageArray, progress) {
        // counter
	    var i = 0,
	    	imageObj = new Image(); // create object
	    // start preloading
	    for(i=0; i<=imageArray.length; i++) {
	        imageObj.src = imageArray[i];
	 		//imgLoadInterval = setInterval(progBar, 10);
	        //console.log('Preloading Images ',imageArray);
	    }
	    
	    function progBar(){
			if( imageObj.src ){
				progress.style.width += 2; 
			}else if ( progress.style.width == '100%' ){
				progress.style.display = 'none';
			}
		}
	};

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
		    	parseArray(feedArr);//parse feed'
		    	//console.log('feedArr ',feedArr);
				
		    } else {
		      console.log('aError: ' + xhr.status); // An error occurred during the request.
			}

		}

	};

	//Parse the feed
	function parseArray(array, callback){
		//loop through each
		array.data.children.forEach( function(obj, index) {
			var img = new Image(),
				imdiv = document.createElement('div'),
				tdiv = document.createElement('div'),
				indiv = document.createElement('div'),
				heart = document.createElement('div'),
				trash = document.createElement('div');

			//image
			img.src = obj.data.url;

			//img attributes
			img.setAttribute('class', 'image');
			img.setAttribute('id', 'slide'+index);
			img.setAttribute('alt', obj.data.title);
			img.setAttribute('title', obj.data.title);
			img.style.height = 'auto';
			img.style.width = '100%';
			div.appendChild(imdiv);// add each image div to "theDiv"
			imdiv.appendChild(img);// add images
			imdiv.setAttribute('class', 'content');
			imdiv.setAttribute('id', 'mainDiv'+index);

			///load image
			preload(img.src, pBar);		

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

			//title
			tdiv.setAttribute('class', 'title');
			imdiv.appendChild(tdiv);
			tdiv.innerHTML = obj.data.title;

			//info
			indiv.setAttribute('class', 'footer');
			imdiv.appendChild(indiv);
			indiv.innerHTML = "<i class='fa fa-user' aria-hidden='true'></i> "  + obj.data.author + " ·" 
				+ " <i class='fa fa-clock-o' aria-hidden='true'></i> " + formatDateTime(obj.data.created_utc) + " ·"
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

			///mouse events
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
				duplicate(imdiv, output, true);
				// console.log('favArr = ', favArr[index]);
			});

			//trash
			trash.addEventListener('click', function(){
				favArr.splice(imdiv);//remove from array
				imdiv.remove();//delete this div
				// console.log('Feed ',index, ' removed');
			});

		})

	};

	//Img
	/*function imagesExist(){
		var theImg = document.querySelectorAll('.image');
		console.log('theImg ',theImg);
	}*/
	

	//EventListeners
	function eventListeners(){
		loader.addEventListener('click', loadClick, false);//reload
		favorites.addEventListener('click', loadFavs, false);//favorites		
	};
	eventListeners();

	function loadClick(){
		location.reload(true);//clear cache
		loadJSON(jsonFile);
	};

	function loadFavs(){
		//changebackground color
		this.classList.add('red');
		//hide main feed
		theDiv.style.display = 'none';
		//show output div
		output.style.display = 'block';	
	};

	//run
	run();
	
})();