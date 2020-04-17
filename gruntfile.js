let banner = "/*! <%= pkg.name %> <%= pkg.version %> */";

module.exports = function (grunt) {
  grunt.initConfig({
    // Package
    pkg: grunt.file.readJSON("package.json"),

    // Watch
    watch: {
      javascript: {
        files: ["src/**/*.js", "!src/**/*.min.js"],
        tasks: ["concat:dist", "uglify"],
      },
      configFiles: {
        files: ["gruntfile.js"],
        options: {
          reload: true,
        },
      },
    },

    uglify: {
      options: {
        banner: banner,
        footer: "\n",
        compress: true,
        mangle: true,
        sourceMap: true,
      },
      dist: {
        files: {
          "dist/django-filters.min.js": ["dist/django-filters.js"],
        },
      },
    },

    concat: {
      dist: {
        src: ["src/*.js"],
        dest: "dist/django-filters.js",
      },
    },
  });

  // Load NPM Tasks
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.loadNpmTasks("grunt-contrib-concat");

  // Register Grunt tasks
  grunt.registerTask("default", ["concat:dist", "uglify"]);
};
