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
		if(this.color[prop] != undefined){
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
	if(name == 'insertion'){
		this.state = {i: 1, j: ui.data.length, x: 0, sideLocation: ui.data.length };
		this.next = function(){
			if(this.state.i < ui.data.length){
				if(this.state.j == ui.data.length){
					ui.activate(this.state.i - 1, 1);
					ui.activate(this.state.i, 2);
					this.state.x = ui.data[this.state.i];
					ui.moveTo(this.state.i, this.state.sideLocation);
					ui.animate(ui.getBarFromIndex(this.state.sideLocation), { bottom: 50 }, 70);
					this.state.j = this.state.i - 1;
				}
				else if(this.state.j > -1 && ui.data[this.state.j] > this.state.x){
					ui.data[this.state.j + 1] = ui.data[this.state.j];
					ui.moveTo(this.state.j, this.state.j + 1);
					this.state.j = this.state.j - 1;
				}
				else{
					ui.data[this.state.j + 1] = this.state.x;
					ui.moveTo(this.state.sideLocation, this.state.j + 1);
					ui.animate(ui.getBarFromIndex(this.state.j + 1), { bottom: 0 }, 100);
					ui.activate(this.state.j + 1, 1);
					this.state.i = this.state.i + 1;
					this.state.j = ui.data.length;
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