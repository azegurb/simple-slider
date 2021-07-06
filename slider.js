!function SSlider() {

    "use strict";

    var that, timerobj = {};

    /**
     * Slider constructor
     * @param id
     * @param options optional
     * @constructor
     */

    function Slider(id = "slider", options = {}) {

        this.pictures = [];

        this.global = {
            vaxt: ''
        };

        this.id = id;

        var _ = this;

        this.shuffle = function (arr, currentEffect = null) {

            var _arr = [];

            arr.forEach(function (item) {
                if (currentEffect != item) {
                    _arr.push(item);
                }
            });

            for (var j, x, i = _arr.length; i; j = parseInt(Math.random() * i, 10), x = _arr[--i], _arr[i] = _arr[j], _arr[j] = x) ;

            return _arr;

        };

        /**
         *  Settings is object that store default options
         */

        this.settings = {

            slices: 10,

            boxesPerRow: 8,

            boxesRows: 5,

            step: 0,

            width: 700,

            duration: 10000,

            dist: 300,

            height: 306,

            effect: function (t) {

                return 1 + (--t) * t * t * t * t

            },

            boxTypes: ['buildSlices', 'buildBoxes'],

            animeTypes: {

                buildSlices: 'animateSlice',

                buildBoxes: 'animateBox',

            },

            currentBoxType: _.shuffle(['buildSlices', 'buildBoxes'])[0],
        }

        that = this;

        this.build(this.settings.step, false);

    }

    Slider.prototype = {

        /**
         * Simple object creator method returning object of chainable methods
         * @param anj
         * @returns {{}}
         * @private
         */

        _$: function (anj) {

            var elem;
            if ((anj.nodeType === 1) && (typeof anj.style === "object") && (typeof anj.ownerDocument === "object")) {
                elem = anj;
            } else {
                elem = document.createElement(anj);
            }
            var El = {};
            El.el = elem;
            El.set = function (name, prop) {
                El.el.setAttribute(name, prop);
                return El;
            };
            El.append = function (obj) {
                obj.appendChild(El.el);
                return El;
            };
            return El;

        },

        /**
         * Simple selector method
         * @param obj
         * @returns {HTMLElement|HTMLCollectionOf<*>}
         */

        getId: function (obj) {

            if (obj.split(" ").length > 1) {
                var res = obj.split(" ");
                return document.getElementById(res[0]).getElementsByTagName(res[1]);
            } else {
                return document.getElementById(obj);
            }

        },

        /**
         * Build backgrounds from given links
         * returns void
         * @param step
         * @param bool
         */
        build: function (step, bool) {

            var i = 0;
            var bgSource;
            var el;
            var so;

            if (!bool) {

                while (i < this.getId(this.id + " a").length) {
                    so = (i + 1) % this.getId(this.id + " a").length;
                    bgSource = this.getId(this.id + " a")[so].childNodes[0].src;
                    this.pictures.push(this.getId(this.id + " a")[i].childNodes[0].src);
                    el = this._$("div").set("id", "divin" + i).set("style", "width:" + this.settings.width + "px;height:" + this.settings.height + "px; background:url(" + bgSource + ")");
                    this.getId(this.id + " a")[i].appendChild(el.el);
                    i += 1;
                }

            }


            var effect = that.shuffle(this.settings.boxTypes, this.settings.currentBoxType);

            this[effect[0]](step);

            this.settings.currentBoxType = effect[0];


        },

        /**
         * Make slices ready to animate
         * @param i
         */
        buildSlices: function (i) {

            var picUrl = this.pictures[this.settings.step];

            var baseBox = this.getId("divin" + this.settings.step);

            this.getId("divin" + i).innerHTML = "";

            var n = 0;

            var d = 0;

            while (n < this.settings.slices) {

                this._$("div")
                    .set("id", "divs" + (i) + n)
                    .set("style", "display:inline-block;vertical-align:bottom; float:left;overflow:hidden;width:" + this.settings.width / this.settings.slices + "px;height:" + this.settings.height + "px; background:url(" + picUrl + ");background-position: " + (-d) + "px 0px; background-repeat:no-repat")
                    .append(baseBox);

                n += 1;

                d = (this.settings.width / this.settings.slices) * n;
            }

        },

        /**
         * Make boxes ready to animate
         * @param i
         */

        buildBoxes: function (i) {

            var picUrl = this.pictures[this.settings.step];

            var baseBox = this.getId("divin" + this.settings.step);

            this.getId("divin" + this.settings.step).innerHTML = "";

            var posY;

            var y;

            var posX;

            var x = 1;

            var boxHeight = this.settings.height / this.settings.boxesRows;

            var boxWidth = this.settings.width / this.settings.boxesPerRow;

            if (document.getElementById('maindiv1')) {

                document.getElementById('maindiv1').parentNode.innerHTML = '';

            }

            while (x <= this.settings.boxesRows) {

                posY = -(boxHeight * (x - 1));

                y = 1;

                this._$("div").set("id", "maindiv" + x).set("style", "position:absolute;top:" + (-posY) + "px; left: 0px").append(baseBox);

                while (y <= this.settings.boxesPerRow) {

                    posX = (this.settings.width / this.settings.boxesPerRow) * (y - 1);

                    this._$("div").set("id", "divsn" + x + y).set("style", "width:" + boxWidth + "px;height:" + boxHeight + "px; background:url(" + picUrl + ");background-position: " + (-posX) + "px " + posY + "px;position:absolute;top:0px; left: " + posX + "px").append(this.getId("maindiv" + x));

                    y += 1;

                }

                x += 1;

            }

        },

        /**
         * Queue rows for animating
         * @param obj
         * @param i
         */

        animateSingleRow: function (obj, i) {

            for (var n = 0; n <= obj.length - 1; n++) {

                that.setTimer(obj, n, i);

            }

        },

        /**
         * Animate box effect
         * @param i
         * @param bul
         * @param prog
         */

        animateBox: function (i, bul, prog) {

            var self = this;

            that.animateSingleRow(this[i].childNodes, i);

            var cancel = '';

            var __next = function (starttime, z) {

                var timestamp = new Date().getTime()

                var runtime = timestamp - starttime;

                var vaxt = z * 300;

                if (z * 1 < self.length - 1 && runtime > vaxt) {

                    z = z + 1;

                    that.animateSingleRow(self[z].childNodes, z);

                }

                if (z * 1 >= self.length - 1) {

                    window.cancelAnimationFrame(cancel);

                }

                cancel = requestAnimationFrame(function () {

                    __next(starttime * 1, z);

                });

            }

            window.requestAnimationFrame(function (timestamp) {
                __next((new Date().getTime()) * 1, i);
            });

        },

        /**
         * configure next stage to animate
         */

        prepareNextSlide: function () {

            that.settings.step++;

            if (that.settings.step > that.getId(this.id + " a").length - 1) {

                that.getId(this.id + " a")[that.settings.step - 1].style.display = "none";
                that.settings.step = 0;
                that.getId(this.id + " a")[that.settings.step].style.display = "block";

            } else {

                that.getId(this.id + " a")[that.settings.step - 1].style.display = "none";
                that.getId(this.id + " a")[that.settings.step].style.display = "block";

            }
        },

        /**
         * Animate current box
         * @param obj
         * @param i
         * @param z
         */

        closeIts: function (obj, i, z) {

            var progress = 0.01 * 3;

            if (obj[i] && parseInt(obj[i].style.height) <= 0) {

                obj[i].style.borderRight = "0px solid #c0c0c0";

            }

            if (obj && obj[i] && parseInt(obj[i].style.height) > 0) {

                if (obj && obj[i]) {
                    var opac = 0.8 - ((306 / 5) - parseInt(obj[i].style.height)) / (306 / 5) + 0.3;
                }

                if (parseInt(obj[i].style.height) - 2 < 0) {
                    obj[i].style.height = '0px';
                    obj[i].style.width = '0px';
                } else {
                    obj[i].style.height = parseInt(obj[i].style.height) - (parseInt(obj[i].style.height) * progress) + 'px';
                    obj[i].style.opacity = opac;

                }

                obj[i].style.width = parseInt(obj[i].style.width) - (1 * 3) + 'px';

                obj[i].style.boxSizing = 'border-box';

            }

            if (!obj[i].starttime) {
                obj[i].starttime = new Date().getTime();
            }

            obj[i].delid = window.requestAnimationFrame(function (timestamp) {

                that.closeIts(obj, i, z);

            });


            if (parseInt(obj[i].style.height) <= 0) {

                if (i == obj.length - 1 && z == 4) {

                    window.cancelAnimationFrame(obj[i].delid);

                    that.prepareNextSlide();

                    that.build(that.settings.step, true);

                    that.applyTo(0, false, false);
                }

                window.cancelAnimationFrame(obj[i].delid);
                obj[i].style.height = `${306 / 5}px`;
                obj[i].style.visibility = "hidden";
                obj[i].style.borderRight = "0px solid #c0c0c0";

            }

        },

        /**
         * Queue of animating rows
         * @param obj
         * @param n
         * @param i
         */

        setTimer: function (obj, n, i) {

            timerobj["timer"] = setTimeout(function () {

                that.closeIts(obj, n, i);

            }, 150 * n);

        },

        /**
         * Animate current slice
         * @param i
         * @param bul
         * @param prog
         */

        animateSlice: function (i, bul, prog) {

            this[i].bul = bul;

            var self = this;

            this[i].runtime = (prog != null ? prog : 60) + 60;

            this[i].progress = that.settings.effect(this[i].runtime / that.settings.duration);

            this[i].progress = Math.min(this[i].progress, 1);

            this[i].style.height = that.settings.dist - (that.settings.dist * this[i].progress).toFixed(2) + 'px';

            if (this[i].runtime > 450 && i < this.length - 1 && this[i].bul === false) {

                this[i].bul = true;

                window.requestAnimationFrame(function (timestamp) {

                    that.applyTo(i + 1, false, null);

                });
            }

            var thatbul = this[i].bul;

            this[i].delid = window.requestAnimationFrame(function (timestamp) {

                that.applyTo(i, thatbul, self[i].runtime, this);

                if (i == self.length - 1 && parseInt(self[i].style.height) >= 306) {

                    that.global.vaxt = setTimeout(function () {

                        that.prepareNextSlide();

                        that.build(that.settings.step, true);

                        that.applyTo(0, false, false);

                        window.clearTimeout(that.global.vaxt);

                    }, 3000);

                }

            });

            if (parseInt(this[i].style.height) <= 0) {

                window.cancelAnimationFrame(this[i].delid);
                this[i].style.height = "306px";
                this[i].style.visibility = "hidden";
                this[i].style.borderRight = "0px solid #c0c0c0";

            }

        },

        /**
         * Applying animating methods to the objects
         * @param i
         * @param bul
         * @param prog
         */

        applyTo: function (i = 0, bul = false, prog = false) {
            var rect = document.getElementById("divin" + that.settings.step).childNodes;
            var r = this.settings.animeTypes[this.settings.currentBoxType];
            this[r].call(rect, i, bul, prog);
        },

        /**
         * Event listener actions
         * @param target
         * @param functionref
         * @param tasktype
         */

        addEvent: function addEvent(target, functionref, tasktype) {
            if (target.addEventListener) {
                target.addEventListener(tasktype, functionref, false);
            } else if (target.attachEvent) {
                target.attachEvent("on" + tasktype, function handler() {
                    return functionref.call(target, window.event);
                });
            }
        }


    }

    /**
     * Private scope for Slider
     * @param elementId
     * @param options
     * @returns {Slider}
     * @constructor
     */

    window.SSlider = function (elementId, options) {
        return new Slider(elementId, options)
    }

}()