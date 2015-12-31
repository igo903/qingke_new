var yScroller = (function() {
    var bind = function (func, context) {
        if (func.bind) {
            return func.bind(context);
        }
        return function () {
            func.apply(context, arguments);
        };
    },

    $$ = function(id) {
        return document.getElementById(id);
    },

    preventDefault = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    };
    ///////////////// dragging /////////////////////
    var events;
    if ('ontouchstart' in  window) {
        events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
    } else {
        events = ['mousedown', 'mousemove', 'mouseup'];
    }

    var Scroller = function (options) {
        if (!options.container) throw 'need container';
        this.$container = typeof(options.container) === 'object' ? options.container : $$(options.container);
        this.position = options.position || 'fixed';
        this.showOverstep = options.showOverstep || false;
		this.onPageLeave = options.onPageLeave || function(y) {};
		this.onPageEnter = options.onPageEnter || function(y) {};
        this.makeScroller();
        this.y = options.y || 0;
        this.setMaxScroll();
        this.reset();
        this.bind();
    };

    Scroller.prototype = {
        makeScroller: function () {

            var $container = this.$container,
                $scroller = document.createElement('div');
				
			$scroller.style.height = "100%";

            $container.style.position = this.position;
            if (this.position === 'fixed') {
                $container.style.width = '100%';
                $container.style.height = '100%';
                $container.style.top = '0';
                $container.style.left = '0';
                $container.style.zIndex = '500';
            }
            // wrap in scroller
            while ($container.childNodes.length > 0) {
                $scroller.appendChild($container.childNodes[0]);
            }
            $container.appendChild($scroller);

            this.$scroller = $scroller;
        },

        reset: function () {
            this.isDragging = false;
            this.startY = 0;
            // for calc delta between ticks
            this.touchY = 0;
            // for momentum
            this.time = 0;
            this.isMoving = false;
            this.slideTimer = null;
            this.setScroll(this.y);
        },

        bind: function () {
            for (var i = 0, len = events.length; i<len; i++) {
                this.$container.addEventListener(events[i], this);
            }
            this.$container.ondragstart = function() { return false; };
        },

        unbind: function () {
            for (var i = 0, len = events.length; i<len; i++) {
                this.$container.removeEventListener(events[i], this);
            }
            this.$container.ondragstart = null;
        },

        handleEvent: function (evt) { //to do
            switch (evt.type) {
                case 'mousedown':
                case 'touchstart':
                    this.onStart(evt);
                    break;

                case 'mousemove':
                case 'touchmove':
                    this.onMove(evt);
                    break;

                case 'mouseup':
                case 'touchend':
                case 'touchcancel':
                    this.onEnd(evt);
                    break;
            }
        },

        onStart: function (evt) {
            document.addEventListener('touchmove', preventDefault);
            if (this.isMoving) {
                preventDefault(evt);
                return;
            }
            window.clearTimeout(this.slideTimer);
            this.isDragging = true;
            this.$scroller.style.webkitTransition = 'none';
            this.screenHeight = this.$container.offsetHeight;
            this.setMaxScroll();  
            var touch = evt.touches? evt.touches[0] : evt;
            this.touchY = touch.clientY;
            this.startY = this.y;
        },

        onMove: function (evt) {
            if (this.isMoving || !this.isDragging) {
                preventDefault(evt);
                return;
            }
            var touch = evt.touches? evt.touches[0] : evt,
                touchY = touch.clientY,
                deltaY = this.touchY - touchY,
                y = this.startY + deltaY * 0.85,
                oldY = this.y;
            this.setScroll(y);
        },

        onEnd: function (evt) { 
            if (this.isMoving || !this.isDragging) {
                preventDefault(evt);
                return;
            }
            this.isDragging = false;
            if (this.y < 0 || this.y > this.maxScrollY) {
                // scroll to boundry
                this.scrollTo(this.y);
            } else {
                // slide with momentum
                var moveY = (this.startY - this.y) / this.screenHeight,
                    direction = moveY > 0 ? -1 : 1;
                if(moveY === 0) {
                    return;
                }
                console.log(moveY)
                if (Math.abs(moveY) < 0) {
                    this.scrollTo(this.startY, 0.15);
                } else {
					this.onPageLeave(this.startY);
                    this.scrollTo(this.startY + this.screenHeight * direction, 0.3);
					this.onPageEnter(this.startY + this.screenHeight * direction);
                }
            }
        },
        
        setMaxScroll: function () {
            this.maxScrollY = Math.abs(this.$scroller.scrollHeight - this.$container.clientHeight);
        },

        scrollTo: function (y, duration) {
            var that = this;
            this.isMoving = true;
            this.$scroller.style.webkitTransition = 'all '+ duration +'s ease';
            this.setScroll(y);
            this.slideTimer = window.setTimeout(function() {
                that.isMoving = false;
            }, duration * 1000);
        },

        setScroll: function (y) {
            if (y < 0) {
                if (this.showOverstep) {
                    y = -Math.pow(-y, 0.85);
                } else {
                    y = 0;
                }
            } else if (y > this.maxScrollY) {
                if (this.showOverstep) {
                    y = this.maxScrollY + Math.pow((y - this.maxScrollY), 0.85);
                } else {
                    y = this.maxScrollY;
                }
            }
            this.$scroller.style.webkitTransform = 'translate3d(0, ' + parseInt(-y) + 'px, 0)';
            this.y = y;
        }
    }

    return {
        init: function (options) {
            return new Scroller(options);
        }
    };
})();