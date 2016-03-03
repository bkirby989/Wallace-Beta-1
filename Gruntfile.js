module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }        
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass'],
      },
      scripts:{
        files: ['angular/app.js', 'angular/**/*.js'],
        tasks: ['uglify'],
      },
      livereload: {
        options: {livereload: 1337},
        files: ['css/*.css', '**/*.html'],
      },
    },

    postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer-core')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: 'css/*.css'
            }
        },

      uglify: {
          options: {
           // beautify: true,
            mangle: true,
            compress: {
               drop_console: true
          }
        },
        my_target: {
          files: {
            'app.js': ['angular/app.js', 'angular/**/*.js']
          }
        }
  },

    ngAnnotate: {
        options: {
            // Task-specific options go here. 
        },
        my_target: {

          files: {
            // Target-specific file lists and/or options go here. 
            'dest/output.js': ['dest/output.js']
          }
        },
    }


  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-ng-annotate');



  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['build','watch']);
    grunt.registerTask('default', ['postcss:dist']);

}