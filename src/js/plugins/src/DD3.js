/**
 *
 * DD3 framework.
 *
 */


(function(global) {

    // 'new' an object
    var DD3 = function() {
        return new DD3.init();   
    }


    DD3.announce = function() {
        console.log("DD3 activated");
    };

    DD3.hasClass = function(el, className) {
      if (el.classList)
        return el.classList.contains(className);
      else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    };

    DD3.addClass = function(el, className) {
      if (el.classList)
        el.classList.add(className);
      else if (!DD3.hasClass(el, className)) el.className += " " + className;
    };

    DD3.removeClass = function(el, className) {
      if (el.classList)
        el.classList.remove(className);
      else if (DD3.hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
      }
    };

    DD3.toggleClass = function(el, className) {
      if (DD3.hasClass(el, className)) {
        DD3.removeClass(el, className);
      } else {
        DD3.addClass(el, className);
      }
    };

    DD3.isOnScreen = function(el){
      var top = el.getBoundingClientRect().top;
      var bottom = el.getBoundingClientRect().bottom;
      return top < window.innerHeight && bottom > 0;
    };

    // the actual object is created here, allowing us to 'new' an object without calling 'new'
    DD3.init = function() {
        var self = this;
        self.announce();
    }

    // trick borrowed from jQuery so we don't have to use the 'new' keyword
    // DD3.init.prototype = DD3.prototype;
    
    // attach our DD3 to the global object, and provide a shorthand 'D_'
    global.DD3 = global.D_ = DD3;

}(window));