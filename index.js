//页面加载后读取localStorage中的信息
window.onload = function() {
	for (var i = 0; i < localStorage.length; i++) {
		addNewAct();
		document.getElementsByTagName('input')[i].value = localStorage['act' + i];
	}
	total();

}

//定义几个常用的全局变量
var header = document.getElementById('header');
var content = document.getElementById('content');
var newAct = document.getElementById('newAct');
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
	var txt1 = document.createTextNode('完成');
	button1.setAttribute("type", "button");
	button1.setAttribute("class", "done");
	var button2 = document.createElement('button');
	var txt2 = document.createTextNode('删除');
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
	idChange();
	stripColor();
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
	var r = confirm("确定删除该活动？");
	if (r === true) {
		//清空localStorage中所有键/值对，重新写入
		localStorage.clear();
		content.removeChild(this.parentNode);
		idChange();
		saveInfo();
		stripColor();
	} else {
		return false;
	}
}
//完成按钮功能事件
function doneAct() {
	var input = this.parentNode.firstChild;
	if (input.className !== 'inputDone') {
		input.className = "inputDone";
		input.setAttribute("disabled", "disabled");
	} else {
		input.className = " ";
		input.removeAttribute("disabled");
	}
	total();
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
	total();
}

//保存按钮功能事件
save.addEventListener('click', saveInfo);

function saveInfo() {
	var inputs = content.getElementsByTagName('input');
	//将信息循环存入localStorage
	for (var i = 0; i < inputs.length; i++) {
		localStorage['act' + i] = inputs[i].value.trim();
	}
	total();
}

//动态改变input的id值
function idChange() {
	var inputs = content.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].setAttribute("id", "act" + i);
	}
}

//斑马背景色
function stripColor() {
	var divs = content.childNodes;
	for (var i = 0; i < divs.length; i++) {
		var id = divs[i].firstChild.getAttribute('id');
		//取出id中的纯数字部分
		var id = id.split('act');
		//此时id为['','number'],故应使用id[1]
		if (id[1] % 2 !== 1) {
			divs[i].setAttribute('class', 'box');
		} else {
			divs[i].setAttribute('class', 'box-strip');
		}
	}
}

//统计待办事项数目
function total() {
	var total = 0;
	var divs = content.childNodes;
	for (var i = 0; i < divs.length; i++) {
		var input = divs[i].firstChild;
		if (input.tagName.toLowerCase() === 'input' && input.value.trim() !== '' && input.getAttribute('disabled') !== 'disabled') {
			total++;
		}
	}
	header.innerHTML = "You have " + total + " things to do";
}