//定义几个常用的全局变量
var lang = "zh";
var header = document.getElementById('header');
var totalNumber = document.getElementById('totalNumber');
var changeLang = document.getElementById('changeLang');
var content = document.getElementById('content');
var newAct = document.getElementById('newAct');
var save = document.getElementById('save');
var clear = document.getElementById('clear');
var currentYear = document.getElementById('currentYear');
//初始化按钮数组
doneAttach();
delAttach();

//页面加载后读取localStorage中的信息
window.onload = function() {
	var today = new Date();
	currentYear.innerHTML = today.getFullYear();
	if (!localStorage.mc_to_do_list) { //检测localStorage中是否存在mc_to_do_list，否则控制台会报错（虽然没啥大影响）
		total();
	} else {
		var list = JSON.parse(localStorage.mc_to_do_list); //这里list是对象 不是数组 注意遍历方式 （我可真蠢）
		for (var i in list) {
			addNewAct();
			var obj = list[i]; //i是键名actX
			var number = i.split('act')[1]; //取出键名中的数字部分
			document.getElementsByTagName('input')[number].value = obj.taskName;
			if (obj.taskDone === 'disabled') {
				document.getElementsByTagName('input')[number].setAttribute('disabled', obj.taskDone);
				document.getElementsByTagName('input')[number].className = "inputDone";
			}
		}
		total();
	}
}

//添加按钮功能事件
newAct.addEventListener('click', addNewAct);

function addNewAct() {
	//动态创建活动及其按钮
	var div = document.createElement('div');
	div.setAttribute('class', 'box');
	var typeArea = document.createElement('input');
	typeArea.setAttribute("type", "text");
	typeArea.setAttribute("class", "typeArea");
	var button1 = document.createElement('button');
	if (lang === 'en') {
		var txt1 = document.createTextNode('Done');
	} else {
		var txt1 = document.createTextNode('完成');
	}
	button1.setAttribute("type", "button");
	button1.setAttribute("class", "done");
	var button2 = document.createElement('button');
	if (lang === 'en') {
		var txt2 = document.createTextNode('Del');
	} else {
		var txt2 = document.createTextNode('删除');
	}
	button2.setAttribute("type", "button");
	button2.setAttribute("class", "delete");
	var button3 = document.createElement('button');
	button3.setAttribute("type", "button");
	button3.setAttribute("class", "top-this");
	div.appendChild(typeArea);
	div.appendChild(button1);
	button1.appendChild(txt1);
	div.appendChild(button2);
	button2.appendChild(txt2);
	div.appendChild(button3);
	content.appendChild(div);
	doneAttach();
	delAttach();
	topAttach();
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
//每次创建新活动时重新获取‘置顶按钮’数组，并重新绑定topAct事件
function topAttach() {
	var topBtn = document.getElementsByClassName('top-this');
	for (var k = 0; k < topBtn.length; k++) {
		topBtn[k].addEventListener('click', topAct);
	}
}
//删除按钮功能事件
function delAct() {
	if (lang === 'zh') {
		var r = confirm("确定删除该活动？");
	} else {
		var r = confirm("Delete this task?");
	}
	if (r === true) {
		var div = this.parentNode;
		addClass(div, 'box-out');
		div.addEventListener('animationend', function() {
			content.removeChild(div);
			idChange();
			stripColor();
		});
		div.addEventListener('webkitAnimationEnd', function() {
			content.removeChild(div);
			idChange();
			stripColor();
		});
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
//置顶按钮功能事件
function topAct() {
	var div = this.parentNode.cloneNode(true);
	var returnedNode = content.insertBefore(div, content.firstChild);
	content.removeChild(this.parentNode);
	doneAttach();
	delAttach();
	topAttach();
	idChange();
	stripColor();
	total();
}
//清空按钮功能事件
clear.addEventListener('click', clearAll);

function clearAll() {
	if (lang === 'zh') {
		var r = confirm("是否清空任务？");
	} else {
		var r = confirm("Clear all the tasks?");
	}
	if (r === true) {
		while (content.hasChildNodes()) //当content下还存在子节点时 循环继续
		{
			content.removeChild(content.firstChild);
			localStorage.removeItem("mc_to_do_list");
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
	var list = {};
	//将信息循环存入localStorage
	for (var i = 0; i < inputs.length; i++) {
		var task = {
			taskName: inputs[i].value.trim(),
			taskDone: inputs[i].getAttribute('disabled')
		};
		list['act' + i] = task;
		//localStorage['act' + i] = JSON.stringify(task);
	}
	localStorage.mc_to_do_list = JSON.stringify(list);
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
			divs[i].style.backgroundColor = '#fff';
		} else {
			divs[i].style.backgroundColor = '#f7f7f7';
		}
	}
}
//追加class属性
function addClass(elem, value) {
	if (!elem.className) {
		elem.className = value;
	} else {
		newClassName = elem.className;
		newClassName += " ";
		newClassName += value;
		elem.className = newClassName;
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
	if (lang === 'zh') {
		totalNumber.innerHTML = "您有" + total + "件事要做";
	} else {
		if (total <= 1) {
			totalNumber.innerHTML = total + " task to do";
		} else {
			totalNumber.innerHTML = total + " tasks to do";
		}
	}

}

//改变语言按钮事件
changeLang.addEventListener('click', changeLanguage);

function changeLanguage() {
	if (lang === 'zh') {
		lang = 'en';
		changeLang.innerText = "English";
		newAct.innerText = 'New Activity';
		save.innerText = 'Save';
		clear.innerText = 'Clear';
		var divs = content.childNodes;
		for (var i = 0; i < divs.length; i++) {
			var done = divs[i].firstChild.nextSibling;
			done.innerText = 'Done';
			done.nextSibling.innerText = 'Del';
		}
		total();
	} else {
		lang = 'zh';
		changeLang.innerText = "中文";
		newAct.innerText = '新建活动';
		save.innerText = '保存';
		clear.innerText = '清空';
		var divs = content.childNodes;
		for (var i = 0; i < divs.length; i++) {
			var done = divs[i].firstChild.nextSibling;
			done.innerText = '完成';
			done.nextSibling.innerText = '删除';
		}
		total();
	}

}