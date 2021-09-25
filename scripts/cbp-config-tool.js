/* 
 * Copyright (C) 2021  Garret Lowe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

/// DOCUMENT ELEMENTS
const inheritanceSlider = document.getElementById("inheritance");
const configInheritance1 = document.getElementById("cf1_inheritance");
const configInheritance2 = document.getElementById("cf2_inheritance");

const genConfigButton = document.getElementById("gen_config_button");
const genConfigStatus = document.getElementById("gen_config_status");
const dlConfigButton = document.getElementById("dl_config_button");

const ulConfig1 = document.getElementById("config_upload_1");
const ulConfig2 = document.getElementById("config_upload_2");

/// GLOBALS
var configPresent1 = false;
var configPresent2 = true;
var config1DetectArmor = false;
var config2DetectArmor = false;

const HEADER = /\[(.*)\]/;
const ASSIGNMENT = /(.*)=([\d.\w]*)/;
const ATTACH = /Attach(\.\w)?/;
const STAPLE_HEADERS = ["Compat", "Accept", "Tuning"];

var newConfig = {};
var config1 = {};
var config2 = {};
var attachMap = {};

var currentConfig = null;

/// EVENT LISTENERS
inheritanceSlider.oninput = function() {
	configInheritance1.value = this.value;
	configInheritance2.value = 100 - this.value;
};

configInheritance1.oninput = function() {
	inheritanceSlider.value = this.value;
	configInheritance2.value = 100 - this.value;
};

configInheritance2.oninput = function() {
	inheritanceSlider.value = 100 - this.value;
	configInheritance1.value = 100 - this.value;
};

genConfigButton.onclick = function() {
	if (!configPresent1 || !configPresent2) {
		dlConfigButton.disabled = true;
		genConfigStatus.innerHTML = 'Two config files are required.';
		return;
	}
	
	generateConfig();
	
	const date = new Date();
	genConfigStatus.innerHTML = `Config Generated (${date.getDay()}/${date.getMonth()+1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()})`;
	dlConfigButton.disabled = false;
};

dlConfigButton.onclick = function () {
	let configString = "; Created using CBP Config Tool by Garret Lowe\n";
	for (let header in newConfig) {
		configString += `[${header}]\n`;
		for (let name in newConfig[header]) {
			configString += `${name}=${newConfig[header][name]}\n`
		}
	}
	let downloadElement = document.createElement('a');
	downloadElement.setAttribute('href', 'data:text/plain; charset=utf-8,' + encodeURIComponent(configString));
	downloadElement.setAttribute('download', 'cbp.ini');
	downloadElement.style.display = 'none';
	document.body.appendChild(downloadElement);
	downloadElement.click();
	document.body.removeChild(downloadElement);
};

ulConfig1.onchange = function() {
	if (this.files[0] === null || this.files[0] === undefined) {
		console.warn('Config 1: Upload Cancelled');
		configPresent1 = false;
		return;
	}
	let reader = new FileReader();
	reader.onload = readConfig;
	currentConfig = config1;
	reader.readAsText(ulConfig1.files[0]);
	configPresent1 = true;
};

ulConfig2.onchange = function() {
	if (this.files[0] === null || this.files[0] === undefined) {
		console.warn('Config 2: Upload Cancelled');
		configPresent2 = false;
		return;
	}
	let reader = new FileReader();
	reader.onload = readConfig;
	currentConfig = config2;
	reader.readAsText(ulConfig2.files[0]);
	configPresent2 = true;
};

/// HELPER FUNCTIONS
readConfig = function(progressEvent) {
	let lines = this.result.split(/\n|\r\n/);
	let currentHeader = 'Error';
	for(let index = 0; index < lines.length - 1; index++) {
		if (lines[index][0] == ';' || !lines[index].replace(/\s/g, '').length) {
			continue;
		}
	
		let headerTest = HEADER.exec(lines[index]);
		if (headerTest) {
			currentHeader = headerTest[1];
			currentConfig[currentHeader] = {};
			continue;
		}
		
		let assignmentTest = ASSIGNMENT.exec(lines[index]);
		if (assignmentTest) {
			let value = assignmentTest[2];
			if (!isNaN(Number(value))) {
				value = Number(value);
			}
			currentConfig[currentHeader][assignmentTest[1]] = value;
		}
	}
}

function generateConfig() {
	
	for (let header in config1) {
		if(!(header in newConfig)) {
			newConfig[header] = {};
		}
		if (STAPLE_HEADERS.includes(header) || !(header in config2)) {
			for (let name in config1[header]){
				if (name == "detectArmor") {
					config1DetectArmor = config1[header][name] == 1;
				}
				newConfig[header][name] = config1[header][name];
			}
			continue;
		}
		for (let name in config1[header]) {
			if (!(name in config2[header]) || config1[header][name] == config2[header][name]) {
				newConfig[header][name] = config1[header][name];
				continue;
			}
			newConfig[header][name] = (config1[header][name] * configInheritance1.value / 100) + (config2[header][name] * (100-configInheritance2.value) / 100);
		}
	}
	for (let header in config2) {
		if (!(header in newConfig)) {
			newConfig[header] = {};
		}
		if (!(header in config1)) {
			for (let name in config2[header]) {
				newConfig[header][name] = config2[header][name];
			}
			continue;
		}
		if (STAPLE_HEADERS.includes(header)) {
			for (let name in config2[header]) {
				if (name == "detectArmor") {
					config2DetectArmor = config2[header][name] == 1;
				}
				if (newConfig[header][name] < config2[header][name]) {
					newConfig[header][name] = config2[header][name];
				}
			}
			continue;
		}
		for (let name in config2[header]) {
			if (!(name in config1[header])) {
				newConfig[header][name] = config2[header][name];
				continue;
			}
		}
	}
}
