Liquid = {};

Liquid.interpolator = function interpolator( from, to, percentage ) {
    "use strict";
    var s, from_val, to_val, diff, target = {}, n, m, x, type;

    function string_type(str) {
        if (str[n-2] === "p" && str[n-1] === "x") { return "px"; }
        if (str[n-2] === "e" && str[n-1] === "m") { return "em"; }
        if (str[n-1] === "%") { return "%"; }
    }

    for ( var name in to) {
        s = name;
        to_val = to[name];

        // für alle numerischen Werte
        if ( typeof(to_val) === 'number' ) {
            if (from[name]) { from_val = from[name]; }
            else            { from_val = 0; }
            diff = to_val - from_val;
            target[name] = (diff * percentage) + from_val;
        }

        // now all strings
        if ( typeof(to_val) === 'string' ) {
            n = to_val.length;
            if ( n > 2 ) {
                type = string_type(to_val);
                n  = parseInt(to_val, 10);
                if (from[name]) {
                    from_val = from[name];
                    m        = parseInt(from_val, 10);
                } else {
                    m = 1;
                }
                diff = n - m;
                switch(type) {
                    case "px":
                        target[name] = parseInt(diff*percentage + m, 10) + type;
                    break;
                    case "em":
                        target[name] = (diff*percentage + m).toFixed(2) + type;
                    break;
                    case "%":
                        target[name] = (diff*percentage + m).toFixed(2) + type;
                    break;
                }
            } // PIXEL END
        }
    }
    return target;
};

Liquid.Layer = function Layer( frame, elements ) {
    "use strict";
    var self = this;
    this.elements = [];
    this.trigger_click      = null;
    this.trigger_keypress   = null;
    this.trigger_mouseover  = null;
    this.trigger_mouseenter = null;
    this.trigger_mouseout   = null;
    this.trigger_mouseleave = null;
    this.trigger_stretch    = null;
    this.trigger_distance   = null;

    this.over               = false;

    // time aspects
    this.last_time          = null;
    this.passed_time        = 0;
    // space aspects
    this.lastX               = -1000;
    this.stretch             = 0;

    this.command = function(list) {
        var i, tl, el, time;
        tl = new TimelineMax({  });
        tl.pause();
        for ( i = 0; i < list.length; i++ ) {
            el = list[i];
            if (el.dom) {
                if (!el.duration) { el.duration = 1; }
                if (!el.delay)    { el.delay = 0; }
                tl.to(el.dom, 0, el.from, 0 );
                tl.to(el.dom, el.duration, el.to, el.delay );
                if (el.callback) {
                  time = (el.duration + el.delay)*1000;
                  window.setTimeout(el.callback, time);
                }
            }
            tl.play();
        }
    };

    this.onkeypress = function()   {
        self.command(self.trigger_keypress);
    };

    this.onmouseover = function()   {
        self.command(self.trigger_mouseover);
    };

    this.onmouseenter = function()   {
        self.command(self.trigger_mouseenter);
    };

    this.onmouseout = function()   {
        self.command(self.trigger_mouseout);
    };

    this.onmouseleave = function()   {
        self.command(self.trigger_mouseleave);
    };

    this.onclick = function() {
        self.command(self.trigger_click);
    };

    this.onmousemove = function() {
    };

    this.ondistance = function() {
        var i, tl, el, dist, perc, target;
        tl = new TimelineMax({  });
        tl.pause();
        for (i = 0; i < self.trigger_distance.length; i+=1) {
            el = self.trigger_distance[i];
            dist = Math.abs(self.mouseX) + Math.abs(self.mouseY);
            if (dist > el.distmax) { dist = el.distmax; }
            if (dist < el.distmin) { dist = el.distmin; }
            perc = dist / el.distmax;
            // console.log(perc);
            target = Liquid.interpolator(el.from, el.to, perc);
            tl.to(el.dom, 0, target, 0 );
        }
        tl.play();
    };

    this.onstretch  = function() {
        var i, tl, el, passed, perc, target;

        tl = new TimelineMax({  });
        tl.pause();

        for ( i = 0; i < self.trigger_stretch.length; i++ ) {
            el = self.trigger_stretch[i];
            passed = self.stretch % self.trigger_stretch[i].stretch_distance;
            if (passed < self.trigger_stretch[i].stretch_distance*0.5) {
                perc    = passed*2 / self.trigger_stretch[i].stretch_distance;
            } else {
                passed = self.trigger_stretch[i].stretch_distance - passed;
                perc    = passed*2 / self.trigger_stretch[i].stretch_distance;
            }
            target = Liquid.interpolator(el.from, el.to, perc);
            tl.to(el.dom, 0, target, 0 );
        }

        tl.play();

    };

    this.set_event = function(element) {
        var s, node, interpol;

        switch(element.event_type) {
            case "click":
                if (self.trigger_click === null) {
                    self.trigger_click = [];
                    self.div.onclick=function(){ self.onclick.call();  };
                    }

                element.dom = document.getElementById(element.div);
                self.trigger_click.push(element);
             break;
             case "keypress":
                if (self.trigger_keypress === null) {
                    self.trigger_keypress = [];

                    self.div.onkeypress=function(){ self.onkeypress.call();  };
                    }

                element.dom = document.getElementById(element.div);
                self.trigger_keypress.push(element);
                alert(self.trigger_keypress.length);
             break;
             case "mousemove":
                alert("ein Move");
                // self.div.onmousemove=function(){ self.onmousemove.call();  };
             break;
             case "mouseover":
                if (self.trigger_mouseover === null) {
                    self.trigger_mouseover = [];
                    self.div.onmouseover=function(){ self.onmouseover.call();  };
                    }

                element.dom = document.getElementById(element.div);
                self.trigger_mouseover.push(element);
             break;
             case "mouseenter":
                 if (self.trigger_mouseenter === null) {
                    self.trigger_mouseenter = [];
                    self.div.onmouseenter=function(){ self.onmouseenter.call();  };
                    }

                element.dom = document.getElementById(element.div);
                self.trigger_mouseenter.push(element);
             break;
             case "mouseout":
                 if (self.trigger_mouseout === null) {
                    self.trigger_mouseout = [];
                    self.div.onmouseout=function(){ self.onmouseout.call();  };
                    }

                element.dom = document.getElementById(element.div);
                self.trigger_mouseout.push(element);
             break;
             case "mouseleave":
                 if (self.trigger_mouseleave === null) {
                    self.trigger_mouseleave = [];
                    self.div.onmouseleave=function(){ self.onmouseleave.call();  };
                    }

                element.dom = document.getElementById(element.div);
                self.trigger_mouseleave.push(element);
             break;
             case "interpolate":
               interpol = new Liquid.Interpolator(element.from, element.to, 0.5);
             break;
             case "time":
               // alert("ein getimtes Event");
             break;
             case "distance":
                if (self.trigger_distance === null) {
                    self.trigger_distance = [];
                    element.dom = document.getElementById(element.div);
                    self.trigger_distance.push(element);
                    // console.log("Anzahl Distanzobjekte " + self.trigger_distance.length);
                }

                s = '<div class = "distance">';
                s += 0;
                s += '</div>';

                node = document.createElement("DIV");
                node.id             = "distance";
                node.className      = "distance";
                node.textContent    = "0";
                self.div.appendChild(node);

                if (!self.looping) {
                    self.looping = true;
                    window.setTimeout(self.loop, 1000);
                }
                if (! self.mousepos) {
                   self.check_mouse();
                   self.mousepos = true;
                }
             break;
             case "stretch":
                 if (self.trigger_stretch === null) {
                    self.trigger_stretch = [];

                    element.dom = document.getElementById(element.div);
                    self.trigger_stretch.push(element);


                    s = '<div class = "distance">';
                    s += 0;
                    s += '</div>';

                    node = document.createElement("DIV");
                    node.id             = "distance";
                    node.className      = "distance";
                    node.textContent    = "0";
                    self.div.appendChild(node);

                    if (!self.looping)
                        {
                        self.looping = true;
                        window.setTimeout(self.loop, 1000);
                        }
                    }


                    if (! self.mousepos)
                        {
                        self.mousepos = true;
                        self.check_mouse();

                        }
             break;
             default:
             break;
            }

    };

    this.check_mouse = function() {
        document.onmousemove = function(e){
            var dist, distx, disty;

            self.mouseX = e.pageX;
            self.mouseY = e.pageY;
            if (self.lastX === -1000) {
                self.lastX = e.pageX;
                self.lastY = e.pageY;
            } else {
                if (self.over === true) {
                    distx = Math.abs(self.mouseX - self.lastX);
                    disty = Math.abs(self.mouseY - self.lastY);
                    dist  = distx + disty;
                    self.stretch += dist;
                    self.lastX  = self.mouseX;
                    self.lastY  = self.mouseY;
                }
            }
        };
    };

    this.check_hover = function() {

        // check if the mouse is over the element
        var i, list, now, on = false;
        list = document.querySelectorAll( ":hover" );

        for (i = 0; i < list.length; i+=1) {
           if (list[i] === self.div) {
               if (self.over === false)
                    {
                    // console.log("BETRETE DAS FELD");
                    self.over = true;
                    self.last_time = new Date().getTime();
                    }
               else
                    {
                    //
                    now = new Date().getTime();
                    self.passed_time += (now - self.last_time);
                    self.last_time = now;
                    document.getElementById('distance').innerHTML = self.passed_time;

                    // checking the distance
                    if (self.trigger_stretch) { self.onstretch(); }
                    if (self.trigger_distance) { self.ondistance();  }
                    }


               on = true;
               }
           }

        if (on === false) {
            self.over = false;
            self.lastX = -1000; // for calculation of way stretches
        }
        ///////////////////////////////////////////////////////////
    };

    this.loop = function() {
        self.check_hover();
        window.setTimeout(self.loop, 50);
    };

    this.init = function() {
        // NOVA = self;
        var i,x, el;

        if (frame) {
            self.div = document.getElementById(frame);
            if ( !self.div ) { alert("ERROR - FRAME NICHT DEFINIERT"); }
        } else {
            x = document.getElementsByTagName("body");
            self.div = x[0];
        }

        if (Array.isArray(elements) === true) {
            self.elements = elements;
            // alert("Anzahl Elemente " + self.elements.length);
        } else {
            self.elements.push(elements);
            alert("Anzahl Elemente " + self.elements.length);
        }
        for (i = 0; i < self.elements.length; i+=1) {
            el = self.elements[i];
            if (el.event_type) {
                self.set_event(el);
            } else {
                alert("Element hat kein Event");
            }
        }

    };
    self.init();
};
