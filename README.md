friend-picker
=============

Yet another(?) jquery plugin to display and choose Facebook friends.
Full write up at: http://dextropy.com/friendpicker-one-of-many-loose-ends

=============
Scope

Takes the JSON array of friends from one of several FB callbacks and renders it to the screen as an interactive picker
Does NOT handle authentication
Does NOT interact with Facebook other than to retrieve profile images
=============
Audience

You understand the scope above.  Reading further represents a mortally binding pact to not ask me any questions about FB.init.

=============
Basic Usage

The jquery initializer has two parameters:
 - An array of FB friends as JSON
 - An optional config object
 - 
Turn any DOM element into a Facebook friendpicker like so:

var requestUrl = "https://graph.facebook.com/" + _user.uid + 
  "/friends&access_token=" + _user.access_token;

$.getJSON(requestUrl, function(json){
  $("#picker").friendPicker(json.data,{
      presentation : {layout : 'cols4', photoSize : '36'}
  });  
});