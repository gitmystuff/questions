var apiAddress 	= "http://localhost:3000/api/",
    qsParm = new Array();

function qs() {
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (var i=0; i<parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0,pos);
            var val = parms[i].substring(pos+1);
            qsParm[key] = val;
        }
    }
}

$( function () {
	
	var Header 	= $.getJSON(apiAddress + 'getContent/1'),
		Nav 	= $.getJSON(apiAddress + 'getContent/2'),
		Footer 	= $.getJSON(apiAddress + 'getContent/3');
		
	$.when(Header, Nav, Footer)
	.done(function(header, nav, footer) {	

        $('#header').html(header[0]);
		$('#menu').html(nav[0]);
		$('#footer').html(footer[0]);
		
		$('.header-elements').css('margin-left', $('#content').offset().left);
		$('.menu-elements').css('margin-left', $('#content').offset().left);
		$('.footer-elements').css('margin-left', $('#content').offset().left);
        
        $( window ).resize(function() {
			$('.header-elements').css('margin-left', $('#content').offset().left);
			$('.menu-elements').css('margin-left', $('#content').offset().left);
			$('.footer-elements').css('margin-left', $('#content').offset().left);
        });
		
		if(window.location.hash.substr(1).split('/')[2]){
			
			var template = window.location.hash.substr(1).split('/')[2];
			var activity = window.location.hash.substr(1).split('/')[3];
			var Template = $.getJSON(apiAddress + 'getTemplate/' + template + '/' + activity);
			
			$.when(Template)
			.done(function(template){
				$('#content').html(template[0]);
			});
			
		} else {
			$('#content').html('<div class="pad-me23"><h2>CONTENT</h2><span class="clickable">Start Questions</span></div>');
		}
		
		$('.clickable')
		.click(function(){
			location.href = "//localhost:8000/#/activity/txtQstn/question";
			location.reload();
		});
		
    });
	
});