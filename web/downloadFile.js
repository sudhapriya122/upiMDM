self.onmessage = function (e) {
    var postBackMessage = function (dataString) {
          postMessage(dataString);
    }
    var headers=e.data.key1;
    var tableData=e.data.key2;
    var string = '<table><tbody><tr>';
        for (var i = 0; i < headers.length; i++) {

            string = string + '<th>' + headers[i]['columnName'] + '</th>';
        }
        string = string + '</tr>'
        for (var i = 0; i < tableData.length; i++) {
            string = string + '<tr>';
            for (var j = 0; j < headers.length; j++) {
                if (headers[j]['columnType'].toLowerCase() != 'select'
                        || headers[j]['columnType'].toLowerCase() != 'button') {
                    string = string + '<td>' + tableData[i][headers[j]['columnId']] + '</td>';
                }
            }
            string = string + '</tr>';
        }
        string = string + '</tbody></table>';
        postBackMessage(string)
}