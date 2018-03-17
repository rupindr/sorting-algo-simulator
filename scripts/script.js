/*
	Copyright 2018 Rupinder Singh

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var algorithm = function(name, speed, ui){
	this.state = {};
	this.color = {};
	this.next = {};
	this.speed = speed;
	this.timer = true;
	this.setValue = function(prop, val){
		if(this.color[prop] != 'undefined'){
			ui.deActivate(this.state[prop], this.color[prop]);
			this.state[prop] = val;
			ui.activate(this.state[prop], this.color[prop]);
		}
		else{
			this.state[prop] = val;
		}
	}
	this.stop = function(){
		this.timer = false;
	};
	if(name == 'selection'){
		this.state = {i:0, j:-1, min:0};
		this.color = {i:1, j:2, min:0};
		this.next = function(){
			if(this.state.i < ui.data.length){
				if(this.state.j < 0){
					this.setValue('min', this.state.i);
					this.setValue('j', this.state.i + 1);
				}
				else if(this.state.j < ui.data.length){
					if(ui.data[this.state.j] < ui.data[this.state.min]){
						this.setValue('min', this.state.j);
					}
					this.setValue('j', this.state.j + 1);
				}
				else{
					var t = ui.data[this.state.i];
					ui.data[this.state.i] = ui.data[this.state.min];
					ui.data[this.state.min] = t;
					ui.swap(this.state.i, this.state.min);
					this.state.i = this.state.i + 1;
					this.setValue('j', -1);
					ui.activate(this.state.i - 1, this.color['i']);
				}
			}
			else{
				this.stop();
			}
		}
	}
	this.play = function(){
		setTimeout(() => {
			if(this.timer){
				this.next();
				this.play();
			}
		}, 1000/this.speed);
	};
};

var uiHelper = function(noOfBars){
	var mainEle = document.getElementById('main');
	var controls = document.getElementById('controls');
	var navEle = document.getElementById('nav');
	var controlsWrap = document.getElementById('controls-wrapper');
	var activeClass = ['active-bar','active-bar-1','active-bar-2'];
	var barIds = [];
	var barWidth = 25;
	var barMargin = 5;
	var noOfBars = noOfBars;
	this.data = [];

	this.getBarFromDataId = function(i){
		return document.getElementById('data_' + i);
	}

	this.getBarFromIndex = function(i){
		if(i > -1 && i < barIds.length){
			return document.getElementById(barIds[i]);
		}
	}

	this.swap = function(i, j){
		var barI = this.getBarFromIndex(i);
		var barJ = this.getBarFromIndex(j);
		if(barI && barJ){
			var leftI = parseFloat(barI.style.left);
			var leftJ = parseFloat(barJ.style.left);
			this.animate(this.getBarFromIndex(i), { left: leftJ }, 70);
			this.animate(this.getBarFromIndex(j), { left: leftI }, 70);
			var temp = barIds[i];
			barIds[i] = barIds[j];
			barIds[j] = temp;
		}
	}

	this.activate = function(i, classIndex){
		for(var j = 0; j < activeClass.length; j++){
			this.deActivate(i, j);
		}
		this.deActivate(i, 0);
		var bar = this.getBarFromIndex(i);
		if(bar){
			bar.className += ' ' + activeClass[classIndex];
		}
	}

	this.deActivate = function(i, classIndex){
		var bar = this.getBarFromIndex(i);
		if(bar){
			bar.className = this.getBarFromIndex(i).className.replace(new RegExp('(?:^|\\s)'+ activeClass[classIndex] + '(?:\\s|$)'), '');
		}
	}

	this.setValOfBar = function(i, val){
		var bar = this.getBarFromIndex(i);
		bar.style.height = val + 'px';
		bar.dataVal = val;
		bar.childNodes[0].innerHTML = val;
	}

	this.animate = function(e, style, time){
		var props = Object.keys(style);
		var freq = [];
		var frameRate = 1000 / 60;
		for(var i = 0; i < props.length; i++){
			var currVal = parseFloat(e.style[props[i]]);
			var reqVal = style[props[i]];
			var noOfFrames = time/frameRate;
			freq.push((reqVal - currVal)/noOfFrames);
		}
		function done(){
			for(var i = 0; i < props.length; i++){
				if((freq[i] > 0 && parseFloat(e.style[props[i]]) < style[props[i]]) || (freq[i] < 0 && parseFloat(e.style[props[i]]) > style[props[i]])){
					return false;
				}
				return true;
			}
		}
		var timer = setInterval((function(){
			for(var i = 0; i < props.length; i++){
				e.style[props[i]] = parseFloat(e.style[props[i]]) + freq[i] + 'px';
			}
			if(done()){
				for(var i = 0; i < props.length; i++){
					e.style[props[i]] = style[props[i]] + 'px';
				}
				clearInterval(timer);
			}
		}).bind(this), frameRate);
	};

	this.fixMainWidth = function(){
		mainEle.style.width = (barWidth + 2*barMargin)*noOfBars + 'px';
		mainEle.style.marginLeft = parseInt((window.innerWidth - 30 - mainEle.offsetWidth)/2) + 'px';
		mainEle.style.height = (window.innerHeight - navEle.offsetHeight - controlsWrap.offsetHeight) + 'px';
	}

	this.loadBars = function(){
		mainEle.innerHTML = '';
		barIds = [];
		this.data = [];
		for(var i = 0; i < noOfBars; i++){
			var bar = document.createElement('div');
			var info = document.createElement('div');
			var val = Math.floor(Math.random()*500);
			bar.className += ' data-bar';
			bar.style.height = val + 'px';
			bar.style.width = barWidth + 'px';
			bar.id = 'data_' + i;
			bar.dataVal = val;
			bar.style.left = i*(barWidth + 2*barMargin) + 'px';
			info.innerHTML = val;
			info.className += ' data-info';
			bar.appendChild(info);
			mainEle.appendChild(bar);
			barIds.push('data_' + i);
			this.data.push(val);
		}
	}
	this.getBarFromDataId = this.getBarFromDataId.bind(this);
	this.getBarFromIndex = this.getBarFromIndex.bind(this);
	this.swap = this.swap.bind(this);
	this.activate = this.activate.bind(this);
	this.deActivate = this.deActivate.bind(this);
	this.setValOfBar = this.setValOfBar.bind(this);
	this.animate = this.animate.bind(this);
	this.fixMainWidth = this.fixMainWidth.bind(this);
	this.loadBars = this.loadBars.bind(this);
	window.addEventListener('resize', () => { this.fixMainWidth(); });
	this.loadBars();
	this.fixMainWidth();
}

var simulator = function(){
	var controls = document.getElementById('controls');
	var ui;
	var algo;
	function reload(){
		if(algo){
			algo.stop();
		}
		ui = new uiHelper(parseInt(controls.bars.value));
		algo = new algorithm('selection', parseInt(controls.speed.value), ui);
		controls.next.disabled = '';
		controls.play.disabled = '';
	}

	controls.play.addEventListener('click', function(){
		controls.next.disabled = 'true';
		controls.play.disabled = 'true';
		algo.play();
	});
	controls.next.addEventListener('click', function(){ algo.next() });
	controls.reset.addEventListener('click', function(){
		reload();
	});
	controls.speed.onchange = function(){
		if(parseInt(controls.speed.value) > 20){ controls.speed.value = "20"; }
		if(parseInt(controls.speed.value) < 1){ controls.speed.value = "1"; }
		algo.speed = parseInt(controls.speed.value);
	};
	controls.bars.onchange = function(){
		if(parseInt(controls.bars.value) > 20){ controls.bars.value = "20"; }
		else if(parseInt(controls.bars.value) < 10){ controls.bars.value = "10"; }
		reload();
	};
	reload();
}

simulator();