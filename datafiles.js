/*
MIT License
Copyright (c) 2017 Corentin Limier 
See LICENSE file at root of project for more informations
*/

(function() {
	'use strict';

	var dataFiles = [];
	var dataFile;

	function DataFile() {
			this.name = '';
			this.size = 0;
			this.delimiter= ';';
			this.nbLines = 0; 
			this.nbColumns = 0; 
			this.lines = [];
			this.header = [];
	}
	
	var reader = new FileReader();

	reader.onload = function(){
		$("#valid-data-file").prop("disabled", false);
		var content = reader.result; 

		dataFile.lines = content.split(/[\r\n]+/g);
		dataFile.nbLines = dataFile.lines.length;
		$("#nblines").html(dataFile.nbLines);

		var delimiter = findDelimiter(dataFile);
		updateDelimiter(dataFile, delimiter);
		
		$("#header-checkbox").prop("disabled", false);
	}

	reader.onprogress = function(e){
		if (e.lengthComputable){
			var percentLoaded = Math.round((e.loaded/e.total) * 100);
			//console.log(percentLoaded);
		}
	}

	var checkBrowser = function(){
		if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
			alert('Les fonctionnalités ne sont pas supportées par votre navigateur');
		}
		else{
			console.log("Browser is ok")
		}
	}
	
	var handleFileSelect = function(e) {
		var files = e.target.files;

		for (var i = 0, f; f = files[i]; i++) {
			dataFile = new DataFile();
			dataFile.name = f.name;
			dataFile.size = f.size;
			reader.readAsText(f);
		}
	}

	var handleFileValidation = function(e){
			$("#list-files ul").append("<li>" + dataFile.name + "</li>")
			dataFiles.push(dataFile);
	}

	var findDelimiter = function(dataFile){
		var delimiter = ";";
		var delimiters = [",", " ", "\t", ";"];

		var maxCount = -1;

		for (var i=0; i<delimiters.length; i++){
			var d = delimiters[i];

			var count = -1;

			for (var j=0; j<=3; j++){
				var c = dataFile.lines[j].split(d).length;
				if (count == -1){
					count = c;
				}
				else if (c != count){
					break
				}
				else if (j == 3 && count > maxCount){
					maxCount = count;
					delimiter = d;
				}
			}
		}

		return delimiter;
	}

	var handleUpdateDelimiter = function(e){
		var newDelimiter = $("#delimiter").val();
		updateDelimiter(dataFile, newDelimiter);
	}

	var updateDelimiter = function(dataFile, delimiter){
		dataFile.delimiter = delimiter;
		$("#delimiter").prop("disabled", false);
		$("#update-delimiter").prop("disabled", false);
		$("#delimiter").val(delimiter);

		dataFile.header = dataFile.lines[0].split(delimiter);
		dataFile.nbColumns = dataFile.header.length;
		$("#nbcolumns").html(dataFile.nbColumns);
		displayHeader(dataFile);
	}

	var displayHeader = function(dataFile){
		var tbody = $("#header-table tbody");
		tbody.html("");
		var lineSplit;
		if (dataFile.lines.length < 2){
			lineSplit = dataFile.header
		}
		else{
			lineSplit = dataFile.lines[1].split(dataFile.delimiter);
		}
		for (var i=0; i < dataFile.header.length; i++){
			console.log(dataFile.header[i]);
			tbody.append("<tr><td>" + dataFile.header[i] + "</td><td>" + lineSplit[i] + "</td><td>String</td></tr>")
		}
	}

	var displayFormHeader = function(dataFile){
		var tbody = $("#header-table tbody");
		tbody.html("");
		var lineSplit = dataFile.lines[0].split(dataFile.delimiter);
		for (var i=0; i < dataFile.header.length; i++){
			console.log(dataFile.header[i]);
			tbody.append("<tr><td><input class=\"form-control\" type=\"text\" ></td><td>" + lineSplit[i] + "</td><td>String</td></tr>")
		}
	}

	$("#header-checkbox").change(function(){
		if (this.checked){
			displayHeader(dataFile);
		}
		else{
			displayFormHeader(dataFile);
		}
	})

	var reinitDataFileModal = function(e){
		$("#delimiter").prop("disabled", true);
		$("#update-delimiter").prop("disabled", true);
		$("#valid-data-file").prop("disabled", true);
		$("#header-checkbox").prop("disabled", true);
		$("#header-checkbox").prop("checked", true);
		$("#delimiter").val(";");
		$("#data-files").val("");
		$("#nblines").html(0);
		$("#nbcolumns").html(0);
		$("#header-table tbody").html("");
	}

	$("#data-files").on('change', handleFileSelect);
	$("#valid-data-file").click(handleFileValidation);
	$("#update-delimiter").click(handleUpdateDelimiter);
	$("#upload-data").click(reinitDataFileModal);
	checkBrowser();

}());
