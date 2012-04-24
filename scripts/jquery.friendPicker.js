/*
 
	JQuery FriendPicker
	A Jquery plugin to display a searchable, selectable list of Facebook friends
	Sam Gong, Feb 2012
	http://dextropy.com
  
	Provided as-is, free to copy, use, and change for any purpose.
    
 */


$.friendPicker = {
	FB_PHOTO_PREFIX : "//graph.facebook.com/",
	FB_PHOTO_SUFFIX : "/picture?type=square",
	TEMPLATES : {
		searchBox : "<input class='friendPicker_searchBox' type='text'>",
		friendPhoto : "<img class='friendPicker_friendPhoto' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NTRDNEMwQTUxN0MxMUUxODRFNUQ4MkY0OTAzRDkxMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NTRDNEMwQjUxN0MxMUUxODRFNUQ4MkY0OTAzRDkxMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU1NEM0QzA4NTE3QzExRTE4NEU1RDgyRjQ5MDNEOTExIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU1NEM0QzA5NTE3QzExRTE4NEU1RDgyRjQ5MDNEOTExIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+m/yZ8wAAAAZQTFRFzMzMAAAA0zMzZAAAAAxJREFUeNpiYAAIMAAAAgABT21Z4QAAAABJRU5ErkJggg=='>",
		friendContainer : "<div class='friendPicker_friendContainer'></div>",
		friendOption : "<div class='friendPicker_friendOption'></div>"
	},
	
	// Filter function for search
	filter : function($parent, selector, attr, term) {
	    var $set = $parent.find(selector);
	    $set.hide();
	    // Regex filter the name fields for all the people
	    $set.filter(
	            function() {
	              return $(this).attr(attr).match(new RegExp(term, 'gi'));
	            }).show();
	},
	
	// Sort function for sort
	sortByName : function(a, b) {
	    // Necessary to order the FB friends list
	    var x = a.name;
	    var y = b.name;
	    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	},
	
	// Detect visibility for lazy load
	inView : function(pane, $elem) {
	    var elemTop = $elem.position().top,
			swath = 0 - $elem.height();
		return (elemTop > swath && elemTop < pane);
	},
	
	/************************* friendPicker functions : $.friendPicker($fp)  */
	
	// Add search box bound to filter data-title 
	addSearch : function($fp, options){
		var $search = $(this.TEMPLATES.searchBox);
		$search.bind('change keydown keyup', function(){
		  var val = $(this).val();
		  $.friendPicker.filter( $fp, ".friendPicker_friendOption", "data-title", val);
		  $.friendPicker.lazyLoad( $fp);
		});
		$fp.prepend($search);
	},
	
	lazyLoad : function($fp){
		var height = $fp.height();
		$.each($fp.find("[data-src]"),function(i, f){
			if($.friendPicker.inView(height, $(f))){
				$(f).attr("src",$(f).attr("data-src"));
				$(f).removeAttr("data-src");
			}
		});
	},
	
	getFriendIds : function($fp){
		var ids = [];
		$.each($fp.find(".friendPicker_friendOption.checked"),function(i,f){
			ids.push($(this).attr("data-uid"));
		});
		return ids;
	},
	
	
	applyBehaviors : function($fp,settings){
		// Check or uncheck based on options
		if(settings.behaviors.checked){
			$f.addClass("checked");
		}
		// Check to see if we need the first lazy load
		if(settings.behaviors.lazyLoad){
			$.friendPicker.lazyLoad($fp.find(".friendPicker_friendContainer"));
		}
		// Check to see if search is enabled
		if(settings.behaviors.search){
			$.friendPicker.addSearch($fp);
		}	
		$fp.find(".friendPicker_friendOption").bind("click",function(){
			$(this).toggleClass("checked");
		});
	}
	
	
};

(function($) {
  $.fn.friendPicker = function(data, options) {

    var settings = $.extend({
		dataKeys : {
			// The property of the data objects to use as a facebook photo id, or false
			uid : 'uid',
			// The property of the data objects to use as a facebook photo id, or false
			photo : 'uid',
			// The property of the data objects to display
			title : 'name'
		},
		
		behaviors : {
			// Defer requesting photos until the image is onscreen (recommended)
			lazyLoad : true,
			// Check the friend options by default (not recommended you spammy whore)
			checked : false,
			// Show & enable the search box
			search : true,
			// Optional flag to sort the friend list
			sort : $.friendPicker.sortByName
		},
		
		presentation : {
			// Preferred photo size - default is 50x50 (/picture?type=square)
			photoSize : null,
			// Friend option layout, a class for friendOptions- 'inline', default is block
			layout : false,
			// Height of the picker
			maxHeight : '400px'
		}
		
	}, options),
	dom = document.createDocumentFragment(),
	$fbox = $($.friendPicker.TEMPLATES.friendContainer), 
	$friend, 
	friend,
	$photo,
	src,
	l = data.length,
	i;
	
	if(settings.behaviors.sort){
		data = data.sort(settings.behaviors.sort);
	}
	
	
	/******************************************** Add all the people! **/
	for(i = 0; i < l; i++){
		f = data[i];
		
		// Add the friend option and title
		$f = $($.friendPicker.TEMPLATES.friendOption);
		$f.html( f[settings.dataKeys.title]);
		$f.attr("data-title",f[settings.dataKeys.title]);
		$f.attr("data-uid",f[settings.dataKeys.uid])
		
		// Add the photo based on options
		if(settings.dataKeys.photo && f[settings.dataKeys.photo]){
		
			//Get the photo URL
			$photo = $($.friendPicker.TEMPLATES.friendPhoto);
			src = $.friendPicker.FB_PHOTO_PREFIX + 
				 	f[settings.dataKeys.photo] + 
					$.friendPicker.FB_PHOTO_SUFFIX;		
			if(settings.behaviors.lazyLoad){
				$photo.attr("data-src",src);
				$fbox.bind("scroll",function(){
					clearTimeout($.friendPicker.LAZY_LOAD);
					$.friendPicker.LAZY_LOAD = setTimeout(
						
						$.proxy(function(){
							$.friendPicker.lazyLoad($(this));
						}, $(this)),
						250);
				})
			} else {
				$photo.attr("src",src);
			}
			if(settings.presentation.photoSize){
				$photo.attr("width",settings.presentation.photoSize);
				$photo.attr("height",settings.presentation.photoSize);
			}
			$f.prepend($photo);
		}
		
		// Add the preferred layout class
		if(settings.presentation.layout){
			$f.addClass(settings.presentation.layout);
		}
		dom.appendChild($f[0]);
	}
	$fbox.append(dom);
	$fbox.css("height",settings.presentation.maxHeight);
	$(this).append($fbox);
	$.friendPicker.applyBehaviors($(this),settings);
	
    return ($(this));
  }
})(jQuery);
