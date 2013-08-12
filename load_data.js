
var all_data ;
var $markup ;
var scroller = null;
var recommend_data ;
var query_recommend ;

function setter()
{
	$.ajax({
		  url: 'data1.php',
		  dataType: 'json',
		  type: "POST",
		  data : { country : force},
		  async: false,
		  success: function(data) 
		  {
				all_data = data ; 
		  }
	});
}

$(document).ready(function(){
	setter();
});

// index page 
$('#home').live( 'pagebeforecreate',function(event)
{

	var arr = all_data.data;

	
	$markup = $('<div class="markup" />');
	$wrapper = $('<div class="content-primary" />');
	$ul = $('<ul data-role="listview" data-inset="true" class="adjust-height main-menu" id="menu" />');
	$ul.append('<li class="pro-range"><a href="product-range.html" data-prefetch><h3>'+all_data.data[0].name+'</h3><p>'+all_data.data[0].content+'</p></a></li>');
	$ul.append('<li class="guide"><a href="guide.html" data-prefetch><h3>'+all_data.data[1].name+'</h3><p>'+all_data.data[1].content+'</p></a></li>');
	$ul.append('<li class="sort"><a href="sort-by.html" data-prefetch><h3>'+all_data.data[2].name+'</h3><p>'+all_data.data[2].content+'</p></a></li>');

	if(all_data.campaign.length > 0)
		$ul.append('<li class="local"><a href="campaigns.html"><h3>'+all_data.data[3].name+'<span class="ui-li-count" id="campaigns_count">'+all_data.campaign.length+'</span></h3><p>'+all_data.data[3].content+'</p></a></li>');
	else
		$ul.prepend('<li class="filler-image"><img src="css/themes/default/images/no_cam.png" /></li>')

	$wrapper.append($ul);
	$markup.append($wrapper);
				
	$(this).find( ":jqmData(role=content)" ).html($markup.html());
					
					
});



	
// product range menu page 
$('#product-range').live( 'pagebeforecreate',function(event)
{
	$.ajax({ url: 'store.php?section=1'});
	
	var arr = all_data.series.all ;
	
	$markup = $('<div class="markup" />');

	$.each(arr , function(key , current)
	{
		$anchor = $('<a href="#" class="ui-grid-a" />');
		var hash = current.series.replace( /\s/g, '').toUpperCase();
		$anchor.attr({ 'href' : 'product-gallery.html?series='+hash });
		
		$span = $('<span />').addClass('model-no').html(current.series);
		$img = '<img src="'+ current.image +'" alt="" />';
		$h2 = '<h2>'+ current.title +'</h2>';
		$p = '<p>'+ current.desc +'</p>';

		$anchor.append($span , $img , $h2 , $p);
		$markup.append($anchor)

	});
	
	if(all_data.series.all.length > 2 )
		$(this).find( ":jqmData(role=content)" ).addClass('triplet');
	
	$(this).find( ":jqmData(role=content)" ).html($markup.html());

});
  
  
  
  
  
  
// product gallery page 
$('#product-gallery').live( 'pagebeforecreate',function(event)
{
	var sel_product = product_by_series($(this).data("url"));
	
	$markup = $('<div class="markup" />');
	 
	$.each(sel_product , function(key , current)
	{
		$grid= $('<div class="ui-grid-a" />');
		$wrapper = $('<div class="block wrapper" />');
		$scroller = $('<div id="scroller'+key+'" />');
		
		$span = '<span class="model-no"> '+ current.series +' </span>';
		
		$features = $('<span class="product-add" />');
		
		var count_feat_img = 0 ;
		for(i=0; i < current.features.length ; i++ )
		{	var src = feature_image(current.features[i]);
			if(src != null)
			{
				$features.append('<img src="'+ src +'" alt="" />');
				count_feat_img++;
			}
		}
		$popup = $('<a href="#popupCloseRight" class="ui-btn-block thumb clickable" data-rel="popup" data-inline="true"  data-position-to="window"><img src="css/themes/default/images/btn.png" alt="" /></a>');
		$popup_img = $('<div class="image-wrapper" />');
		for(i=0; i < current.image.length ; i++ )
			$popup_img.append('<img src="'+ current.image[i] +'" alt="" />');
		
		$popup.append($popup_img);

		$img = '<div style="min-height:550px"><img src="'+ convert_to_grey(current.image[0]) +'" alt="" /></div>'
		$h2 = '<h2>' + current.title + '</h2>' ;
		$desc = '<div class="editor-data">' + current.data + '</div>' ; 
		
		if(count_feat_img > 0)
			$scroller.append($span , $features , $popup , $img , $h2 , $desc);
		else
			$scroller.append($span , $popup , $img , $h2 , $desc);
			
		$wrapper.append($scroller);
		$grid.append($wrapper);
		$markup.append($grid);
		
		$markup.find('.ui-grid-a:odd').addClass('even');
		
	});
	
	$(this).find( ":jqmData(role=content)" ).html($markup.html());

});





// sort-by-feature page 
$('#product-sort').live( 'pagebeforecreate',function(event)
{
	$.ajax({ url: 'store.php?section=3'});

	filter_sort_product("all");
	$('select').change(function(){
		var selected = $(this).children(':selected').val();
		filter_sort_product(selected);
		setTimeout(function(){scroller.refresh();} , 10 );
		setTimeout(function(){scroller.refresh();} , 100);
		setTimeout(function(){scroller.refresh();} , 500);
		setTimeout(function(){scroller.refresh();} , 1500);
	});
	$('select').blur(function(){window.scrollTo(0,0);});
});

function filter_sort_product(selected)
{
	var arr = all_data.products.all ;
	var new_arr = new Array() ;
		
	if(selected != "all")
	{
		$.each(all_data.sortfeature , function(key , value){
			if(value[selected] != null)
				filter_name = value[selected];
		});
			
		$.each(filter_name , function(key1 , value){
			$.each(arr , function(key2 , current)
			{	
				if(value == current.serial)
				{
					new_arr.push(current);
				}
			});
		});

		arr = new_arr;
	}
	
	$markup = $('<div class="markup" />');
	$.each(arr , function(key , current)
	{
		$product = $('<div class="product-block">');
		$h2 = '<h2>'+current.title+'</h2>' ;
		$img = '<img src="'+ convert_to_grey(current.image[0]) +'" alt="" class="ui-btn-left thumbnail" />' ; 
		$ul = $('<ul class="product-list" />');
		$ul_data = '';
		for(i=0; i < current.features.length ; i++ )
			if(feature_image(current.features[i]) !=null)
				$ul_data += '<li><img src="'+ feature_image(current.features[i]) +'" alt=""/></li>';
		$ul.append($ul_data);
		$product.append($h2 , $img , $ul);
		$markup.append($product);
	});
	$('#product-sort').find( ":jqmData(role=content)" ).find('#scroller-refresh').html($markup.html());

}

// selection guide page ( guide.html )
$('#product-a').live( 'pagebeforecreate',function(event)
{
	$.ajax({ url: 'store.php?section=2'});

	quiz = all_data.quiz;
	$markup = $('<div/>');
	$.each(quiz, function(key , current)
	{	
		var index = key+1;
		$block = $('<div class = "block border-btm" />');
		$count = $('<em class="count" />').html(index);
		$h5 = $('<h5/>').html(current.question);
		$slider_wrapper = $('<div data-role="fieldcontain" class="slider-range" />');

		$slider_input = $('<input type="range" name="question'+current.id+'" id="question'+index+'" value="0" min="0" step="1" max="'+(current.options.length-1)+'" data-highlight="true" data-theme="d" />') 
		$ul = $('<ul class="three-options" />');
		$.each(current.options , function(key1 , value)
		{
			$li = $('<li />').html(value);
			if(key1 == 1 && current.options.length == 3)
				$li = $('<li />').append('<span>'+value+'</span>');
			$ul.append($li);
		});
		
		if(current.options.length == 5)
			$ul.addClass('five-options').removeClass('three-options');
		
		if(current.options.length == 2)
		{
			$ul.removeClass('three-options');
			$ul.children(':last').css({'background-position' : '98% 0' , 'width' : '70%'});
		}
		
		$slider_wrapper.append($slider_input , $ul);
		
		
		
		$block.append($count , $h5 , $slider_wrapper);

		if(key%2==0)
			$scroller = $('<div id="scroller'+index+'" />')

		if(key == 0)
		{
			$head = ' <h4>Please answer the question below</h4>';
			$scroller.append($head);
		}
		
		$scroller.append($block)
		
		if((key%2 != 0) || (index==all_data.quiz.length && index%2 != 0))
		{
			$warpper = $('<div class = "block wrapper padd-top" />');
			$warpper.append($scroller);
			$markup.append($warpper);
		}

	});
	$(this).find( ":jqmData(role=content)" ).html($markup.html());
});


// recommended products from quiz
$('#recommend').live( 'pagebeforecreate',function(event)
{
	$.ajax({
		  url: query_recommend ,
		  dataType: 'json',
		  async: false,
		  success: function(data) 
		  {
				recommend_data = data ; 	
		  }
	});
	
	//recommend_data = { "recommend" :  ["345678","456789","234567","89078","9999","90001","90000""345678","456789","234567","89078"] };
	 
	var recommend_arr = recommend_data.recommend;
	var arr = all_data.products.all ;
	var new_arr = new Array() ;
	
	$.each(recommend_arr , function(key1 , value){
			$.each(arr , function(key2 , current)
			{	
				if(value == current.serial)
				{
					new_arr.push(current);
				}
			});
		});

	arr = new_arr;
	$markup = $('<div />')
	$.each(arr , function(key , current)
	{
		$product = $('<a href="guide-list.html?id='+current.serial+'" class="product-block" />');
		$count = $('<em class="count" />').html(key+1);
		$h2 = '<h2>'+current.title+'</h2>' ;
		$img = '<img src="'+ convert_to_grey(current.image[0]) +'" alt="" class="ui-btn-left thumbnail" />' ; 
		$ul = $('<ul class="product-list" />');
		$ul_data = '';
		for(i=0; i < current.features.length ; i++ )
			if(feature_image(current.features[i]) !=null)
				$ul_data += '<li><img src="'+ feature_image(current.features[i]) +'" alt=""/></li>';
		$ul.append($ul_data);
		$product.append($count , $h2 , $img , $ul , '<img class="arrow-right" src="css/themes/default/images/arrow-right.png"/>');
		$markup.append($product);
	});
	$(this).find( ":jqmData(role=content)" ).find('#scroller-recomend').html($markup.html());
});




// guide-list page
$('#guide-list').live( 'pagebeforecreate',function(event)
{
	var sel_product = $(this).data("url").replace(/.*=/,"");
	var arr = all_data.products.all ;

	$markup = $('<div class="markup" />');
	$wrapper = $('<div class="overflow_h" />');
	 
	$.each(arr , function(key , current)
	{
		if(sel_product == current.serial)
		{
			$features = $('<span class="product-add" />');
			
			var count_feat_img = 0 ;
			for(i=0; i < current.features.length ; i++ )
			{	var src = feature_image(current.features[i]);
				if(src != null)
				{
					$features.append('<img src="'+ src +'" alt="" />');
					count_feat_img++;
				}
			}
			$popup = $('<a href="#popupCloseRight" class="ui-btn-block thumb clickable" data-rel="popup" data-inline="true"  data-position-to="window"><img src="css/themes/default/images/btn.png" alt="" /></a>');
			$popup_img = $('<div class="image-wrapper" />');
			for(i=0; i < current.image.length ; i++ )
				$popup_img.append('<img src="'+ current.image[i] +'" alt="" />');
			
			$popup.append($popup_img);
			$img = '<img src="'+ convert_to_grey(current.image[0]) +'" alt="" />'
			$h2 = '<h2>' + current.title + '</h2>' ;
			$desc = '<div class="editor-data">' + current.data + '</div>' ; 
			
			if(count_feat_img > 0)
				$wrapper.append($features , $popup , $img , $h2 , $desc);
			else
				$wrapper.append( $popup , $img , $h2 , $desc);

			
			//$description = $('<ul class="description" />');
			// for adding li in description 
			
			$social = $('<ul data-role="listview" data-shadow="true" class="social-list" data-theme="a" />');
			$social.append('<li><a href="test-pilot.html">'+all_data.languages.lang_BECOME +'</a></li>')
			$social.append(' <li><a href="social.html?id='+current.serial+'">'+all_data.languages.lang_SHARE +'</a></li>')

			$markup.append($wrapper , $social);
		}
	});
	$(this).find( ":jqmData(role=content)" ).find('#scroller4').html($markup.html());
});



// campaigns
$('#news').live( 'pagebeforecreate',function(event)
{
	$.ajax({ url: 'store.php?section=4'});

	var arr = all_data.campaign;
	//alert(11)
	$markup = $('<div class="markup" />');
	
	$.each(arr , function(key , current)
	{
		$news = $('<div class="news-item" />');
		
		$image = $('<img src="'+current.image+'" alt="" />');
		$h3 = $('<h3 />').html(current.desc);
		desc = current.desc + current.start + ' to ' + current.end ; 
		//$p = $('<p />').html(desc);
		$news.append($image , $h3 );
		$markup.append($news);
	});
	$(this).find( ":jqmData(role=content)" ).html($markup.html());
});

// where-to-buy page
$('#where-to-buy').live( 'pagebeforecreate',function(event)
{
	$.ajax({ url: 'store.php?section=5'});

	var arr = all_data.address;
	
	$markup = $('<div class="markup" />');
	
	$.each(arr , function(key , current)
	{
		$li = $('<li />');
		$a = $('<a href="buy.html?'+current.lat+'&'+current.lng+'"/>');
		
		$item =  $('<div class="menu-item" />');
		$h3 = $('<h3 />').html(current.name);
		$desc = $('<span class="description" />').html(current.address);
		$country = $('<span class="country" />').html(current.country);
		$item.append( $h3 ,  $desc , $country );
		
		$a.append( $item , '<img src="'+current.logo+'" alt="" />');
		$li.append($a);
		$markup.append($li);
	});
	$(this).find( ":jqmData(role=content)" ).find('#container').html($markup.html());
});


// google map page
$('#buy-new').live( 'pagebeforecreate',function(event)
{
	var place = $(this).data("url").replace(/.*\?/,"");
	var lat  = parseFloat(place.split('&')[0]);
	var lng  = parseFloat(place.split('&')[1]);

	var mapOptions = {
						 center		: 	new google.maps.LatLng(lat, lng),
						 zoom		: 	7,
						 mapTypeId	: 	google.maps.MapTypeId.ROADMAP
					};
					
   var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

   var marker=new google.maps.Marker({
										position	:	(new google.maps.LatLng(lat, lng)),
										title		:	"SpeedGlas Helmets"
									});
   
   marker.setMap(map);	 
});

// test pilot module
$('#guide').live( 'pagebeforecreate',function(event)
{
	var questions ; 
	$.ajax({
		  url: 'question.php' ,
		  dataType: 'json',
		  async: false,
		  success: function(data) 
		  {
				questions = data.question ; 	
		  }
	});

	$.each(questions , function(key , current)
	{
		var id = current.id ; 
		$('#question'+id).html(current.question);
		//console.log($('#question'+id).html());
		//console.log(id);
	});
	
	
	var query = "pilot.php?string=";
	$('#guide .send').live('click' , function()
	{
		$.each(questions , function(key , current)
		{
			var id = current.id ; 
			$('.question'+id).each(function(){

				$(this).filter(':html').each(function()
				{
					query += ('question'+ id +'_' + $(this).val() + ',');
				});

				$(this).filter('input:checked').each(function()
				{
					query += ('question'+ id +'_' + $(this).val() + ',');
				});

			});
			
		});

		$.ajax(
		{
		  url: query  ,
		  async: false,
		  success: function(data) 
		  {
				console.log(query);
		  }
		});
		
	});
});


//social.html
$('#social').live( 'pagebeforecreate',function(event)
{
	var id = $(this).data("url").replace(/.*\=/,"");
	var url = $.mobile.path.get(location.href)+'3m/3mweb/index.php?prod='+id+'_'+all_data.Country;
	//var place = $(this).data("url").replace(/.*\?/,"");
		
	//console.log(url);

	var arr = all_data.products.all ;
	
	var title_arr = new Array();
	var urls = new Array();
	
	$markup = $('<div class="markup" />');
	$.each(arr , function(key , current)
	{
		if(id == current.serial)
		{
			title_arr = ['Facebook' , 'Twitter' , 'Google++' , 'Email'];
			urls = [		'http://www.facebook.com/sharer/sharer.php?u='+url/*+'&p[title]='+current.title+'&p[summary]=This helmet is of series'+current.series*/,
							'http://twitter.com/share?url='+url,
							'https://plusone.google.com/_/+1/confirm?hl=en&url='+url,
							'mailto:?subject=Speedglas Helmets : '+current.title+'&body=I will like to share with you '+url /*+current.data*/
						] ; 
		}
	});


	$.each(title_arr , function(key , value)
	{
		$a = $('<a target="_blank" />').attr('href' , urls[key]).html(value);
		$li = $('<li />').append($a);
		$markup.append($li);
	});

	$(this).find( ":jqmData(role=content)" ).find('#container').html($markup.html());
	
	
});








function feature_image(feature)
{
	var feat = {"features"	:	[
							{"Head" 		:	"css/themes/default/images/d4.png" } ,
							{"Flip-up"		: 	"css/themes/default/images/d1.png" } ,
							{"Respiratory"	:	"css/themes/default/images/d3.png" } ,
							{"Hearing"		:	"css/themes/default/images/d2.png" } , 
							{"Eye and Face"	:	null  } ,
							{"Graphics"		:	null  } 
						]};
	var path = null
	$.each(feat.features , function(key , value){
		if(value[feature] != null)
			path = value[feature];
	});
	return path;
}


function product_by_series(series)
{
	var series_num = series.replace(/.*=/,"");
	var all_product = all_data.products.all ;
	var sel_product = new Array()  ; 

	$.each(all_product , function(key , current)
	{	
		if(series_num == current.series.replace( /\s/g, '').toUpperCase())
		{
			sel_product.push(current);
		}
	});
	
	return sel_product;
}










// refresh scroller
$('#product-sort').live( 'pageshow',function(event)
{
	scroller = new iScroll(document.getElementById('scroller-refresh'));
	setTimeout(function(){refreshing_scroller();} , 500);
});

// query string for recommended products
$('#product-a .send').live('click' , function()
{
	query_recommend = 'selection.php?answers=' ; 
	for(i=1 ; i<11 ; i++)
	{
		query_recommend += ($('#question'+i).attr('name')+'_'+$('#question'+i).val());
		if(i != 10)
			query_recommend += ',';
	}
});


function refreshing_scroller()
{
	if(scroller != null){
		setTimeout(function(){scroller.refresh();},0)}
}



function convert_to_grey(str)
{
	return (str.split('.')[0]+'_med.'+str.split('.')[1]);

}










