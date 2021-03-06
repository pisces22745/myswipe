function Carousel(list, index) {
	var _this = this;
	this.list = list;
	this.index = index;
	this.children = list.children;
	this.setting = {"speed": 100, "delay": 800, "autoplay": false, "direction": -1};
	var fingerSX = 0;
	var fingerSY = 0;
	this.list.addEventListener('touchstart', function (e) {
		fingerSX = e.changedTouches[0].pageX
	}, false);
	this.list.addEventListener('touchend', function (e) {
		var fingerEX = e.changedTouches[0].pageX;
		var dis = fingerEX - fingerSX;
		_this.moveList(dis);
		var active = _this.getActIndex(_this.children);
		_this.toggleRadius(_this.index.children, active - 1)
	}, false)
}
Carousel.prototype = {
	setListWidth: function (obj) {	//	设置容器宽度
		var children = this.children;
		var childWidth = this.getWidth(children[0]);
		obj.style.width = childWidth * children.length + "px"
	}, getWidth: function (obj) {	//	获得对象的宽度
		return obj.clientWidth
	}, getActIndex: function (children) {
		for (var i = 0; i < children.length; i++) {
			if (children[i].getAttribute('class')) {
				return i
			}
		}
	}, addAct: function (obj) {		//	添加active类做标示
		obj.setAttribute('class', 'active')
	}, removeAct: function (children) {
		for (var i = 0; i < children.length; i++) {
			children[i].removeAttribute('class')
		}
	}, autoPlay: function (direction, delay) {	//	自动播放
		var _this = this;
		setInterval(function () {
			_this.moveList(direction);
			var active = _this.getActIndex(_this.children);
			_this.toggleRadius(_this.index.children, active - 1)
		}, delay)
	}, toggleRadius: function (obj, j) {		//  圆点轮播
		for (var i = 0; i < obj.length; i++) {
			obj[i].style.background = 'rgba(255,255,255,.5)'
		}
		obj[j].style.background = '#fff'
	}, removeTransit: function (list, listWidth) {	//移除transition效果
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				resolve('removeTransit');
				list.style.transition = 'none';
				list.style.left = listWidth + 'px'
			}, 200)
		})
	}, addTransit: function (list, speed) {		//  添加transition效果
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				resolve("a");
				list.style.transition = 'left ' + speed + 'ms'
			}, 20)
		})
	}, moveList: function (dis) {				//  轮播
		var _this = this;
		var list = this.list;
		var children = this.children;
		var aWidth = this.getWidth(children[0]);
		var listWidth = (children.length - 2) * aWidth;
		var left = this.list.offsetLeft;
		var index = this.getActIndex(children);
		var active = index;
		for (var i = 1; i < children.length - 1; i++) {
			if (i == active) {
				left = -active * aWidth
			}
		}
		if (dis > 0) {
			index = index == 1 ? children.length - 1 : index;
			left = left + aWidth;
			list.style.left = left + 'px';
			if (left == 0) {
				_this.removeTransit(list, -listWidth).then(function (res) {
					return _this.addTransit(list, _this.setting.speed)
				})
			}
			_this.removeAct(children);
			_this.addAct(children[index - 1])
		} else {
			index = index == children.length - 2 ? 0 : index;
			left = left - aWidth;
			list.style.left = left + 'px';
			if (left == -listWidth - aWidth) {
				_this.removeTransit(list, -aWidth).then(function (res) {
					return _this.addTransit(list, _this.setting.speed)
				})
			}
			_this.removeAct(children);
			_this.addAct(children[index + 1])
		}
	}, init: function (setting) {				// 初始化
		var _this = this;
		for (var temp in setting) {
			this.setting[temp] = setting[temp]
		}
		style = this.list.style;
		this.setListWidth(_this.list);
		var aWidth = this.getWidth(this.list.children[0]);
		style.left = -aWidth + 'px';
		if (this.setting.autoplay) {
			this.autoPlay(_this.setting.direction, _this.setting.delay)
		}
	}
}