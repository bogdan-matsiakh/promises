$(document).ready(function () {
    function textareaChanging(e) {
        var data = em.validator.getData(textarea.val());
        em.validator.showData(data);
    }
    
    // fuzzyset initialization
    var i = 0, max = em.TITLES.length,
        downloadSVG = $("#download-svg"),
        downloadPNG = $("#download-png"),
        draw = $('.draw'),
        insertDefault = $('.insert-default'),
        mapFillColor = $('#choose-color-map-fill'),
        textarea = $("#data-text"); // comment if use CodeMirror plugin
       /**
        Uncomment to use CodeMirror plugin for numbers in textarea row 
        
        textarea = em.CodeMirror.fromTextArea($("#data-text")[0], {
            mode: "text/html",
            lineNumbers: true
        });*/
    
    em.fuzzyset = em.Fuzzyset() 
    
    for (; i < max; i += 1) {
        em.fuzzyset.add(em.TITLES[i]);
    }
    // initialization
    
    textarea.on("change", textareaChanging);
    textarea.on("keyup", textareaChanging);
    textarea.bind('paste', textareaChanging);
    
    downloadSVG.click(function () {
        em.downloader.downloadSVG("test");
    });
    
    downloadPNG.click(function () {
        em.downloader.downloadPNG("test");
    });
    
    insertDefault.click(function () {
        textarea.val(em.TITLES.join(', 1\n') + ', 2');
        textareaChanging(textarea);
        em.validator.drawMap();
    });
    mapFillColor.change(function (e) {
        console.log('mapFillColor',mapFillColor);
        em.validator.fillColor = colors[$(this).find(':selected').text()];
        em.validator.drawMap();
    });
});