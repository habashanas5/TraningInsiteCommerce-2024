module.exports = function (grunt) {

    require("load-grunt-tasks")(grunt);
    const sass = require("node-sass");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },

            webThemes: {
                files: [{
                    nocase: true,
                    expand: true,
                    src: "Themes/**/*.scss",
                    ext: ".css"
                }]
            },

            webStyles: {
                files: [{
                    nocase: true,
                    expand: true,
                    src: "Styles/*.scss",
                    ext: ".css"
                }]
            }
        },

        watch: {
            webThemes: {
                nocase: true,
                files: "Themes/**/*.scss",
                tasks: ["sass:webThemes"]
            },

            webStyles: {
                nocase: true,
                files: "Styles/*.scss",
                tasks: ["sass:webStyles"]
            }
        }
    });

    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("build", [
        "sass:webStyles",
        "sass:webThemes"
    ]);
};