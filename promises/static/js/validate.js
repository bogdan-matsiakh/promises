em = em || {};

em.validator = (function () {
    function _getDataArray(dataString) {
        var result, i = 0, max;
        
        result = dataString.split('\n');
            
        for (max = result.length; i < max; i += 1) {
            result[i] = result[i].split(',');
        }
        _result = _validateTitles(result);

        return _result;
    }
    function _validateTitles(resultArray) {
        var i = 0, max = resultArray.length, elem,
            result = [],
            item,
            name,
            number,
            isError,
            isNumber,
            regexpNumber = /^\d+$/,
            fuzzyResult; 
        
        for (; i < max; i += 1) {
            fuzzyResult = em.fuzzyset.get(resultArray[i][0]);
            fuzzyResult = fuzzyResult === null ? null : fuzzyResult[0]; 
            
            resultArray[i][1] = resultArray[i][1] || ''; 
            isError = (fuzzyResult === null || fuzzyResult[0] < PROBABILITY);
            number = resultArray[i][1].replace(/^\s+|\s+$/g,'');             
            isNumber = regexpNumber.test(number);
            
            result.push({
                name : isError ? false : fuzzyResult[1],
                value : isNumber ? number : false,    // trin string
                isError : isError
            });
        }
        return result;
    }
    function _showData(data) {
        console.log('data', data);
        var i = 0, j = 0, max = data.length, len,
            row,
            cell,
            table = document.getElementById('data-table'),
            fragment = document.createDocumentFragment('div'),
            errorDom,
            prop;
        table.innerHTML = '';
        
        for (; i < max; i += 1) {
            row = document.createElement('div');
            /*
            number = document.createElement('div');
            number.classList.add('cell');
            number.classList.add('number');
            
            number.innerText = i + 1;
            row.appendChild(number);
            */
            if (data[i].isError) {
                row.classList.add('error');
            }
            
            for (property in data[i]) {
                if (data[i].hasOwnProperty(property) && property !== 'isError') {
                    prop = data[i][property];
                    if (prop) {
                        cell = document.createElement('div');
                        cell.innerText = prop;                        
                    } else {
                        cell = document.createElement('input');
                        cell.classList.add('errorValue');
                        _bindError(cell, i);
                    }
                    cell.classList.add('cell');
                    cell.classList.add(property);
                    
                    row.appendChild(cell);
                }
            }
            row.classList.add('row');
            fragment.appendChild(row);
        }
        table.appendChild(fragment);
        _drawMap();
    }
    function _bindError(dom, index) {
        var name, value,
            regexpNumber = /^\d+$/,
            isError;
        
        $(dom).change(function (e) {
            if (this.classList.contains('name')) {
                name = em.fuzzyset.get(this.value)[0];
                
                if (name !== null && name[0] > PROBABILITY) {
                    _result[index].name = name[1];
                    this.value = name[1];
                    this.classList.remove('errorValue');
                }
            } else if (this.classList.contains('value') && regexpNumber.test(this.value)) {
                _result[index].value = this.value;
                this.classList.remove('errorValue');
            }
            _updateArea();
            if($(this.parentNode).children('.errorValue').length === 0) {
                _result[index].isError = false;
                _showData(_result);
                _drawMap();
            }
        });
    }
    function _drawMap() {
        var result = [],
            fillColor = em.validator.fillColor || colors[$('#choose-color-map-fill').find(':selected').text()];
            
        em.validator.getResult().forEach(function (item) {
            result.push({
                name : item.name,
                id : '',
                value  : item.value
            });
        });
        
        easy_choropleth({
                colors: fillColor,
                width: 960,
                height: 600,    
                datasource: "oblasti.topo.json",
                data: result,
                selector: "#map_svg" 
        });
    }
    function _updateArea() {
        var textarea = $("#data-text"),
            data = em.validator.getResult(),
            i = 0, max = data.length,
            item,
            result = [];
        for (; i < max; i += 1) {
            result.push(data[i].name + ', ' + data[i].value);
        }
        textarea.val(result.join('\n'));
    }
    
    var PROBABILITY = 0.5,
        _result;
    
    return {
        fillColor : false,
        getData : _getDataArray,
        showData : _showData,
        getResult : function () {
            return _result;
        },
        drawMap : _drawMap
    }
})();
