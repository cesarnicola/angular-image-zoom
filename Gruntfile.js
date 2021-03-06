'use strict';
/**
 *
 */
module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: ['src/less'],
          strictMath: true
        },
        files: {
          'dist/image-zoom.css': 'src/less/image-zoom.less'
        }
      },
      minify: {
        options: {
          compress: true,
          cleancss: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'image-zoom.min.css.map',
          sourceMapFilename: 'image-zoom.min.css.map',
          report: 'min',
          keepSpecialComments: '0'
        },
        files: {
          'dist/image-zoom.min.css': 'dist/image-zoom.css'
        }
      }
    },
    concat: {
      app: {
        options: {
          separator: ';',
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: "'use strict';\n",
          process: function (src, filepath) {
            var newSrc = src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
            return newSrc;
          },
        },
        src: [
          'src/js/image-zoom.js',
        ],
        dest: 'dist/image-zoom.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= pkg.author.name %> <%= pkg.license %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>' +
          ' */',
        mangle: false,
        preserveComments: false,
        compress: {
          drop_console: true
        },
        report: 'min'
      },
      production: {
        files: {
          'dist/image-zoom.min.js': ['dist/image-zoom.js'],
        }
      }
    },
    copy: {
      templateToDist: {
        files: [{
          expand: true,
          flatten: true,
          src: 'src/template/*.html',
          dest: 'dist',
          filter: 'isFile'
        }]
      }
    },
    watch: {
      css: {
        files: ['src/less/*.less'],
        tasks: ['less'],
        options: {
          livereload: false,
        },
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          livereload: false,
        },
      },
      template: {
        files: ['src/template/*.html'],
        tasks: ['copy:templateToDist'],
        options: {
          livereload: false,
        },
      }
    },
    express: { // to server file on local machine
      server: {
        options: {
          port: 9000,
          bases: ['demo', 'dist']
        }
      }
    },
    concurrent: {
      devWatch: ['demoServer', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
  });

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-concurrent');
  // build
  grunt.registerTask('build', ['copy:templateToDist', 'less', 'concat', 'uglify']);
  //development
  grunt.registerTask('dev', ['concurrent:devWatch']);
  grunt.registerTask('demoServer', ['express', 'express-keepalive']);
};
