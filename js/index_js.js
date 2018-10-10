'use strict'

function select_hw(evt, hw_num) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(hw_num).style.display = "block";
    evt.currentTarget.className += " active";
}

// 触发 id="defaultselected" click 事件
document.getElementById("defaultselected").click();