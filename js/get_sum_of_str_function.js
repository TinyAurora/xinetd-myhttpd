/* ThoughtWorks训练营作业之Javascript中级编程题-1 */

'use strict'

// 求解
function get_sum_of_str() {
    var inputNumStr = document.getElementById("inputNumStr").value;
    if (check_input(GET_STR_SUM, inputNumStr) === ISOK) {
        output_sum(inputNumStr);
    } else {
        document.getElementById("sum").innerHTML = "请重新输入！";
        print_error(check_input(GET_STR_SUM, inputNumStr));
    }
}

// 输出
function output_sum(inputNumStr) {
    var sum = 0;
    for (var i = 0; i < inputNumStr.length; i++) {
        sum += Number(inputNumStr[i]);
    }
    document.getElementById("sum").innerHTML = String(sum);
}

