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
          'docs/chorewheel.js': ['scripts/common.js', 'scripts/chorewheel.js'],
          'docs/edit.js': ['scripts/common.js', 'scripts/edit.js'],
          'docs/remind.js': ['scripts/common.js', 'scripts/remind.js'],
        }
      }
    },
    cssmin: {
      default: {
        files: {
          'docs/chorewheel.css': ['style/chorewheel.css', 'style/bulma.min.css', 'style/materia.min.css'],
        }
      }
    },
    htmlmin: {
      options: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
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
          'docs/remind.html': 'html/remind.html',
        }
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask("default", ["jshint", "cssmin", "uglify", "htmlmin"]);
};
