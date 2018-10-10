/* ThoughtWorks训练营作业之JavaScript简单编程题-1 */

'use strict'

// 求余
function get_remainder() {
    var num1 = document.getElementById("num1").value;
    var num2 = document.getElementById("num2").value;
    if (check_input(GET_REMAINDER, num1, num2) === ISOK) {
        document.getElementById("result").innerHTML = (num1 % num2).toString();
    } else {
        document.getElementById("result").innerHTML = "请重新输入！";
        print_error(check_input(GET_REMAINDER, num1, num2));
    }
}