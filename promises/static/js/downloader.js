em = em || {};

em.downloader = {
	_MAP_SELECTOR: "#map",
	_TEMP_CANVAS_ID: "temp-canvas",
	
	downloadSVG: function (fileName) {
		var html = $(this._MAP_SELECTOR).select("svg")
				.attr("version", 1.1)
				.attr("xmlns", "http://www.w3.org/2000/svg")
				.html().trim(), //.node().parentNode.innerHTML,
			
			blob = new Blob([html], {
				type: "data:image/svg+xml"
			});
		
		saveAs(blob, fileName + ".svg");
	},
	
	downloadPNG: function (fileName) {
		var that = this,
			content = d3.select("body").append("canvas")
				.attr("id", that._TEMP_CANVAS_ID)
				.style("width","600px")
				.style("height","500px")
				.style("display","none"),
			canvas = document.getElementById(that._TEMP_CANVAS_ID);
		
		canvg(
			that._TEMP_CANVAS_ID,
			$(that._MAP_SELECTOR).select("svg").html().trim()
		);
		
		canvas.toBlob(function(blob) {
			saveAs(blob, fileName + ".png");
			d3.select("#" + that._TEMP_CANVAS_ID).remove();
		}, "image/png");
	}
}
