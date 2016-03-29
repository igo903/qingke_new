/*!
 * Author: Boring
 * Update: 2016-03-28 10:14
 */

(function () {
	var
		getByClass = function (className, container) {
			var container = container || document,
				allElms,
				elms,
				i;

			if (container.getElementsByClassName) {
				elms = container.getElementsByClassName(className);
			} else if (container.querySelector) {
				elms = container.querySelectorAll('.' + className);
			}

			return elms;
		},

		forEach = function (array, handler) {
			var i;

			if (array.forEach) {
				array.forEach(function (item) {
					handler(item);
				});
			} else {
				for (i = 0; i < array.length; i++) {
					handler(array[i], i);
				}
			}
		},

		filter = function (array, handler) {
			var newArray = [],
				i;

			if (array.filter) {
				newArray = array.filter(function (item) {
					return handler(item);
				});
			} else {
				forEach(array, function (item) {
					if (handler(item)) {
						newArray.push(item);
					}
				});
			}

			return newArray;
		},

		listen = function (elm, type, handler, capture) {
			if (elm.addEventListener) {
				elm.addEventListener(type, handler, capture || false);
			} else if (elm.attachEvent) {
				elm.attachEvent('on' + type, handler);
			}
		},

		preventEventDefault = function (e) {
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		},

		getClassList = function (elm) {
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
		},

		getData = function (elm, dataName) {
			var dataset = elm.dataset,
				dataValue;

			if (dataset) {
				dataValue = dataset[dataName];
			} else {
				dataValue = elm.getAttribute('data-' + dataName);
			}

			return dataValue;
		},

		setData = function (elm, dataName, dataValue) {
			var dataset = elm.dataset;

			if (dataset) {
				dataset[dataName] = dataValue;
			} else {
				elm.setAttribute('data-' + dataName, dataValue);
			}
		},

		removeData = function (elm, dataName) {
			var dataset = elm.dataset;

			if (dataset) {
				delete dataset[dataName];
			} else {
				elm.removeAttribute('data-' + dataName);
			}
		},

		bubbleElement = function (elm, tester) {
			var passed = true;

			while (!tester(elm)) {
				elm = elm.parentNode;

				if (elm.nodeType !== 1) {
					passed = false;
					break;
				}
			}

			return passed ? elm : undefined;
		},

		removeNode = function (node) {
			if (typeof node.remove === 'function') {
				node.remove();
			} else {
				node.parentNode.removeChild(node);
			}
		},

		ajax = function (config) {
			var config = config || {},
				url = config.url,
				method = config.method || 'get',
				async = typeof config.async !== 'undefined' ? config.async : true,
				success = config.success,
				xhr = new XMLHttpRequest();

			xhr.open(method, url, async);

			listen(xhr, 'readystatechange', function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					if (success) {
						success(xhr.responseText);
					}
				}
			});

			xhr.send();
		},

		tab = function (container, config) {
			var
				init = function () {
					listenTrigger();
					go(current);
				},

				listenTrigger = function () {
					forEach(handles, function (handle, index) {
						listen(handle, eventType, function () {
							go(index);
						});
					});
				},

				go = function (index) {
					if (!panels[index]) {
						return;
					}

					clearCurrentStatus();
					addTargetStatus(index);

					current = index;

					if (ongo) {
						ongo(index);
					}
				},

				forward = function () {
					go(current + 1);
				},

				back = function () {
					go(current - 1);
				},

				clearCurrentStatus = function () {
					getClassList(handles[current]).remove(currentHandleClassName);
					getClassList(panels[current]).remove(currentPanelClassName);
				},

				addTargetStatus = function (index) {
					getClassList(handles[index]).add(currentHandleClassName);
					getClassList(panels[index]).add(currentPanelClassName);
				},

				container = typeof container === 'string' ? document.getElementById(container) : container,
				config = config || {},
				sign = config.sign || '',
				signSuffix = sign ? '-' + sign : '',
				handlesWrap = getByClass('boring-tab-handles' + signSuffix, container)[0],
				handles = handlesWrap.children,
				panelsWrap = getByClass('boring-tab-panels' + signSuffix, container)[0],
				panels = panelsWrap.children,
				eventType = config.event || 'click',
				current = 0,
				currentClassName = 'boring-tab-current',
				ongo = config.ongo,
				currentHandleClassName = config.currentHandleClassName || currentClassName,
				currentPanelClassName = config.currentPanelClassName || currentClassName;

			init();

			return {
				go: go,
				forward: forward,
				back: back
			};
		},

		lazyload = function (config) {
			var
				init = function () {
					loadImgsInView();
					listenScroll();
				},

				loadImgsInView = function () {
					var imgsInView = getImgsInView();

					forEach(imgsInView, loadImg);
				},

				loadImg = function (img) {
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
				},

				getImgsInView = function () {
					return filter(imgs, function (img) {
						return isInview(img);
					});
				},

				isInview = function (img) {
					var imgRect = img.getBoundingClientRect();

					return imgRect.top < window.innerHeight && imgRect.bottom > 0;
				},

				listenScroll = function () {
					listen(window, 'scroll', loadImgsInView);
				},

				config = config || {},
				onload = config.onload,
				imgs = getByClass('boring-lazyload');

			init();
		},

		dialog = function (id, config) {
			var
				init = function () {
					if (!noMask) {
						initMask();
					}

					if (blankClose) {
						if (mask) {
							listen(mask, 'click', close);
						}
					}

					if (selfClose) {
						listen(body, 'click', close);
					}

					center();
					listenClose();
				},

				initMask = function () {
					mask = document.createElement('div');
					maskCl = getClassList(mask);
					maskCl.add('boring-dialog-mask');
					body.parentNode.insertBefore(mask, body);
				},

				open = function () {
					if (mask) {
						maskCl.add(maskOpenedCn);
					}

					bodyCl.add(bodyOpenedCn);
					center();

					if (focusElm) {
						setTimeout(function () {
							focusElm.focus();
						}, 20);
					}

					if (autoClose) {
						setTimeout(close, autoClose);
					}

					if (onopen) {
						onopen();
					}
				},

				close = function (e) {
					if (mask) {
						maskCl.remove(maskOpenedCn);
					}

					bodyCl.remove(bodyOpenedCn);

					if (onclose) {
						onclose();
					}

					if (onmanualclose && e) {
						onmanualclose();
					}
				},

				center = function () {
					body.style.cssText += '; margin-top: ' + -(body.offsetHeight / 2) + 'px;';
				},

				listenClose = function () {
					listen(body, 'click', function (e) {
						var e = e || event,
							t = e.target || e.srcElement,
							closeBtn = bubbleElement(t, function (elm) {
								return getClassList(elm).contains('boring-dialog-closer');
							});

						if (closeBtn) {
							close(e);
						}
					});
				},

				body = document.getElementById(id),
				config = config || {},
				noMask = config.noMask || false,
				blankClose = config.blankClose || false,
				selfClose = config.selfClose || false,
				bodyCl = getClassList(body),
				bodyOpenedCn = 'boring-dialog-opened',
				maskOpenedCn = 'boring-dialog-mask-opened',
				focusElm = getByClass('boring-dialog-focus', body)[0],
				autoClose = config.autoClose,
				onclose = config.onclose,
				onopen = config.onopen,
				onmanualclose = config.onmanualclose,
				mask,
				maskCl;

			init();

			return {
				open: open,
				close: close,
				center: center
			};
		},

		placeholder = function (fieldsWrap) {
			var
				initPlaceholder = function (field, defaultValue) {
					fakePlaceholder(field, defaultValue);
					listenFocus(field, defaultValue);
					listenBlur(field, defaultValue);
				},

				fakePlaceholder = function (field, defaultValue) {
					if (field.type !== 'password') {
						field.value = defaultValue;
					}
				},

				listenFocus = function (field, defaultValue) {
					listen(field, 'focus', function () {
						if (field.value === defaultValue) {
							field.value = '';
						}
					});
				},

				listenBlur = function (field, defaultValue) {
					listen(field, 'blur', function () {
						if (!field.value) {
							fakePlaceholder(field, defaultValue);
						}
					});
				},

				fields = (fieldsWrap || document).querySelectorAll('[placeholder]'),
				i;

			if ('placeholder' in document.createElement('input')) {
				return;
			}

			for (i = 0; i < fields.length; i++) {
				initPlaceholder(fields[i], fields[i].getAttribute('placeholder'));
			}
		},

		boring = {
			getByClass: getByClass,
			forEach: forEach,
			listen: listen,
			preventEventDefault: preventEventDefault,
			bubbleElement: bubbleElement,
			removeNode: removeNode,
			getClassList: getClassList,
			getData: getData,
			setData: setData,
			removeData: removeData,
			ajax: ajax,
			tab: tab,
			lazyload: lazyload,
			placeholder: placeholder,
			dialog: dialog
		};

	placeholder();

	if (typeof window.define === 'function') {
		define(boring);
	}

	window.boring = boring;
}());