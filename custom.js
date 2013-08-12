var scroll_recomend; 
var scroll_pilot;

$('#home,#product-sort , #product-gallery , #guide-list , #product-a , #guide , #recommend, #news , #product-range , #buy-new , #where-to-buy , #social').live( 'pagebeforecreate',function(event)
{
	if(navigator.userAgent.indexOf("Safari")<0 && navigator.userAgent.indexOf("Mac OS")>=0)
	{
		$('head').append('<link rel="stylesheet"  href="css/themes/default/apple_app.css">');
		$(this).children('header').css('padding-top' , '40px');
		//alert("status bar hai");
	}
});

$(document).bind("mobileinit", function(){
	$.mobile.defaultPageTransition =  'slide';	  
});

$(document).on('pageinit' , function(){
	$.event.special.swipe.durationThreshold = 2000;
	$.event.special.swipe.verticalDistanceThreshold  =  500;
	$.event.special.swipe.horizontalDistanceThreshold = 150 ;

});

$(document).on('pagecreate' , function(){
	var lang = all_data.languages ; 
	var all_lang_class = Object.keys(lang) ;
	
	$.each(all_lang_class , function( index , current)
	{
		$('.'+current).html(lang[current]);
	});
});

/*$('#home').live("pagebeforeshow", function()
{
	setTimeout(function(){
	$.mobile.useFastClick=false;
	},2000)
	

});*/

$(function(){
	$('body').prepend('<div id="loader"><div id="splash"><img id="clk" src="css/themes/default/images/splash.jpg" alt="Loading"></div><div class="ui-loader ui-loader-default"><span class="ui-icon ui-icon-loading"></span></div></div>');
	$('.ui-loader').show();
})

$(window).load(function(){
	setTimeout(function(){$('#loader').remove();
	$('#home').fadeIn();} , 4500);	//4500);	
});

$('#guide input[type=text]').live('blur , focus' , function(event)
{
	window.scrollTo(0,0);
	//scroll_pilot.scrollTo(0, 0, 1);
	setTimeout(function()
	{
		if(scroll_pilot !=null)
			scroll_pilot.refresh();
	},0);
});


// for sliding in popup and product range page
$(document).ready(function () {
	var stringChecker = new String(navigator.userAgent);
	$('#product-gallery , #guide-list').live('pageinit', function (event) {
		$('.clickable').click(function () {
			$('.imgslider').children().remove();
			$(this).find('.image-wrapper img').each(function () {
				var srcset = $(this);
				$('.imgslider').append(srcset.clone().css('position', 'absolute'))
			})
			imglength = $('.imgslider img').length;
			ind = 0;
			currentimg = ind + 1;
			$('.imgslider').append('<span>' + currentimg + '/' + imglength + '</span>');
			$('.imgslider img').hide();
			$('.imgslider img').eq(0).show();
			
			if(imglength > 1)
			{
				$('.imgslider img').swipeleft(function () {
					$(document).delegate('.imgslider img', 'scrollstart', false);
					$('.imgslider img').eq(ind).hide('slide', {
						direction: 'left'
					})
					$('.imgslider span').remove();
					currentimg++;
					ind++;
					if (ind > imglength - 1) {
						ind = 0;
						currentimg = 1;
					}
					$('.imgslider').append('<span>' + currentimg + '/' + imglength + '</span>');
					$('.imgslider img').eq(ind).show('slide', {
						direction: 'right'
					})
				})
				$('.imgslider img').swiperight(function () {
					$('.imgslider img').eq(ind).hide('slide', {
						direction: 'right'
					})
					$('.imgslider span').remove();
					currentimg--;
					ind--;
					if (ind < 0) {
						ind = imglength - 1;
						currentimg = imglength;
					}
					$('.imgslider').append('<span>' + currentimg + '/' + imglength + '</span>');
					$('.imgslider img').eq(ind).show('slide', {
						direction: 'left'
					})
				});
			}
		})
	})
	index = 0;
	a = 0;
	
})	
	
	






//  for slider on guide.html
$('#product-a , #product-gallery , #news , #guide' ).live( 'pageshow',function(event){
			var has_child = $('.sliding_content').find('.slide_child').length;
			 if(has_child == 0)
			 {
				 $('.sliding_content').wrapInner('<div class="slide_child" />');
				 $('.sliding_content').wrapInner('<div class="container" />');
				 $('.container').after('<a class="prev" href="#">'+all_data.languages.lang_PRE+'</a> <a class="next" href="#">'+all_data.languages.lang_NEX+'</a>');
				 $('.container').css({ 'overflow' : 'hidden' , 'width' : '100%' });
				 slider('.slide_child' , '.prev' , '.next');
			 }
});

function slider(ele , prev_ele , next_ele )
{
	var parent_width = 0 , num_child , parent_margin_left=0 , last_item_pos =0 , marginleft=0 , slide_num=1 ;
	$(ele).css('margin-left' , '0px');
	$(ele).children().css('float' , 'left');
	parent_width = $(ele).width();
	num_child = $(ele).children().length;
	$(ele).children().width(parent_width);
	$(ele).width(num_child * parent_width);
	last_item_pos = -(parent_width * (num_child - 1));
	
	if( ($('.sliding_content').parents('#product-a').attr('id') == 'product-a') || ($('.sliding_content').parents('#guide').attr('id') == 'guide'))
	{
		$(next_ele).after('<a class="send slider-link ui-link" href="#popupCloseRight" data-rel="popup" data-role="button" data-inline="true"  data-position-to="window">'+all_data.languages.lang_SEN+'</a>');
		$('.send').after('<small class="slide-number"><span class="num"></span> / <span class="total"></span></small>')
	}
	else
		$('.next').after('<small class="slide-number"><span class="num"></span> / <span class="total"></span></small>')


	$('.send').hide();
	$('.next , .prev').addClass('slider-link ui-link');
	
	if(num_child < 2)
		$('.next').hide();
		
	
	slide_num_update();
	
	$(prev_ele).hide();
	$(prev_ele).click(function(){
		calc_margin_left();
		if(marginleft >= 0)
		{
			//alert('first');
		}
		else
		{
			slide_it('+');
			slide_num--;
			slide_num_update();
		}
		return false;
	});
	
	$(next_ele).click(function(){
		calc_margin_left();
		if(marginleft <= last_item_pos )
		{
			//alert('last');
		}
		else
		{
			slide_it('-');
			slide_num++;
			slide_num_update();
		}
		return false;
	});
	
	$('.with_swipe').find('.container').swipeleft(function(){
		calc_margin_left();
		if(marginleft <= last_item_pos )
		{
			//alert('last');
		}
		else
		{
			slide_it('-');
			slide_num++;
			slide_num_update();
		}
		return false;
	});
	
	$('.with_swipe').find('.container').swiperight(function(){
		calc_margin_left();
		if(marginleft >= 0)
		{
			//alert('first');
		}
		else
		{
			slide_it('+');
			slide_num--;
			slide_num_update();
		}
		return false;
	});

	function calc_margin_left()
	{
		parent_margin_left =parseInt($(ele).css('margin-left'));
	}
	
	function slide_it(direction)
	{
			$(ele).stop(true, true).animate({'margin-left' : ''+direction+'='+parent_width+'px'} , 300);
			marginleft = eval(marginleft + direction+ parent_width);
			if(marginleft == 0)
				$(prev_ele).hide();
			else
				$(prev_ele).show();
				
			if(marginleft <= last_item_pos )
			{
				$(next_ele).hide();
				$('.send').show();
			}
			else
			{
				$('.send').hide();
				$(next_ele).show();
			}
	}
	
	function slide_num_update()
	{
		$('.slide-number .num').text(slide_num);
		$('.slide-number .total').text(num_child);
	}

$('.send , .next , .prev , .slide-number').each(function(){
		$(this).css('margin-top' , -($(this).outerHeight()+10));
});


	
}




// for scrollbars 
$('#recommend' ).live( 'pageshow',function(event)
{	scroll_recomend = new iScroll(document.getElementById('scroller-recomend'));
	setTimeout(function(){
		scroll_recomend.refresh(); } , 100);
});

$('#product-sort , #product-gallery , #guide-list , #product-a , #guide ' ).live( 'pageshow',function(event)
{
			
	function scroll_obj(ele)
	{
		if(ele != null)
			return (new iScroll(ele));
	}
	
	var scroll_arr = new Array();
		for(i=0; i<20; i++)
			scroll_arr.push(scroll_obj(document.getElementById('scroller'+i)));
	
	var abc=setTimeout(function()
	{
		for(i=0; i<scroll_arr.length; i++)	
			if(scroll_arr[i] !=null)
				scroll_arr[i].refresh();
	},10);

	$('#scroller').each(function(index){
				new iScroll($(this).get(index));
		});

	$('#scroll_pilot').each(function(index){
				scroll_pilot = new iScroll($(this).get(index));
		});

	if(document.getElementById('scroller51') != null)
		new iScroll(document.getElementById('scroller51'));

	setTimeout(function()
	{ if(scroll_pilot !=null)
				scroll_pilot.refresh();},100);
	
});












// for height of elements
function custom_content()
{
	$('#home , #product-sort, #product-a , #product-gallery , #guide-list , #guide , #recommend, #news , #product-range , #buy-new , #where-to-buy , #social').each(function(){
		$cont = $(this).children(":jqmData(role=content)");	
		$cont.css('height' , $(this).css('min-height'));
	});

	$('#product-a .slide_child').css('height' , parseInt($('#product-a').css('min-height'))-80)

	$('#product-gallery .slide_child').css('height' , parseInt($('#product-gallery').css('min-height'))-80)

	$('#guide .slide_child').css('height' , parseInt($('#guide').css('min-height'))-80)

	$('#news .slide_child').css('height' , parseInt($('#news').css('min-height'))-80)

	$('#product-sort #wrapper').css('height' , parseInt($('#product-sort').css('min-height'))-parseInt($('#product-sort .ui-field-contain').outerHeight(true)));
	refreshing_scroller();

	$('#recommend .wrapper').css('height' , parseInt($('#recommend').css('min-height'))-parseInt($('#recommend h4').outerHeight(true)));
	if(scroll_recomend != null)
		scroll_recomend.refresh();
		
	//$('#product-gallery .imgslider').css('height' , parseInt($('#product-gallery').css('min-height'))+parseInt($('#product-gallery footer').css('height')))
	//$('#guide-list .imgslider').css('height' , parseInt($('#guide-list').css('min-height'))+100)

}















