/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var dmCommonApi = angular.module('dmCommonApiModule', []);
Number.prototype.toNDigits = function (NDigits) {
    var returnVal = '';
    var digits = '';
    var value = this.toString();
    var valueLength = value.length;
    var digitsToBeAdded = NDigits - valueLength;
    if (valueLength < NDigits) {
        for (var i = 0; i < digitsToBeAdded; i++) {
            digits += '0';
        }
    }
    returnVal = digits + value;
    //value < 10 ? returnVal = "0" + value : returnVal = value;
    return returnVal;
};


String.prototype.parseDate = function (formatType) {
    var returnValue = this;
    var shortMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    switch (formatType) {
        case 'todateobj':
            var dateArr = this.split('-');
            var d_month = shortMonths.indexOf(dateArr[1]);
            d_month = d_month < 10 ? '0' + d_month : d_month;
            returnValue = new Date('20' + dateArr[2], d_month, dateArr[0]);
            break;
        case 'servertoobj':
            var dateStr = this.split(' ')[0];
            var dateArr = dateStr.split('-');
//            returnValue = new Date(dateArr[0],)
            break;
    }

    return returnValue;
}

Date.prototype.parseDate = function (formatType) {
    var returnValue = this;
    var formats = {
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        shortWeeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday']
    };
    //console.log(Object.prototype.toString.call(this));
    var date = this.getDate();
    var month = this.getMonth();
    var year = this.getFullYear();
//    var year = this.getUTCFullYear();
    var hour = this.getHours();
    var min = this.getMinutes();
    var sec = this.getSeconds();
    switch (formatType ? formatType.toLowerCase() : '') {
        case 'serverdate':
            returnValue = year.toNDigits(4) + '-' + (month + 1).toNDigits(2) + '-' + date.toNDigits(2) + ' ' + hour.toNDigits(2) + ':' + min.toNDigits(2) + ':' + sec.toNDigits(2);
            break;
        case 'shortdate':
            returnValue = date + ' ' + formats['shortMonths'][Number(month)] + ', ' + year;
            break;
        case 'textedmonthdate':
            returnValue = date + '-' + formats['shortMonths'][Number(month)] + '-' + year % 100;
            break;
        case 'isoshortdate':
            returnValue = year.toNDigits(4) + '-' + (month + 1).toNDigits(2) + '-' + date.toNDigits(2);
            break;

        case 'hour_min':
            returnValue = hour.toNDigits(2) + ':' + min.toNDigits(2)
            break;
        default :

            break;
    }
    return returnValue;
};
Date.prototype.dateAdd = function (size, value) {
    value = parseInt(value);
    var incr = 0;
    switch (size) {
        case 'day':
            incr = value * 24;
            this.dateAdd('hour', incr);
            break;
        case 'hour':
            incr = value * 60;
            this.dateAdd('minute', incr);
            break;
        case 'week':
            incr = value * 7;
            this.dateAdd('day', incr);
            break;
        case 'minute':
            incr = value * 60;
            this.dateAdd('second', incr);
            break;
        case 'second':
            incr = value * 1000;
            this.dateAdd('millisecond', incr);
            break;
        case 'month':
            value = value + this.getUTCMonth();
            if (value / 12 > 0) {
                this.dateAdd('year', value / 12);
                value = value % 12;
            }
            this.setUTCMonth(value);
            break;
        case 'millisecond':
            this.setTime(this.getTime() + value);
            break;
        case 'year':
            this.setFullYear(this.getUTCFullYear() + value);
            break;
        default:
            throw new Error('Invalid date increment passed');
            break;
    }

};
Date.prototype.firstDay = function (size) {
    switch (size.toLowerCase()) {
        case 'week':
            var weekday = this.getDay();
            weekday === 0 ? weekday = 7 : '';
            this.dateAdd('day', -(weekday - 1));
            break;
        case 'month':
            this.setDate(1);
            break;
        case 'year':
            this.setMonth(0);
            this.firstDay('month');
            break;
        default:
            throw new Error('Invalid parameters');
            break;
    }
    return this;
};
Date.prototype.lastDay = function (size) {
    switch (size.toLowerCase()) {
        case 'week':
            var weekday = this.getDay();
            weekday === 0 ? weekday = 7 : '';
            this.dateAdd('day', 7 - weekday);
            break;
        case 'month':
            this.setDate(1);
            this.dateAdd('month', 1);
            this.dateAdd('day', -1);
            break;
        case 'year':
            this.setMonth(11);
            this.lastDay('month');
            break;
        default:
            throw new Error('Invalid parameters');
            break;
    }
    return this;

};

dmCommonApi.filter('columnConfigurator', [function () {
        return function (headingColumns) {
            var currentColumnCongigurations = [];
            var allColumns = headingColumns.split("~");
            for (var i = 0, max = allColumns.length; i < max; i++) {
                allColumns[i] = allColumns[i].trim();
                var columnObj = {
                    columnId: "",
                    columnName: "",
                    columnType: "",
                    columnSequence: "",
                    columnShown: true
                };
                if (allColumns[i].trim().toLowerCase() === "select") {
                    columnObj.columnId = allColumns[i];
                    columnObj.columnName = "Select";
                    columnObj.columnType = "checkbox";
                    columnObj.columnSequence = i;
                } else if (allColumns[i].trim().indexOf("_btn") > -1) {
                    columnObj.columnId = allColumns[i];
                    columnObj.columnName = allColumns[i].split("_")//[0];
                    columnObj.columnName.pop();
                    columnObj.columnName = columnObj.columnName.join(' ');
                    columnObj.columnType = "button";
                    columnObj.columnSequence = i;
                } else if (allColumns[i].trim().indexOf("_") > -1) {
                    columnObj.columnId = allColumns[i];
                    columnObj.columnName = allColumns[i].split("_").join(" ");
                    columnObj.columnType = "text";
                    columnObj.columnSequence = i;
                } else {
                    columnObj.columnId = allColumns[i];
                    columnObj.columnName = allColumns[i].split("_").join(" ");
                    columnObj.columnType = "text";
                    columnObj.columnSequence = i;
                }
                currentColumnCongigurations.push(columnObj);
            }
            return currentColumnCongigurations;
        };
    }]);
dmCommonApi.filter('extractProperty', [function () {
        return function (collection, propName) {
            var output = [];
            angular.forEach(collection, function (obj) {
                output.push(obj[propName].trim());
            });
            return output;
        };
    }]);
dmCommonApi.filter('replaceInArray', [function () {
        return function (collection, text_to_replace, replace_by_text) {
            var output = [];

            angular.forEach(collection, function (value) {
                value = value.replace(text_to_replace, replace_by_text)
                output.push(value)
            });
            return output;
        }
    }]);
dmCommonApi.filter('toNDigits', [function () {
        return function (value, NDigits) {
            var returnVal = '';
            var digits = '';
            value = value.toString();
            var valueLength = value.length;
            var digitsToBeAdded = NDigits - valueLength;
            if (valueLength < NDigits) {
                for (var i = 0; i < digitsToBeAdded; i++) {
                    digits += '0';
                }
            }
            returnVal = digits + value;
            //value < 10 ? returnVal = "0" + value : returnVal = value;
            return returnVal;
        };
    }]);
dmCommonApi.filter('toPlatwareDate', ['$filter', function ($filter) {
        return function (dateString) {
            if (dateString.trim().length > 0) {
                var dateStrArr = dateString.split("T");
                var timeArr = dateStrArr[1].split(":");
                var dateArr = dateStrArr[0].split("-");
                var returnDate = new Date(dateArr[0], dateArr[1], dateArr[2], timeArr[0], timeArr[1]);
                var year = $filter('toNDigits')(returnDate.getFullYear(), 4);
                var month = $filter('toNDigits')(returnDate.getMonth() + 1, 2);
                var date = $filter('toNDigits')(returnDate.getDate(), 2);
                var hour = $filter('toNDigits')(returnDate.getHours(), 2);
                var min = $filter('toNDigits')(returnDate.getMinutes(), 2);
                var sec = $filter('toNDigits')(returnDate.getMilliseconds(), 2);
                returnDate = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
            } else {
                returnDate = ""
            }
            return returnDate;

        };
    }]);
//dmCommonApi.filter('toPlatwareDate2', ['$filter', function ($filter) {
//        return function (dateString) {
//
//        };
//    }]);
dmCommonApi.filter('parseServerDate', [function () {
        return function (dateString) {
            var date = null;
            var time = null;
            if (dateString.indexOf('.') > -1) {
                dateString = dateString.split('.')[0];
            }
            if (dateString.indexOf(' ') > -1) {
                date = dateString.split(' ')[0].split('-');
                time = dateString.split(' ')[1].split(':');
            } else {
                date = dateString.split('-');
                time = ['00', '00', '00'];
            }
            var newDate = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
            return newDate;
        };
    }]);
dmCommonApi.filter('formatDate', ['$filter', function ($filter) {
        return function (dateString, formatType) {
            var output = null;
            var daysArray = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            var returnDate = $filter('parseServerDate')(dateString);
            var year = $filter('toNDigits')(returnDate.getFullYear(), 4);
            var month = $filter('toNDigits')(returnDate.getMonth() + 1, 2);
            var day = $filter('toNDigits')(returnDate.getDate(), 2);
            var hour = $filter('toNDigits')(returnDate.getHours(), 2);
            var min = $filter('toNDigits')(returnDate.getMinutes(), 2);
            var sec = $filter('toNDigits')(returnDate.getMilliseconds(), 2);
            var weekDay = returnDate.getDay();
            switch (formatType) {
                case 'dd-mm-yyyy':
                    output = day + '-' + month + '-' + year;
                    break;
                case 'yyyy-mm-dd':
                    output = year + '-' + month + '-' + day;
                    break;
                case 'local-date':

                default :
                    output = returnDate.toDateString();
            }
            return output;
        };
    }]);
dmCommonApi.filter("extractObj", [function () {
        return function () {

        };
    }]);
dmCommonApi.filter('unique', [function () {
        return function (collection, keyname) {
            var output = [],
                    keys = [];
            angular.forEach(collection, function (item) {
                var key = item[keyname].toLowerCase();
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        };
    }]);
dmCommonApi.filter('orderObjectBy', [function () {
        return function (input, attribute) {
            if (!angular.isObject(input))
                return input;

            var array = [];
            for (var objectKey in input) {
                array.push(input[objectKey]);
            }
            array.sort(function (a, b) {
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return a - b;
            });
            return array;
        };
    }]);
dmCommonApi.filter('byProp', [function () {
        return function (collection, keyname, value, conditional) {
            if (conditional) {
                return collection;
            }
            value = value ? value.toLowerCase() : '';
            if (keyname == "column function name") {
            }
            var output = [],
                    keys = [];
            if (collection && collection.length > 0 && keyname) {
                angular.forEach(collection, function (item) {
                    item[keyname].toLowerCase().trim() === value.trim() ? output.push(item) : "";
                });
            }
            return output;
        };
    }]);
dmCommonApi.filter('getEventsByTime', [function () {
        var output = [];
        return function (collection, keyname, minValue, maxValue) {
            if (collection && collection.length > 0 && keyname) {
                angular.forEach(collection, function (item) {

                    if (item[keyname].split(':')[0] == minValue.split(':')[0] && item[keyname].split(':')[0] == maxValue.split(':')[0] && ((item[keyname].split(':')[1] >= minValue.split(':')[1]) && (item[keyname].split(':')[1] <= maxValue))) {
                        output.push(item);
                    }
                });
            }
            return output;
        }
    }]);
dmCommonApi.filter('byPropCount', [function () {
        return function (collection, keyname, value) {
            var output = 0;
            if (Object.prototype.toString.call(collection) === '[object Array]') {

            } else if (Object.prototype.toString.call(collection) === '[object Object]') {
                angular.forEach(collection, function (item) {
                    //console.log(JSON.stringify(item)) 
                    if (item[keyname].toLowerCase().trim() === value.toLowerCase().trim()) {
                        output++;
                    }
                });
            }
            return output;
        };
    }]);
dmCommonApi.filter('byPropMst', [function () {
        return function (collection, reference, value, outputType) {
            var collectionType = Object.prototype.toString.call(collection);
            var refType = Object.prototype.toString.call(reference);
            var conditions = [];
            var output = null;
            var prepareValueArray = function (value) {
                var valueType = Object.prototype.toString.call(value);
                var valueArray = [];
                switch (valueType) {
                    case '[object String]':
                        valueArray.push(value.toLowerCase());
                        break;
                    case '[object Array]':
                        angular.forEach(value, function (val) {
                            valueArray.push(val.toLowerCase());
                        });
                        break;
                    case '[object Object]':
                        angular.forEach(value, function (val) {
                            valueArray.push(val.toLowerCase());
                        });
                        break;
                }
                return valueArray;
            };
            var prepareConditionObj = function (key) {
                var conditionObj = {};
                var keyType = Object.prototype.toString.call(key);
                switch (keyType) {
                    case '[object String]':
                        conditionObj[key] = prepareValueArray(value);
                        break;
                    case '[object Array]':

                        break;
                    case '[object Object]':

                        angular.forEach(key, function (value, keyname) {
                            key[keyname] = prepareValueArray(value);
                        });
                        conditionObj = key;
                        break;
                }
                return conditionObj;
            };
            var chkForRef = function (reference) {

                var refType = Object.prototype.toString.call(reference);
                switch (refType) {
                    case '[object String]':
                        if (reference) {
                            conditions.push(prepareConditionObj(reference));
                        }
                        break;
                    case '[object Object]':
                        outputType = value;
                        conditions.push(prepareConditionObj(reference));
                        break;
                    case '[object Array]':
                        outputType = value;
                        angular.forEach(reference, function (refObj) {
                            conditions.push(prepareConditionObj(refObj));
                        });
                        break;
                }

            };
            var prepareOutputData = function (collection) {
                var collectionType = Object.prototype.toString.call(collection);
                var outputData = null;
                switch (collectionType) {
                    case '[object Array]':
                        outputData = [];
                        angular.forEach(collection, function (dataObj) {
                            var isMatched = false;
                            angular.forEach(conditions, function (conditionObj) {
                                var checks = 0;
                                angular.forEach(conditionObj, function (valueArray, keyName) {
                                    var value = dataObj[keyName] ? dataObj[keyName].toLowerCase() : dataObj[keyName];
                                    if (valueArray.indexOf(value) > -1) {
                                        checks++;
                                    }
                                });
                                if (Object.keys(conditionObj).length == checks) {
                                    isMatched = true;
                                }
                            });
                            switch (true) {
                                case outputType == false:
                                    if (!isMatched) {
                                        outputData.push(dataObj);
                                    }
                                    break;
                                default :
                                    if (isMatched) {
                                        outputData.push(dataObj);
                                    }
                            }
                        });
                        break;
                    case '[object Object]':
                        outputData = {};
                        angular.forEach(collection, function (dataObj, dataKey) {
                            var isMatched = false;
                            angular.forEach(conditions, function (conditionObj) {
                                var checks = 0;
                                angular.forEach(conditionObj, function (valueArray, keyName) {
                                    var value = dataObj[keyName] ? dataObj[keyName].toLowerCase() : dataObj[keyName];
                                    if (valueArray.indexOf(value) > -1) {
                                        checks++;
                                    }
                                });
                                if (Object.keys(conditionObj).length == checks) {
                                    isMatched = true;
                                }
                            });
                            switch (true) {
                                case outputType == false:
                                    if (!isMatched) {
                                        outputData[dataKey] = dataObj;
                                    }
                                    break;
                                default :
                                    if (isMatched) {
                                        outputData[dataKey] = dataObj;
                                    }

                            }
//                            if (isMatched) {
//                                outputData[dataKey] = dataObj;
//                            }
                        });
                        break;
                }
                return outputData;
            };
            var init = function () {
                if (collection && reference) {
                    chkForRef(reference);
                    if (conditions.length > 0) {
                        output = prepareOutputData(collection);
                        return;
                    }
                }
                output = collection;
            }();
            return output;
        };
    }]);
//dmCommonApi.filter('byPropMst', [function () {
//        return function (collection, reference, value) {
//            var collectionType = Object.prototype.toString.call(collection);
//            var refType = Object.prototype.toString.call(reference);
//            var conditions = [];
//            var output = null;
//            var prepareValueArray = function (value) {
//                var valueType = Object.prototype.toString.call(value);
//                var valueArray = [];
//                switch (valueType) {
//                    case '[object String]':
//                        valueArray.push(value.toLowerCase());
//                        break;
//                    case '[object Array]':
//                        angular.forEach(value, function (val) {
//                            valueArray.push(val.toLowerCase());
//                        });
//                        break;
//                    case '[object Object]':
//                        angular.forEach(value, function (val) {
//                            valueArray.push(val.toLowerCase());
//                        });
//                        break;
//                }
//                return valueArray;
//            };
//            var prepareConditionObj = function (key) {
//                var conditionObj = {};
//                var keyType = Object.prototype.toString.call(key);
//                switch (keyType) {
//                    case '[object String]':
//                        conditionObj[key] = prepareValueArray(value);
//                        break;
//                    case '[object Array]':
//
//                        break;
//                    case '[object Object]':
//                        angular.forEach(key, function (value, keyname) {
//                            key[keyname] = prepareValueArray(value);
//                        });
//                        conditionObj = key;
//                        break;
//                }
//                return conditionObj;
//            };
//            var chkForRef = function (reference) {
//
//                var refType = Object.prototype.toString.call(reference);
//                switch (refType) {
//                    case '[object String]':
//                        if (reference) {
//                            conditions.push(prepareConditionObj(reference));
//                        }
//                        break;
//                    case '[object Object]':
//                        conditions.push(prepareConditionObj(reference));
//                        break;
//                    case '[object Array]':
//                        angular.forEach(reference, function (refObj) {
//                            conditions.push(prepareConditionObj(refObj));
//                        });
//                        break;
//                }
//
//            };
//            var prepareOutputData = function (collection) {
//                var collectionType = Object.prototype.toString.call(collection);
//                var outputData = null;
//                switch (collectionType) {
//                    case '[object Array]':
//                        outputData = [];
//                        angular.forEach(collection, function (dataObj) {
//                            var isMatched = false;
//                            angular.forEach(conditions, function (conditionObj) {
//                                var checks = 0;
//                                angular.forEach(conditionObj, function (valueArray, keyName) {
//                                    if (valueArray.indexOf(dataObj[keyName].toLowerCase()) > -1) {
//                                        checks++;
//                                    }
//                                });
//                                if (Object.keys(conditionObj).length == checks && !isMatched) {
//                                    outputData.push(dataObj);
//                                    isMatched = true;
//                                }
//                            });
//                        });
//                        break;
//                    case '[object Object]':
//                        outputData = {};
//                        angular.forEach(collection, function (dataObj, dataKey) {
//                            var isMatched = false;
//                            angular.forEach(conditions, function (conditionObj) {
//                                var checks = 0;
//                                angular.forEach(conditionObj, function (valueArray, keyName) {
//                                    if (valueArray.indexOf(dataObj[keyName].toLowerCase()) > -1) {
//                                        checks++;
//                                    }
//                                });
//                                if (Object.keys(conditionObj).length == checks && !isMatched) {
//                                    outputData[dataKey] = dataObj;
//                                    isMatched = true;
//                                }
//                            });
//                        });
//                        break;
//                }
//                return outputData;
//            };
//            var init = function () {
//                if (collection && reference) {
//                    chkForRef(reference);
//                    if (conditions.length > 0) {
//                        output = prepareOutputData(collection);
//                        return;
//                    }
//                }
//                output = collection;
//            }();
//            return output;
//        };
//    }]);
dmCommonApi.filter('excludeByProp', [function () {
        return  function (collection, keyname, value) {
            var output = [];
            if (collection && collection.length > 0 && keyname) {
                angular.forEach(collection, function (item) {
                    item[keyname].toLowerCase() !== value.toLowerCase() ? output.push(item) : "";
                });
            }
            return output;
        };
    }]);
dmCommonApi.filter('excludedData', [function () {
        return function (parentCollection, childCollection, parentKey, childKey) {
            var output = [];
            if (parentCollection && parentCollection.length && childCollection && childCollection.length && parentKey && childKey) {
                angular.forEach(parentCollection, function (parentObj) {
                    var isMatch = false;
                    angular.forEach(childCollection, function (childObj) {
                        if (parentObj[parentKey].toLowerCase() === childObj[childKey].toLowerCase()) {
                            isMatch = true;
                        }
                    });
                    if (!isMatch) {
                        output.push(parentObj);
                    }
                });
            }
            return output;
        };
    }]);
dmCommonApi.filter('replacePropValue', [function () {
        return function (collection, keyname, currentValue, newValue) {
            var output = [];
            angular.forEach(collection, function (item) {
                if (item[keyname].toLowerCase() === currentValue.toLowerCase()) {
                    item[keyname] = newValue
                }
                output.push(item);
            });
            return output;
        };
    }]);
dmCommonApi.filter('splitByDelimitor', [function () {
        return function (delimitedString, delimiter) {
            // alert(delimitedString+"__________"+delimiter);
            var delimiter = delimiter || delimiter;
            return delimitedString.split(delimiter);
        };
    }]);
dmCommonApi.filter('objToLower', [function () {
        return function (collection) {
            angular.forEach(collection, function (data, index) {
                var dataObj = JSON.stringify(data);
                var newDataObj = [];
                newDataObj.push(dataObj.replace(/"([^"]+)":/g, function ($0, $1) {
                    var lowerCasedKey = '"' + $1.toLowerCase() + '":';
                    return lowerCasedKey;
                }));
                collection.splice(index, 1, JSON.parse(newDataObj));
            });
            return collection;
        };
    }]);
dmCommonApi.filter('columnActionConfigurator', [function () {
        return function (collection, key, value) {
            var output = [];
            angular.forEach(collection, function (item) {
                if (item[key].toLowerCase().indexOf("_btn") > -1) {
                    var columnName = item[key].split('_');
                    columnName.pop();
                    columnName = columnName.join(' ');
                    columnName.toLowerCase() === value.toLowerCase() ? output.push(item) : "";
                } else {
                    item[key].toLowerCase() === value.toLowerCase() ? output.push(item) : "";
                }
            });
            return output;
        };
    }]);
dmCommonApi.filter('pagination', [function () {
        return function (collection, pageNumber, itemsPerPage) {
            var output = null;
            if (collection) {
                var dataStartIndex = Number(((pageNumber - 1) * itemsPerPage));
                var dataEndIndex = Number(dataStartIndex + itemsPerPage);
                output = collection.slice(dataStartIndex, dataEndIndex);
            }
            return output;
        };
    }]);
dmCommonApi.filter('highlightSearch', ['$sce', function ($sce) {
        return function (text, phrase) {
            if (phrase)
                text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
                        '<span class="dmHighlighted">$1</span>')
            return $sce.trustAsHtml(text);
        };
    }]);
dmCommonApi.service('modifyObj', [function () {
        this.attachKey = function (collection, keyName, defaultValue) {
            angular.forEach(collection, function (dataObj, $index) {
                var value = defaultValue ? defaultValue : $index.toString();
                if (dataObj[keyName]) {
                    dataObj[keyName] = value;
                } else {
                    dataObj[keyName] = value;
                }
            });
            return collection;
        };
        this.removeKey = function (collection, keyName) {
            angular.forEach(collection, function (dataObj) {
                if (dataObj[keyName]) {
                    delete dataObj[keyName];
                }
            });
            return collection;
        };
    }]);
dmCommonApi.service('prepareDwnldData', [function () {

        this.uri = {excel: 'data:application/vnd.ms-excel;base64,', csv: 'data:application/csv;base64,'};
        this.base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        };
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        this.fromCharCode = String.fromCharCode;
        this.INVALID_CHARACTER_ERR = (function () {
            // fabricate a suitable error object
            try {
                document.createElement('$');
            } catch (error) {
                return error;
            }
        }());
        window.btoa || (window.btoa = function (string) {
            var a, b, b1, b2, b3, b4, c, i = 0, len = string.length, max = Math.max, result = '';

            while (i < len) {
                a = string.charCodeAt(i++) || 0;
                b = string.charCodeAt(i++) || 0;
                c = string.charCodeAt(i++) || 0;

                if (max(a, b, c) > 0xFF) {
                    throw this.INVALID_CHARACTER_ERR;
                }

                b1 = (a >> 2) & 0x3F;
                b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
                b3 = ((b & 0xF) << 2) | ((c >> 6) & 0x3);
                b4 = c & 0x3F;

                if (!b) {
                    b3 = b4 = 64;
                } else if (!c) {
                    b4 = 64;
                }
                result += this.characters.charAt(b1) + this.characters.charAt(b2) + this.characters.charAt(b3) + this.characters.charAt(b4);
            }
            return result;
        });
        this.excelData = function (headers, data) {
            var string = '<table><tbody><tr>';
            for (var i = 0; i < headers.length; i++) {

                string = string + '<th>' + headers[i]['columnName'] + '</th>';
            }
            string = string + '</tr>'
            for (var i = 0; i < data.length; i++) {
                string = string + '<tr>';

                var invalidReasonobject = data[i].invalidreason;
                for (var j = 0; j < headers.length; j++) {
                    if (headers[j]['columnType'].toLowerCase() != 'select'
                            || headers[j]['columnType'].toLowerCase() != 'button') {
//                        string = string + '<td>' + data[i][headers[j]['columnId']] + '</td>';
                        if (invalidReasonobject && headers[j]['columnId'] in invalidReasonobject) {
                            string = string + '<td style="background:#ff0000">' + (data[i][headers[j]['columnId']].match(/^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})/g) ? '"' + data[i][headers[j]['columnId']] + '"' : data[i][headers[j]['columnId']]) + '</td>';
                        } else {
                            string = string + '<td>' + (data[i][headers[j]['columnId']].match(/^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})/g) ? data[i][headers[j]['columnId']] : data[i][headers[j]['columnId']]) + '</td>';
                        }

                    }
                }
                string = string + '</tr>';
            }
            string = string + '</tbody></table>';
            return string;
        };


        // this.csvData = function (headers, data) {
        //     var string = '';
        //     for (var i = 0, max = headers.length; i < max; i++) {
        //         if (i !== headers.length - 1) {
        //             string = string + '"' + headers[i].columnName + '",';
        //         } else {
        //             string = string + '"' + headers[i].columnName + '"';
        //         }
        //     }
        //     string = string + '\n';


        //     for (var j = 0; j < data.length; j++) {
        //         for (var k = 0; k < headers.length; k++) {
        //             string = string + '"' + data[j][headers[k]['columnId']] + '"';
        //             if (k !== headers.length - 1) {
        //                 string = string + ',';
        //             }
        //         }
        //         string = string + '\n';
        //     }
        //     return string;
        // };




         this.csvData = function (headers, data) {
             var string='';
             for (var i = 0, max = headers.length; i < max; i++) {
                 if (i !== headers.length - 1) {
                     string = string + headers[i].columnName + ',';
                 } else {
                     string = string + headers[i].columnName;
                 }
             }
             string = string + '\n';


             for (var j = 0; j < data.length; j++) {
                 for (var k = 0; k < headers.length; k++) {
                     string = string + data[j][headers[k]['columnId']];
                     if (k !== headers.length - 1) {
                         string = string + ',';
                     }
                 }
                 string = string + '\n';
             }
             return string;
         };


        
    }]);
dmCommonApi.directive('dmTable', ['$parse', function ($parse) {
        return {
            restrict: 'E',
            templateUrl: 'commonFilters/dmTable.html',
            scope: {
                datasource: '=dmDatasource',
                searchable: "=dmSearchable",
                sortable: "=dmSortable",
//                datacount: "=dmDatacount",
                tableDataActions: "=dmTableDataActions",
                columnActions: "=dmColumnActions",
                tabSeperatorKey: "@dmTabSeperatorKey",
                seperatorAsCol: "@dmTabSeperatorAsCol",
                dataUniqueKey: "@dmDataUniqueKey",
                themeColor: '@dmTheme',
                editableProp: '@dmEditableKey',
                editableCondn: '@dmEditableCondition',
                returnCurrentData: '=returnDataAction',
                refreshTableCtrl: "=dmTableRefresh",
                cellTitle: '@dmCellTitle',
                dmCellAction: '@dmCellAction',
                dmActionCellTitle: '@dmActionCellTitle',
                dmColListConfig: '=dmColConfig',
                tablePaginationProc: '=dmProcedure',
                dmServerPagin:"=dmServerPaging"
            },
            controller: function ($scope, $filter, modifyObj, prepareDwnldData) {
                //alert($scope.tabSeperatorKey);
                $scope.$on('switchTab', function (e, tabName) {
                    $scope.showTab(tabName)
                });
                var perpageItemShown = 8;
                var endCount = 8;
                if ($scope.tabSeperatorKey) {
                    if ($scope.tabSeperatorKey.indexOf("_") > -1) {
                        $scope.tabSep = $scope.tabSeperatorKey.split('_').join(" ");
                    } else {
                        $scope.tabSep = $scope.tabSeperatorKey;
                    }
                }
                $scope.columnObj = {
                    columnListShown: false,
                    disabledColumn: [],
                    isColumnList: false
                };
                $scope.getPrevRecords = function () {
                    var index = parseInt($scope.startIndex);
                    index=index-parseInt($scope.dmServerPagin.batchCount)-2
                    $scope.tablePaginationProc(index)();
                }
                $scope.getNextRecords = function () {
                    var index = $scope.endIndex;
                    $scope.tablePaginationProc(index)();

                }
                var chkForColumnListActions = function () {
                    if ($scope.dmColListConfig && $scope.dmColListConfig.columnListShown) {
                        $scope.columnObj.isColumnList = true;
                        var type = Object.prototype.toString.call($scope.dmColListConfig);
                        if (type === '[object Object]') {
                            if ($scope.dmColListConfig.disabled && $scope.dmColListConfig.disabled.length > 0) {
                                $scope.columnObj.disabledColumn = $scope.dmColListConfig.disabled;
                            }
                        }
                    } else {
                        $scope.columnObj.isColumnList = false;
                    }

//                    if(type=='[object Object]' && ){
//                        
//                    }
                };
                $scope.selectedRows = {};
                //$scope.itemsPerPage = 5;
                $scope.itemsPerPage = {
                    itemShown: perpageItemShown//10
                };
                $scope.itemCountPerPage = {
                    'startCount': 1,
                    'endCount': endCount
                };
                //alert(JSON.stringify($scope.itemCountPerPage))
                $scope.pageNumber = {
                    currentPage: 1
                };
                $scope.pageNumber.currentPage = 1;
                $scope.totalPages = '';
                $scope.datacount = '';
                $scope.searchTableData = {
                    value: ''
                };
                $scope.columns = null;
                $scope.shownTableData = null;
                $scope.tableTabs = null;
                $scope.dataUniqueKey = null;
                $scope.tabShown = {
                    currentTab: null
                };
                $scope.showTabTable = function (selectedTab) {
                    var isTabShown = false;
                    if ($scope.tabShown.currentTab.toLowerCase() == selectedTab.toLowerCase()) {
                        isTabShown = true;
                    }

                    return isTabShown;
                };
                //$scope.currentTab = null;

                /***********calculate the total pages in table data************/

                $scope.totalPagesCalculator = function () {
                    $scope.totalPages = Math.ceil($scope.datacount / $scope.itemsPerPage.itemShown) || 0;
                };
                /****** This initially runs, sets the data to the table******/

                $scope.setDataSource = function () {
                                     
                    if ($scope.datasource && $scope.datasource.length > 0) {
                        if (!$scope.dataUniqueKey) {
                            $scope.dataUniqueKey = 'dmdataindex';
                            $scope.datasource = modifyObj.attachKey($scope.datasource, $scope.dataUniqueKey);
                        }
                        ;
                        $scope.dataUniqueKey = $scope.dataUniqueKey.toLowerCase();
                        $scope.tableTabs = $scope.calculateTableTabs();
                        // to lowercase object keys
//                    angular.forEach($scope.datasource, function (data, index) {
//                        JSON.stringify(data).replace(/"([^"]+)":/g, function ($0, $1) {
//                            return ('"' + $1.toLowerCase() + '":');
//                        });
//                        $scope.datasource.splice(index, 1, JSON.parse(JSON.stringify(data)));
//                    });
                        angular.forEach($scope.datasource, function (data, index) {
                            var dataObj = JSON.stringify(data);
                            var newDataObj = [];
                            newDataObj.push(dataObj.replace(/"([^"]+)":/g, function ($0, $1) {
                                var lowerCasedKey = '"' + $1.toLowerCase() + '":';
                                return lowerCasedKey;
                            }));
                            $scope.datasource.splice(index, 1, JSON.parse(newDataObj));
                        });
                       
                       
                        $scope.columns = $filter('columnConfigurator')($scope.datasource[0].heading.toLowerCase());
                        if ($scope.tabSeperatorKey) {
                            $scope.perTabData();
                        } else {
                            $scope.dataWithoutTab();
                        }

                        $scope.calculatePerPageData();
                    }
                };
                /**************watch for the table data change***************/

              

                $scope.$watch('datasource', function () {
                  
                    $scope.showEditableRow = {};
                  
                                           $scope.startIndex = $scope.datasource[0].start_index;
                        $scope.endIndex = $scope.datasource[0].end_index;
                    
                   

            if(Number($scope.endIndex) > Number($scope.datasource[0].total_records))
            {
                $scope.endIndex = $scope.datasource[0].total_records;
            }
            else
            {
               // $scope.endIndex = $scope.datasource[0].total_records;
            }
        
              
               
               
                        
    
                    
                   
                    $scope.reset();
                    $scope.setDataSource();
                    chkForColumnListActions();
                });
                /*********** Calculate the tabs in the tabledata if table contains tab*************/

                $scope.calculateTableTabs = function () {
                    var tabs = null;
                    var returnArray = null;
                    if ($scope.tabSeperatorKey) {
                        returnArray = new Array();
                        tabs = $filter('unique')($scope.datasource, $scope.tabSeperatorKey);
                        angular.forEach(tabs, function (items) {
                            if (items[$scope.tabSeperatorKey] && items[$scope.tabSeperatorKey].trim().length > 0) {
                                returnArray.push(items[$scope.tabSeperatorKey]);
                                if (!$scope.selectedRows[items[$scope.tabSeperatorKey]]) {
                                    $scope.selectedRows[items[$scope.tabSeperatorKey]] = {};
                                }
                            }

                        });
                        $scope.tabShown.currentTab = returnArray[0];
                    }

                    return returnArray;
                };
                /*********** to show the tab*************/

                $scope.showTab = function (tab) {
                    $scope.showEditableRow = {};
                    $scope.tabShown.currentTab = tab;
                    $scope.perTabData();
                    $scope.calculatePerPageData();

                };
                /*************If table doesn't contain tabs then assignment of table data***************/

                $scope.dataWithoutTab = function () {
                    $scope.pageNumber.currentPage = 1;
                    $scope.itemsPerPage.itemShown = perpageItemShown//10;
                    $scope.itemCountPerPage.startCount = 1;
                    $scope.particularTabData = $scope.datasource || [];
                    $scope.particularTabData = $filter('filter')($scope.particularTabData, $scope.searchTableData.value);
                    $scope.datacount = $scope.particularTabData.length;
                    $scope.particularTabData = $scope.particularTabData || [];
                    $scope.datacount = $scope.particularTabData.length;
                    if ($scope.datacount < $scope.itemsPerPage.itemShown) {
                        $scope.itemsPerPage.itemShown = $scope.datacount;
                        $scope.itemCountPerPage.endCount = $scope.datacount;
                    } else {
                        $scope.itemsPerPage.itemShown = perpageItemShown//10;
                        $scope.itemCountPerPage.endCount = endCount;

                    }
                    $scope.totalPages = Math.ceil($scope.datacount / $scope.itemsPerPage.itemShown) || 0;
                };
                /************ If table contain tabs then calculation of tab data*************/

                $scope.perTabData = function () {
                    $scope.pageNumber.currentPage = 1;
                    $scope.itemsPerPage.itemShown = perpageItemShown//10;
                    $scope.itemCountPerPage.startCount = 1;
                    $scope.particularTabData = $filter('byProp')($scope.datasource, $scope.tabSeperatorKey, $scope.tabShown.currentTab);
                    $scope.particularTabData = $filter('filter')($scope.particularTabData, $scope.searchTableData.value);
//                if (!$scope.datacount) {
//                }
                    $scope.particularTabData = $scope.particularTabData || [];
                    $scope.datacount = $scope.particularTabData.length;
                    if ($scope.datacount < $scope.itemsPerPage.itemShown) {
                        $scope.itemsPerPage.itemShown = $scope.datacount;
                        $scope.itemCountPerPage.endCount = $scope.datacount;
                    } else {
                        $scope.itemsPerPage.itemShown = perpageItemShown//10;
                        $scope.itemCountPerPage.endCount = endCount;
                    }
                    if($scope.particularTabData.length > 0){
                        $scope.columns = $filter('columnConfigurator')($scope.particularTabData[0].heading.toLowerCase());
                    }else{}
                                       $scope.totalPages = Math.ceil($scope.datacount / $scope.itemsPerPage.itemShown) || 0;
                };
                /********** Calculation of per page data in pagination to show on the table**********/

                $scope.calculatePerPageData = function () {
                    $scope.sortingObj = {
                        sortingColumn: '',
                        sortingType: null
                    };
                    $scope.shownTableData = $filter('pagination')($scope.particularTabData, $scope.pageNumber.currentPage, $scope.itemsPerPage.itemShown);
                };
                /**********runs when per page items shown are changed *********/

                $scope.perPageItemShown = function () {
                    $scope.pageNumber.currentPage = 1;
                    if ($scope.itemsPerPage.itemShown > $scope.particularTabData.length) {
                        $scope.itemsPerPage.itemShown = $scope.particularTabData.length;
                        $scope.itemCountPerPage.endCount = $scope.particularTabData.length;
                    }
                    $scope.calculatePerPageData();
                    $scope.totalPagesCalculator();
                };
                $scope.$watch(function () {
                    return $scope.searchTableData.value;
                }, function () {

                    if ($scope.tabSeperatorKey) {
                        $scope.perTabData();
                    } else {
                        $scope.dataWithoutTab();
                    }
                    $scope.perPageItemShown()

                });
                var sortTableData = function (columnName, sortType) {
                    var colName = columnName;
                    var dataArray = $scope.datasource;
                    dataArray.sort(function (a, b) {
                        var returnValue = 0;
                        switch (angular.isArray(a[colName])) {
                            case true:
                                if (a[colName].length > b[colName].length) {
                                    returnValue = sortType ? 1 : -1;
                                } else if (a[colName].length < b[colName].length) {
                                    returnValue = sortType ? -1 : 1;
                                }
                                break;
                            case false:
                                if (a[colName].toLowerCase() > b[colName].toLowerCase()) {
                                    returnValue = sortType ? 1 : -1;
                                } else if (a[colName].toLowerCase() < b[colName].toLowerCase()) {
                                    returnValue = sortType ? -1 : 1;
                                }
                                break;
                        }

                        return returnValue;
                    });
                    if ($scope.tabSeperatorKey) {
                        $scope.perTabData();
                    } else {
                        $scope.dataWithoutTab();
                    }

                    $scope.calculatePerPageData();
                };
                /**************** Sorting the table data***************/
                $scope.setSort = function (columnName, sortType) {
                    sortTableData(columnName, sortType)
//                    $scope.sortingObj.sortingColumn = columnName;
//                    $scope.sortingObj.sortingType = sortType;

                };
                /*************** Controls the tabledata actions**************/

                $scope.tableActionClick = function (functionName) {
                    var output = $scope.prepareReturnedData().slice();
//                if ($scope.dataUniqueKey == 'dmdataindex') {
//                    output = modifyObj.removeKey(output, $scope.dataUniqueKey);
//                }
                    $scope.$parent[functionName](output);
                };
                $scope.returnDataClick = function (functionName) {
                    if (typeof ($scope.datasource) == 'object') {
                        var firstKey = $scope.datasource[0];
                        if (firstKey['heading'].split('~')[0].toLowerCase() == 'select') {
                            var output = $scope.prepareReturnedData().slice();
                            $scope.$parent[functionName](output);
                        } else {
                            $scope.$parent[functionName]($scope.datasource);
                        }
                    } else {
                        $scope.$parent[functionName]($scope.datasource);
                    }
                };
                $scope.columnActionClick = function (columnName, dataObj) {
                    $scope.columnActions = $filter('objToLower')($scope.columnActions);
                    var actionArray = $filter('columnActionConfigurator')($scope.columnActions, 'column_name', columnName);
                    $scope.$parent[actionArray[0]['action_function']](dataObj);
                };
                /************* runs when page is changed in pagination*************/

                $scope.changePage = function (pageNumber) {
                    if (pageNumber > 0 && pageNumber <= $scope.totalPages) {
                        $scope.pageNumber.currentPage = pageNumber;
                        var dataStartIndex = Number(((pageNumber - 1) * $scope.itemsPerPage.itemShown));
                        var dataEndIndex = Number(dataStartIndex + $scope.itemsPerPage.itemShown);
                        $scope.itemCountPerPage.startCount = (dataStartIndex + 1);
                        if (dataEndIndex > $scope.particularTabData.length) {
                            $scope.itemCountPerPage.endCount = $scope.particularTabData.length;
                        } else {
                            $scope.itemCountPerPage.endCount = dataEndIndex;
                        }
                        $scope.calculatePerPageData();
                    } else if (pageNumber <= 0) {
                        $scope.pageNumber.currentPage = 1;
                        $scope.calculatePerPageData();
                    } else if (pageNumber > $scope.totalPages) {
                        $scope.pageNumber.currentPage = $scope.totalPages;
                        $scope.calculatePerPageData();
                    }
                };
                $scope.prepareReturnedData = function () {
                    var outputData = [];
                    //var caseCond=$scope.tabSeperatorKey?true:false;
                    switch (true) {
                        case $scope.tabSeperatorKey ? true : false:
                            angular.forEach($scope.selectedRows, function (tabObj) {
                                angular.forEach(tabObj, function (selectedRowsPage, key) {
                                    angular.forEach(selectedRowsPage, function (value, key) {
                                        if (value) {
                                            outputData.push($filter('byProp')($scope.datasource, $scope.dataUniqueKey, key)[0]);
                                        }
                                    });
                                });
                            });
                            break;
                        default :
                            angular.forEach($scope.selectedRows, function (selectedRowsPage, key) {
                                angular.forEach(selectedRowsPage, function (value, key) {
                                    if (value) {
                                        outputData.push($filter('byProp')($scope.datasource, $scope.dataUniqueKey, key)[0]);
                                    }
                                });
                            });
//                        angular.forEach($scope.selectedRows, function (value, key) {
//                            if (value) {
//                                outputData.push($filter('byProp')($scope.datasource, $scope.dataUniqueKey, key)[0]);
//                            }
//                        });
                            break;
                    }
                    return outputData;
                };
                /*********** calculate the brightness of theme color**********/

                $scope.getBrightness = function (themeColor) {
                    var r = parseInt(themeColor.substr(0, 2), 16);
                    var g = parseInt(themeColor.substr(2, 2), 16);
                    var b = parseInt(themeColor.substr(4, 2), 16);
                    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                    return (yiq >= 128) ? 'black' : 'white';
                };
                $scope.downLoadTableData = function (anchor, format) {
                    var columns = $filter('byProp')($scope.columns, 'columnType', 'text')
                    //alert($scope.tabShown.currentTab);
                    if ($scope.tabSeperatorKey) {
                        var data = $filter('byProp')($scope.datasource, $scope.tabSeperatorKey, $scope.tabShown.currentTab);
                    } else {
                        var data = $scope.datasource;
                    }
//                if ($scope.dataUniqueKey == 'dmdataindex') {
//                    data = modifyObj.removeKey(data, $scope.dataUniqueKey);
//                }
                    switch (format) {
                        case 'excel':
                            var string = prepareDwnldData.excelData(columns, data);
                            if (navigator.msSaveBlob) { // IE10
                                 return navigator.msSaveBlob(new Blob(),'data.xls');
                            } else 
                            {
                                anchor.target.download = "data.xls";
                                var hrefvalue = prepareDwnldData.uri.excel + prepareDwnldData.base64(string);
                                anchor.target.href = hrefvalue;
                            }
                            
                            break;
                        case 'csv':
                            var string = prepareDwnldData.csvData(columns, data);
                            if (navigator.msSaveBlob) { // IE10
                                 return navigator.msSaveBlob(new Blob([string]),'data.xls');
                            } else 
                            {
                                anchor.target.download = "data.xls";
                                var hrefvalue = prepareDwnldData.uri.excel + prepareDwnldData.base64(string);
                                anchor.target.href = hrefvalue;
                            }
                            break;
                        case 'pdf':
                            break;
                        default :
                    }
                };
                $scope.editRow = function (tableRow, editablePropData, index) {
                    var isEditable;
                    $scope.showEditableRow[index] ? isEditable = false : isEditable = true;
                    if ($scope.isDataEditable) {
                        if ($scope.editableProp == "all") {
                            $scope.showEditableRow[index] = isEditable;
                            angular.forEach(tableRow.currentTarget.children, function (item) {
                                if (item.attributes.style) {
                                    if (item.attributes.style.value != '') {
                                        item.focus();
                                        return;
                                    }

                                }
                            })
                        } else if (editablePropData.toLowerCase() == $scope.editableCondn) {
                            $scope.showEditableRow[index] = isEditable;
                            angular.forEach(tableRow.currentTarget.children, function (item) {
                                if (item.attributes.style) {
                                    if (item.attributes.style.value != '') {
                                        item.focus();
                                        return;
                                    }

                                }
                            })
                        }
                    }
                };
                $scope.initEditableFlag = function (index) {
                    $scope.showEditableRow[index] = false;
                }
                $scope.showUnEditableField = function (value, index) {
                    var showRow = false;
                    try {
                        if ($scope.editableCondn.toLowerCase() === value) {
                            if ($scope.showEditableRow[index] === false || !$scope.showEditableRow[index]) {
                                showRow = true;
                            }
                        } else {
                            showRow = true;
                        }
                    } catch (e) {
                        showRow = true;
                    }
                    return showRow;
                };
                $scope.showEditableField = function (value, index) {
                    var showRow = false;
                    if ($scope.isDataEditable) {
                        if ($scope.editableCondn.toLowerCase() === value) {
                            if ($scope.showEditableRow[index] === true) {
                                showRow = true;
                            }
                        } else {
                        }
                    }
                    return showRow;
                };
                $scope.isActionVisible = function (visibilityTabs) {
                    var isVisible = false;
                    if (!visibilityTabs) {
                        isVisible = true;
                    } else {
                        for (var i = 0, max = visibilityTabs.length; i < max; i++) {
                            if ($scope.tabShown.currentTab.toLowerCase() === visibilityTabs[i].toLowerCase()) {
                                isVisible = true;
                            }
                        }
                    }
                    return isVisible;
                };
                $scope.isAllRowSelected = {
                };
                $scope.chkForAllSelected = function () {
                    var isAllSelected = true;
                    switch (true) {
                        case $scope.tabSeperatorKey ? true : false:
                            var selectedRows = Object.keys($scope.selectedRows[$scope.tabShown.currentTab][$scope.pageNumber.currentPage]).length;
                            if (selectedRows === $scope.shownTableData.length) {
                                angular.forEach($scope.selectedRows[$scope.tabShown.currentTab][$scope.pageNumber.currentPage], function (value) {
                                    if (!value) {
                                        isAllSelected = false;
                                    }
                                });
                            } else {
                                isAllSelected = false;
                            }

                            $scope.isAllRowSelected[$scope.tabShown.currentTab][$scope.pageNumber.currentPage] = isAllSelected;
                            break;
                        default :
                            var selectedRows = Object.keys($scope.selectedRows[$scope.pageNumber.currentPage]).length;
                            if (selectedRows === $scope.shownTableData.length) {
                                angular.forEach($scope.selectedRows[$scope.pageNumber.currentPage], function (value) {
                                    if (!value) {
                                        isAllSelected = false;
                                    }
                                });
                            } else {
                                isAllSelected = false;
                            }
                            $scope.isAllRowSelected[$scope.pageNumber.currentPage] = isAllSelected;
                    }

//                var selectedRows = Object.keys($scope.selectedRows[$scope.pageNumber.currentPage]).length;
//                if (selectedRows === $scope.shownTableData.length) {
//                    angular.forEach($scope.selectedRows[$scope.pageNumber.currentPage], function (value) {
//                        if (!value) {
//                            isAllSelected = false;
//                        }
//                    });
//                } else {
//                    isAllSelected = false;
//                }

                };
                $scope.selectAll = function () {
                    switch (true) {
                        case $scope.tabSeperatorKey ? true : false:
                            angular.forEach($scope.shownTableData, function (data) {
                                $scope.selectedRows[$scope.tabShown.currentTab][$scope.pageNumber.currentPage] = $scope.selectedRows[$scope.tabShown.currentTab][$scope.pageNumber.currentPage] || {};
                                $scope.selectedRows[$scope.tabShown.currentTab][$scope.pageNumber.currentPage][data[$scope.dataUniqueKey]] = $scope.isAllRowSelected[$scope.tabShown.currentTab][$scope.pageNumber.currentPage];
                            });
                            break;
                        default :
                            angular.forEach($scope.shownTableData, function (data) {
                                $scope.selectedRows[$scope.pageNumber.currentPage] = $scope.selectedRows[$scope.pageNumber.currentPage] || {};
                                $scope.selectedRows[$scope.pageNumber.currentPage][data[$scope.dataUniqueKey]] = $scope.isAllRowSelected[$scope.pageNumber.currentPage];
                            });
                            break;
                    }
                };
                $scope.refreshTable = function (methodName) {
                    $scope.$parent[methodName]($scope.datasource);
                };
                $scope.reset = function () {
                    $scope.tabShown = {
                        currentTab: null
                    };
                    $scope.itemCountPerPage = {
                        'startCount': 1,
                        'endCount': endCount
                    };
                    $scope.searchTableData = {
                        value: ''
                    };
                    $scope.selectedRows = {};
                    $scope.dataUniqueKey = null;
                    $scope.isAllRowSelected = {};

                };
                $scope.isPageNumberEditable = false;
                $scope.chkForPageNumberEdit = function () {
                    if ($scope.isPageNumberEditable) {
                        $scope.isPageNumberEditable = false;
                    } else {
                        $scope.isPageNumberEditable = true;
                    }
                };
                $scope.isTableActionVisible = function (actionObj) {
                    var returnValue = false;
                    var columns = $scope.columns;
                    var visibility = actionObj['visibility'];
                    if (visibility) {
                        switch (visibility.toLowerCase()) {
                            case 'cb':
                                angular.forEach(columns, function (columnObj) {
                                    if (columnObj.columnType == 'checkbox') {
                                        returnValue = true;
                                    }
                                });
                                break;
                            default :
                        }

                    } else {
                        returnValue = true;
                    }
                    return returnValue;
                };
                /*
                 * table cell action
                 */
                $scope.toggleColumnList = function () {
                    $scope.columnObj.columnListShown = $scope.columnObj.columnListShown ? false : true;
                };
            },
            link: function (scope, element, attrs) {
                /*if(scope.returnCurrentData){
                 scope.returnCurrentDataMethod=scope.returnCurrentData.method;
                 scope.returnCurrentDataTitle=scope.returnCurrentData.title;
                 scope.returnDataActionVisibilty=scope.returnCurrentData.showOnTab;
                 scope.isDataActionVisible=false;
                 if(!scope.returnDataActionVisibilty){
                 scope.isDataActionVisible=true;
                 }
                 else{
                 scope.isDataActionVisible={};
                 for (var i = 0, max = scope.returnDataActionVisibilty.length; i < max; i++) {
                 scope.isDataActionVisible[scope.returnDataActionVisibilty[i]]=true;
                 }
                 //alert(JSON.stringify(scope.isDataActionVisible));
                 }
                 
                 }*/
                scope.isDataEditable = false;
                var actionCellTitlesArr = [];
                if (scope.dmActionCellTitle) {
                    actionCellTitlesArr = scope.dmActionCellTitle.split('~');
                }
                //console.log(scope.dmActionCellTitle);
                scope.showEditableRow = {};
                if (scope.editableProp) {
                    if (scope.editableProp.toLowerCase() === "all" || scope.editableCondn) {
                        scope.isDataEditable = true;
                    } else {
                        // console.log("data not editable because editable condition is missing");
                    }
                }
                var tableCellActionFn = $parse(scope.dmCellAction);
                scope.tableCellAction = tableCellActionFn(element.scope());
                scope.isTextUnderLine = function (col, value) {
                    var returnValue = false;
                    if (scope.dmCellAction) {
                        if (actionCellTitlesArr.length == 0) {
                            returnValue = true;
                            if (!isNaN(value)) {
                                if (Number(value) > 0) {
                                    returnValue = true;
                                } else {
                                    returnValue = false;
                                }
                            } else {
                                returnValue = false;
                            }
                        } else {
                            if (actionCellTitlesArr.indexOf(col) > -1) {
                                returnValue = true;
                            }
                        }

                    }
                    return returnValue;
                };
            }
        };
    }]);
dmCommonApi.directive('dmScrollableList', [function () {
        return {
            restrict: 'E',
            templateUrl: 'commonFilters/dmScrollableList.html',
            scope: {
                listsArray: "=dmLists"
            },
            controller: function ($scope) {

            },
            link: function (scope, element, attrs) {
                scope.$watch(scope.listsArray, function () {
                    scope.setInitialData();
                });
                scope.setInitialData = function () {

                };
                /****************Left Scrolling******************/
                scope.Timer = null;
                scope.clear = function () {
                    clearInterval(scope.Timer);
                };
                scope.onLeftScroll = function () {
                    var container = element[0].children[1].children[1];
                    var lists = container.children[0];
                    var scrollableWidth = lists.children[0].offsetWidth;
                    container.scrollLeft = container.scrollLeft - scrollableWidth;
                    //scope.Timer = setInterval(container.scrollLeft -= 10, 15);
                };
                /********************Right Scrolling***********************/
                scope.onRightScroll = function () {
                    var container = element[0].children[1].children[1];
                    var lists = container.children[0];
                    var scrollableWidth = lists.children[0].offsetWidth;
                    container.scrollLeft = container.scrollLeft + scrollableWidth;
                };
                /****************List item Click Action ***************/
                scope.dmListClick = function (functionName) {
                    scope.$parent[functionName]();
                };
                scope.isListAvailable = function (listArray) {
                    var isVisible = false;
                    if (listArray && listArray.length > 0) {
                        isVisible = true;
                    }
                    ;
                    return isVisible;
                };
            }
        };
    }]);
dmCommonApi.service('dmDialogueBox', ['$q', '$timeout', function ($q, $timeout) {
        var dialogueBox = this;
        dialogueBox.dialogueCtrls = {};
        dialogueBox.initialize = function () {
            dialogueBox.dialogueCtrls = {
                title: '',
                message: '',
                actionLabel: [],
                isShown: false,
                messageType: '',
                type: ''
            };
            dialogueBox.deferObj = null;
        };
        dialogueBox.deferObj = null;
        dialogueBox.timerForToast = null;
        dialogueBox.alertBox = function (config) {
            //function to show custom alert box
            //config syntax: Object {title: header of the alertbox,message: message to be displayed, actionLabel: Array of buttons}
            dialogueBox.deferObj = $q.defer();
            var dialogueType = 'alert';
            var title = config.title ? config.title : 'Alert Box';
            var message = config.message;
            var messageType = config.messageType ? config.messageType : 'general';
            var actionLabel = (config.actionlabel && config.actionlabel.length > 0) ? config.actionlabel : ['Ok'];
            dialogueBox.setControls(title, message, actionLabel, dialogueType, messageType);
            return dialogueBox.deferObj.promise;
        };
        dialogueBox.setReturn = function (data) {
            dialogueBox.deferObj.resolve(data);
        };
        dialogueBox.confirmBox = function (config) {
            dialogueBox.deferObj = $q.defer();
            var dialogueType = 'confirm';
            var title = config.title ? config.title : 'Confirm Box';
            var message = config.message;
            var messageType = config.messageType ? config.messageType : 'general';
            var actionLabel = (config.actionlabel && config.actionlabel.length) > 0 ? config.actionlabel : ['Cancel', 'Ok'];
            dialogueBox.setControls(title, message, actionLabel, dialogueType, messageType);
            return dialogueBox.deferObj.promise;
        };
        dialogueBox.toastBox = function (config) {
            dialogueBox.deferObj = $q.defer();
            var dialogueType = 'toast';
            var title = config.title ? config.title : 'Toast Box';
            var message = config.message;
            var messageType = config.messageType ? config.messageType.toLowerCase() : 'general';
            var actionLabel = (config.actionlabel && config.actionlabel.length) > 0 ? config.actionlabel : ['Cancel', 'Ok'];
            dialogueBox.setControls(title, message, actionLabel, dialogueType, messageType);
            dialogueBox.persistToastBox();
            dialogueBox.reinitializeToastBox();
            return dialogueBox.deferObj.promise;
        };
        dialogueBox.reinitializeToastBox = function () {
            //$timeout.cancel(dialogueBox.timerForToast);
            dialogueBox.timerForToast = $timeout(function () {
                dialogueBox.deferObj.resolve(true);
                dialogueBox.hideDialogue()
            }, 3000);
        };
        dialogueBox.persistToastBox = function () {
            $timeout.cancel(dialogueBox.timerForToast);
        };
        dialogueBox.hideToastBox = function () {
            $timeout.cancel(dialogueBox.timerForToast);
            dialogueBox.setReturn(true);
            dialogueBox.hideDialogue();
        };
        dialogueBox.setControls = function (title, message, actionLabel, dialogueType, messageType) {
            dialogueBox.dialogueCtrls.title = title;
            dialogueBox.dialogueCtrls.message = message;
            dialogueBox.dialogueCtrls.actionLabel = actionLabel;
            dialogueBox.dialogueCtrls.isShown = true;
            dialogueBox.dialogueCtrls.type = dialogueType;
            dialogueBox.dialogueCtrls.messageType = messageType.toLowerCase();
        };
        dialogueBox.getControls = function () {
            return dialogueBox.dialogueCtrls;
        };
        dialogueBox.hideDialogue = function () {
            dialogueBox.initialize();
        };
        dialogueBox.initialize();
    }]);
dmCommonApi.directive('dmDialogue', [function () {
        return {
            restrict: 'E',
            templateUrl: 'commonFilters/dmDialogues.html',
            scope: {
                themeColor: "@dmTheme"
            },
            controller: function ($scope, dmDialogueBox, $sce) {
                $scope.dmDialogueBox = dmDialogueBox;
                $scope.dialogueCtrls = null;
                $scope.actionItemHover = new Object();
                $scope.$watch(function () {
                    return dmDialogueBox.getControls();
                }, function (newValue) {
                    $scope.dialogueCtrls = newValue;
                    try {
                        $scope.dialogueCtrls.message = $sce.trustAsHtml($scope.dialogueCtrls.message);
                    } catch (e) {

                    }
                    $scope.actionWidth = (100 / $scope.dialogueCtrls.actionLabel.length) + '%';
                }, true);
                $scope.dialogueColor = {
                    error: {
                        'color': '#a94442',
                        'background': '#ebccd1',
                        'border-color': '#f2dede'
                    },
                    success: {
                        'color': '#3c763d',
                        'background': '#dff0d8',
                        'border-color': '#d6e9c6'
                    },
                    warning: {
                        'color': '#8a6d3b',
                        'background': '#fcf8e3',
                        'border-color': '#faebcc'
                    },
                    general: {
                    }
                };
                $scope.reInitializeToast = function () {
                    //console.log('hi');
                    $scope.dmDialogueBox.reinitializeToastBox();
                };
                $scope.persistToast = function () {
                    $scope.dmDialogueBox.persistToastBox();
                }
                $scope.actionClick = function (actionIndex) {

                    switch ($scope.dialogueCtrls.type.toLowerCase()) {
                        case 'alert':
                            switch (true) {
                                case actionIndex == 0 :
                                    dmDialogueBox.setReturn(true);
                                    break;
                                default :
                                    dmDialogueBox.setReturn(true);
                                    break;
                            }
                            break;
                        case 'confirm':
                            switch (true) {
                                case actionIndex == 0:
                                    dmDialogueBox.setReturn(false);
                                    break;
                                case actionIndex == 1:
                                    dmDialogueBox.setReturn(true);
                                    break;
                                default :
                                    dmDialogueBox.setReturn(false);
                                    break;
                            }
                            break;
                        case 'toast':
                        switch (true) {
                            default :
                                dmDialogueBox.hideToastBox();
                        }
                    }
                    $scope.dmDialogueBox.hideDialogue();
                };
            },
            link: function (scope, element, attrs) {

            }

        };
    }]);
dmCommonApi.directive('searchlist', ['$filter','$rootScope', '$parse', function ($filter, $parse,$rootScope) {
        return {
            restrict: "E",
            require: '?ngModel',
            scope: {
                itemaction: '&',
                buttonaction: '&',  
                themecolor: '@',
                textboxStyle: '@'
            },
            templateUrl: 'commonFilters/searchList.html',
            link: function (scope, element, attrs, ngModel) {
                console.log(attrs);
                //console.log(scope);
                // console.log(element);
                // console.log(ngModel);
                scope.isDisabled = false;
                scope.windowHeight = window.innerHeight;
                scope.bodyRect = document.body.getBoundingClientRect();
                scope.isListInverse = false;
                //alert(JSON.stringify(scope.stylefn))
                scope.returnValueType = attrs.modeltype;
//                var itemListGetter = $parse(attrs.itemlist);
//                scope.$watch(function (){
//                    return itemListGetter(element.scope())
//                },function (newValue){
//                    if (attrs.hasOwnProperty('dmDisabled') && attrs.dmDisabled != '') {
//                        scope.isDisabled = JSON.parse(attrs.dmDisabled);
//                    }
//
////                    newValue = JSON.parse(newValue);
//                    if (newValue && newValue.length > 0) {
//                        //newValue = JSON.parse(newValue);
//
//                        scope.itemlist = newValue;
//                    } else {
//                        //scope.itemlist = newValue;
//                        scope.itemlist = null;
//                        ngModel.$setViewValue('');
//                    }
//                });
                scope.$watch(function () {
                   //[] console.log(attrs.itemlist);
                    return attrs.itemlist;
                }, function (newValue) {
                    if (attrs.hasOwnProperty('dmDisabled') && attrs.dmDisabled != '') {
                        scope.isDisabled = JSON.parse(attrs.dmDisabled);
                    }

//                    newValue = JSON.parse(newValue);
                    if (newValue && (newValue = JSON.parse(newValue)) && newValue.length > 0) {

                        //newValue = JSON.parse(newValue);

                        scope.itemlist = newValue;
                    } else {
                        //scope.itemlist = newValue;
                        scope.itemlist = null;
                        ngModel.$setViewValue('');
                    }
                    //ngModel.$setViewValue('');
                    //scope.searchListInputModel = ngModel.$viewValue[scope.itemDescription];
                    //scope.textBoxWidth = element[0].children[2].children[0].offsetWidth + "px"
                    //scope.listMargin = element[0].children[2].children[0].clientHeight + "px"
                });
                scope.$watch(function () {
                    return ngModel.$viewValue;
                }, function (newValue) {
                    if (newValue) {
                        //scope.setViewValue(newValue);
                        var type = Object.prototype.toString.call(newValue);
                        if (type == '[object Object]') {
                            scope.searchListInputModel = newValue[scope.itemDescription];
                        } else {
                            var selectedObj = $filter('byProp')(scope.itemlist, scope.itemValue, newValue)
                            try {
                                scope.searchListInputModel = selectedObj[0][scope.itemDescription];
                            } catch (e) {

                            }
                        }
                    } else {
                        if (!scope.itemlist || scope.itemlist.length <= 0) {
                            scope.searchListInputModel = '';
                        }
                        scope.searchListInputModel = '';
                        // to clear input field on backspace of a selected value
                    }
                });
                scope.$watch("isListOpen", function () {
                    scope.elementRect = element[0].getBoundingClientRect();
                    scope.offset = scope.elementRect.top - scope.bodyRect.top;
                    //scope.offset = element[0].offsetTop;
                    var css = window.getComputedStyle(element[0].children[2].children[1]);
                    //var autoCompleteHeight = Number(css['maxHeight'].toString().split('p')[0]);
                    var autoCompleteHeight = Number(css['maxHeight'].replace('px', ''));
                    var elementOffset = autoCompleteHeight + scope.offset;
                    if (scope.windowHeight < elementOffset) {
                        scope.isListInverse = true;
                    } else {
                        scope.isListInverse = false;
                    }
                    scope.textBoxWidth = element[0].children[2].children[0].offsetWidth + "px"
                });
                //scope.textBoxWidth = element[0].children[2].children[0].offsetWidth + "px"
                scope.entityValueData=null;
                scope.fromDate="";
                scope.selectedItem = null;
                scope.placeholder = attrs.placeholder;
                scope.itemValue = attrs.itemvalue;
                scope.itemDescription = attrs.itemdesc;
                scope.title = attrs.label;
                if (attrs.actiontitle && attrs.actiontitle.length > 0) {
                    scope.buttonTitle = attrs.actiontitle;
                    scope.isButton = true;
                } else {
                    scope.isButton = false;
                }
                scope.isListOpen = true;
                scope.showList = function () {

                };
                scope.hideList = function () {

                };

               
                
               
                scope.itemClick = function (item) {
                 
                        scope.setViewValue(item);
               
//                scope.selectedItem = {
//                        value: val,
//                        name: desc
//                    };
                   
//                if (scope.returnValueType && scope.returnValueType.toLowerCase() == 'value') {
//                    ngModel.$setViewValue(item[scope.itemValue]);
//                    scope.searchListInputModel = ngModel.$viewValue;
//                } else {
//                    ngModel.$setViewValue(item);
//                    scope.searchListInputModel = ngModel.$viewValue[scope.itemDescription];
//                }
                    //scope.$apply();
//                if (scope.itemaction) {
//                    scope.selectedItem = {
//                        value: val,
//                        name: desc
//                    };
                    //scope.itemaction()(val, desc);
                    //               }

                };
                scope.buttonClick = function () {
                    console.log("77777777777777");
                    if (scope.buttonaction) {
                        console.log(scope.buttonaction);
                        console.log("8888888888");
                        scope.buttonaction()()
                    }
                };
                scope.callOnChange = function () {
                   
                   var modelValue = '';
                   console.log("&&&&&&&&&&&&&&");
                   scope.showSearchBy="false";
                   
    //    var toDate=$scope.toDate;
    //     var fromTime=$scope.fromTime;
    //     var toTime=$scope.toTime;
                    angular.forEach(scope.itemlist, function (item) {
                       if (item[scope.itemDescription].toLowerCase() === scope.searchListInputModel.toLowerCase()) {
                            modelValue = item;
                        }
                    });
                    //ngModel.$setViewValue(modelValue);
                    scope.setViewValue(modelValue);
//                if(scope.searchlistChange){
//                    scope.searchlistChange()();
//                }
                };
                

                scope.setViewValue = function (value) {

               
                   // console.log(value);

                    if (scope.returnValueType && scope.returnValueType.toLowerCase() == 'value') {
                        if (!value && scope.searchListInputModel && scope.searchListInputModel.length > 0) {
                            ngModel.$setViewValue('');
                        } else {
                            ngModel.$setViewValue(value[scope.itemValue]);
                            scope.searchListInputModel = value[scope.itemDescription];
                        }

                    } else {
                        if (!value && scope.searchListInputModel && scope.searchListInputModel.length > 0) {
                            //ngModel.$setViewValue(scope.searchListInputModel)
                            ngModel.$setViewValue(value);
                        } else {
                            ngModel.$setViewValue(value);
                        }
                        //scope.searchListInputModel = ngModel.$viewValue[scope.itemDescription];
                    }
                };
                scope.$watch('selectedItem', function () {
                    scope.callOnChange();
                });
            },
//        link: function (scope, element, attrs, ngModel) {
//            scope.$watch(function () {
//                return attrs.itemlist;
//            }, function (newValue) {
//                if (attrs.itemlist) {
//                    scope.itemlist = JSON.parse(attrs.itemlist);
//                    scope.textBoxWidth = element[0].children[2].children[0].offsetWidth + "px"
//                    scope.listMargin=element[0].children[2].children[0].offsetHeight +1;
//                    scope.listMargin+="px"
//
//                } else {
//                    ngModel.$setViewValue('');
//                }
//                //ngModel.$setViewValue('');
//                //   scope.searchListInputModel = ngModel.$viewValue[scope.itemDescription];
//
//            });
//            scope.$watch(function () {
//                return ngModel.$viewValue;
//            }, function (newValue) {
//                if (newValue) {
//                    scope.searchListInputModel = newValue[scope.itemDescription];
//
//                } else {
//                    scope.searchListInputModel = '';
//                }
//            });
////            scope.$watch("isListOpen", function () {
////                if(attrs.itemlist){
////                scope.itemlist = JSON.parse(attrs.itemlist);
////                scope.searchListInputModel=ngModel.$viewValue[scope.itemDescription];
////
////                }
////                scope.textBoxWidth = element[0].children[2].children[0].offsetWidth + "px"
////
////            });
//            //scope.textBoxWidth = element[0].children[2].children[0].offsetWidth + "px"
//
//            scope.selectedItem = null;
//            scope.placeholder = attrs.placeholder;
//            scope.itemValue = attrs.itemvalue;
//            scope.itemDescription = attrs.itemdesc;
//
//            scope.title = attrs.title;
//            if (attrs.actiontitle && attrs.actiontitle.length > 0) {
//                scope.buttonTitle = attrs.actiontitle;
//                scope.isButton = true;
//            } else {
//                scope.isButton = false;
//            }
//            scope.isListOpen = true;
//            scope.showList = function () {
//
//            };
//            scope.hideList = function () {
//
//            };
//            scope.itemClick = function (item) {
////                scope.selectedItem = {
////                        value: val,
////                        name: desc
////                    };
//                ngModel.$setViewValue(item);
//                scope.searchListInputModel = ngModel.$viewValue[scope.itemDescription];
//                //scope.$apply();
////                if (scope.itemaction) {
////                    scope.selectedItem = {
////                        value: val,
////                        name: desc
////                    };
//                //scope.itemaction()(val, desc);
//                //               }
//
//            };
//            scope.buttonClick = function () {
//                if (scope.buttonaction) {
//                    scope.buttonaction()()
//                }
//            };
//            scope.callOnChange = function () {
//                var modelValue = '';
//                angular.forEach(scope.itemlist, function (item) {
//                    if (item[scope.itemDescription].toLowerCase() === scope.searchListInputModel.toLowerCase()) {
//                        modelValue = item;
//                    }
//
//                });
//                ngModel.$setViewValue(modelValue);
////                if(scope.searchlistChange){
////                    scope.searchlistChange()();
////                }
//            };
//            scope.$watch('selectedItem', function () {
//                scope.callOnChange();
//            });
//
//        },
            controller: ['$scope', '$filter', function ($scope, $filter, $attr) {
                    //alert($attr.textboxStyle)
                    $scope.searchlistItemHover = {};
                    $scope.stylefn = function () {
                        var newStyle = $scope.$eval($scope.textboxStyle);
                        return newStyle;
                    }
                    $scope.getInputBoxWidth = function (elementObj) {
                        var returnStyle = {
                            width: ""
                        };
                        //angular.element(elementObj).pa
                    };
                    $scope.setHover = function (index) {
                        $scope.searchlistItemHover[index] = true;
                    };
                    $scope.unsetHover = function (index) {
                        $scope.searchlistItemHover[index] = false;
                    }
                    $scope.getHoverStyle = function (index) {
                        var hoverStyle = new Object();
                        $scope.searchlistItemHover[index] ? hoverStyle = {background: '#' + $scope.themecolor, color: '#ffffff'} : hoverStyle = {background: '#ffffff', color: '#' + $scope.themecolor};
                        return hoverStyle;
                    };
                }]
        };
    }]);
dmCommonApi.directive('dmFocus', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            link: function (scope, element, attrs) {
                var model = $parse(attrs.dmFocus);
                scope.$watch(model, function (value) {
                    // console.log('value=', value);
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    }]);
dmCommonApi.directive('dmTimePicker', ['$filter', function ($filter) {
        return {
            restrict: "E",
            require: '?ngModel',
            scope: {
                themecolor: '@',
                textboxStyle: '@'
            },
            templateUrl: 'commonFilters/dmTimePicker.html?' + new Date(),
            link: function (scope, element, attrs, ngModelCtrl) {
                scope.stylefn = function () {
                    var newStyle = scope.$eval(scope.textboxStyle);
                    //console.log("new:\n" + JSON.stringify(newStyle));
                    return newStyle;
                }
                scope.setTime = function () {
                    //   console.log("here")
                    //  console.log($filter("toNDigits")(scope.hourPickerModel, 2) + ":" + $filter("toNDigits")(scope.minutesPickerModel, 2))
                    scope.timePickerModel = $filter("toNDigits")(scope.hourPickerModel, 2) + ":" + $filter("toNDigits")(scope.minutesPickerModel, 2);
                    //console.log(scope.timePickerModel);
                    ngModelCtrl.$setViewValue(scope.timePickerModel);
                    ngModelCtrl.$setDirty();
                    //ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
                };
                scope.windowHeight = window.innerHeight;
                scope.isPickerInverse = false;
                scope.isPickingTime = null;
                scope.timePickerModel;
                //console.log(ngModelCtrl.$viewValue)
                if (ngModelCtrl.$viewValue) {
                    //console.log(ngModelCtrl.$viewValue)
                }
                scope.$watch(function () {
                    return ngModelCtrl.$viewValue

                }, function (newModelValue) {
                    //  console.log("hi"+newModelValue)
                    if (newModelValue && newModelValue.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/gi)) {
                        newModelValue = newModelValue.split(":");
                        scope.hourPickerModel = newModelValue[0];
                        scope.minutesPickerModel = newModelValue[1];
                    } else {
                        scope.hourPickerModel = 00;
                        scope.minutesPickerModel = 00;
                    }
                    scope.setTime();
                });
                scope.hourPickerModel = 00;
                scope.minutesPickerModel = 00;
                //scope.setTime()
                ngModelCtrl.$setViewValue(scope.timePickerModel);
                scope.isPickerOpen = false;
                scope.isPickingHour = null;
                scope.isPickingMinutes = null;
                var pickerBox = element[0].childNodes[5];
                scope.onTimepickerFocus = function () {
                    if (scope.isPickingTime === null) {
                        scope.isPickingTime = true;
                    }
                    scope.offset = element[0].offsetTop;
                    var css = window.getComputedStyle(pickerBox);
                    var pickerHeight = Number(css['height'].replace('px', ''));
                    var elementOffset = pickerHeight + scope.offset;
                    if (scope.windowHeight < elementOffset) {
                        scope.isPickerInverse = true;
                    } else {
                        scope.isPickerInverse = false;
                    }
                    scope.isPickerOpen = true;
                };
                scope.onTimepickerBlur = function () {
                    if (scope.isPickingTime) {
                    } else {
                        scope.isPickerOpen = false;
                    }
                };
                scope.onMouseLeave = function () {
                    if (scope.isPickingTime !== null) {
                        scope.isPickingTime = false;
                        scope.$apply();
                    }
                };
                scope.onMouseEnter = function () {
                    if (scope.isPickingTime !== null) {
                        scope.isPickingTime = true;
                    }
                };
                pickerBox.addEventListener("mouseenter", scope.onMouseEnter);
                pickerBox.addEventListener("mouseleave", scope.onMouseLeave);
                scope.timeHrData = [];
                for (var i = 0; i < 24; i++) {
                    var hrVal = $filter('toNDigits')(i, 2);
                    var hrObj = {
                        id: hrVal,
                        value: hrVal
                    };
                    scope.timeHrData.push(hrObj);
                }
                scope.timeMinData = [];
                var minVal;
                var minId;
                for (var i = 0; i < 60; i++) {

                    if (i % 5 == 0) {
                        minVal = $filter('toNDigits')(i, 2);
                    } else {
                        minVal = "."
                    }
                    minId = $filter('toNDigits')(i, 2);
                    var minObj = {
                        id: minId,
                        value: minVal
                    };
                    scope.timeMinData.push(minObj);
                }

            },
            controller: ['$scope', '$filter', function ($scope, $filter, $attr) {
//                $scope.stylefn = function () {
//                    var newStyle = $scope.$eval($scope.textboxStyle);
//                    return newStyle;
//                }
//                $scope.minTransformStyle = function (index) {
//                    var returnStyle = {
//                        "transform": ""
//                    }
//                    if(index%5===0){
//                        var x=75
//                        returnStyle.transform='rotate(' + index * 6 + 'deg) translate('+x+'px) rotate(' + (90 - index * 6) + 'deg)'
//                    }else{
//                        returnStyle.transform='rotate(' + index * 6 + 'deg) translate(75px) rotate(' + (90 - index * 6) + 'deg)'
//                    }
//                    console.log(JSON.stringify(returnStyle));
//                    return returnStyle;
//                }
                }]
        };
    }]);
dmCommonApi.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
//dmCommonApi.directive('dmLoader', [function () {
//        return {
//            restrict: 'E',
//            templateUrl: 'commonFilters/dmLoader.html',
//        };
//    }]);


dmCommonApi.factory('formValidityPrvdr', ['$filter', function ($filter) {
        var formsCtrl = {};
        var form;
        return {
            chkForFormValid: function (formCtrl) {
                // console.log(formCtrl);
                var errorMessages = '';
                form = formCtrl;
                var returnValue = {
                    isInvalid: false,
                    errorMessages: '',
                    inputCtrls: {}
                };
                angular.forEach(formCtrl, function (item) {
                    var itemType = Object.prototype.toString.call(item);
                    if (itemType == '[object Object]') {
                        if (item.hasOwnProperty('$modelValue')) {
                            returnValue.inputCtrls[item['$name']] = {
                                isInvalid: false,
                                errorMessage: ''
                            };
                            if (item['$error']['isError'] && item['$error']['isVisible']) {
                                if (item['$untouched'] && item['$modelValue']) {
                                    returnValue.inputCtrls[item['$name']]['isInvalid'] = true;
                                } else if (item['$untouched']) {
                                    returnValue.inputCtrls[item['$name']]['isInvalid'] = false;
                                } else {
                                    returnValue.inputCtrls[item['$name']]['isInvalid'] = true;
                                }
//                                returnValue.inputCtrls[item['$name']]['isInvalid'] = item['$untouched'] ? false : true;


                                returnValue.inputCtrls[item['$name']]['errorMessage'] = item['$error']['errorMessage'];
                                returnValue.isInvalid = true;
                                returnValue.errorMessages = returnValue.errorMessages + item['$error']['errorMessage'] + '\n';
                            }
                        }
                    }
                });
//                console.log(JSON.stringify(returnValue));
                return returnValue;
            },
            addCtrlsToForm: function (formName, inputCtrl) {
                formsCtrl[formName] = formsCtrl[formName] || {};
                var controlName = inputCtrl.$name;
                formsCtrl[formName][controlName] = inputCtrl;
                //console.log(formsCtrl);
            },
            setFormError: function (formName) {
                var errorObj = form.$error.required;
                var inputCtrl;
                if (errorObj) {
                    for (var i = 0; i < errorObj.length; i++) {
                        if (errorObj[i]['$name'] == formName) {
                            if (errorObj[i]) {
                                inputCtrl = errorObj[i];
                                inputCtrl['$error']['errorMessage'] = '';
                                inputCtrl['$error']['isError'] = false;
                            }
                        }
                    }

                }
            }
        };
    }]);
dmCommonApi.directive('validate', ['formValidityPrvdr', '$parse', '$filter', '$rootScope', function (formValidityPrvdr, $parse, $filter, $rootScope) {
        return {
            restrict: 'A',
            require: 'ngModel',
//            scope: {
//                formValues: '=formvalues'
//            },

            //templateUrl: 'validationApi/validationTemplate.html',
            link: function (scope, element, attrs, ngModelCtrl) {
                //console.log(attrs)
//                console.log(attrs.formvalues);
                var parentForm = ngModelCtrl.$$parentForm.$name;
                // console.log(parentForm);
//            angular.forEach(ngModelCtrl.$$parentForm,function (item,key){
//               console.log(key+'  '+Object.prototype.toString.call(item)); 
//            });
                var controlName = ngModelCtrl.$name;
                formValidityPrvdr.addCtrlsToForm(parentForm, ngModelCtrl);
                //console.log(formValidityPrvdr);
//                var validationObj = scope.validationObj;
//                validationObj = validationObj;
                var validationObjFn = $parse(attrs.validate);
                var formInputs = $parse(attrs.formvalues)(element.scope());
                // console.log(controlName,formInputs)
                var validationObj = validationObjFn(scope);
                var formId = validationObj['form_id'];
                var parameterName = validationObj['param_name'];
                var dataType = validationObj['data_type'].toLowerCase();
                var validationType = validationObj['textbox_type'].toLowerCase() || dataType;
                var maxLength = Number(validationObj['max_length']) || '';
                var minLength = Number(validationObj['min_length']) || '';
                var mandatory = validationObj['mandatory'] || '';
                var maxValue = validationObj['max_value'] || '';
                var minValue = validationObj['min_value'] || '';
                mandatory = mandatory.toLowerCase() == 'y' ? true : false;
                //validationType = validationType == 'n' ? 'number' : validationType;
                //validationType = validationType == 'phone' ? 'mobile' : validationType;
                //scope.validationType = attrs.validate.toLowerCase();
//            angular.element('body').append('validationApi/validationTemplate.html');
//            element[0].className = element[0].className + ' toolTipLeft';

//                var validationConfig = {
//                    text: {
//                        text: {
//                            regex: /^[a-zA-Z\s]*$/gi,
//                            errorMessage: 'Only alphabets are allowed'
//                        },
//                        number: {
//                            regex: /^[0-9]*$/gi,
//                            errorMessage: ''
//                        },
//                        name: {
//                            regex: /^[A-Za-z\.]*$/gi,
//                            errorMessage: ''
//                        },
//                        alphanum: {
//                            regex: '',
//                            keyCodeArray: ''
//                        },
//                        mobile: {
//                            regex: /^[6-9]{1}[0-9]{9}/gi,
//                            errorMessage: 'Not a valid mobile number'
//                        },
//                        phone: {
//                            regex: /^[6-9]{1}[0-9]{9}/gi,
//                            errorMessage: 'Not a valid mobile number'
//                        },
//                        email: {
//                            regex: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/gi,
//                            errorMessage: 'Not a valid email id'
//                        },
//                        password: {
//                        }
//                    },
//                    textarea: {
//                        textarea: {
//                            regex: /^[A-Za-z0-9\s\.\-\/,@#]*$/gi,
//                            errorMessage: ''
//                        },
//                        ta: {
//                            regex: /^[A-Za-z0-9\s\.\-\/,@#]*$/gi,
//                            errorMessage: ''
//                        }
//                    },
//                    select: {
//                        select: {
//                            regex: '',
//                            errorMessage: ''
//                        }
//                    },
//                    cb: {
//                        cb: {
//                            regex: '',
//                            errorMessage: ''
//                        }
//                    },
//                    rb: {
//                        rb: {
//                            regex: '',
//                            errorMessage: ''
//                        }
//                    }
//                };
                var regex = '';
                var errorMessage = '';
                var checkOnBlur = false;
                var getValidationConfig = function () {
                    switch (dataType) {
                        case 'text':
                            switch (validationType) {
                                case 'alpha':
                                    regex = /^[a-zA-Z\s]*$/gi;
                                    break;
                                case 'number':
                                case 'n':
                                case 'phone':
                                    regex = /^[0-9]*$/gi;
                                    break;
                                case 'name':
                                    regex = /^[A-Za-z\.]*$/gi;
                                    break;
                                case 'alphanum':
                                    break;
                                case 'mobile':
                                    regex = /^[6-9]{1}[0-9]*$/;
                                    break;
                                case 'loc_code':
                                    regex = /^[6-9]{1}[0-9]*$/;
                                    break;
                                case 'email':
                                    regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/gi;
                                    checkOnBlur = true;
                                    break;
                                default :
                            }
                            break;
                        case 'ta':
                        case 'textarea':
                            switch (validationType) {
                                case 'ta':
                                case 'textarea':
                                    regex = /^[A-Za-z0-9\s\.\-\/,@#]*$/gi;
                                    break;
                                default :
                            }
                            break;
                        case 'radio':
                        case 'rb':
                            switch (validationType) {
                                case 'radio':
                                case 'rb':
                                    break;
                                default :
                            }
                            break;
                        case 'checkbox':
                        case 'cb':
                            switch (validationType) {
                                case 'checkbox':
                                case 'cb':
                                    break;
                                default :
                            }
                            break;
                        case 'tcb':
                            switch (validationType) {
                                case 'tcb':
                                    break;
                                default :
                            }
                            break;
                        case 'select':
                            switch (validationType) {
                                case 'select':
                                    break;
                                default :
                            }
                            break;
                        default :
                    }
                }();
//                var regex = validationConfig[dataType][validationType]['regex'] || '';
//                var warningMessage = validationConfig[dataType][validationType]['warningMessage'];
//                var errorMessage = validationConfig[dataType][validationType]['errorMessage'] || '';
                ngModelCtrl.$error = {
                    isError: null,
                    errorMessage: null,
                    isWarning: null,
                    warningMessage: null
                };
                var isElementVisibleFn = $parse(attrs.ngRequired);
                scope.$watch(function () {
                    return isElementVisibleFn(scope);
                }, function (newValue) {
                    ngModelCtrl.$error['isVisible'] = newValue;
                });
                var setPreviousValue = function (oldValue) {
                    //element[0].value = oldValue;
                    ngModelCtrl.$setViewValue(oldValue);
                    ngModelCtrl.$render();
                };
                var setWarning = function (status, message) {
                    ngModelCtrl.$error['isWarning'] = status;
                    ngModelCtrl.$error['warningMessage'] = message ? message : '';
                };
                var setError = function (status, message) {
                    ngModelCtrl.$error['isError'] = status;
                    ngModelCtrl.$error['errorMessage'] = message ? message : '';
                };
                var getErrorMessageForDate = function (value) {

                };
                var compareDate = function (compareType, value, compareValue, validationType) {
                    value = $filter('parseServerDate')(value);
                    var returnObj = {
                        message: '',
                        isValid: false
                    };
                    var comprisionOperators = new RegExp(['<=', '<', '>=', '>', '='].join('|')); //order of the operator in the array should be like this
                    var arthOptrs = /\+|\-/;
                    var numArray = compareValue.match(/\d+/);
                    var currentDate = new Date();
                    var message = '';
                    if (compareValue.match(comprisionOperators)) {

                    } else if (compareValue) {
                        var count = 1;
                        var currentOptr = compareValue.match(arthOptrs) ? compareValue.match(arthOptrs)[0] : null;
                        if (numArray && numArray.length > 0) {
                            compareValue = compareValue.split(numArray[0]).join('');
                            count = Number(numArray[0]);
                        }
//        var count = numArray.length > 0 ? Number(numArray[0]) : 1;
                        count = Number(currentOptr + count);
                        switch (compareValue.split('-')[0].toUpperCase()) {
                            case 'T':
                                currentDate = new Date();
                                //message='Current Date';
                                break;
                            case 'FM'://current date set to first day of month
                                currentDate.firstDay('month');
                                //'First Day of month';
                                break;
                            case 'LM'://curret date set to last day of month
                                currentDate.lastDay('month');
                                //message='Last Day of month'
                                break;
                            case 'FY'://curret date set to first day of year
                                currentDate.firstDay('year');
                                //message='First Day of year';
                                break;
                            case 'LY'://curret date set to last day of year
                                currentDate.lastDay('year');
                                //message='Last day of year';
                                break;
                            case 'FCW'://current date set to first day of current week
                                currentDate.firstDay('week');
                                //message='First day of this week';
                                break;
                            case 'LCW'://current date set to last day of current week
                                currentDate.lastDay('week');
                                //message='Last day of this week';
                                break;
                            case 'WS':
                                break;
                            case 'WE':
                                break;
                            default :
                        }
                        switch (compareValue.split('-')[1] ? compareValue.split('-')[1].toLowerCase() : '') {
                            case 'd':
                                currentDate.dateAdd('day', count);
                                break;
                            case 'm':
                                currentDate.dateAdd('month', count);
                                break;
                            case 'y':
                                currentDate.dateAdd('year', count);
                                break;
                            case 'w':
                                currentDate.dateAdd('week', count);
                                break;
                            default :
                        }
                        switch (validationType) {
                            case 'date':
                                currentDate.setHours(0, 0, 0, 0, 0);
                                value.setHours(0, 0, 0, 0, 0);
                                returnObj.message = currentDate.parseDate('shortdate');
                                break;
                            case 'datetime':
                                returnObj.message = currentDate.parseDate('shortdate') + ' ' + currentDate.parseDate('hour_min');
                                break;
                            default :
                        }
                        switch (compareType) {
                            case 'min':
                                if (value.getTime() >= currentDate.getTime()) {
                                    returnObj.isValid = true;
                                    //return true;
                                }
                                break;
                            case 'max':
                                if (value.getTime() <= currentDate.getTime()) {
                                    returnObj.isValid = true;
                                    //return true;
                                }
                                break;
                        }
                        return returnObj;
                        //return false;
                    }
                };
                var chkForMandatory = function (dataType, validationType, value) {
                    var returnValue = true;
                    var errorMsg = '';
                    switch (dataType) {
                        case 'text':
                            switch (validationType) {
                                case 'alpha':
                                case 'number':
                                default :
                                    if (!value) {
                                        errorMsg = parameterName + ' can not be empty';
                                        returnValue = false;
                                    }
                                    break;
                            }
                            break;
                        case 'select':
                            switch (validationType) {
                                case 'select':
                                default :
                                    if (!value) {
                                        errorMsg = parameterName + ' can not be empty';
                                        returnValue = false;
                                    }
                                    break;
                            }
                            break;
                        case 'cb':
                        case 'checkbox':
                        case 'tcb':
                            switch (validationType) {
                                case 'cb':
                                case 'checkbox':
                                case 'tcb':
                                default :
                                    var valueType = Object.prototype.toString.call(value);
                                    var isChecked = false;
                                    var chkArray = ['no', 'n'];
                                    if (valueType == '[object Object]') {
                                        angular.forEach(value, function (item) {
                                            if (chkArray.indexOf(item.toLowerCase()) < 0) {
                                                isChecked = true;
                                            }
//                                            if (item.toLowerCase() !== 'no' || item.toLowerCase() !== 'n') {
//                                                isChecked = true;
//                                            }
                                        });
                                        if (!isChecked) {
                                            errorMsg = parameterName + ' should be selected for atleast one';
                                            returnValue = false;
                                        }
                                    }
                                    break;
                            }
                            break;
                        case 'rb':
                        case 'radio':
                            switch (validationType) {
                                case 'rb':
                                case 'radio':
                                default :
                                    if (!value) {
                                        errorMsg = parameterName + ' must be selected';
                                        returnValue = false;
                                    }
                            }
                            break;
                        case 'datetime':
                        switch (validationType) {
                            case 'datetime':
                                var valueType = Object.prototype.toString.call(value);
                                if (valueType == '[object Object]') {
                                    if (!value['date'] || !value['time']) {
                                        errorMsg = parameterName + ' must be selected';
                                        returnValue = false;
                                    }
                                }
                                break;
                        }
                        default :
                            if (!value) {
                                errorMsg = parameterName + ' can not be empty';
                                returnValue = false;
                            }
                    }
                    if (errorMsg) {
                        setError(true, errorMsg);
                    } else {
                        setError(false);
                    }
                    return returnValue;
                };
                var chkForMinValue = function (dataType, validationType, val, oldValue, minval, mandatory) {
                    var returnValue = true;
                    var errorMsg = '';
                    var valueType = Object.prototype.toString.call(val);
                    var valLength = '';
                    switch (valueType) {
                        case '[object Object]':
                            break;
                        case '[object String]':
                            valLength = val.trim().length;
                            break;
                        default :
                            valLength = val.trim().length;
                    }
                    if (minval && (mandatory || (!mandatory && valLength > 0))) {
                        switch (dataType) {
                            case 'text':
                                switch (validationType) {
                                    case 'alpha':
                                        break;
                                    case 'number':
                                        val = Number(val);
                                        minval = Number(minval);
                                        if (val < minval) {
                                            errorMsg = parameterName + ' should not be less than ' + minval;
                                            returnValue = false;
                                        }
                                        break;
                                    default :
                                }
                                break;
                            case 'date':
                                switch (validationType) {
                                    case 'date':
                                        var compareResult = compareDate('min', val, minval, validationType);
                                        if (!compareResult.isValid) {
                                            errorMsg = parameterName + ' should not be less than ' + compareResult.message;
                                            returnValue = false;
                                        }
                                        break;
                                    case 'datetime':
                                        break;
                                }
                                break;
                            case 'datetime':
                            switch (validationType) {
                                case 'datetime':
                                    var valueType = Object.prototype.toString.call(val);
                                    switch (valueType) {
                                        case '[object Object]':
                                            var date = val['date'];
                                            var timeArray = val['time'].split(':');
                                            var time = timeArray.join(':');
                                            for (var i = 0; i < 3 - timeArray.length; i++) {
                                                time = time + ":00";
                                            }
                                            val = date + ' ' + time;
                                            break;
                                        default :
                                    }
                                    var compareResult = compareDate('min', val, minval, validationType);
                                    if (!compareResult.isValid) {
                                        errorMsg = parameterName + ' should not be less than ' + compareResult.message;
                                        returnValue = false;
                                    }
                                    break;
                            }
                            default :
                        }
                    }
                    if (errorMsg) {
                        setError(true, errorMsg);
                    } else {
                        setError(false);
                    }
                    return returnValue;
                };
                var chkForMaxValue = function (dataType, validationType, val, oldValue, maxval) {
                    var returnValue = true;
                    var errorMsg = '';
                    var valueType = Object.prototype.toString.call(val);
                    var valLength = '';
                    switch (valueType) {
                        case '[object Object]':
                            break;
                        case '[object String]':
                            valLength = val.trim().length;
                            break;
                        default :
                            valLength = val.trim().length;
                    }
                    if (maxval && (mandatory || (!mandatory && valLength > 0))) {
                        switch (dataType) {
                            case 'text':
                                switch (validationType) {
                                    case 'alpha':
                                        break;
                                    case 'number':
                                        val = Number(val);
                                        maxval = Number(maxval);
                                        if (val > maxval) {
                                            errorMsg = parameterName + ' should not be greater than ' + maxval;
                                            returnValue = false;
                                        }
                                        break;
                                    default :
                                }
                                break;
                            case 'date':
                                switch (validationType) {
                                    case 'date':
                                        var compareResult = compareDate('max', val, maxval, validationType);
                                        if (!compareResult.isValid) {
                                            errorMsg = parameterName + ' should not be greater than ' + compareResult.message;
                                            returnValue = false;
                                        }
                                        break;
                                    case 'datetime':
                                        break;
                                }
                                break;
                            case 'datetime':
                            switch (validationType) {
                                case 'datetime':
                                    var valueType = Object.prototype.toString.call(val);
                                    switch (valueType) {
                                        case '[object Object]':
                                            var date = val['date'];
                                            var timeArray = val['time'].split(':');
                                            var time = timeArray.join(':');
                                            for (var i = 0; i < 3 - timeArray.length; i++) {
                                                time = time + ":00";
                                            }
                                            val = date + ' ' + time;
                                            break;
                                        default :
                                    }
                                    var compareResult = compareDate('max', val, maxval, validationType);
                                    if (!compareResult.isValid) {
                                        errorMsg = parameterName + ' should not be greater than ' + compareResult.message;
                                        returnValue = false;
                                    }
                                    break;
                            }
                            default :
                        }
                    }
                    if (errorMsg) {
                        setError(true, errorMsg);
                    } else {
                        setError(false);
                    }
                    return returnValue;
                };
                var chkForMinLength = function (dataType, validationType, val, oldValue, minlen, mandatory) {
                    var returnValue = true;
                    var errorMsg = '';
                    var valueType = Object.prototype.toString.call(val);
                    var valLength = '';
                    switch (valueType) {
                        case '[object Object]':
                            break;
                        case '[object String]':
                            valLength = val.trim().length;
                            break;
                        default :
                            valLength = val.trim().length;
                    }
                    if (minlen && (mandatory || (!mandatory && valLength > 0))) {
                        switch (dataType) {
                            case 'text':
                                switch (validationType) {
                                    case 'alpha':
                                    case 'number':
                                    case 'name':
                                    case 'mobile':
                                    case 'loc_code':
                                    case 'alphanum':
                                    case 'ta':
                                    case 'textarea':
                                    default :
                                        if (valLength && valLength < minlen) {
                                            errorMsg = parameterName + ' length should not be less than ' + minlen;
                                            returnValue = false;
                                        }
                                        break;
                                }
                                break;
                            default :
                        }
                    }
                    if (errorMsg) {
                        setError(true, errorMsg);
                    } else {
                        setError(false);
                    }
                    return returnValue;
                };
                var chkForMaxLength = function (dataType, validationType, val, oldValue, maxlen, mandatory) {
                    var returnValue = true;
                    var errorMsg = '';
                    var valLength = '';
                    var valueType = Object.prototype.toString.call(val);
                    switch (valueType) {
                        case '[object Object]':
                            break;
                        case '[object String]':
                            valLength = val.trim().length;
                            break;
                        default :
                            valLength = val.trim().length;
                    }
                    if (maxlen && (mandatory || (!mandatory && valLength > 0))) {
                        switch (dataType) {
                            case 'text':
                                switch (validationType) {
                                    case 'alpha':
                                    case 'number':
                                    case 'name':
                                    case 'alphanum':
                                    case 'mobile':
                                    case 'loc_code':
                                    case 'ta':
                                    case 'textarea':
                                    default :
                                        if (valLength > maxlen) {
                                            errorMsg = parameterName + ' length should be less than or equal to ' + maxlen;
                                            setPreviousValue(oldValue); //disallow to enter after the max value
                                            returnValue = false;
                                        }
                                        break;
                                }
                                break;
                            default :
                        }
                    }
                    if (errorMsg) {
                        setError(true, errorMsg);
                    } else {
                        setError(false);
                    }
                    return returnValue;
                };
                var chkForRegex = function (newValue, oldValue, scope, isBlurEvent) {
                    var returnValue = true;
                    if (regex) {
                        switch (dataType) {
                            case 'text':
                                switch (validationType) {
                                    case 'email':
                                        if (isBlurEvent && newValue && !newValue.match(regex)) {
                                            returnValue = false;
                                            setError(true, parameterName + ' should be a valid email Id');
                                        }
                                        break;
                                    case 'alpha':
                                    case 'alphanum':
                                    case 'number':
                                    case 'n':
                                    case 'phone':
                                    case 'mobile':
                                    case 'loc_code':
                                    case 'name':
                                        if (newValue && !newValue.match(regex)) {
                                            setPreviousValue(oldValue);
                                            returnValue = false;
                                        }
                                        break;
                                    default :

                                }
                                break;
                            default :
                        }
                    }
                    return returnValue;
                };
                var validateInput = function (newValue, oldValue, scope, isBlurEvent) {

                    oldValue = oldValue || '';
                    newValue = newValue || '';
                    if (chkForRegex(newValue, oldValue, scope, isBlurEvent)) {
//                    if ((regex && newValue.match(regex)) || !regex) {
//                        if (mandatory && (isBlurEvent || ngModelCtrl.$error.isError==null) && !chkForMandatory(validationType, newValue, oldValue)) {
                        var action = validationObj['parent_form_action'].split('||');
                        var optionalIndex = action.indexOf('optional')
                        if (optionalIndex > -1) {

                            if (validationObj['parent_control_id'].split('||').length > 1) {
                                if (formInputs[formId][validationObj['parent_json_name'].split('||')[optionalIndex]] == undefined ||
                                        formInputs[formId][validationObj['parent_json_name'].split('||')[optionalIndex]] == '') {
                                    if (!formInputs[formId][validationObj['json_name']] || formInputs[formId][validationObj['json_name']] == undefined) {
                                        if (mandatory && !chkForMandatory(dataType, validationType, newValue, oldValue)) {
                                            return;
                                        }
                                    }
                                }
                                // (formInputs[formId][validationObj['json_name']]!='undefined'&&formInputs[formId][validationObj['json_name']]!='')) {

                            }
                            formValidityPrvdr.setFormError(validationObj['parent_json_name'].split('||')[optionalIndex])
                        } else {
                            if (mandatory && !chkForMandatory(dataType, validationType, newValue, oldValue)) {
                                return;
                            }
                        }


                        if (!chkForMaxLength(dataType, validationType, newValue, oldValue, maxLength, mandatory)) {
                            return;
                        }
                        if (!chkForMinLength(dataType, validationType, newValue, oldValue, minLength, mandatory)) {
                            return;
                        }
                        if (!chkForMinValue(dataType, validationType, newValue, oldValue, minValue, mandatory)) {
                            return;
                        }
                        if (!chkForMaxValue(dataType, validationType, newValue, oldValue, maxValue, mandatory)) {
                            return;
                        }
                    }
//                    else {
////                        setPreviousValue(oldValue);
//                        setError(true, errorMessage);
//                    }
                };
                scope.$watch(function () {
                    return  ngModelCtrl.$modelValue;
                    //return element[0].value;
                }, validateInput, true);
                var onFocus = function () {

                };
                var onBlur = function () {
                    //var value = element[0].value;
                    var value = ngModelCtrl.$modelValue;
                    checkOnBlur = true;
                    validateInput(value, value, scope, true);
                    scope.$apply();
                };
                var onKeyPress = function (evt) {
//                / console.log(ngModel);
                };
                element.on('keypress', onKeyPress);
//            element.on('keydown', onKeyDown);
                element.on('blur', onBlur);
//            element.on('focus', onFocus);
//            element.on('keyup', onKeyUp);
//            element.on('paste',onPaste);
//            element.on('change', onChange);
            }
        };
    }]);
dmCommonApi.directive('dmSearchList', ['$parse', '$http', '$compile', '$filter', '$rootScope', function ($parse, $http, $compile, $filter, $rootScope) {
        return {
            restrict: 'A',
            require: '?ngModel',
            transclude: true,
            scope: {},
//            templateUrl:'searchlist/searchlistTemplate.html',
            link: function (scope, element, attrs, ngModalCtrl) {
                //console.log(element.scope())
                $http.get('commonFilters/searchlistTemplate.html').success(function (response) {
                    //angular.element('body').append($compile(response)(scope))
                    angular.element(document.querySelectorAll("[ng-view]")[0]).append($compile(response)(scope));
//                    element.after($compile(response)(scope));
                });
                try {
                    var styleObj = attrs.styleobj ? JSON.parse(attrs.styleobj.replace(/\'/g, '\"')) : {};
                } catch (e) {
                    console.log('Searchlist : Style Object Is not a valid object');
                }
                var itemListGetter = $parse(attrs.dmSearchList);
                var itemvalue = attrs.itemvalue;
                scope.itemvalue = attrs.itemvalue;
                var modalType = attrs.modaltype ? attrs.modaltype : 'object';
                scope.themeColor = attrs.theme;
                scope.itemdesc = attrs.itemdesc;
                scope.itemList = itemListGetter(element.scope());
                var itemList = scope.itemList;
                var chkForModalValue = function (value) {
                    var returnValue = '';
                    value = value || '';
                    angular.forEach(itemList, function (item) {
                        switch (modalType) {
                            case 'object':
                                if (item[itemvalue].toLowerCase() == value[itemvalue].toLowerCase()) {
                                    returnValue = item[scope.itemdesc];
                                }
                                break;
                            case 'value':
                                if (item[itemvalue].toLowerCase() == value.toLowerCase()) {
                                    returnValue = item[scope.itemdesc];
                                }
                                break;
                        }
                    });
                    return returnValue;
                };
                var getListItems = function () {
                    itemList = itemListGetter(element.scope());
                    scope.itemList = itemList;
                    var modelValue = chkForModalValue(ngModalCtrl.$modelValue);
                    ngModalCtrl.$setViewValue(modelValue);
                    ngModalCtrl.$render();
                    if (!modelValue) {
                        element[0].value = '';
                    }
                };
                scope.$watch(function () {
                    return itemListGetter(element.scope());
                }, function (newValue) {
                    itemList = newValue;
                    scope.itemList = itemList;
                    var modelValue = '';
                    if (ngModalCtrl.$untouched) {
                        modelValue = chkForModalValue(ngModalCtrl.$modelValue);
                    }
//                    var modelValue = chkForModalValue(ngModalCtrl.$modelValue);
                    ngModalCtrl.$setViewValue(modelValue);
                    ngModalCtrl.$render();
                    if (!modelValue) {
                        element[0].value = '';
                    }
                }, true);
                scope.listObj = {
                    listShown: null
                };
                ngModalCtrl.$parsers.push(function (value) {
                    var returnValue = '';
                    value = value || '';
                    scope.itemList = $filter('filter')(itemList, value);
                    angular.forEach(itemList, function (item) {
                        switch (modalType) {
                            case 'object':
                                var type = Object.prototype.toString.call(value);
                                if (type === '[object Object]') {
                                    if (item[scope.itemdesc].toLowerCase() === value[scope.itemdesc].toLowerCase()) {
                                        returnValue = item;
                                    }
                                }
                                break;
                            case 'value':
                                if (item[scope.itemdesc].toLowerCase() === value.toLowerCase()) {
                                    returnValue = item[itemvalue];
                                }
                                break;
                        }
                    });
                    return returnValue;
                });
                ngModalCtrl.$formatters.push(function (value) {
                    var returnValue = '';
                    value = value || '';
                    if (!value) {
                        scope.itemList = $filter('filter')(itemList, value);
                    }
                    angular.forEach(itemList, function (item) {
                        switch (modalType) {
                            case 'object':
                                if (item[itemvalue].toLowerCase() == value[itemvalue].toLowerCase()) {
                                    returnValue = item[scope.itemdesc];
                                }
                                break;
                            case 'value':
                                if (item[itemvalue].toLowerCase() == value.toLowerCase()) {
                                    returnValue = item[scope.itemdesc];
                                }
                                break;
                        }
                    });
                    return returnValue;
                });
                scope.itemClick = function (item) {
                    if (item[itemvalue]) {
                        switch (modalType) {
                            case 'object':
                                ngModalCtrl.$setViewValue(item);
                                ngModalCtrl.$render();
                                break;
                            case 'value':
                                ngModalCtrl.$setViewValue(item[scope.itemdesc]);
                                ngModalCtrl.$render();
                                break;
                        }
                    } else {
                        ngModalCtrl.$setViewValue('');
                        ngModalCtrl.$render();
                    }
                    element[0].value = item[scope.itemdesc];
                };
                scope.adjustPosition = function () {
                    var viewPortWidth = window.innerWidth || document.documentElement.clientWidth,
                            viewPortHeight = window.innerHeight || document.documentElement.clientHeight,
                            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
                            left, clientRect, top,
                            offsetWidth = element[0].offsetWidth,
                            offsetHeight = element[0].clientHeight,
                            searchListheight = document.getElementsByClassName('searchListBox')[0].clientHeight;
                    if (typeof element[0].getBoundingClientRect === 'function') {
                        clientRect = element[0].getBoundingClientRect();
                        left = clientRect.left + window.pageXOffset;
                        top = clientRect.bottom + window.pageYOffset;
                        if (left + offsetWidth > viewPortWidth) {
                            left = left - offsetWidth;
                        }
                        if (top + searchListheight > viewPortHeight) {
                            top = top - searchListheight - offsetHeight;
                        }
                    }
                    styleObj.top = top + 'px';
                    styleObj.left = left + 'px';
                    styleObj.width = offsetWidth + 'px';
                    return styleObj;
                };
                scope.getBrightness = function (themeColor) {
                    var r = parseInt(themeColor.substr(0, 2), 16);
                    var g = parseInt(themeColor.substr(2, 2), 16);
                    var b = parseInt(themeColor.substr(4, 2), 16);
                    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                    return (yiq >= 128) ? 'black' : 'white';
                };
                scope.getHoverStyle = function () {
                    var returnStyle = {};
                    returnStyle.color = scope.getBrightness(scope.themeColor);
                    returnStyle.background = '#' + scope.themeColor;
                    return returnStyle;
                };
                element.on('focus', function () {
                    scope.listObj.listShown = true;
                    ngModalCtrl.$setViewValue('');
                    ngModalCtrl.$render(); //as per requirement 12 Dec 2016
                    element[0].value = ''           //
                    scope.$apply();
                });
                element.on('blur', function () {
                    scope.listObj.listShown = false;
                    scope.$apply();
                });
//                scope.$watch(function (){
//                    return element[0].getBoundingClientRect();
//                },function (newValue){
//                    console.log(newValue)
//                },true)
            }
        };
    }]);
dmCommonApi.directive('dmFormatDate', ['$filter', function ($filter) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModalCtrl) {
                ngModalCtrl.$parsers.push(function (value) {
//                    console.log(value);
                    var returnValue = '';
                    if (value) {
                        var viewValue = $filter('parseServerDate')(value);
                        if (!isNaN(viewValue)) {
                            element[0].value = viewValue.parseDate('shortdate');
                            value = $filter('parseServerDate')(value);
                            returnValue = value.parseDate('serverdate');
                        } else {
                            element[0].value = '';
                        }
                    }
                    return returnValue;
                });
                ngModalCtrl.$formatters.push(function (value) {
                    var returnValue = '';
                    if (value) {
                        value = $filter('parseServerDate')(value);
                        returnValue = value.parseDate('shortdate');
                    }
                    return returnValue;
//                    console.log(value);
//                    return value;
                });
            }
        };
    }]);
dmCommonApi.directive('tickerElement', ['$parse', '$sce', function ($parse, $sce) {
        var directiveObj = {};
        directiveObj.templateUrl = 'commonFilters/ticker.html';
        directiveObj.scope = {};
        function linkFn(scope, element, attrs) {
            scope.dataString = '';
            var stringGetter = $parse(attrs.messageString);
            scope.$watch(function () {
                return stringGetter(element.scope());
            }, function (newValue) {
                scope.dataString = $sce.trustAsHtml(newValue);
            });
        }
        directiveObj.link = linkFn;
        return directiveObj;
    }]);
dmCommonApi.directive('webOnForm', [function () {
        var directiveObj = {};
        directiveObj.scope = {};
        directiveObj.templateUrl = 'commonFilters/webOnTemplate.html';
        function controllerFn($scope) {

        }
        function linkFn(scope, element, attrs) {
            scope.dataObj = {};
            scope.formParameters = [];
        }
        directiveObj.controller = controllerFn;
        directiveObj.link = linkFn;
        return directiveObj;
    }]);
dmCommonApi.filter('checkvaluetype', function () {
    return function (value) {
        var returnValue = '';
        if (angular.isArray(value)) {
            if (value.length == 1) {
                if (value[0].hasOwnProperty('crn')) {
                    returnValue = value[0]['crn'];
                } else {
                    returnValue = value.length;
                }
            } else {
                returnValue = value.length;
            }
            return returnValue;
        } else {
            return value;
        }
    }
})

dmCommonApi.directive('onlyDigits', function () {

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined)
                    return '';
                var include = attrs.onlyDigits || 'nothing';
                var regEx = /[^0-9]/g;
                switch (include) {
                    case 'decimal':
                        regEx = /[^0-9.]/g;
                        var transformedInput = inputValue.replace(regEx, '');
                        if (transformedInput.indexOf('.') > -1) {
                            var fraction = transformedInput.split('.')[1];
                            var number = transformedInput.split('.')[0];
                            if (fraction.length > 2) {
                                fraction = fraction.substr(0, 2);
                            }
                            transformedInput = number + '.' + fraction;
                        }
                        break;
                    default:
                        var transformedInput = inputValue.replace(regEx, '');
                        break;
                }

                if (transformedInput == '0') {
                    transformedInput = '';
                }
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});
dmCommonApi.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});
