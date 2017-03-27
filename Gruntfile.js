module.exports = function(grunt) {

  console.log("==================================================");
  console.log("Current distribution folder:", getNewDateString());

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      output: getNewDateString()
    },

    /**
     *
     * Handlebars / HTML
     *
     */

    clean: {
      output_html: ['src/output/**/*.html']
    },

    assemble: {
      options: {
        layoutdir: './src/hbs/wrapper',
        layout: 'main.hbs',
        partials: ['./src/hbs/partials/**/*.hbs'],
        flatten: true,
      },
      site: {
        src: ['./src/hbs/pages/**/*.hbs'],
        dest: './src/output',
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          preserveLineBreaks: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
        },
        files: {
          'dist/<%= dirs.output %>/index.html': 'dist/<%= dirs.output %>/index.html',     // 'destination': 'source'
        }
      },
    },

    /**
     *
     * Sass / Styles
     *
     */

    sass: {
      dev: {
        options: {
          sourceMap: true,
          style: 'expanded'
        },
        files: {
          'src/temp/screen.pre.css': 'src/sass/screen.scss'
        }
      },
      prod: {
        options: {
          sourceMap: false,
          style: 'expanded'
        },
        files: {
          'src/temp/screen.pre.prod.css': 'src/sass/screen.scss'
        }
      },
    },

    postcss: {
      // Update the dev file with autoprefixer
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 4 versions']
            }),
          ]
        },
        src: 'src/temp/screen.pre.css',
        dest: 'src/output/css/screen.css'
      },
      // Update the prod file with minification
      prod: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: ['last 4 versions']
            }),
            require('cssnano')() // minify the result
          ]
        },
        src: 'src/temp/screen.pre.prod.css',
        dest: 'dist/<%= dirs.output %>/css/screen.css'
      },
    },

    /**
     *
     * JS (w/ Browserify)
     *
     */

    browserify: {
      options: {
        sourceMap: true,
        transform: [
          ["babelify", { "presets": ["es2015"] }]
        ]
      },
      dev: {
        src: 'src/js/app.js',
        dest: 'src/temp/main-bundled.js'
      },
    },

    removelogging: {
      dist: {
        src: "src/temp/main-bundled.js",
        dest: "src/temp/main-clean.js"
      },
    },

    uglify: {
      prod: {
        src: 'src/temp/main-clean.js',
        dest: 'src/temp/main-clean-ugly.js'
      }
    },

    concat: {
      options: {
        sourceMap: true,
      },
      dev: {
        src: [
          'src/js/plugins/plugins.js',
          'src/temp/main-bundled.js',
        ],
        dest: 'src/output/js/scripts.js'
      },
      prod: {
        src: [
          'src/js/plugins/plugins.js',
          'src/temp/main-clean-ugly.js',
        ],
        dest: 'dist/<%= dirs.output %>/js/scripts.js'
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        force: true,
      },
      dev: ['Gruntfile.js', './src/js/app.js', './src/js/modules/*'],
    },

    /**
     *
     * Copy task (getting to dist)
     *
     */

    copy: {
      css: {
        files: [{
          src: 'src/css/screen.css',
          dest: 'dist/<%= dirs.output %>/css/screen.css',
        }],
      },
      js: {
        files: [{
          src: 'src/js/scripts.js',
          dest: 'dist/<%= dirs.output %>/js/scripts.js',
        }],
      },
      jvenddev: {
        expand: true,
        cwd: 'src/js/vendor',
        src: '**',
        dest: 'src/output/js/vendor',
      },
      jsvendor: {
        expand: true,
        cwd: 'src/js/vendor',
        src: '**',
        dest: 'dist/<%= dirs.output %>/js/vendor',
      },
      html: {
        src: 'src/index.html',
        dest: 'dist/<%= dirs.output %>/index.html',
      },
      imgs: {
        expand: true,
        cwd: 'src/',
        src: 'img/**/*',
        dest: 'dist/<%= dirs.output %>/',
        flatten: false,
        filter: 'isFile',
      },
    },

    /**
     *
     * Minify images
     *
     */

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,gif,JPG}'],
          dest: 'dist/<%= dirs.output %>/'
        }]
      }
    },

    /**
     *
     * Express
     *
     */

    express: {
      all: {
        options: {
          bases: ['./src/output'],
          hostname: "0.0.0.0",
          livereload: true,
          port: 1337
        }
      }
    },

    /**
     *
     * Watch task.
     *
     * Basically the watch task is JUST for the dev folder.
     * Run a separate prod task to copy everything over to prod, minify, etc.
     *
     */

    watch: {
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['browserify:dev', 'concat:dev', 'jshint:dev'],
        options: {
          spawn: false,
        },
      },
      styles: {
        files: ['src/sass/**.scss', 'src/sass/**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev'],
        options: {
          spawn: false,
        },
      },
      pages: {
        files: ['src/hbs/**/*.hbs', 'src/hbs/*.hbs'],
        tasks: ['clean:output_html', 'assemble:site'],
        options: {
          spawn: false,
        },
      }
    }
  });

  /**
   *
   * Task set-up.
   *
   */

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['express', 'watch']);

  grunt.registerTask('compressimages', ['newer:imagemin']);

  grunt.registerTask('dev', ['browserify:dev',
                             'concat:dev',
                             'copy:jvenddev',
                             'sass:dev',
                             'postcss:dev',
                             'assemble:site',
                             'express',
                             'watch']);

  grunt.registerTask('prod', ['sass:prod',
                              'postcss:prod',
                              'removelogging:dist',
                              'uglify:prod',
                              'concat:prod',
                              'copy:html',
                              'htmlmin:dist',
                              'copy:imgs',
                              'copy:jsvendor']);
};


/**
 *
 * Helper function to get a Date String for constructing distribution folders.
 * This can probably be dumped into a separate module file or something.
 *
 */

function getNewDateString() {
  var curDate = new Date();
  var curYear = curDate.getFullYear();
  var curMonth = curDate.getMonth() + 1;
  var curDay = curDate.getDate();
  var curHours = curDate.getHours();
  var curMinutes = curDate.getMinutes();

  var dateString = "dist--";

  dateString += curYear.toString();
  dateString += (curMonth <= 9) ? "0" + curMonth.toString() : (curMonth).toString();
  dateString += (curDay <= 9) ? "0" + curDay.toString() : (curDay).toString();

  dateString += "_";

  dateString += (curHours <= 9) ? "0" + curHours.toString() : (curHours).toString();
  dateString += (curMinutes <= 9) ? "0" + curMinutes.toString() : (curMinutes).toString();

  return dateString;
};
