self.onmessage = function (e) {
    self.importScripts('js/jszip.js', 'js/xls.js', 'js/xlsx.js');
    var file = e.data.file;
    var fileType = '';
    var errorMessage = '';
    var returnedData = {};
    var postBackMessage = function (data, sheets) {
        // console.log(errorMessage);
        var dataObj = {
            fileType: fileType,
            sheets: '',
            fileData: data || '',
            errorMessage: errorMessage
        };
        switch (fileType.toLowerCase()) {
            case 'xls':
            case 'xlsx':
                if (sheets) {
                    var tempSheetArr = [];
                    for (var i = 0, sheet_len = sheets.length; i < sheet_len; i++) {
                        if ((sheets[i].length > 0 && sheets[i].toLowerCase() == "configuration_not to be touched") || (sheets[i].length > 0 && sheets[i].toLowerCase() == "validations")) {

                        } else {
                            tempSheetArr.push(sheets[i]);
                        }
                    }
                    sheets = tempSheetArr;
                    /*var index_1 = sheets.indexOf("Configuration_not to be touched");
                     var index_2= sheets.indexOf("Validations");
                     if (index_1 > -1) {
                     sheets.splice(index_1);
                     }
                     if (index_2 > -1) {
                     sheets.splice(index_2);
                     }*/
                    dataObj.sheets = sheets || '';
                }

                break;
            case 'csv':
                dataObj.sheets = '';
                break;
            default :

        }
        postMessage(dataObj);
    };
    var parseExcelData = function (workBook) {
        var sheet_name_list = workBook.SheetNames;
        sheet_name_list.forEach(function (y) { /* iterate through sheets */
            var worksheet = workBook.Sheets[y];
            for (z in worksheet) {
                /* all keys that do not begin with "!" correspond to cell addresses */
                if (z[0] === '!')
                    continue;
                console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
            }
        });
    }
    var parseSheetsData = function (workBook) {
        var sheets = workBook.SheetNames;
//        if(sheets.length<=0){
//            errorMessage='Empty Workbook';
//            postBackMessage();
//            return ;
//        }


        for (var i = 0; i < sheets.length; i++) {
            var sCSV = XLSX.utils.make_csv(workBook.Sheets[sheets[i]]);
            returnedData[sheets[i]] = sCSV.trim();
        }
        postBackMessage(returnedData, sheets);
    };
    // Return array of string values, or NULL if CSV string not well formed.
    var CSVtoArray = function (text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text))
            return null;
        var a = []; // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
                function (m0, m1, m2, m3) {
                    // Remove backslash from \' in single quoted values.
                    if (m1 !== undefined)
                        a.push(m1.replace(/\\'/g, "'"));
                    // Remove backslash from \" in double quoted values.
                    else if (m2 !== undefined)
                        a.push(m2.replace(/\\"/g, '"'));
                    else if (m3 !== undefined)
                        a.push(m3);
                    return ''; // Return empty string.
                });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text))
            a.push('');
        return a;
    };
    var readCsv = function (event) {
        try {
            var fileData = event.target.result.trim();
            /*var arrData = CSVtoArray(fileData);
             for (var i = 0; i < arrData.length; i++) {
             if (arrData[i].indexOf(",") > -1) {
             arrData[i] = arrData[i].replace(/,/g, "^^");
             }
             }
             var str = arrData.join(",");
             fileData = str;*/
            var rows = fileData.split("\n");
            var data = [];
            for (var i = 0, r_len = rows.length; i < r_len; i++) {
                var curRowData = CSVtoArray(rows[i]);
                for (var j = 0, cur_len = curRowData.length; j < cur_len; j++) {
                    if (curRowData[j].indexOf(",") > -1) {
                        curRowData[j] = curRowData[j].replace(/,/g, "^^");
                    }
                    if (curRowData[j].indexOf("\n") > -1) {
                        curRowData[j] = curRowData[j].replace(/\n/g, "");
                    }
                }
                var str = curRowData.join(',');
                data.push(str);
            }
            fileData = data.join('\n');
            postBackMessage(fileData);
        } catch (e) {
            errorMessage = "File Corrupted..Load Another File";
            postBackMessage();
        }

    };
    var readExcel = function (event) {
        var reader1 = new FileReader();
        try {
             if ('readAsBinaryString' in reader1) {
                var data = event.target.result;
            } else {
                var data = "";
                var bytes = new Uint8Array(event.target.result);
                var length = bytes.byteLength;
                for (var i = 0; i < length; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
            }
            var cfb = XLSX.CFB.read(data, {type: 'binary'});
            var wb = XLSX.parse_xlscfb(cfb);
            parseSheetsData(wb);
        } catch (e) {
            errorMessage = "File Corrupted..Load Another File"
            postBackMessage();
        }

    };
    var readExcel_xlsx = function (event) {
        var reader1 = new FileReader();
        try {
            if ('readAsBinaryString' in reader1) {
                var data = event.target.result;
            } else {
                var data = "";
                var bytes = new Uint8Array(event.target.result);
                var length = bytes.byteLength;
                for (var i = 0; i < length; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
            }


            var wb = XLSX.read(data, {type: 'binary'});
            //var wb = XLSX.parse_xlscfb(cfb);
            parseSheetsData(wb);
        } catch (e) {
            errorMessage = "File Corrupted..Load Another File";
        }

    }
    var init = function () {
        fileType = file.name.substr(file.name.lastIndexOf(".") + 1);
        if (fileType.toLowerCase() === "csv" || fileType.toLowerCase() === "xls" || fileType.toLowerCase() === "xlsx") {
            var reader = new FileReader();
            switch (fileType.toLowerCase()) {
                case "csv":
                    reader.onload = readCsv;
                    break;
                case "xls":
                    reader.onload = readExcel;
                    break;
                case "xlsx":
                    //errorMessage='Invalid File Type';
                    reader.onload = readExcel_xlsx;
                default:
                    break;
            }
            if ('readAsBinaryString' in reader) {
                reader.readAsBinaryString(file);
            } else {
                switch(fileType.toLowerCase()){
                    case 'xlsx':
                    case 'xls':
                        reader.readAsArrayBuffer(file);
                        break;
                    case 'csv':
                        reader.readAsText(file);
                        break;
                        
                }
                
            }

        } else {
            errorMessage = 'Invalid File Type..';
            postBackMessage();
            return;
        }
        ;
    };
    init();
};