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
		displayHeader(dataFile, true);
		
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
			$("#list-files ul").append(
					"<li>" 
					+ dataFile.name 
					+ " - "
					+ dataFile.nbLines
					+ " lignes - "
					+ dataFile.nbColumns
					+ " colonnes</li>"
			)
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
		displayHeader(dataFile, true);
	}

	var updateDelimiter = function(dataFile, delimiter){
		dataFile.delimiter = delimiter;
		$("#delimiter").prop("disabled", false);
		$("#update-delimiter").prop("disabled", false);
		$("#delimiter").val(delimiter);

		dataFile.header = dataFile.lines[0].split(delimiter);
		dataFile.nbColumns = dataFile.header.length;
		$("#nbcolumns").html(dataFile.nbColumns);
	}

	var displayHeader = function(dataFile, isFirstLineHeader){
		var tbody = $("#header-table tbody");
		tbody.html("");
		var lineSplit;

		if (isFirstLineHeader && dataFile.lines.length > 1){
			lineSplit = dataFile.lines[1].split(dataFile.delimiter);
		}
		else{
			lineSplit = dataFile.header
		}

		for (var i=0; i < dataFile.header.length; i++){
			var element = lineSplit[i];

			var header_i = "";
			if (isFirstLineHeader){
				header_i = dataFile.header[i];
			}

			var rowTable = $(document.createElement('TR'));
			var headerName = $(document.createElement('TD'));
			var headerForm = $(document.createElement('INPUT'))
				.attr('class', "form-control")
				.attr("type", "text")
				.attr("value", header_i);
			var example = $(document.createElement('TD'))
				.html(lineSplit[i]);
			var format = $(document.createElement('TD'))

			createFormFormat(element, format);

			headerName.append(headerForm);
			rowTable.append(headerName);
			rowTable.append(example);
			rowTable.append(format);
			tbody.append(rowTable);
		}
	}

	var checkIfNumber = function(element){
		return !isNaN(element);
	}

	var getFormatDate = function(element){
		var checkFormat = [
			{format : "%Y-%m-%d", regex : "[0-9]{4}-[0-9]{2}-[0-9]{2}"},
		];

		for (var i=0; i < checkFormat.length; i++){
			var format = checkFormat[i].format;
			var re = new RegExp(checkFormat[i].regex);
			if (re.test(element)){
				return format;
			}
		}

		return undefined;
	}

	var createFormFormat = function(element, td){
		var select = $(document.createElement('SELECT'))
			.attr("class", "form-control");

		var optionDate = $(document.createElement('OPTION'))
			.html("Date");
		var optionNumber = $(document.createElement('OPTION'))
			.html("Number");
		var optionString = $(document.createElement('OPTION'))
			.html("String");

		var formatDateForm = $(document.createElement('INPUT'))
			.attr('class', "form-control")
			.attr("type", "text")
			.attr("value", formatDate);

		var formatDate = getFormatDate(element);

		if (formatDate != undefined){
			optionDate.attr("selected", "selected");
			formatDateForm.attr("value", formatDate);
		}
		else if (checkIfNumber(element)){
			optionNumber.attr("selected", "selected");
			formatDateForm.hide();
		}
		else{
			optionString.attr("selected", "selected");
			formatDateForm.hide();
		}

		select.append(optionDate);
		select.append(optionNumber);
		select.append(optionString);

		select.on('change', function(){
			if (this.value == "Date"){
				formatDateForm.show();
			}
			else{
				formatDateForm.hide();
			}
		})

		td.append(select);
		td.append(formatDateForm);
	}

	$("#header-checkbox").change(function(){
		if (this.checked){
			displayHeader(dataFile, true);
		}
		else{
			displayHeader(dataFile, false);
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
