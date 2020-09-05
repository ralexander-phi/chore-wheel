module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      default: {
        src: ['scripts/*.js'],
      }
    },
    uglify: {
      options: {
        sourceMap: true,
      },
      default: {
        files: {
          'docs/app.min.js': ['scripts/app.js'],
          'docs/chorewheel.min.js': ['scripts/common.js', 'scripts/chorewheel.js'],
          'docs/edit.min.js': ['scripts/common.js', 'scripts/edit.js'],
          'docs/service-worker.js': ['scripts/service-worker.js'],
        }
      }
    },
    cssmin: {
      default: {
        files: {
          'docs/chorewheel.min.css': ['style/chorewheel.css'],
        }
      }
    },
    htmlmin: {
      options: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
      },
      default: {
        files: {
          'docs/about.html': 'html/about.html',
          'docs/edit.html': 'html/edit.html',
          'docs/index.html': 'html/index.html',
        }
      }
    },
    copy: {
      default: {
        files: {
          'docs/manifest.json': 'manifest.json',
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask("default", ["jshint", "cssmin", "uglify", "htmlmin", "copy"]);
};
