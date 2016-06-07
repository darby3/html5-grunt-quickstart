// main scripts
(function() {

  document.addEventListener('DOMContentLoaded', function() {

    // Let's get this party started.
    console.log("hello let us begin");

    // Requires and module initializations

    var hiThere = require("./modules/helloThere");
    hiThere();

    /**
     *
     * Helpers & polyfills.
     *
     * ...Object.create polyfill.
     *
     */

    if (!Object.create) {
      Object.create = function(o) {
        if (arguments.length > 1) {
          throw new Error('Object.create implementation' + ' only accepts the first parameter.');
        }

        function F() {}
        F.prototype = o;
        return new F();
      };
    }


    /**
     *
     * Custom Modernizr tests
     *
     */

    //Add Modernizr test
    Modernizr.addTest('isios', function() {
      return navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
    });

    //usage
    if (Modernizr.isios) {
      console.log("is IOS");
    }


    //
    //
    // page custom code can start going here
    //
    //



  });

}());
