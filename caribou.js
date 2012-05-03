/**
 * Caribou - A dead simple JQuery Carousel.
 **/
if (typeof Object.create !== 'function'){
    Object.create = function( obj ){
        function F() {};
        F.prototype = obj;
        return new F();
    };
}
(function($,window, document, undefined){
    
     var Caribou = {
        init: function(options, elem) {
            var self = this;
            if (elem.nodeName.toUpperCase() != 'UL' && elem.nodeName.toUpperCase() != 'OL' ) {
                console.log('Cannot apply caribou to '+ elem.nodeName);
                return;
            }
            self.list = $(elem);
            self.options = $.extend({}, $.fn.caribou.options, options);
            var li = self.list.children('li');
            // position:realtive needed for IE7. 
            self.container = self.list.wrap('<div class="caribou clearfix" style="overflow:hidden; position:relative;"/>').parent();
            self.container.append('<div class="caribou-left" style="position:absolute;top:0;left:0;height:100%;cursor:pointer;width:30px;background:transparent url(left-arrow.png) no-repeat scroll left center;"/>');
            self.container.append('<div class="caribou-right" style="position:absolute;top:0;right:0;height:100%;cursor:pointer;width:30px;background:transparent url(right-arrow.png) no-repeat scroll left center;"/>');
            // Total number of items
            self.count = li.length;
            // Width of each item
            self.item_width = li.outerWidth();
            self.overall_width = self.container.outerWidth();
            // Number of items in view
            self.view_count = Math.ceil(self.overall_width /  self.item_width);
            // Initial position
            self.x0 = self.item_width * (Math.floor(self.view_count/2) - self.count);
            // Position at end of sequence
            self.xe = self.item_width * (self.view_count - self.count);
            // position at start of sequence
            self.xs = self.item_width * (-self.count);
            // position at left edge
            self.xl = (self.view_count - 2*self.count + 0.5)*self.item_width;
            // position at right edge
            self.xr = -(self.item_width/2);
            // Double the list for scrolling
            li.clone().appendTo(self.list);
            // position list in the middle.
            self.list.css("left", self.x0 );
            self.list.css("width", self.count * 2 * self.item_width);
            self.options.direction = (self.options.direction === 'string')?self.options.direction.toUpperCase().charAt(0):'L';
            self.start();
            self.container.children('.caribou-left').click(function(){self.slide_right();});
            self.container.children('.caribou-right').click(function(){self.slide_left();});
            self.container.hover(function(){self.stop();}, function(){self.start();});
        },
        start: function() {
            var self = this;
            var dir = 
            self.timer = setInterval(function() {
                if (self.options.direction == 'R') {
                    self.slide_right();
                } else {
                    self.slide_left();
                }
            }, this.options.interval);
        },
        stop: function() {
            clearInterval(this.timer);
            this.timer = null;
        },
        slide_right: function() {
            var pos = this.list.position().left;
            if (pos >= this.xr) {
                pos = this.xs;
                this.list.css("left", pos);
            }
            this.list.animate({"left": (pos+this.item_width) + "px" }, this.options.velocity, this.options.easing);              
        },
        slide_left: function() {
            var pos = this.list.position().left;
            if (pos <= this.xl) {
                pos = this.xe;
                this.list.css("left", pos);
            }
            this.list.animate({"left": (pos-this.item_width) + "px" }, this.options.velocity,  this.options.easing);
        }
        };    
   
    $.fn.caribou = function(options) {
        return this.each(function(){
            var carousel = Object.create( Caribou );
            carousel.init(options, this);
        });
    };
    // Default options
    $.fn.caribou.options = {
        // How fast the carousel slides, 'slow', 'fast', or a number of milliseconds (200=fast, 600=slow)
        velocity: 'slow',
        // ms between each time slide advances. 
        interval: 1000,
        // easing effect to use @see JQuery#animate
        easing: 'swing',
        direction: 'L'
    };
})(jQuery, window, document);