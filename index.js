//页面加载后读取localStorage中的信息
window.onload = function() {
	for (var i = 0; i < localStorage.length; i++) {
		document.getElementsByTagName('input')[i].value = localStorage['act' + i];
		addNewAct();
	}

}

//定义几个常用的全局变量
var newAct = document.getElementById('newAct');
var content = document.getElementById('content');
var save = document.getElementById('save');
var clear = document.getElementById('clear');
//初始化按钮数组
doneAttach();
delAttach();
//添加按钮功能事件
newAct.addEventListener('click', addNewAct);

function addNewAct() {
	//动态创建活动及其按钮
	var div = document.createElement('div');
	var typeArea = document.createElement('input');
	typeArea.setAttribute("type", "text");
	typeArea.setAttribute("class", "typeArea");
	var button1 = document.createElement('button');
	var txt1 = document.createTextNode('Done');
	button1.setAttribute("type", "button");
	button1.setAttribute("class", "done");
	var button2 = document.createElement('button');
	var txt2 = document.createTextNode('Delete');
	button2.setAttribute("type", "button");
	button2.setAttribute("class", "delete");
	div.appendChild(typeArea);
	div.appendChild(button1);
	button1.appendChild(txt1);
	div.appendChild(button2);
	button2.appendChild(txt2);
	content.appendChild(div);
	doneAttach();
	delAttach();

}


//每次创建新活动时重新获取‘完成按钮’数组，并重新绑定doneAct事件
function doneAttach() {
	var doneBtn = document.getElementsByClassName('done');
	for (var j = 0; j < doneBtn.length; j++) {
		doneBtn[j].addEventListener('click', doneAct);
	}
}
//每次创建新活动时重新获取‘删除按钮’数组，并重新绑定delAct事件
function delAttach() {
	var delBtn = document.getElementsByClassName('delete');
	for (var i = 0; i < delBtn.length; i++) {
		delBtn[i].addEventListener('click', delAct);
	}
}
//删除按钮功能事件
function delAct() {
	var r = confirm("确定删除该活动？")
	if (r === true) {
		content.removeChild(this.parentNode);
	} else {
		return false;
	}
}
//完成按钮功能事件
function doneAct() {
	this.parentNode.firstChild.value = "done";

}

//清空按钮功能事件
clear.addEventListener('click', clearAll);

function clearAll() {
	var r = confirm("是否清空任务？")
	if (r === true) {
		while (content.hasChildNodes()) //当content下还存在子节点时 循环继续
		{
			content.removeChild(content.firstChild);
			localStorage.clear();
		}
	} else {
		return false;
	}
}

//保存按钮功能事件
save.addEventListener('click', saveInfo);

function saveInfo() {
	var input = document.getElementsByTagName('input');
	//将信息循环存入localStorage
	for (var i = 0; i < input.length; i++) {
		localStorage['act' + i] = input[i].value;
	}

}