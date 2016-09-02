module.exports = function(grunt) {

  // Helper function to get a Date String for constructing distribution folders.
  // This can probably be dumped into a separate module file or something.
  // TODO: un-hardcode the curYear variable, yeesh.
  var getNewDateString = function() {
    var curDate = new Date();
    var curYear = "16";
    var curMonth = curDate.getMonth() + 1;
    var curDay = curDate.getDate();
    var curHours = curDate.getHours();
    var curMinutes = curDate.getMinutes();

    var dateString = "dist-";

    dateString += (curMonth <= 9) ? "0" + curMonth.toString() : (curMonth).toString();
    dateString += (curDay <= 9) ? "0" + curDay.toString() : (curDay).toString();

    dateString += curYear;
    dateString += "_";

    dateString += (curHours <= 9) ? "0" + curHours.toString() : (curHours).toString();
    dateString += (curMinutes <= 9) ? "0" + curMinutes.toString() : (curMinutes).toString();

    return dateString;
  };


  console.log("==================================================");
  console.log("Current distribution folder:", getNewDateString());

  grunt.initConfig({

    // I've set this up but I don't think I ever actually use it. TODO: figure
    // out why I might want or need this.
    pkg: grunt.file.readJSON('package.json'),

    // Object declaring some directory props. Make it clear that we have set
    // target directories for everything. This includes a folder dedicated to
    // source files, a dev folder that actually has no purpose in the current
    // set-up, a preview folder where debuggable preview builds are put, and a
    // temp folder for transient files in case we want to do back-tracking to
    // find an issue. Output (production or distribution) gets a new date string
    // so we can construct a new distribution folder on each prod run. For the
    // most part I'm not actually using these, since I've just got the
    // directories hard coded in and can't think of a reason not to do that. But
    // I might revisit this in the future. Also worth noting that all of this
    // multidirectory stuff was because I decided I wanted to break out my own
    // source files from what I'm previewing in the browser so I know what I'm
    // ultimately adding up if I count lines of code. Which may not be good
    // enough of a reason to justify all of this but hey it's where we're at
    // now.
    dirs: {
      src: 'src',
      dev: 'dev',
      preview: 'preview',
      temp: 'temp',
      output: getNewDateString()
    },

    // Stylesheets. Pretty straight-forward: pass through sass and then through
    // postcss. Best of both worlds!

    // Compile sass files. Includes sourcemaps for build/stage, not for prod.
    // Prod and build tasks both start with the source files but create separate
    // temp files.
    sass: {
      build: {
        options: {
          sourceMap: true,
          style: 'expanded'
        },
        files: {
          'temp/screen.pre.css': 'src/sass/screen.scss'
        }
      },
      prod: {
        options: {
          sourceMap: false,
          style: 'expanded'
        },
        files: {
          'temp/screen.pre.prod.css': 'src/sass/screen.scss'
        }
      },
    },

    // PostCSS. Autoprefix for dev, autoprefix and minify for prod. Follows the
    // sass task in this set-up, picking up temp files and then placing outputs
    // either in preview or dist.
    postcss: {
      build: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 4 versions']
            }),
          ]
        },
        src: 'temp/screen.pre.css',
        dest: 'preview/css/screen.css'
      },
      prod: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: ['last 4 versions']
            }),
            require('cssnano')()
          ]
        },
        src: 'temp/screen.pre.prod.css',
        dest: 'dist/<%= dirs.output %>/css/screen.css'
      },
    },

    // Scripts. The flow is basically like we've got a main "app" file that
    // calls on other module files as needed; in turn all of that stuff may rely
    // on some globally available plugins, which we're simply adding in already
    // minified in a separate plugins file that will be concatenated onto the
    // top of our output scripts file. At the end of the day we've got one big
    // scripts.js file and sourcemaps when we need them.

    // Let's check our JS file for horrifying errors. This only runs on the src
    // files. Would need to add other files beyond the main app.js if needed.
    // force is true so it doesn't jam up the whole works if something minor
    // isn't right.
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        force: true,
      },
      dev: ['Gruntfile.js', './src/js/app.js', './src/js/modules/*'],
    },

    // Browserify. Take our main app script and pull in all the modules. If I
    // needed to have multiple top-level app files for some unholy reason I'd
    // need to add a separate flow and do some concat action down the line.
    // Includes source maps for dev and not for prod. TODO: figure out why I
    // have that top-level options object, is it needed?
    browserify: {
      options: {
        sourceMap: true,
      },
      build: {
        src: 'src/js/app.js',
        dest: 'temp/browserify-bundle.js',
        options: {
          sourceMap: true,
          browserifyOptions: {
            debug: true
          }
        }
      },
      prod: {
        src: 'src/js/app.js',
        dest: 'temp/browserify-bundled-for-min.js',
        options: {
          sourceMap: false,
        }
      },
    },

    // Get rid of console.log statements but only from the production output.
    removelogging: {
      dist: {
        src: "temp/browserify-bundled-for-min.js",
        dest: "temp/browserify-bundled-for-min-unlogged.js"
      },
    },

    // Minify the JS file. TODO: figure out how to better handle plugin files
    // and my own framework file; I think it just means pushing off those tasks
    // into their own separate projects and then manually copying in the plugins
    // needed into my plugins file, so this becomes nothing but the prod task.
    uglify: {
      prod: {
        src: 'temp/browserify-bundled-for-min-unlogged.js',
        dest: 'temp/browserify-bundled-for-min-unlogged-minified.js'
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

    // Concat. Squash the plugins file onto the browserify bundle and put our
    // final file into the target directory. So now we've come. To the end. Of
    // the road.
    concat: {
      build: {
        src: [
          'src/js/plugins/plugins.js',
          'temp/browserify-bundle.js',
        ],
        dest: 'preview/js/scripts.js',
        options: {
          sourceMap: true,
        },
      },
      prod: {
        src: [
          'src/js/plugins/plugins.js',
          'temp/browserify-bundled-for-min-unlogged-minified.js',
        ],
        dest: 'dist/<%= dirs.output %>/js/scripts.js'
      }
    },

    // HTML. Just minifying. Removing comments and whitespace. This only happens
    // in the production output run.

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
          'dist/<%= dirs.output %>/index.html': 'dist/<%= dirs.output %>/index.html',
        }
      },
    },

    // Images. Minify them. We use newer to make sure we only do this as much as
    // is needed.

    imagemin: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,gif,JPG,svg}'],
          dest: 'temp/'
        }]
      },
      prod: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,gif,JPG,svg}'],
          dest: 'temp/'
        }]
      },
    },

    // Copying files. There's things that aren't processed or that other
    // processes aren't putting into their final locations or we just need mid-
    // point resting places for some things and this rounds up everything needed
    // and makes sure it gets where it needs to go. TODO: weed out anything
    // really unneccesary here. Also can we nest the variants? This seems a
    // little messy. Oh and also figure out what happens if we wind up with more
    // than an index file...

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
      jsvendorBuild: {
        expand: true,
        cwd: 'src/js/vendor',
        src: '**',
        dest: 'preview/js/vendor',
      },
      html: {
        src: 'src/index.html',
        dest: 'dist/<%= dirs.output %>/index.html',
      },
      htmlBuild: {
        src: 'src/index.html',
        dest: 'preview/index.html',
      },
      imgs: {
        expand: true,
        cwd: 'temp/',
        src: 'img/**/*',
        dest: 'dist/<%= dirs.output %>/',
        flatten: false,
        filter: 'isFile',
      },
      imgsBuild: {
        expand: true,
        cwd: 'temp/',
        src: 'img/**/*',
        dest: 'preview/',
        flatten: false,
        filter: 'isFile',
      },
    },

    // Express. The webserver we use to preview our work. This is only tied to
    // preview, for checking dist runs, I suggest manually using http-server in
    // the output directory.

    express: {
      all: {
        options: {
          bases: ['./preview'],
          hostname: "0.0.0.0",
          livereload: true,
          port: 1337
        }
      }
    },

    // Watch for changes and update the preview folder as needed. This doesn't
    // do anything for production though. IE this is solely focused on creating
    // the preview folder for development use.

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['browserify:build', 'concat:build', 'jshint:dev'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
      styles: {
        files: ['src/sass/**.scss', 'src/sass/**/*.scss'],
        tasks: ['sass:build', 'postcss:build'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
      html: {
        files: ['src/**.html'],
        tasks: ['newer:copy:htmlBuild'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
      images: {
        files: ['**/*.{png,jpg,gif,JPG}'],
        tasks: ['newer:imagemin:build'],
        options: {
          spawn: false,
        },
      },
    }

  });

  // Automatically load all required grunt tasks. Never remove this line.
  require('load-grunt-tasks')(grunt);

  // I never use this, but it's possible to launch right back into an existing
  // preview folder without rebuilding it. Good to have something in case I just
  // type grunt and don't know what to expect.
  grunt.registerTask('default', ['express', 'watch']);

  // For a while I needed to compress images manually but I think I've squashed
  // that out now. TODO: determine whether I actually need this or not.
  grunt.registerTask('compressimages', ['newer:imagemin']);

  // Here's our big two commands.

  // devBuild gives us a fresh build of our stage folder and then launches
  // express/watch so we can live check for changes.

  // prodReady spits out a unique dist- folder, timestamped. So we can put out
  // options without over writing one folder over and over. This means I can
  // spit out distributable variants of a design in case I want to easily show
  // off some options. Nice.

  grunt.registerTask('devBuild', ['sass:build',
                                  'postcss:build',
                                  'browserify:build',
                                  'concat:build',
                                  'newer:copy:htmlBuild',
                                  'newer:imagemin:build',
                                  'newer:copy:imgsBuild',
                                  'newer:copy:jsvendorBuild',
                                  'express',
                                  'watch']);

  grunt.registerTask('prodReady', ['sass:prod',
                                   'postcss:prod',
                                   'browserify:prod',
                                   'removelogging:dist',
                                   'uglify:prod',
                                   'concat:prod',
                                   'copy:html',
                                   'htmlmin:dist',
                                   'newer:imagemin:prod',
                                   'copy:imgs',
                                   'copy:jsvendor']);

};
