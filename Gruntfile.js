module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
        dest: 'dist/css/screen.css'
      },
    },

    concat: {
      options: {
        sourceMap: true,
      },
      dev: {
        src: [
          'src/js/plugins/plugins.js',
          'src/js/main.js',
        ],
        dest: 'src/js/scripts.js'
      },
      prod: {
        src: [
          'src/js/plugins/plugins.js',
          'src/temp/main-clean-ugly.js',
        ],
        dest: 'dist/js/scripts.js'
      }
    },

    removelogging: {
      dist: {
        src: "src/js/main.js",
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
        reporter: require('jshint-stylish')
      },
      dev: ['Gruntfile.js', './src/js/main.js'],
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
        files: {                                    // Dictionary of files
          'dist/index.html': 'dist/index.html',     // 'destination': 'source'
        }
      },
    },

    copy: {
      css: {
        files: [{
          src: 'src/css/screen.css',
          dest: 'dist/css/screen.css',
        }],
      },
      js: {
        files: [{
          src: 'src/js/scripts.js',
          dest: 'dist/js/scripts.js',
        }],
      },
      jsvendor: {
        expand: true,
        cwd: 'src/js/vendor',
        src: '**',
        dest: 'dist/js/vendor',
      },
      html: {
        src: 'src/index.html',
        dest: 'dist/index.html',
      }
    },

    imagemin: {                              // Task
      dynamic: {                             // Another target
        files: [{
          expand: true,                      // Enable dynamic expansion
          cwd: 'src/',                       // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,JPG}'],   // Actual patterns to match
          dest: 'dist/'                      // Destination path prefix
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
        tasks: ['concat:dev', 'jshint:dev'],
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
      images: {
        files: ['src/img/*.{png,jpg,gif,JPG}', 'src/img/**/*.{png,jpg,gif,JPG}'],
        tasks: ['newer:imagemin'],
        options: {
          spawn: false,
        },
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['express', 'watch']);

  grunt.registerTask('compressimages', ['newer:imagemin']);

  grunt.registerTask('devPrep', [
    'concat:dev', 
    'sass:dev',
    'postcss:dev',
    'newer:imagemin',
    'express',
    'watch'
  ]);

  grunt.registerTask('prodReady', [
    'sass:dev'
    'postcss:prod'
    'removelogging:dist'
    'uglify:prod'
    'concat:prod'
    'copy:html'
    'newer:copy:jsvendor'
    'htmlmin:dist'
    'newer:imagemin'
  ]);

};