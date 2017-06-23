/*
MIT License
Copyright (c) 2017 Corentin Limier 
See LICENSE file at root of project for more informations
*/

(function() {
	'use strict';
	
	var reader = new FileReader();
	reader.onload = function(){
		var content = reader.result;
		var lines = content.split(/[\r\n]+/g);
		$("#content-file").html(lines.length);
		console.log("done");
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
	
	
	var handleFileSelect = function(evt) {
		console.log("handleFileSelect");
		var files = evt.target.files;

		var output = [];
		for (var i = 0, f; f = files[i]; i++) {
			output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
					  f.size, ' bytes, last modified: ',
					  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
					  '</li>');
			reader.readAsText(f);
		}
		$("#list-files").html('<ul>' + output.join('') + '</ul>');
	}

	$("#data-files").on('change', handleFileSelect);

}());
