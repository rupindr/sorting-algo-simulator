var values=[];
var numberofbars=40;
var pad=parseInt($('#main').css("padding-left"))+parseInt($("#main").css("padding-right"))+60;
var barwidth=(window.innerWidth-pad)/numberofbars;
var bodyheight=window.innerHeight-10;
var timedelay=100;
var originalcolor='#009245';
var downbtnheight=parseInt($('#dropdown').css('height'))*1.2;
var ddmargin=parseInt($('#alg').css('width'))+20;
var availsorts=['Selection Sort','Bubble Sort','Insertion Sort'];
var currsort=0;
var barborder=1;
var incdecheight=parseInt($('.infobox').css('height'));
var availspeeds=[0.1,0.2,0.5,0.7,1,2,5,10,15,30];
var virtualSpeeds=[0.1,0.2,0.5,0.7,1,2,4,6,8,10];
var speedindex=5;
var speed=availspeeds[speedindex];
var state=0; /* 0-initial 1-running 2-paused*/



function setHeight () {
	for(var i=0;i<values.length;i++){
		$('#n'+i+' .bottom').css('height',(values[i])+'%');
		$('#n'+i+' .top').css('height',100-values[i]+'%');
	}
	if(barwidth<10){
		barborder=0;
	}
	else{
		barborder=1;
	}
	$('.bottom').css('border-width',barborder);
	$('.bottom').css('border-bottom','none');
}


function initBars(){
	$('#main').html("");
	barwidth=(window.innerWidth-pad)/numberofbars;
	values=[];
	for(var i=0;i<numberofbars;i++){
		var val=Math.round(Math.random()*100)
		if(val==00 || val==25 || val==50 || val==75 || val==100){
			val=18;
		}
		values.push(val);
	}
	for(var i=0;i<values.length;i++){
		$('#main').append("<div id=\"n"+i+"\" class=\"bar\"><div class=\"top\"></div><div class=\"bottom\"></div></div>");
	}
	setHeight();
	$('#main').children().css('width',barwidth);
}

function initdd(){
	$('.dropdown-content').html("");
	for(var i=0;i<availsorts.length;i++){
		if(i!=currsort){
			$('.dropdown-content').append("<span id=\"as"+i+"\">"+availsorts[i]+"</span>");
		}
	}
	$('#dropdown').html(availsorts[currsort]);
}



$('.downbtn').on('click',function(){
	$('.dropdown-content').toggleClass('show');
	$('#cont1 img').toggleClass('hidebtn');
});


function changealgo(n){
	currsort=n;
	$('.dropdown-content').toggleClass('show');
	$('#cont1 img').toggleClass('hidebtn');
	initdd();
}


function speedcontrol(n){
	if(n==0){
		$('#speed').html(virtualSpeeds[speedindex]);
	}
	else if(n==1){
		speedindex+=1;
		speedcontrol(0);
		if(speedindex==availspeeds.length-1){
			$('#speedinc').addClass('hidebtn');
		}
		if(speedindex==1){
			$('#speeddec').removeClass('hidebtn');
			$('#speed').css('margin-left',0);
		}
	}
	else if(n==-1){
		speedindex-=1;
		speedcontrol(0);
		if(speedindex==0){
			$('#speeddec').addClass('hidebtn');
			$('#speed').css('margin-left',incdecheight*1.3);
		}
		if(speedindex==availspeeds.length-2){
			$('#speedinc').removeClass('hidebtn');
		}
	}
}
$('#speedinc').on('click',function(){
	speedcontrol(1);
});
$('#speeddec').on('click',function(){
	speedcontrol(-1);
});




function nobcontrol(n){
	if(n==0){
		$('#barsinfobox').html(numberofbars);
	}
	else if(n==1){
		numberofbars+=10;
		nobcontrol(0);
		if(numberofbars>=100){
			$('#databarsinc').addClass('hidebtn');
		}
		if(numberofbars>=11){
			$('#databarsdec').removeClass('hidebtn');
			$('#barsinfobox').css('margin-left',0);
		}
	}
	else if(n==-1){
		numberofbars-=10;
		nobcontrol(0);
		if(numberofbars<11){
			$('#databarsdec').addClass('hidebtn');
			$('#barsinfobox').css('margin-left',incdecheight*1.3);
		}
		if(numberofbars<=99){
			$('#databarsinc').removeClass('hidebtn');
		}
	}
	state=0;
	initBars();
	$('#mainbtn').html("Start");
}
$('#databarsinc').on('click',function(){
	nobcontrol(1);
});
$('#databarsdec').on('click',function(){
	nobcontrol(-1);
});



function startsorting(n){
	if(n==0){
		selectionSort();
	}
	else if(n==2){
		insertionSort();
	}
	else if(n==1){
		bubbleSort();
	}
}
function hidecontrols(){
	$('#nob img').addClass('hidebtn');
	$('.openbtn').addClass('hidebtn');
	$('.closebtn').addClass('hidebtn');
	$('.dropdown-content').removeClass('show');
	$('#barsinfobox').css('margin-left',incdecheight*1.3);
}
function showcontrols(){
	$('#nob img').removeClass('hidebtn');
	$('.openbtn').removeClass('hidebtn');
	$('#barsinfobox').css('margin-left',0);
	if(numberofbars<11){
		$('#databarsdec').addClass('hidebtn');
		$('#barsinfobox').css('margin-left',incdecheight*1.3);
	}
	if(numberofbars>299){
		$('#databarsinc').addClass('hidebtn');
	}
}
$('#mainbtn').on('click',function(){
	if(state==0){
		state=1;
		$('#mainbtn').html("Stop");
		startsorting(currsort);
		hidecontrols();
	}
	else if(state==1){
		state=2;
		$('#mainbtn').addClass('hidebtn');
		$('#mainbtn').html("Reset");	
		showcontrols();
	}
	else if(state==2){
		state=0;
		initBars();
		$('#mainbtn').html("Start");
		showcontrols();
	}
});


$('#smat').on('click',function(){
	$('#emailcover').removeClass('hidebtn');
});
$('#emailcover img').on('click',function(){
	$('#emailcover').addClass('hidebtn');
});



$(document).ready(function(){
	$('body').css('height',bodyheight);
	$('.downbtn').css('height',downbtnheight);
	$('.downbtn').css('width',downbtnheight);
	$('.incdec').css('height',incdecheight);
	$('.incdec').css('width',incdecheight);
	$('.dropdown-content').css('margin-left',ddmargin);
	$('#emailcover').addClass('hidebtn');
	initdd();
	speedcontrol(0);
	nobcontrol(0);
});

$(window).on('resize',function(){
	bodyheight=window.innerHeight-10;
	$('body').css('height',bodyheight);
	pad=parseInt($('#main').css("padding-left"))+parseInt($("#main").css("padding-right"))+60;
	barwidth=(window.innerWidth-pad)/numberofbars;
	$('#main').children().css('width',barwidth);
	setHeight();
	downbtnheight=parseInt($('#dropdown').css('height'))*1.2;
	incdecheight=parseInt($('.infobox').css('height'));
	$('.incdec').css('height',incdecheight);
	$('.incdec').css('width',incdecheight);
	$('.downbtn').css('height',downbtnheight);
	$('.downbtn').css('width',downbtnheight);
	ddmargin=parseInt($('#alg').css('width'))+20;
	$('.dropdown-content').css('margin-left',ddmargin);
});
$(document).on('click','.dropdown-content span',function(){
	changealgo($(this).attr('id').replace(/[^\d]/g,''));
});
$(window).on('load',function(){
	$('#loader').css('display','none');
});



/*algorithms */
function swap(a,b){
	var t=values[a];
	values[a]=values[b];
	values[b]=t;
}
function deactivatebartemp(m){
	$('#n'+m+' .bottom').css('background',originalcolor);
}
function activatebartemp(m,c){
	$('#n'+m+' .bottom').css('background',c);
	setTimeout(function(){
		deactivatebartemp(m);
	},(timedelay/availspeeds[speedindex]));
}
function activatebar(m,c){
	$('#n'+m+' .bottom').css('background',c);
}
function deactivatebar(m,c){
	$('#n'+m+' .bottom').css('background',c);
}



function bubbleSort(){
	function outerfor(i){
		function innerfor(j){
			if(values[j]>values[j+1]){
				swap(j,j+1);
				flag=1;
				setHeight();
			}
			activatebartemp(j+1,'orange');
			$('#mainbtn').removeClass('hidebtn');
			if(state!=1){
				return;
			}
			j++;
			if(j<values.length-1-i){
				setTimeout(function(){
					innerfor(j);
				},timedelay/availspeeds[speedindex]);
			}
			else{
				setTimeout(function(){
					activatebar(values.length-i-1,'blue');
				},timedelay/availspeeds[speedindex]);
				
				if(i<values.length-1){
					setTimeout(function(){
						outerfor(i+1);
					},timedelay/availspeeds[speedindex]);
				}
				else{
					state=2;
					$('#mainbtn').html("Reset");
					setTimeout(function(){
						activatebar(1,'blue');
					},timedelay/availspeeds[speedindex]);
				}
			}
		}
		setTimeout(function(){
			innerfor(0);
		},timedelay/availspeeds[speedindex]);
	}
	outerfor(0);

}

function selectionSort(){
	function outerfor(i){
		var minindex=i;
		function innerfor(j){
			activatebar(minindex,'red');
			activatebartemp(j,'yellow');
			
			if(values[minindex]>values[j]){
				deactivatebar(minindex,originalcolor);
				minindex=j;
				activatebar(minindex,'red');
			}
			j++;
			$('#mainbtn').removeClass('hidebtn');
			if(state!=1){
				return;
			}
			if(j<values.length){
				setTimeout(function(){
					innerfor(j);
				},timedelay/availspeeds[speedindex]);
			}
			else{
				deactivatebar(minindex,originalcolor);
				swap(i,minindex);
				setHeight();
				i++;
				if(i<values.length-1){
					setTimeout(function(){
						outerfor(i);
					},timedelay/availspeeds[speedindex]);
					activatebar(i-1,'blue');
				}
				else{
					state=2;
					$('#mainbtn').html("Reset");
					activatebar(values.length-2,'blue');
					setTimeout(function(){
						activatebar(values.length-1,'blue');
					},timedelay/availspeeds[speedindex]);
					
				}
			}
		}
		setTimeout(function(){
			innerfor(i+1);
		},timedelay/availspeeds[speedindex]);
	}
	outerfor(0);
}

function insertionSort(){
	function outerfor(i){
		var j=i;
		function innerfor(j){
			activatebar(j-1,'orange');
			swap(j,j-1);
			deactivatebar(j,'blue');
			setHeight();
			j--;
			$('#mainbtn').removeClass('hidebtn');
			if(state!=1){
				return;
			}
			if(values[j]<values[j-1] && j>0){
				setTimeout(function(){
					innerfor(j);
				},timedelay/availspeeds[speedindex]);
				
			}
			else{
				deactivatebar(j,'blue');
				$('#n'+i+' .bottom').css('background','blue');
				i++;
				if(i<numberofbars){
					setTimeout(function(){
					outerfor(i);
					},timedelay/availspeeds[speedindex]);
				}
				else{
					state=2;
					$('#mainbtn').html("Reset");
				}
			}
		}
		if(values[j]<values[j-1] && j>0){
			setTimeout(function(){
					innerfor(j);
			},timedelay/availspeeds[speedindex]);
		}
		else{
			$('#n'+i+' .bottom').css('background','blue');
			i++;
			if(i<numberofbars){
				setTimeout(function(){
					outerfor(i);
				},timedelay/availspeeds[speedindex]);
			}
			else{
					state=2;
					$('#mainbtn').html("Reset");
			}
		}
	}
	outerfor(1);
	setHeight();
}