$(document).ready(function() {
// load country list:
init_selects();
init_city_lists();

/*
	var country = window.location.pathname.split("/")[1].toUpperCase(),
	       city = window.location.pathname.split("/")[2];
	       
	$('#city-select-box').change(function() {
		var city = $('#city-select-box').find(':selected').val(); // get id from select
		$('#city-select').html('<img src="/img/ajax-loader.gif">');
		location.href = '/' +country + '/' +city; // send to city
	}); // end change event watcher

	// build & select the city list client side :-)
	$.getJSON('/json_cache/citylist_' + country + '.json', function(data) {
		data.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
		$.each(data, function(key, val) {
			$('#city-select-box').append('<option value="' + val.id + '">' + val.name + '</option>');
		});
		var c = window.location.pathname.split("/")[2];
		document.getElementById("city-select-box").value = c;
		// set document title to city name
		var cityname = $('#city-select-box').find(':selected').text();
		document.title = cityname +' -> Stats' ;
		
		$('#city-select').fadeIn(300, 'swing');	
	});

//	var city = window.location.pathname.split("/")[2];
console.log('We\'ve made it this far... ' +city);
 // updatedeals();
setTimeout( function() {
console.log('Updating Deals...');
// updatedeals();
window.location.href=window.location.href;
}, 60000);	
*/
	
}); // end doc.ready

function init_selects() {
	$.getJSON('/json_cache/country_list.json', function(data) {
		data.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
		$.each(data, function(key, val) {
			$('#country-select-box').append('<option value="' + val.id + '">' + val.name + '</option>');
		});
		if (c = window.location.pathname.split("/")[2]) {
			c.toUpperCase();
			console.log('Country is :: ' +c);
			document.getElementById("country-select-box").value = c;
			// set document title to city name
			var e = document.getElementById("country-select-box");
			var countryname = e.options[e.selectedIndex].text;
			// var cityname = $('#country-select-box').find(':selected').text();
			document.title = countryname +' -> Stats' ;
		}
		// $('#country-select').fadeIn(300, 'swing');	
	});
	
	if (country_id = window.location.pathname.split("/")[2]) {
		console.log('We have a country :: ' +country_id);
		var D = new Date(),
		d = dayofyear(D);
		var get = $.ajax({
			type: "GET", url: '/json_cache/citylist_' + country_id + '_' +d +'.json',
			success: function (data, text) {
				console.log('Success! > Loading deals from Cache...');
				if (data == null) { 
					console.log('Data is Null! Back to the drawing board!');
				}
				// console.log('Data :: ' +data);
				data.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
					$.each(data, function(key, val) {
						$('#city-select-box').append('<option value="' + val.id + '">' + val.name + '</option>');
					});
					if (c = window.location.pathname.split("/")[4]){
						document.getElementById("city-select-box").value = c;
						// set document title to city name
						var e = document.getElementById("city-select-box");
						var cityname = e.options[e.selectedIndex].text;
						//var cityname = $('#city-select-box').find(':selected').text();
						document.title = cityname +' -> Stats' ;
						
					}
					$('#city-select').fadeIn(300, 'swing');	
			},
			error: function (request, status, error) {
				console.log('No Cache! Need to Load');
				setTimeout(function() {
					// buildcitylist();
					// buildcitylistall();
				},0);
				// alert('Good Morning Early Bird! \n You are the first person viewing this today! \n'
				// +'We are busy loading the data... please try again in 1 minute...');
			}
		}); // end ajax
	} // end if(country_id)
}

function init_city_lists() {
	console.log('init_city_list called ... ');
	var D = new Date(),
	d = dayofyear(D);
	var get = $.ajax({
		type: "GET", url: '/json_cache/citylist_4_' +d +'.json',
		success: function (data, text) {
			if (data == null) { 
				console.log('Data is Null! Back to the drawing board!');
			}
		},
		error: function (request, status, error) {
			console.log('There are no City City Lists...');
			buildcitylistall();
		}
	}); // end ajax
}

$('#country-select-box').change(function() {
	var country = $('#country-select-box').find(':selected').val(); // get id from select
	if (Number(country) === 300) { console.log('Country : ' +country); window.location.href = '/'; }
	else { location.href = '/country/' +country + '/';  } // send to city 
}); // end change event watcher

$('#city-select-box').change(function() {
	var country = $('#country-select-box').find(':selected').val();
	var city = $('#city-select-box').find(':selected').val(); // get id from select
	if (Number(city) === 0) { window.location.href = '/country/' +country; }
	else { location.href = '/country/' +country + '/city/' +city; }// send to city
}); // end change watcher


//  This function is only used once per day (per country)
// it builds the latest city list for a country and ensures that
// only cities that have active deals appear in the dropdown.
// in the next version we are going to build a more complex list
// with a class="deal" or class="nodeal" to show all cities in the list
// even if they do not have any currently active deals we can show past deals! :-)
function buildcitylist() {
// var country_id = window.location.pathname.split("/")[2];
var e = document.getElementById("country-select-box");
var country_id = e.options[e.selectedIndex].value;
var countryname = e.options[e.selectedIndex].text;
$.get('/getcitylist/' + country_id +'/', function(data) {
  		console.log('Building Citylist for :: ' +country_id );
		alert('Hi! we are still fetching the data for ' +countryname +' \n'
				+'please try again in 1 minute...');
 		// dealinit(city);
		setTimeout( function() {
		// window.location.href = window.location.href;
		window.history.back();
		},300);
    });
} // end buildcitylist

function buildcitylistall() {
	var i = 0,
	count = 0,
	timer = 1000;
	$.getJSON('/json_cache/country_list.json', function(data) {
		$('#country-select').html('<img src="/img/ajax-loader.gif">');
		data.sort(sort_by('name', -1, function(a){return a.toUpperCase()}));
		console.log('Data length :: ' +data.length );
		if(i < data.length) {
			$.each(data, function(key, val) {
			timer += 3000;
				count = setTimeout( function(){
					console.log('i :: ' +i +' Count :: ' + count +' - Val.id :: ' +val.id +' - Val.name :: ' +val.name  +' - Timer :: ' +timer + ' -> date ::' + new Date().getTime() );
						if (val.id < 300){
								$.get('/getcitylist/' + val.id, function(data) {
									console.log('Building Citylist for :: ' +val.id );
								});
						} else {
							 console.log('Loop Ended!');
							 // window.history.back();
							 window.location.href = window.location.href;
							 // clearInterval(intvalcounter);
						}   
						i++;
						count++;
						timer += 4000;
				},timer);		
			}); //end each
		} 
			// $.getJSON('/json_cache/country_list.json', function(data) {
				// data.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
				
			// }); // end each
	}); // end getJSON (outer)
} // end buildcitylist




function sort_by(field, reverse, primer) {
	reverse = (reverse) ? -1 : 1;
	return function(a,b){
		a = a[field];
		b = b[field];
		if (typeof(primer) != 'undefined'){
			a = primer(a);
			b = primer(b);
		}
		if (a<b) return reverse * -1;
		if (a>b) return reverse * 1;
		return 0;
	}
} // end sort_by


function updatedeals() { 
	var city = window.location.pathname.split("/")[2];
	$.get('/refresh/' + city, function(data) {
  		console.log('Cache refreshed for city :: ' +city );
  		dealinit(city);
    });
}

function dealinit(city) {	
	
	var D = new Date(),
	d = dayofyear(D),
	m = minofday(D);
	console.log('Date : ' +D +' Day :: ' +d +' + min :: ' +m);	
	var get = $.ajax({
     type: "GET", url: '/json_cache/deals_' + city + '_' +d +'.json',
     success: function (data, text) {
     console.log('Success! > Loading deals from Cache...');
	 if (data == null) { 
		console.log('Data is NULL!' +data); 
		setTimeout( function(){
			// updatedeals();
			alert('Sorry, Something went wrong there... please try again in 30 seconds.');
			window.stop();
			// document.execCommand('Stop');
			// window.location.href=window.location.href;
			window.history.back()
		}, 2000);
		return;
	 }
     var i = 0,
	 total_s = 0,
	 total_r = 0;
		
		data.sort(sort_by('r', -1));
		$.each(data, function(key, val) {
			$('#deals').append('<div class="deal" id="' + val.id + '">' 		

	+ '<div class="dinfo">'
		+ '<a target="_blank" href="' +val.url + '"><img class="dimg" src="' + val.image_large_url  +'"></a>'
		+ '<h3 class="dtitle">' + val.title  + '</h3>'
		+ '<small> [ ' +val.type_info  + ' ]</small>'
	+ '</div>'	
		
	+ '<div class="tbls">'												
	+ '<table class="results green" width="100%" cellspacing="0" cellpadding="0" border="0">'				
		+ '<tbody>'			
			+ '<tr class="res_hdr"> <td class="col1">   Sold </td><td>               Revenue </td></tr>'
			+ '<tr class="res_lrg"> <td class="col1">'  + Math.round(val.s)  +'</td><td>  &pound;' + Math.round(val.r*10)/10  + '</td></tr>'
		+ '</tbody>'		
	+ '</table>'
	
	+ '<table class="results blue" width="100%" cellspacing="0" cellpadding="0" border="0">'				
		+ '<tbody>'						
			+ '<tr class="res_hdr"> <td class="col1">             Price      </td><td>        Discount      </td></tr>'
			+ '<tr class="res_lrg"> <td class="col1"> &pound;'  + val.price  +'</td><td>' + val.discount_percent  + '% </td></tr>'
		+ '</tbody>'		
	+ '</table>'
	
	+ '<table class="results orange" width="100%" cellspacing="0" cellpadding="0" border="0">'				
		+ '<tbody>'			
			+ '<tr class="res_hdr"> <td class="col1-or">    Deal ID </td><td>       Salesforce # </td></tr>'
			+ '<tr class="res_lrg"> <td class="col1-or">'  + val.id  +'</td><td>' + val.salesforce_id  + '</td></tr>'
		+ '</tbody>'		
	+ '</table>'		
	+ '</div>'
							
				+ '</div>').fadeIn(300); // end append
					i++;
					total_r += val.r;
					total_s += Number(val.s);
					// console.log (i +' Total Sales : ' +total_s +' - revenue : ' +total_r );
					
			}); // end each
			
				$('#canvas').fadeTo('slow', 1.0); // .toggle('fast').slideDown();	
				$('#city-total').append(' '

	+ '<table class="results totals ph" width="100%" cellspacing="0" cellpadding="0" border="0">' 
		+ '<tbody>'			
	+ '<tr class="res_hdr"> <td class="col1">  #G p/h       </td><td class="col1">  &pound;  p/h    </td></tr>'
	+ '<tr class="res_lrg"> <td class="col1">' + Math.floor(total_s*60*100/m)/100 +'</td>' 
	+'<td class="col1">&pound;' + Math.floor((total_r*60/m)*100)/100  + '</td></tr>'
		+ '</tbody>'		
	+ '</table>'

	+ '<table class="results green totals" width="100%" cellspacing="0" cellpadding="0" border="0">' 
		+ '<tbody>'			
	+ '<tr class="res_hdr"> <td class="col1">  # Sold       </td><td class="col1">   Revenue       </td><td>   Average </td></tr>'
	+ '<tr class="res_lrg"> <td class="col1">' + total_s +'</td><td class="col1">&pound;' + Math.floor(total_r*100)/100  + '</td><td>&pound;' +Math.floor(total_r/total_s*100)/100 +'</td>  </tr>'
		+ '</tbody>'		
	+ '</table>'
	
	+ '<table class="results totals active" width="100%" cellspacing="0" cellpadding="0" border="0">'
		+ '<tbody>'			
			+ '<tr class="res_hdr"> <td># Active</td></tr>'
			+ '<tr class="res_lrg"> <td>' + i +'</td></tr>'
		+ '</tbody>'		
	+ '</table>'	
	);
console.log('Done!');
    },
    error: function (request, status, error) {
    	console.log('No Cache! Need to Load');
        console.log(request.responseText +' -> '  + error);
        updatedeals(city);

    }
});
}


// Two basic Date 'Conversion' (simplification) functions:

function dayofyear(D) {   // D is a Date object  e.g: var D = new Date();
	if (D == undefined || D === false ){
	 var D = new Date;	
	}
	var yn = D.getFullYear();
	var mn = D.getMonth();
	var dn = D.getDate();
	var d1 = new Date(yn,0,1,12,0,0); // noon on Jan. 1
	var d2 = new Date(yn,mn,dn,12,0,0); // noon on input date
	var ddiff = Math.round((d2-d1)/864e5);
  return ddiff+1; 
}

function minofday(D) {
//	if (D === undefined || D === false ){
//	 var D = new Date;	
//	}
  	var h = D.getHours(),
      m = D.getMinutes();
  return h*60+m;
}
