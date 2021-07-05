!function SSlider() {

    "use strict";

    var that, that1, timerobj = {};

    function Slider(options = {}) {

        this.pictures = [];

        var _ = this;

        this.shuffle = function (arr, currentEffect = null) {

            if (currentEffect == null) {

                var index = arr.indexOf(currentEffect);

                if (index > -1) {
                    arr.splice(index, 1);
                }

            }

            for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i, 10), x = arr[--i], arr[i] = arr[j], arr[j] = x) ;

            return arr;

        };

        this.settings = {
            slices: 10,
            boxes: 9,
            step: 0,
            en: 700,
            boxen: 700 / 3,
            boxhundur: 306 / 3,
            duration: 10000,
            dist: 300,
            hun: 306,
            effect: function (t) {
                return 1 + (--t) * t * t * t * t
            },
            boxTypes: ['buildSlices', 'buildBoxes'],
            // boxTypes: ['buildBoxes'],
            animeTypes: {
                buildSlices: 'animateSlice',
                buildBoxes: 'animateBox',
            },
            currentBoxType: _.shuffle(['buildSlices', 'buildBoxes']),
        }

        that = this;

        this.build(this.settings.step, false);

    }

    Slider.prototype = {

        mass: function (anj) {

            var elem;
            if ((anj.nodeType === 1) && (typeof anj.style === "object") && (typeof anj.ownerDocument === "object")) {
                elem = anj;
            } else {
                elem = document.createElement(anj);
            }
            var massEl = {};
            massEl.el = elem;
            massEl.set = function (name, prop) {
                massEl.el.setAttribute(name, prop);
                return massEl;
            };
            massEl.append = function (obj) {
                obj.appendChild(massEl.el);
                return massEl;
            };
            return massEl;

        },

        getId: function (obj) {

            if (obj.split(" ").length > 1) {
                var res = obj.split(" ");
                return document.getElementById(res[0]).getElementsByTagName(res[1]);
            } else {
                return document.getElementById(obj);
            }

        },

        build: function (addim, bool) {

            var i = 0;
            var en;
            var uzun;
            var ad;
            var el;
            var so;
            if (!bool) {

                while (i < this.getId("slider a").length) {
                    en = this.getId("slider a")[i].childNodes[0].width;
                    en = 700;
                    uzun = this.getId("slider a")[i].childNodes[0].height;
                    uzun = 306;
                    so = (i + 1) % this.getId("slider a").length;
                    ad = this.getId("slider a")[so].childNodes[0].src;
                    this.pictures.push(this.getId("slider a")[i].childNodes[0].src);
                    el = this.mass("div").set("id", "divin" + i).set("style", "width:" + en + "px;height:" + uzun + "px; background:url(" + ad + ")");
                    this.getId("slider a")[i].appendChild(el.el);
                    console.log((i + 1) % this.getId("slider a").length)
                    i += 1;

                }

            }


            var effect = that.shuffle(this.settings.boxTypes, this.settings.currentBoxType);

            this[effect[0]](addim);

            this.settings.currentBoxType = effect[0];
            // this.buildBoxes(addim);

        },

        buildSlices: function (i) {

            var ad2 = this.pictures[this.settings.step];

            var anadiv = this.getId("divin" + this.settings.step);
            this.getId("divin" + i).innerHTML = "";
            var n = 0;
            var d = 0;
            while (n < this.settings.slices) {
                console.log(this, 'thissed');
                this.mass("div")
                    .set("id", "divs" + (i) + n)
                    .set("style", "display:inline-block;vertical-align:bottom; float:left;overflow:hidden;width:" + this.settings.en / this.settings.slices + "px;height:" + this.settings.hun + "px; background:url(" + ad2 + ");background-position: " + (-d) + "px 0px; background-repeat:no-repat")
                    .append(anadiv);
                n += 1;
                d = (this.settings.en / this.settings.slices) * n;
            }
            this.settings.step;
        },

        buildBoxes: function (i) {

            var nm = this.getId("slider a").length - 1; //10/0---
            //   console.log(nm)
            var ad2 = this.pictures[this.settings.step];
            var anadiv = this.getId("divin" + this.settings.step);
            this.getId("divin" + this.settings.step).innerHTML = "";
            var n = 0;
            var d = 0;
            var z;
            var y;
            var os;
            var x = 1;

            var hun = 306 / 5;
            var enn = 700 / 8;
            var enlik = 700;

            if(document.getElementById('maindiv1')){
                document.getElementById('maindiv1').parentNode.innerHTML='';
            }
            while (x <= 5) {
                z = -(hun * (x - 1));
                y = 1;
                this.mass("div").set("id", "maindiv" + x).set("style", "position:absolute;top:" + (-z) + "px; left: 0px").append(anadiv);
                while (y <= 8) {
                    os = enn * (y - 1);
                    this.mass("div").set("id", "divsn" + x + y).set("style", "width:" + enlik / 8 + "px;height:" + hun + "px; background:url(" + ad2 + ");background-position: " + (-os) + "px " + z + "px;position:absolute;top:0px; left: " + os + "px").append(this.getId("maindiv" + x));
                    y += 1;
                }
                x += 1;
            }

        },

        animateSingleRow: function (obj, i) {

            var progress = 0.01 * 3;

            for (var n = 0; n <= obj.length - 1; n++) {

                that.setTimer(obj, n, i);

            }

        },

        animateBox: function (i, bul, prog) {
            var opac;
            var progress = 0.01 * 3;

            this[i].bul = bul;

            that1 = this;

            this[i].runtime = (prog != null ? prog : 60);

            let obj = this[i].childNodes;

            that.animateSingleRow(obj, i);

            let cancel = '';

            var __next = function(starttime, z) {
                var timestamp = new Date().getTime()
                var runtime = timestamp - starttime;
                var vaxt = z * 300;
                if (z * 1 < that1.length - 1 && runtime > vaxt) {
                    z = z + 1;
                    that.animateSingleRow(that1[z].childNodes, z);
                }
                if (z * 1 >= that1.length - 1) {
                    window.cancelAnimationFrame(cancel);

                }

                cancel = requestAnimationFrame(() => __next(starttime * 1, z));

            }

            window.requestAnimationFrame(function (timestamp) {
                __next((new Date().getTime()) * 1, i);
            });

        },

        prepareNextSlide: function (){

            that.settings.step++;

            if (that.settings.step > that.getId("slider a").length - 1) {

                that.getId("slider a")[that.settings.step - 1].style.display = "none";
                that.settings.step = 0;
                that.getId("slider a")[that.settings.step].style.display = "block";

            } else {

                that.getId("slider a")[that.settings.step - 1].style.display = "none";
                that.getId("slider a")[that.settings.step].style.display = "block";

            }
        },

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

                var timestamp = new Date().getTime()
                var runtime = timestamp - obj[i].starttime;

            });


            if (parseInt(obj[i].style.height) <= 0) {

                if (i == obj.length - 1 && z == 4) {

                    window.cancelAnimationFrame(obj[i].delid);

                    that.prepareNextSlide();

                    that.build(that.settings.step, true);

                    that.applyTo(0, false, false);
                }

                window.cancelAnimationFrame(obj[i].delid);
                obj[i].style.height = `${306/5}px`;
                obj[i].style.visibility = "hidden";
                obj[i].style.borderRight = "0px solid #c0c0c0";

            }

        },

        setTimer: function (obj, n, i) {

            timerobj["timer" + n] = setTimeout(function () {

                that.closeIts(obj, n, i);

            }, 150 * n);

        },

        animateSlice: function (i, bul, prog) {

            this[i].bul = bul;

            that1 = this;

            this[i].runtime = (prog != null ? prog : 60);

            var runtime = this[i].runtime + 60;

            this[i].progress = this[i].runtime / that.settings.duration

            this[i].progress = that.settings.effect(this[i].progress);

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

                that.applyTo(i, thatbul, runtime, this);

                if (i == that1.length - 1 && parseInt(that1[i].style.height) >= 306) {

                    that.global.vaxt = setTimeout(function () {

                        that.prepareNextSlide();

                        that.build(that.settings.step, true);

                        that.applyTo(0, false, false);

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

        applyTo: function (i = 0, bul = false, prog = false) {
            var rect = document.getElementById("divin" + that.settings.step).childNodes;
            var r = this.settings.animeTypes[this.settings.currentBoxType];
            this[r].call(rect, i, bul, prog);
            console.log(this.settings.currentBoxType, rect, 'rected');
        },

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

    window.SSlider = function (options) {
        return new Slider(options)
    }

}()