
self.onmessage = function (e) {
    var data = e.data.key1;
    var attrSeq = e.data.key2;
    var attrSeqArr = attrSeq.split(",")
    var templateHeaderSeq = e.data.key3;
    var attrList = e.data.key4;
    var dataArr = [];
    var returnDataArr = [];
    var recordsLength = 0;
    var totalRecordsLength = 0;
    var reqCharThreshhold = 20000;
    var reqRecordObj = {};
    var numOfRecords = 1;
    for (var i = 0, maxData = data.length; i < maxData; i++) {
        dataArr = [];

        for (var a = 0, max = attrList.length; a < max; a++) {
            data[i][templateHeaderSeq[a]] = data[i][templateHeaderSeq[a].toLowerCase()].replace(/[”'"]/g, '');
            switch (attrList[a]['datatype'].toLowerCase()) {
                case 'number':
                    if (data[i][templateHeaderSeq[a]] !== "") {
                        if (data[i][templateHeaderSeq[a]].split(',').length > 1) {
                            data[i][templateHeaderSeq[a]] = (data[i][templateHeaderSeq[a]].split(',').join(''));
                            dataArr.push(data[i][templateHeaderSeq[a]]);
                        } else {
                            dataArr.push(data[i][templateHeaderSeq[a]]);
                        }
                    } else {
                        dataArr.push("'" + data[i][templateHeaderSeq[a]] + "'");
                    }
                    break;
                case 'varchar2':
                case "string":
                case "boolean":
                    dataArr.push("'" + data[i][templateHeaderSeq[a]] + "'");
                    break;
//                case "date":
//                    var tempdate=data[i][templateHeaderSeq[a]].split('/');
//                    tempdate=tempdate[2]+'-'+tempdate[1]+'-'+tempdate[0];
//                    dataArr.push("'" + tempdate + "'");
//                    break;
                default:
                    dataArr.push("'" + data[i][templateHeaderSeq[a]] + "'");
                    break;
            }
        }
        var recordStr = dataArr.join(",");
        recordsLength += recordStr.length;
        if (recordsLength > reqCharThreshhold) {
            recordsLength = 0;
            var reqRecordArr = returnDataArr;
            var reqRecordStr = reqRecordArr.join("~")
            reqRecordObj[numOfRecords] = reqRecordStr;
            numOfRecords++;
            returnDataArr = [];
        }
        totalRecordsLength += recordStr.length;
        returnDataArr.push(recordStr);
//        if (recordsLength <= reqCharThreshhold) {
//            //recordsLength=0;
//            var reqRecordArr = returnDataArr;
//            var reqRecordStr = reqRecordArr.join("~");
//            reqRecordObj[numOfRecords] = reqRecordStr;
//            numOfRecords++;
//            //returnDataArr=[];
//        }

    }
    if (recordsLength <= reqCharThreshhold) {
        recordsLength = 0;
        var reqRecordArr = returnDataArr;
        var reqRecordStr = reqRecordArr.join("~");
        reqRecordObj[numOfRecords] = reqRecordStr;
        numOfRecords++;
        returnDataArr = [];
    }


    //console.log(recordsLength);
    //console.log(totalRecordsLength)
    //console.log(Object.keys(reqRecordObj).length)
    //console.log(JSON.stringify(reqRecordObj[Object.keys(reqRecordObj).length-1]));
    postMessage({
        type: "submitData",
        data: reqRecordObj
    });

}
