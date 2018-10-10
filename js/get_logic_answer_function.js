/* ThoughtWorks训练营作业之第二组逻辑题 */

'use strict'

// 求解函数
function get_answer() {
    var inputStrArray = get_input();    // 获取输入字符串数组
    if (check_input(GET_LOGIC_ANSWER, inputStrArray) === ISOK) {
        output_answer(inputStrArray);
    } else {
        document.getElementById("answer").innerHTML = "请重新输入！";
        print_error(check_input(GET_LOGIC_ANSWER, inputStrArray));
    }
}

// 读取输入
function get_input() {
    var inputStrArray = [];
    inputStrArray[0] = document.getElementById("question_num").value;
    inputStrArray[1] = document.getElementById("instruction_1").value;
    inputStrArray[2] = document.getElementById("instruction_2").value;
    inputStrArray[3] = document.getElementById("instruction_3").value;
    inputStrArray[4] = document.getElementById("instruction_4").value;
    inputStrArray[5] = document.getElementById("instruction_5").value;
    inputStrArray[6] = document.getElementById("instruction_6").value;
    inputStrArray[7] = document.getElementById("instruction_7").value;
    inputStrArray[8] = document.getElementById("instruction_8").value;
    inputStrArray[9] = document.getElementById("instruction_9").value;
    return inputStrArray;
}

// 流程图中每个结点所拥有的信息属性
function Node(seq, value, yes, no, instructionHead) {
    this.seq = seq;         // 编号
    this.value = value;     // 数字
    this.yes = yes;         // 在有‘Yes or No’选择的情况下，yes等于‘Yes’箭头指向的编号；若无‘Yes or No’选择，则yes等于箭头指向的编号
    this.no = no;           // 在有‘Yes or No’选择的情况下，no等于‘No’箭头指向的编号；若无‘Yes or No’选择，则no等于0，表示没有指向任何编号或者指向End结束
    this.instructionHead = instructionHead;    // 表示每条指令中最前面的两个汉字，用作指令头来区分不同指令的行为
    this.numInInstruction = [];                // 存储指令中含有的数字，方便执行指令的行为
}

// 输入字符串解析
function input_str_parse(inputStr) {
    // 建立结点以存储字符串中有用的信息
    var node = new Node(
        Number(inputStr[0]),    
        Number(inputStr[2]), 
        Number(inputStr[4]), 
        Number(inputStr[6]), 
        inputStr.substring(8, 10)
    );
    // 提取出指令中含有的数字信息
    var tempStr = inputStr.substring(8);
    for (var i = 0; i < tempStr.length; i++) {
        if (tempStr[i] >= '1' && tempStr[i] <= '9') {
            node.numInInstruction.push(Number(tempStr[i]));
        }
    }
    return node;
}

// 获取输入信息中的有用信息
function get_input_info(inputStrArray) {
    var inputInfo = [];
    inputInfo[0] = Number(inputStrArray[0]);
    for (var i = 1; i < inputStrArray.length; i++) {
        inputInfo[i] = input_str_parse(inputStrArray[i]);
    }
    return inputInfo;
}

/*****************************************五种指令类型处理函数*****************************************/
// ‘改变’指令
function change_instruction(numInInstruction, inputInfo) {
    inputInfo[numInInstruction[0]].numInInstruction[numInInstruction[1] - 1] += numInInstruction[2];  
}

// ‘判断’指令
function judge_instruction(numInInstruction, inputInfo) {
    return inputInfo[numInInstruction[0]].numInInstruction[numInInstruction[1] - 1] > inputInfo[numInInstruction[2]].value ? 'yes' : 'no';
}

// ‘相乘’指令
function multiply_instruction(numInInstruction, inputInfo) {
    inputInfo[numInInstruction[2]].value = inputInfo[numInInstruction[0]].value * inputInfo[numInInstruction[1]].value;
}

// ‘相加’指令
function plus_instruction(numInInstruction, inputInfo) {
    inputInfo[numInInstruction[2]].value = inputInfo[numInInstruction[0]].value + inputInfo[numInInstruction[1]].value;
}

// ‘将’指令
function put_instruction(numInInstruction, inputInfo) {
    inputInfo[numInInstruction[1]].value = inputInfo[numInInstruction[0]].value;     
}

// 执行指令
function execute_instruction(node, inputInfo) {
    var nextPos = node.yes;
    switch (node.instructionHead) {
        case '更改': change_instruction(node.numInInstruction, inputInfo);   break;
        case '相乘': multiply_instruction(node.numInInstruction, inputInfo); break;
        case '相加': plus_instruction(node.numInInstruction, inputInfo);     break;
        case '判断': nextPos = (judge_instruction(node.numInInstruction, inputInfo) === 'yes' ? node.yes : node.no); break;
        default: put_instruction(node.numInInstruction, inputInfo); break;
    }
    return nextPos;
}

// 输出
function output_answer(inputStrArray) {
    var inputInfo = get_input_info(inputStrArray);    // 表示整个流程执行过程中每个结点的实时信息
    var step = inputInfo[1].seq;
    while (step != 0) {
        step = execute_instruction(inputInfo[step], inputInfo);
        console.log("ggggg");
    }
    document.getElementById("answer").innerHTML = inputInfo[Number(inputInfo[0])].value;
}