'use strict'

// 定义错误号
const ISNULL = 0;               // 输入为空，eg：''
const ISNAN = 1;                // 输入含有非法字符，eg：'十度非ddsdqq.,./;'
const ISSPACE = 2;              // 输入含有空格符，eg：'123 345 5 67'
const ISZERO = 3;               // 第二个数不能为0，eg：2 % 0，除数不能为0
const ISILLEGALNUM = 4;         // 输入为非法数字，eg：'0000001', '03', '0004'
const ISMINUS = 5;              // 输入不能为负数，eg：'-12435'
const ISFLOAT = 6;              // 输入不能为小数，eg：'1.24345'
const INSTRUCTIONERROR = 7;     // 指令格式错误
const ISOK = 7;                 // 输入合法

// 定义函数类型
const GET_REMAINDER = 0;        // 求余
const GET_CALCULATE = 1;        // 求计算值
const GET_STR_SUM = 2;          // 求字符串和
const GET_NUM_LCD = 3;          // 求数字符号
const GET_LOGIC_ANSWER = 4;     // 求逻辑题答案

// 输入异常检查函数
function check_input(mode, inputStr1, inputStr2) {
    switch (mode) {
        case GET_REMAINDER: return check_input_1(inputStr1, inputStr2); 
        case GET_CALCULATE: return check_input_2(inputStr1);
        case GET_STR_SUM: return check_input_3(inputStr1);   
        case GET_NUM_LCD: return check_input_4(inputStr1);
        case GET_LOGIC_ANSWER: return check_input_5(inputStr1);
    }
}

// 求余输入异常检查函数
function check_input_1(num1, num2) {
    if (num1 === '' || num2 === '') {    // 输入为空
        return ISNULL;
    } else if (isNaN(num1) || isNaN(num2) || isNaN(num1[num1.length - 1]) || isNaN(num2[num2.length - 1])) {    // 输入含有非法字符
        return ISNAN;
    } else if (!(/^[0-9]+.?[0-9]*/).test(num1) || !(/^[0-9]+.?[0-9]*/).test(num2)) {    // 输入含有空格
        return ISSPACE;
    } else if (Number(num2) === 0) {    // 除数为0
        return ISZERO;
    } else if (Number(num1[0]) === 0 || Number(num2[0]) === 0) {          // 输入为非法数字
        return ISILLEGALNUM;
    } else {                            // 输入正确
        return ISOK;
    }
} 

// 求计算值输入检查函数
function check_input_2(inputStr) {
    var inputArray = inputStr.split(",");
    var inputStr = inputStr.replace(",", "");
    if (inputStr === '') {                        // 输入为空
        return ISNULL;
    } else if (inputStr.indexOf(" ") !== -1) {    // 输入含有空格
        return ISSPACE;
    } else {
        for (var i = 0; i < inputArray.length; i++) {
            if (isNaN(inputArray[i]) || isNaN(inputArray[i][inputArray[i].length - 1])) {
                return ISNAN;                     // 输入含有非法字符
            }
            if (Number(inputArray[i][0]) === 0) { // 输入为非法数字
                return ISILLEGALNUM;
            }
        }
        return ISOK;                              // 输入合法
    } 
}

// 求字符串和输入检查函数
function check_input_3(inputNumStr) {
    if (inputNumStr === "") {                                // 输入为空
        return ISNULL;
    } else if (isNaN(inputNumStr) || isNaN(inputNumStr[inputNumStr.length - 1])) {   // 输入含有非法字符
        return ISNAN;
    } else if (Number(inputNumStr.indexOf(" ")) !== -1) {    // 输入含有空格
        return ISSPACE;
    } else if (Number(inputNumStr.indexOf("-")) !== -1) {    // 输入不能为负数
        return ISMINUS;
    } else if (Number(inputNumStr.indexOf(".")) !== -1) {    // 输入不能为小数
        return ISFLOAT;
    } else {                                                 // 输入合法
        return ISOK;
    }
}

// 求数字LCD符号输入检查函数
function check_input_4(inputStr) {
    if (inputStr === "") {                                // 输入为空
        return ISNULL;
    } else if (isNaN(inputStr) || isNaN(inputStr[inputStr.length - 1])) {   // 输入含有非法字符
        return ISNAN;
    } else if (Number(inputStr.indexOf(" ")) !== -1) {    // 输入含有空格
        return ISSPACE;
    } else if (Number(inputStr.indexOf("-")) !== -1) {    // 输入不能为负数
        return ISMINUS;
    } else if (Number(inputStr.indexOf(".")) !== -1) {    // 输入不能为小数
        return ISFLOAT;
    } else {                                              // 输入合法
        return ISOK;
    }
}

// 求逻辑题答案输入检查函数
function check_input_5(inputStrArray) {
    for (var i = 0; i < inputStrArray.length; i++) {    // 输入为空
        if (inputStrArray[i] === "") {                 
            return ISNULL;
        }
    }
    if (isNaN(inputStrArray[0]) || Number(inputStrArray[0]) === 0) {    // 问题编号检查
        return ISNAN;
    }
    for (var i = 1; i < inputStrArray.length; i++) {    // 输入指令检查
        if (inputStrArray[i].length < 10) {
            return INSTRUCTIONERROR;
        }
        var tempArray = inputStrArray[i].split("-");
        for (var j = 0; j < 4; j++) {
            if (isNaN(tempArray[j]) || isNaN(tempArray[j][tempArray[j].length - 1])) {
                return INSTRUCTIONERROR;
            }
        }
    }
    return ISOK;
}

// 打印错误号对应错误信息
function print_error(errno) {
    switch (errno) {
        case ISNULL: alert("错误：输入不能为空！"); break;
        case ISNAN: alert("错误：输入含有非法字符！"); break;
        case ISSPACE: alert("错误：输入不能含有空格符！"); break;
        case ISZERO: alert("错误：第二个数不能为0！"); break;
        case ISILLEGALNUM: alert("错误：输入为非法数字，eg：'0000001', '03', '0004'！"); break;
        case ISMINUS: alert("错误：输入不能为负数！"); break;
        case ISFLOAT: alert("错误：输入不能为小数！"); break;
        case INSTRUCTIONERROR: alert("错误：输入指令格式错误！"); break;
    }
}
