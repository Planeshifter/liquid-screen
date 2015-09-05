LiquidEvents = {};

LiquidEvents.Animator = function Animator(obj) {
    'use strict';

    var self = this;
    this.id = null;
    this.events = [];

    this.start  = 0;
    this.time   = 0;
    this.fin    = 10000;

    this.reset_events = function() {
        var i;
        for ( i = 0; i < self.events.length; i++ ) {
            self.events[i].done = false;
        }
    };

    this.greensock_event = function(event) {
        var tl,
            el,
            config = {},
            delay,
            props;

        el = document.getElementById("Container");

        if (event.div) el = document.getElementById( event.div );

        props = ['left', 'top', 'opacity', 'scale', 'rotation',
            'border', 'borderRadius', 'background', 'fontSize', 'fontFamily',
            'letterSpacing', 'color', 'textShadow', 'boxShadow',
            'transition','ease', 'webkitFilter'
        ];

        for ( var i = 0; i < props.length; i++ ) {
            var key = props[ i ];
            if ( event[key] ) {
                config[key] = event[key];
            }
        }

        if ( event.delay ) {
            delay = (event.delay/1000).toFixed( 2 );
        } else {
            delay = 0;
        }

        tl = new TimelineMax({  });
        tl.pause();
        tl.to( el, (event.duration/1000).toFixed(2), config, delay );
        tl.play();

    };

    this.typewriter = function(event) {
        var s = "", n, name, elements = [];
        name = event.div + "_tyewriter";

        for (n = 0; n < event.text.length; n++ ) {
            s += '<span class = "' + name + '">' + event.text[n] + '</span>';
        }
        $("#" + event.div).html(s);
        elements = document.getElementsByClassName(name);
        var tl = new TimelineMax({ onComplete: done });
        tl.pause();
        tl.to(elements, 0, {"color": "rgba(0,0,0,0)" });
        tl.staggerTo(elements, 0.2, {color: event.color}, 0.08);
        tl.play();

        function done() {
            if (event.callback) {
                window.setTimeout(event.callback, 0);
            }
        }
    };

    this.fire_event = function(event) {
        var s;
        switch(event.type) {
            case "greensock":
                self.greensock_event(event);
            break;
            case "change_text":
                $("#" + event.div).html(event.text);
            break;
            case "typewriter":
                self.typewriter(event);
            break;
            case "change_image":
                var img = new Image();
                img.onload = function () {
                    s = '<img src = "' + event.file + '"/>';
                    $("#" + event.div).html(s);
                };
                img.src = event.file;
            break;
        }
    };

    this.check_events = function() {
        var i;
        for ( i = 0; i < self.events.length; i++ ) {
            if ( !self.events[i].done && self.events[i].time < self.time ) {
                self.events[i].done = true;
                self.fire_event( self.events[i] );
            }
        }
    };

    this.check_end = function() {
        if (self.time > self.fin) {
            self.reset_events();
            self.time = 0;
            self.start = new Date().getTime();
        }
    };

    this.loop = function() {
        self.time = new Date().getTime() - self.start;

        self.check_events();
        self.check_end();

        window.setTimeout( self.loop, obj.interval);
    };

    this.sort_events = function(events) {
        function compare(a,b) {
            if (a.time < b.time) { return -1; }
            if (a.time > b.time) { return 1;  }
            return 0;
        }
        events.sort(compare);
        self.fin = events[events.length-1].time + events[events.length-1].duration + 1000;
    };

    this.init = function(){
        if (obj.events) { self.events = obj.events; }
        self.sort_events(self.events);
        self.el = document.getElementById(obj.div);
        self.start = new Date().getTime();
        self.loop();
    };

    self.init();

};
