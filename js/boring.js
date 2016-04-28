/*!
 * Author: Boring
 * Update: 2016-04-26 12:12
 */

(function () {
	function getByClass(className, container) {
		var container = container || document,
			elms,
			i;

		if (container.getElementsByClassName) {
			elms = container.getElementsByClassName(className);
		} else if (container.querySelectorAll) {
			elms = container.querySelectorAll('.' + className);
		}

		return elms;
	}

	function forEach(array, handler) {
		var i;

		if ([].forEach) {
			[].forEach.call(array, handler);
		} else {
			for (i = 0; i < array.length; i++) {
				handler(array[i], i, array);
			}
		}
	}

	function filter(array, handler) {
		var newArray = [],
			i;

		if ([].filter) {
			[].filter.call(array, handler);
		} else {
			forEach(array, function (item) {
				if (handler(item)) {
					newArray.push(item);
				}
			});
		}

		return newArray;
	}

	function listen(elm, type, handler, capture) {
		if (elm.addEventListener) {
			elm.addEventListener(type, handler, capture || false);
		} else if (elm.attachEvent) {
			elm.attachEvent('on' + type, handler);
		}
	}

	function preventEventDefault(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}

	function getClassList(elm) {
		return elm.classList || {
			add: function (className) {
				if (this.contains(className)) {
					return;
				}

				elm.className += " " + className;
			},

			remove: function (className) {
				if (!this.contains(className)) {
					return;
				}

				elm.className = elm.className.replace(className, "");
			},

			toggle: function (className) {
				if (this.contains(className)) {
					this.remove(className);
				} else {
					this.add(className);
				}
			},

			contains: function (className) {
				var elmClasses = elm.className.split(' '),
					contained = false;

				forEach(elmClasses, function (elmClass) {
					if (elmClass === className) {
						contained = true;
					}
				});

				return contained;
			}
		};
	}

	function getData(elm, dataName) {
		var dataset = elm.dataset,
			dataValue;

		if (dataset) {
			dataValue = dataset[dataName];
		} else {
			dataValue = elm.getAttribute('data-' + dataName);
		}

		return dataValue;
	}

	function setData(elm, dataName, dataValue) {
		var dataset = elm.dataset;

		if (dataset) {
			dataset[dataName] = dataValue;
		} else {
			elm.setAttribute('data-' + dataName, dataValue);
		}
	}

	function removeData(elm, dataName) {
		var dataset = elm.dataset;

		if (dataset) {
			delete dataset[dataName];
		} else {
			elm.removeAttribute('data-' + dataName);
		}
	}

	function bubbleElement(elm, tester) {
		var passed = true;

		while (!tester(elm)) {
			elm = elm.parentNode;

			if (elm.nodeType !== 1) {
				passed = false;
				break;
			}
		}

		return passed ? elm : undefined;
	}

	function removeNode(node) {
		if (node.remove) {
			node.remove();
		} else {
			node.parentNode.removeChild(node);
		}
	}

	function createObject(proto) {
		function Temp() {}

		var newObj = null;

		if (Object.create) {
			newObj = Object.create(proto);
		} else {
			Temp.prototype = proto;
			newObj = new Temp();
		}

		return newObj;
	}

	var boring = {
		getByClass: getByClass,
		forEach: forEach,
		listen: listen,
		preventEventDefault: preventEventDefault,
		bubbleElement: bubbleElement,
		removeNode: removeNode,
		getClassList: getClassList,
		getData: getData,
		setData: setData,
		removeData: removeData
	};

	(function () {
		var
			HANDLES_CLASS = 'boring-tab-handles',
			PANELS_CLASS = 'boring-tab-panels',
			CURRENT_CLASS = 'boring-tab-current',

			tab = {
				listenEvents: function () {
					var _this = this;

					forEach(this.handles, function (handle, index) {
						listen(handle, _this.eventType, function () {
							_this.go(index);
						});
					});
				},

				go: function (index) {
					if (!this.panels[index]) {
						return;
					}

					this.clearCurrentStatus();
					this.addTargetStatus(index);
					this.current = index;

					this.config.ongo && this.config.ongo(this);
				},

				clearCurrentStatus: function () {
					getClassList(this.handles[this.current]).remove(CURRENT_CLASS);
					getClassList(this.panels[this.current]).remove(CURRENT_CLASS);
				},

				addTargetStatus: function (index) {
					getClassList(this.handles[index]).add(CURRENT_CLASS);
					getClassList(this.panels[index]).add(CURRENT_CLASS);
				},

				forward: function () {
					this.go(this.current + 1);
				},

				back: function () {
					this.go(this.current - 1);
				},

				init: function (container, config) {
					var config = config || {},
						sign = config.sign || '',
						signSuffix = sign ? '-' + sign : '',
						container = typeof container === 'string' ? document.getElementById(container) : container;

					this.handles = [].slice.call(getByClass(HANDLES_CLASS + signSuffix, container)[0].children);
					this.panels = [].slice.call(getByClass(PANELS_CLASS + signSuffix, container)[0].children);
					this.eventType = config.event || 'click';
					this.current = 0;
					this.config = config;

					this.listenEvents();
					config.oninit && config.oninit(this);

					this.go(0);
				}
			};

		boring.tab = function (container, config) {
			var newTab = createObject(tab);

			newTab.init(container, config);

			return newTab;
		};
	}());

	(function () {
		var DIALOG_OPENED_CLASS = 'boring-dialog-opened',
			MASK_CLASS = 'boring-dialog-mask',
			MASK_OPENED_CLASS = 'boring-dialog-mask-opened',
			CLOSER_CLASS = 'boring-dialog-closer',
			CONFIRM_CLASS = 'boring-dialog-confirm',
			CANCEL_CLASS = 'boring-dialog-cancel',

			dialog = {
				init: function (container, config) {
					var config = config || {};

					this.element = typeof container === 'string' ? document.getElementById(container) : container;

					if (!config.noMask) {
						this.mask = createObject(mask);
						this.mask.init(this);
					}

					this.config = config;
					this.centerAfterLoaded();
					this.listenEvents();
				},

				open: function () {
					var _this = this;

					this.center();
					getClassList(this.element).add(DIALOG_OPENED_CLASS);
					this.mask && this.mask.open();
					this.config.onopen && this.config.onopen();

					if (this.config.autoClose) {
						setTimeout(function () {
							if (_this.isOpened()) {
								_this.close();
							}
						}, this.config.autoClose);
					}
				},

				close: function () {
					getClassList(this.element).remove(DIALOG_OPENED_CLASS);
					this.mask && this.mask.close();
					this.config.onclose && this.config.onclose();
					this.config.onmanualclose && arguments[0] instanceof Event && this.config.onmanualclose();
				},

				isOpened: function () {
					return getClassList(this.element).contains(DIALOG_OPENED_CLASS);
				},

				centerAfterLoaded: function () {
					var imgs = [].slice.call(this.element.getElementsByTagName('img')),
						loadedCount = 0,
						_this = this;

					if (imgs.length === 0) {
						this.center();
					}

					forEach(imgs, function (img) {
						listen(img, 'load', function () {
							loadedCount++;

							if (loadedCount >= imgs.length) {
								_this.center();
							}
						});
					});
				},

				center: function () {
					this.element.style.cssText += '; margin: -' + this.element.offsetHeight / 2 + 'px 0 0 -' + this.element.offsetWidth / 2 + 'px;';
				},

				listenEvents: function () {
					var _this = this;

					listen(this.element, 'click', function (e) {
						var t = e.target || event.srcElement,
							closeBtn = bubbleElement(t, function (element) {
								return getClassList(element).contains(CLOSER_CLASS);
							}),
							confirmBtn = bubbleElement(t, function (element) {
								return getClassList(element).contains(CONFIRM_CLASS);
							}),
							cancelBtn = bubbleElement(t, function (element) {
								return getClassList(element).contains(CANCEL_CLASS);
							});

						if (closeBtn) {
							_this.close(e);
						} else if (confirmBtn) {
							_this.config.onconfirm && _this.config.onconfirm();
							_this.close(e);
						} else if (cancelBtn) {
							_this.config.oncancel && _this.config.oncancel();
							_this.close(e);
						}
					});

					if (this.config.blankClose) {
						listen(this.mask.element, 'click', function (e) {
							_this.close(e);
						});
					}

					if (this.config.selfClose) {
						listen(this.element, 'click', function (e) {
							_this.close(e);
						});
					}
				},

				setConfig: function(config) {
					var i;

					for (i in config) {
						if (config.hasOwnProperty(i)) {
							this.config[i] = config[i];
						}
					}
				}
			},

			mask = {
				init: function (dialog) {
					this.element = document.createElement('div');
					getClassList(this.element).add(MASK_CLASS);
					dialog.element.parentNode.insertBefore(this.element, dialog.element);
				},

				open: function () {
					getClassList(this.element).add(MASK_OPENED_CLASS);
				},

				close: function () {
					getClassList(this.element).remove(MASK_OPENED_CLASS);
				}
			};

		boring.dialog = function (container, config) {
			var newDialog = createObject(dialog);

			newDialog.init(container, config);

			return newDialog;
		};
	}());

	(function () {
		function init() {
			loadImgsInView();
			listenScroll();
		}

		function loadImgsInView() {
			var imgsInView = getImgsInView();

			forEach(imgsInView, loadImg);
		}

		function loadImg(img) {
			var src = img.dataset.boringLazyloadSrc,
				tempImg;

			if (!src) {
				return;
			}

			tempImg = document.createElement('img');

			listen(tempImg, 'load', function () {
				img.src = src;

				if (onload) {
					onload(img);
				}
			});

			tempImg.src = src;
			delete img.dataset.boringLazyloadSrc;
		}

		function getImgsInView() {
			return filter(imgs, function (img) {
				return isInview(img);
			});
		}

		function isInview(img) {
			var imgRect = img.getBoundingClientRect();

			return imgRect.top < window.innerHeight && imgRect.bottom > 0;
		}

		function listenScroll() {
			listen(window, 'scroll', loadImgsInView);
		}

		boring.lazyload = function (config) {
			var config = config || {},
				onload = config.onload,
				imgs = getByClass('boring-lazyload');

			init();
		};
	}());

	(function () {
		function initPlaceholder(field, defaultValue) {
			fakePlaceholder(field, defaultValue);
			listenFocus(field, defaultValue);
			listenBlur(field, defaultValue);
		}

		function fakePlaceholder(field, defaultValue) {
			if (field.type !== 'password') {
				field.value = defaultValue;
			}
		}

		function listenFocus(field, defaultValue) {
			listen(field, 'focus', function () {
				if (field.value === defaultValue) {
					field.value = '';
				}
			});
		}

		function listenBlur(field, defaultValue) {
			listen(field, 'blur', function () {
				if (!field.value) {
					fakePlaceholder(field, defaultValue);
				}
			});
		}

		boring.placeholder = function (fieldsWrap) {
			var fields = null,
				i;

			if ('placeholder' in document.createElement('input')) {
				return;
			}

			fields = (fieldsWrap || document).querySelectorAll('[placeholder]');

			for (i = 0; i < fields.length; i++) {
				initPlaceholder(fields[i], fields[i].getAttribute('placeholder'));
			}
		};
	}());

	if (typeof window.define === 'function') {
		define(boring);
	}

	window.boring = boring;

	boring.placeholder();
}());