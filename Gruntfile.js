module.exports = function(grunt) {

  // TODO: Comment this function.

  var getNewDateString = function() {
    curDate = new Date();
    curYear = "16";
    curMonth = curDate.getMonth() + 1;
    curDay = curDate.getDate();
    curHours = curDate.getHours();
    curMinutes = curDate.getMinutes();

    dateString = "dist-";

    dateString += (curMonth <= 9) ? "0" + curMonth.toString() : (curMonth).toString();
    dateString += (curDay <= 9) ? "0" + curDay.toString() : (curDay).toString();

    dateString += curYear;
    dateString += "_";

    dateString += (curHours <= 9) ? "0" + curHours.toString() : (curHours).toString();
    dateString += (curMinutes <= 9) ? "0" + curMinutes.toString() : (curMinutes).toString();

    return dateString;
  };


  console.log("Current distribution folder:", getNewDateString());


  // TODO: Document this initialization call.

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
        output: getNewDateString()
    },

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
    },

    postcss: {
      // Update the dev file with autoprefixer
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer-core')({
              browsers: ['last 4 versions']
            }),
          ]
        },
        src: 'src/temp/screen.pre.css',
        dest: 'src/css/screen.css'
      },
      // Update the prod file with minification
      prod: {
        options: {
          map: false,
          processors: [
            require('autoprefixer-core')({
              browsers: ['last 4 versions']
            }),
            require('cssnano')() // minify the result
          ]
        },
        src: 'src/temp/screen.pre.css',
        dest: 'dist/<%= dirs.output %>/css/screen.css'
      },
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
        dest: 'src/js/scripts.js'
      },
      prod: {
        src: [
          'src/js/plugins/plugins.js',
          'src/temp/main-clean-ugly.js',
        ],
        dest: 'dist/<%= dirs.output %>/js/scripts.js'
      }
    },

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
      },
      dd3: {
        src: 'src/js/plugins/DD3.js',
        dest: 'src/js/plugins/DD3.min.js',
      },
      console: {
        src: 'src/js/plugins/console-errors.js',
        dest: 'src/js/plugins/console-errors.min.js',
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        force: true,
      },
      dev: ['Gruntfile.js', './src/js/app.js', './src/js/modules/*'],
    },

    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          preserveLineBreaks: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
        },
        files: {                                   // Dictionary of files
          'dist/<%= dirs.output %>/index.html': 'dist/<%= dirs.output %>/index.html',     // 'destination': 'source'
        }
      },
    },

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

    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'src/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,JPG}'],   // Actual patterns to match
          dest: 'dist/<%= dirs.output %>/'                  // Destination path prefix
        }]
      }
    },


    // Grunt express - our webserver
    // https://github.com/blai/grunt-express
    express: {
      all: {
        options: {
          bases: ['./src'],
          hostname: "0.0.0.0",
          livereload: true,
          port: 1337
        }
      }
    },

    // Basically the watch task is JUST for the dev folder.
    // Run a separate prod task to copy everything over to prod, minify, etc.

    watch: {
      scripts: { // sort this out...basically need to do my own stuff then concat it and copy it to dist...
        files: ['src/**/*.js'],
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
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['express', 'watch']);

  grunt.registerTask('compressimages', ['newer:imagemin']);

  grunt.registerTask('devPrep', ['browserify:dev', 'concat:dev', 'sass:dev', 'postcss:dev', 'express', 'watch']);

  grunt.registerTask('prodReady', ['sass:dev', 'postcss:prod', 'removelogging:dist', 'uglify:prod', 'concat:prod', 'copy:html', 'htmlmin:dist', 'copy:imgs', 'copy:jsvendor']);

};
