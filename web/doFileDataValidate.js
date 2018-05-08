self.onmessage = function (e) {
    var currentInvalidReason = "";
    var validateMethods = {
        isMandatory: function (propertyValue, data) {
            var isRecordValid = false;
            if (propertyValue !== "") {



                if (propertyValue === "1" ||
                        propertyValue === "y" ||
                        propertyValue === "yes" ||
                        propertyValue === "true")
                {
                    if (data) {
                        data = data.trim();
                    }
                    if (data === "" || data.length < 1) {
                        isRecordValid = false;
                        currentInvalidReason += "\nvalue cannot be empty";
                        return;
                    } else {
                        isRecordValid = true;
                    }
                } else {
                    isRecordValid = true;
                }


            } else {
                isRecordValid = true;
            }
            return isRecordValid;
        },
        isValidEmpId: function (propertyValue, data) {

        },
        isMinValue: function (propertyValue, data) {
            var isRecordValid = false;
            if (propertyValue !== "")
            {
                if (Number(data) < Number(propertyValue)) {
                    isRecordValid = false;
                    currentInvalidReason += "\nvalue cannot be less than " + propertyValue;
                    return;
                } else {
                    isRecordValid = true;
                }
            } else {
                isRecordValid = true;
            }

            //console.log(data+":"+currentInvalidReason)
            return isRecordValid;
        },
        isValidEmail: function (data) {
            var isRecordValid = false;
            if (data != '') {
                if (!data.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi)) {
                    isRecordValid = false;
                    currentInvalidReason += "\n Enter valid e-mail";
                    return;
                } else {
                    isRecordValid = true;
                }
            } else {
                isRecordValid = true;
            }

            //console.log(data+":"+currentInvalidReason)
            return isRecordValid;
        },
        isValidDateTime: function (data) {
            var isRecordValid = false;
            if (data != '') {
                data = data.replace(/\s\s+/g, ' ');
//                if (!data.match(/^([1-9]|([012][0-9])|(3[01]))-([0]{0,1}[1-9]|1[012])-\d\d\d\d [012]{0,1}[0-9]:[0-6][0-9]$/)) {
                if (!data.match(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4} ([01]\d|2[0-3]):[0-5]\d$/)) {
                    isRecordValid = false;
                    currentInvalidReason += "\n Enter in dd/mm/yyyy hh:mm";
                    return;
                } else {
                    isRecordValid = true;
                }
            } else {
                isRecordValid = true;
            }

            //console.log(data+":"+currentInvalidReason)
            return isRecordValid;
        },
        isValidTimeStamp: function (data) {
            var isRecordValid = false;
            if (data != '') {
                data = data.replace(/\s\s+/g, '');
//                if (!data.match(/^([1-9]|([012][0-9])|(3[01]))-([0]{0,1}[1-9]|1[012])-\d\d\d\d [012]{0,1}[0-9]:[0-6][0-9]$/)) {
                if (!data.match(/^([01]\d|2[0-3]):[0-5]\d$/)) {
                    isRecordValid = false;
                    currentInvalidReason += "\n Enter hh:mm";
                    return;
                } else {
                    isRecordValid = true;
                }
            } else {
                isRecordValid = true;
            }

            //console.log(data+":"+currentInvalidReason)
            return isRecordValid;
        },
        isMaxValue: function (propertyValue, data) {
            var isRecordValid = false;
            if (propertyValue !== "")
            {
                if (Number(data) > Number(propertyValue)) {
                    isRecordValid = false;
                    currentInvalidReason += "\nvalue cannot be greater than " + propertyValue;
                    return;
                } else {
                    isRecordValid = true;
                }
            } else {
                isRecordValid = true;
            }

            //console.log(data+":"+currentInvalidReason)
            return isRecordValid;
        },
        isMinLength: function (propertyValue, data) {
            var isRecordValid = false;
            if (propertyValue !== "")
            {
                if (data && (data.length < Number(propertyValue))) {
                    isRecordValid = false;
                    currentInvalidReason += "\nvalue length cannot be less than " + propertyValue;
                    return;
                } else {
                    isRecordValid = true;
                }
            } else {
                isRecordValid = true;
            }

            //  console.log(data+":"+currentInvalidReason)
            return isRecordValid;
        },
        isMaxLength: function (propertyValue, data) {
            var isRecordValid = false;
            if (propertyValue !== "")
            {
                if (data && (data.length > Number(propertyValue))) {
                    isRecordValid = false;
                    currentInvalidReason += "\nvalue length cannot be greater than " + propertyValue;
                    return;
                } else {
                    isRecordValid = true;
                }
            } else {
                isRecordValid = true;
            }

            //  console.log(data+":"+currentInvalidReason)
            return isRecordValid;
        },
        isBoolean: function (propertyValue, data) {
            var isRecordValid = false;
            if (propertyValue === "1" ||
                    propertyValue === "y" ||
                    propertyValue === "yes" ||
                    propertyValue === "true")
            {
                if (data === "1" || data === "y" || data === "yes" || data === "true") {
                    isRecordValid = true;
                    // return;
                } else {
                    isRecordValid = false;
                    currentInvalidReason += "\nvalue should be only a boolean value";
                    return;
                }
            } else {
                isRecordValid = true;
            }

            //  console.log(data+":"+currentInvalidReason)
            return isRecordValid;
        },
        isFormatValid: function (data) {
            var isRecordValid = false;
            var date = new Date(data);
            if (date == 'Invalid Date') {
                isRecordValid = false;
                currentInvalidReason += "\nDate is not in proper format";
            } else {
                isRecordValid = true;
            }

        }
    };
    function validateRecord(recordAttrs, recordData) {
        var isRecordValid = false;
        var isDateValid = false;
        currentInvalidReason = "";
        switch (recordAttrs['datatype'].toLowerCase()) {
            case "number":
            case "int":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid) {
                                if (recordData.split('^^').length > 1) {
                                    recordData = recordData.trim();
                                    recordData = parseFloat(recordData.split('^^').join(''));
                                } else {

                                }
                                if (isNaN(recordData)) {
                                    isRecordValid = false;
                                    currentInvalidReason += '\n value must be in number';
                                } else {
                                    isRecordValid = true;
                                }
                                return isRecordValid;
                            } else {
                                return isRecordValid;
                            }
                            break;
                        case 'minvalue':
                            isRecordValid = validateMethods.isMinValue(recordAttrs[validationProp].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        case 'maxvalue':
                            isRecordValid = validateMethods.isMaxValue(recordAttrs[validationProp].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        case 'minlength':
                            isRecordValid = validateMethods.isMinLength(recordAttrs[validationProp].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        case 'maxlength':
                            isRecordValid = validateMethods.isMaxLength(recordAttrs[validationProp].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        default:

                            break;
                    }

                }
                return isRecordValid;
                break;
            case "email":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid) {

                                isRecordValid = validateMethods.isValidEmail(recordData);
                                if (isRecordValid) {

                                } else {
                                    return isRecordValid;
                                }
                            } else {
                                return isRecordValid;
                            }
                            break;


                    }
                }
                return isRecordValid;
                break;
            case "altitude":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid) {
                                if (recordData) {
                                    if (!recordData.match(/^\d{3}.\d{6}$/)) {
                                        isRecordValid = false;
                                        currentInvalidReason += '\n value is not in proper format(*3 digits(.)6 digits)';
                                    } else {
                                        isRecordValid = true;
                                    }
                                }

                            } else {
                                return isRecordValid;
                            }
                            break;


                    }
                }
                return isRecordValid;
                break;
            case "lname":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid) {
                                if (recordData) {
                                    if (!recordData.trim().match(/^[a-zA-Z]*[ ]{0,1}[.]{0,1}[a-zA-Z]*[.]{0,1}$/gi)) {
                                        isRecordValid = false;
                                        currentInvalidReason += '\n value is not in proper format(only alphabets with *single space and *(.))';
                                    } else {
                                        isRecordValid = true;
                                    }
                                }

                            } else {
                                return isRecordValid;
                            }
                            break;


                    }
                }
                return isRecordValid;
                break;
            case "fname":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid) {
                                if (recordData) {
                                    if (!recordData.trim().match(/^[a-zA-Z]*[ ]{0,1}[a-zA-Z]*$/gi)) {
                                        isRecordValid = false;
                                        currentInvalidReason += '\n value is not in proper format(only alphabets with *single space)';
                                    } else {
                                        isRecordValid = true;
                                    }
                                }

                            } else {
                                return isRecordValid;
                            }
                            break;


                    }
                }
                return isRecordValid;
                break;
            case "latlng":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid) {
                                if (recordData) {
                                    if (!recordData.match(/^\d{2}.\d{6}$/)) {
                                        isRecordValid = false;
                                        currentInvalidReason += '\n value is not in proper format(*2 digits(.)6 digits)';
                                    } else {
                                        isRecordValid = true;
                                    }
                                }

                            } else {
                                return isRecordValid;
                            }
                            break;


                    }
                }
                return isRecordValid;
                break;
            case "emp_id":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid) {
                                if (recordData) {
                                    if (!recordData.match(/^[0-9]{5}[a-zA-z]{3}$/)) {
                                        isRecordValid = false;
                                        currentInvalidReason += '\n value is not in proper format(*5 digits and 3 characters)';
                                    } else {
                                        isRecordValid = true;
                                    }
                                }

                            } else {
                                return isRecordValid;
                            }
                            break;



//                case 'minlength':
//                            isRecordValid = validateMethods.isMinLength(recordAttrs[validationProp].trim(), recordData.trim());
//                            if (isRecordValid) {
//
//                            } else {
//                                return isRecordValid;
//                            }
//
//                            break;
//                        case 'maxlength':
//                            isRecordValid = validateMethods.isMaxLength(recordAttrs[validationProp].trim(), recordData.trim());
//                            if (isRecordValid) {
//
//                            } else {
//                                return isRecordValid;
//                            }
//
//                            break;
                    }
                }
                return isRecordValid;
                break;
            case 'varchar2':
            case "string":
            case "varchar":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }
                            break;
                        case 'minlength':
                            isRecordValid = validateMethods.isMinLength(recordAttrs[validationProp].trim(), recordData.trim());
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        case 'maxlength':
                            isRecordValid = validateMethods.isMaxLength(recordAttrs[validationProp].trim(), recordData.trim());
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        default:

                            break;
                    }

                }

                return isRecordValid;
                break;
            case "mobile":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid && recordData !== "") {
                                if (isNaN(recordData)) {
                                    isRecordValid = false;
                                    currentInvalidReason += '\n value must be in number';
                                } else {
                                    isRecordValid = true;
                                    var mobileRegex = /^[7-9]{1}[0-9]*$/;
//                                var dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                                    if (!recordData.match(mobileRegex)) {
                                        isRecordValid = false;
                                        // currentInvalidReason += '\n Date must be in format dd/mm/yyyy or d/m/yyyy';
                                        currentInvalidReason += '\n value must start with 7 or 8 or9';
                                        // console.log(recordAttrs['attributename']);
                                    } else {
                                        isRecordValid = true;
                                    }
                                }

                            } else {
                                return isRecordValid;
                            }
                            return isRecordValid;
                            break;
                        case 'minlength':
                            isRecordValid = validateMethods.isMinLength(recordAttrs[validationProp].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        case 'maxlength':
                            isRecordValid = validateMethods.isMaxLength(recordAttrs[validationProp].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        default:

                            break;
                    }
                }

                break;
            case "alphanumeric":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid && recordData !== "") {
                                isRecordValid = false;
                                var alphanumericRegex = /^[0-9a-zA-Z]+$/;
                                if (!recordData.match(alphanumericRegex)) {
                                    isRecordValid = false;
                                    // currentInvalidReason += '\n Date must be in format dd/mm/yyyy or d/m/yyyy';
                                    currentInvalidReason += '\n value must be alphanumeric';
                                    // console.log(recordAttrs['attributename']);
                                } else {
                                    isRecordValid = true;
                                }


                            } else {
                                return isRecordValid;
                            }
                            return isRecordValid;
                            break;
                        case 'minlength':
                            isRecordValid = validateMethods.isMinLength(recordAttrs[validationProp].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        case 'maxlength':
                            isRecordValid = validateMethods.isMaxLength(recordAttrs[validationProp].trim(), recordData);
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        default:

                            break;
                    }
                }

                break;
            case "plainnumber":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData.trim());
                            if (isRecordValid && recordData !== "") {
                                isRecordValid = false;
                                var alphanumericRegex = /^[0-9]+$/;
                                recordData = recordData.trim();
                                if (!recordData.match(alphanumericRegex)) {
                                    isRecordValid = false;
                                    // currentInvalidReason += '\n Date must be in format dd/mm/yyyy or d/m/yyyy';
                                    currentInvalidReason += '\n value must be numeric without any special characters';
                                    // console.log(recordAttrs['attributename']);
                                } else {
                                    isRecordValid = true;
                                }


                            } else {
                                return isRecordValid;
                            }
                            return isRecordValid;
                            break;
                        case 'minlength':
                            isRecordValid = validateMethods.isMinLength(recordAttrs[validationProp].trim(), recordData.trim());
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        case 'maxlength':
                            isRecordValid = validateMethods.isMaxLength(recordAttrs[validationProp].trim(), recordData.trim());
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        default:

                            break;
                    }
                }

                break;
            case "alpha":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData.trim());

                            if (isRecordValid && recordData !== "") {
                                isRecordValid = false;
                                var alphanumericRegex = /^[a-zA-Z\s]+$/;
                                recordData = recordData.trim();
                                if (!recordData.match(alphanumericRegex)) {
                                    isRecordValid = false;
                                    // currentInvalidReason += '\n Date must be in format dd/mm/yyyy or d/m/yyyy';
                                    currentInvalidReason += '\n value must be alphabet';
                                    // console.log(recordAttrs['attributename']);
                                } else {
                                    isRecordValid = true;
                                }


                            } else {
                                return isRecordValid;
                            }
                            return isRecordValid;
                            break;
                        case 'minlength':
                            isRecordValid = validateMethods.isMinLength(recordAttrs[validationProp].trim(), recordData.trim());
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        case 'maxlength':
                            isRecordValid = validateMethods.isMaxLength(recordAttrs[validationProp].trim(), recordData.trim());
                            if (isRecordValid) {

                            } else {
                                return isRecordValid;
                            }

                            break;
                        default:

                            break;
                    }
                }

                break;
            case "boolean":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()], recordData);
                            if (isRecordValid) {
                                isRecordValid = validateMethods.isBoolean(recordAttrs[validationProp].trim().toLowerCase(), recordData.toLowerCase());
                                if (isRecordValid) {

                                } else {
                                    return isRecordValid;
                                }
                            } else {
                                return isRecordValid;
                            }
                            break;

                        default:

                            break;
                    }
                }
                return isRecordValid;
                break;
            case "time":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()], recordData);
                            if (isRecordValid) {
                                isRecordValid = validateMethods.isValidTimeStamp(recordData);
                                if (isRecordValid) {

                                } else {
                                    return isRecordValid;
                                }
                            } else {
                                return isRecordValid;
                            }
                            break;

                        default:

                            break;
                    }
                }
                return isRecordValid;
                break;
            case "datetime":
                for (var validationProp in recordAttrs) {
                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()], recordData);
                            if (isRecordValid) {
                                isRecordValid = validateMethods.isValidDateTime(recordData);
                                if (isRecordValid) {

                                } else {
                                    return isRecordValid;
                                }
                            } else {
                                return isRecordValid;
                            }
                            break;

                        default:

                            break;
                    }
                }
                return isRecordValid;
                break;
            case"date":
                for (var validationProp in recordAttrs) {

                    switch (validationProp.toLowerCase()) {
                        case 'mandatoryflag':
                            isRecordValid = validateMethods.isMandatory(recordAttrs[validationProp.toLowerCase()].trim(), recordData);
                            if (isRecordValid && recordData !== "") {
                                //var dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;
                                // var dateRegex = /^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[012])\-\d{4}$/;
                                var dateRegex1 = /(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
                                //var dateRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;
//                                var dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                                if (!recordData.match(dateRegex1)) {
                                    isRecordValid = false;
                                    // currentInvalidReason += '\n Date must be in format dd/mm/yyyy or d/m/yyyy';
                                    currentInvalidReason += '\n Date must be in format dd/mm/yyyy';
                                    // console.log(recordAttrs['attributename']);
                                } else {
//                                    var tempDate = recordData.split('/');
//                                    var year = tempDate[2];
//                                    var month = tempDate[1];
//                                    var day = tempDate[0];
//                                    tempDate = month + '/' + day + '/' + year;

                                    //var date = new Date(tempDate);
                                    /*var date = new Date(recordData);
                                     if (!typeof (date) == 'object') {
                                     isRecordValid = false;
                                     } else {
                                     if (JSON.stringify(date) == 'null') {
                                     isRecordValid = false;
                                     currentInvalidReason += '\n Date is invalid';
                                     } else {
                                     isRecordValid = true;
                                     //                                            var recordDataYear = recordData.split('-')[0];
                                     //                                            var recordDataMonth = $filter('toNDigits')(recordData.split('-')[1], '2');
                                     //                                            var recordDataDate = r$filter('toNDigits')(recordData.split('-')[2], '2');
                                     //                                            recordData = recordDataYear + '-' + recordDataMonth + '-' + recordDataDate;
                                     
                                     }
                                     }*/
                                    isRecordValid = true;
                                }

                                return isRecordValid;
                            } else {
                                return isRecordValid;
                            }
                            break;
                    }
                }
                break;
            case"timestamp":
                isRecordValid = true;
                return isRecordValid;
                break;
            default:

                break;
        }
    }
    var returnedData = [];
    var fileData = e.data.key1;
    fileData = fileData.trim();
    var attributeLists = e.data.key2;
    var templateheaders = e.data.key3;
    var stagingData = e.data.key4 || [];
    var action = e.data.key5.toLowerCase();
    var rejectData = e.data.key6 || [];
    var masterData = e.data.key7 || [];
    //console.log(rejectData)

    var fileRows = fileData.split('\n');
    /*if (fileRows.length > 20001) {
     postMessage(
     {
     type: "error",
     data: false,
     message: "Permissible limit is 20,000 records."
     });
     }*/
    var csvheaders = fileRows[0].toLowerCase().split(',');
    csvheaders = csvheaders.map(Function.prototype.call, String.prototype.trim);
    var index = csvheaders.indexOf("");
    if (index > -1) {
        csvheaders = csvheaders.splice(0, index);
    }

    var errorMessage = "";
    switch (action) {
        case "create mapping":
        case "change mapping":
            if (csvheaders.length === attributeLists.length) {
                if (fileRows.length === 1) {
                    postMessage({
                        type: "headers",
                        data: csvheaders,
                        message: ""
                    });
                } else {
                    errorMessage = "Selected File Should only contain column headers";
                    postMessage(
                            {
                                type: "error",
                                data: false,
                                message: errorMessage
                            });
                }
            } else {
                errorMessage = "Number of columns in the file do not match template columns";
                postMessage(
                        {
                            type: "error",
                            data: false,
                            message: errorMessage
                        });
            }
            break;
        case "upload data":
            for (var sd = 0, sdMax = stagingData.length; sd < sdMax; sd++) {
                stagingData[sd]["isvalid"] = "Staging Data";
            }
            for (var rd = 0, rdMax = rejectData.length; rd < rdMax; rd++) {
                rejectData[rd]["isvalid"] = "Rejected Data";
            }
            for (var md = 0, mdMax = masterData.length; md < mdMax; md++) {
                masterData[md]["isvalid"] = "Master Data";
            }
            if (templateheaders.length > 0) {
                templateheaders = templateheaders.join(',').toLowerCase().split(',')
            } else {
                postMessage({
                    type: "headers",
                    data: csvheaders,
                    message: ""
                });
            }
            var fileTemplateMapping = {};
            for (var h = 0, max = templateheaders.length; h < max; h++) {
                var headerIndex = csvheaders.indexOf(templateheaders[h].toLowerCase().trim());

                if (headerIndex > -1) {
                    fileTemplateMapping[templateheaders[h]] = headerIndex;
                } else {
                    postMessage({
                        type: "headers",
                        data: csvheaders,
                        message: ""
                    });
                    postMessage(
                            {
                                type: "error",
                                data: false,
                                message: "Column Names do not match"
                            });
                    return;
                }
            }
            // console.log(JSON.stringify(fileTemplateMapping));
//    postMessage({
//        type: "headers",
//        data: csvheaders,
//        message: ""
//    });
            var header = templateheaders;//csvheaders;
            header.push('isvalid');
            var headings = header.join('~');
            if (fileRows.length === 1) {
                postMessage({
                    type: "headers",
                    data: csvheaders,
                    message: ""
                });
                postMessage(
                        {
                            type: "error",
                            data: false,
                            message: "No data found, select other sheet or file"
                        });
            } else if (fileRows.length > 1 && csvheaders.length === attributeLists.length) {
                try {
                    var isvalid;
                    var invalidReason = "";
                    for (var f = 1, max = fileRows.length; f < max; f++) {
                        var currentRowObj = {};
                        var currentRow = fileRows[f].split(',');
                        var isRowEmpty = true;
                        isvalid = "valid";
                        invalidReason = {};
                        var attrIdList = [];
                        for (var a = 0, attrMax = attributeLists.length; a < attrMax; a++) {
                            if (currentRow[fileTemplateMapping[templateheaders[a]]]) {
                                isRowEmpty = false;
                            }
                            currentRow[fileTemplateMapping[templateheaders[a]]] = currentRow[fileTemplateMapping[templateheaders[a]]].replace(/"/g, '')
                            attrIdList.push([attributeLists[a]['attributeid']]);
                            if (validateRecord(attributeLists[a], currentRow[fileTemplateMapping[templateheaders[a]]].trim())) {
                                //isvalid = 'valid';
                                //  console.log(attributeLists[a]);
                                //  console.log(currentRow[fileTemplateMapping[templateheaders[a]]]);
                            } else {
                                isvalid = 'invalid';
                                //console.log(templateheaders[a]+":"+currentInvalidReason)
                                invalidReason[templateheaders[a]] = currentInvalidReason;
                            }
                            currentRow[fileTemplateMapping[templateheaders[a]]] = currentRow[fileTemplateMapping[templateheaders[a]]].trim();
                            currentRowObj[templateheaders[a]] = currentRow[fileTemplateMapping[templateheaders[a]]].replace(/\^\^/g, ',');
                            currentInvalidReason = "";
                        }
                        currentRowObj['attributeid'] = attrIdList.join("~");
                        currentRowObj['heading'] = headings;
                        currentRowObj['isvalid'] = isvalid;
                        currentRowObj['invalidReason'] = invalidReason;
                        //console.log(currentRowObj['invalidReason'])
                        if (!isRowEmpty) {
                            returnedData.push(currentRowObj);
                        }
                        //console.log(returnedData);
                    }
                } catch (e) {
                    //console.log(e);
                }
                postMessage({
                    type: "headers",
                    data: templateheaders,
                    message: ""
                });
                // console.log(returnedData);

                returnedData = returnedData.concat(stagingData);
                returnedData = returnedData.concat(rejectData);
                returnedData = returnedData.concat(masterData);


                postMessage({
                    type: "tabledata",
                    data: returnedData
                });
                /* for (var i = 1; i < fileRows.length; i++) {
                 var myobj = {};
                 var currentRow = fileRows[i].split(',');
                 var isvalid = "valid";
                 for (var j = 0; j < attributeLists.length; j++) {
                 if (currentRow[j] != '') {
                 switch (attributeLists[j]['datatype']) {
                 case 'number':
                 if (attributeLists[j]['mandatoryflag'] != '' && attributeLists[j]['mandatoryflag'].toLowerCase() == 'y' && currentRow[j] == '' ||
                 Number(attributeLists[j]['minvalue']) > Number(currentRow[j]) ||
                 Number(attributeLists[j]['maxvalue']) < Number(currentRow[j])) {
                 isvalid = "invalid";
                 }
                 break;
                 case 'string':
                 if (attributeLists[j]['mandatoryflag'] != '' && attributeLists[j]['mandatoryflag'].toLowerCase() == 'y' && currentRow[j] == '' ||
                 Number(attributeLists[j]['minlength']) > currentRow[j].length ||
                 Number(attributeLists[j]['maxlength']) < currentRow[j].length) {
                 isvalid = "invalid";
                 }
                 break;
                 case 'boolean':
                 if (attributeLists[j]['mandatoryflag'] != '' && attributeLists[j]['mandatoryflag'].toLowerCase() == 'y' && currentRow[j] == '' ||
                 currentRow[j].toLowerCase() == 'n' ||
                 currentRow[j].toLowerCase() == 'no' ||
                 currentRow[j].toLowerCase() == 'false') {
                 isvalid = "invalid";
                 }
                 break;
                 default :
                 if (attributeLists[j]['mandatoryflag'] != '' && attributeLists[j]['mandatoryflag'].toLowerCase() == 'y' && currentRow[j] == '') {
                 isvalid = "invalid";
                 }
                 break;
                 }
                 myobj[csvheaders[j]] = currentRow[j];
                 }
                 }
                 myobj['heading'] = headings;
                 myobj['isvalid'] = isvalid;
                 returnedData.push(myobj);
                 // console.log(myobj)
                 
                 }
                 postMessage({
                 type: "tabledata",
                 data: returnedData
                 });*/
            } else {
                postMessage({
                    type: "error",
                    data: false,
                    message: "Number of columns in the file do not match template columns"
                });
            }
            //console.log(returnedData);
            //console.timeEnd("dataParse");
            break;
        default:

            break;
    }


};
