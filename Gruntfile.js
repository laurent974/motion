module.exports = function(grunt) {

    // configure the tasks
    grunt.initConfig({
        copy: {
            build: {
                cwd: 'dev',
                src: [ '**', '!**/*.styl', '!**/*.jade' ],
                dest: 'prod',
                expand: true
            }
        },
        stylus: {
            build: {
                options: {
                    linenos: true,
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: 'dev',
                    src: [ '**/*.styl' ],
                    dest: 'prod',
                    ext: '.css'
                }]
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            build: {
                files: [
                {
                    src: ['dev/assets/vendor/*.js', 'dev/assets/scripts/main.js'],
                    dest: 'prod/script.min.js'
                }
                ]
            }
        },
        autoprefixer: {
            build: {
                expand: true,
                cwd: 'prod',
                src: [ '**/*.css' ],
                dest: 'prod'
            }
        },
        cssmin: {
            build: {
                files: {
                    'prod/style.min.css': [ 'prod/**/*.css' ]
                }
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'prod/script.min.js': [ 'prod/**/*.js' ]
                }
            }
        },
        clean: {
            build: {
                src: [ 'prod' ]
            },
            stylesheets: {
              src: [ 'prod/**/*.css', '!prod/style.min.css' ]
            },
            minstyle: {
              src: [ 'prod/style.min.css']
            },
            scripts: {
              src: [ 'prod/**/**/*.js', '!prod/script.min.js' ]
            },
            minscript: {
              src: [ 'prod/script.min.js']
            }
        },
        jade: {
            compile: {
                options: {
                    data: {}
                },
                files: [{
                    expand: true,
                    cwd: 'dev',
                    src: [ '**/*.jade', '!**/_*.jade' ],
                    dest: 'prod',
                    ext: '.html'
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            stylesheets: {
                files: 'dev/**/*.styl',
                tasks: [ 'stylesheets' ]
            },
            scripts: {
                files: 'dev/**/*.js',
                tasks: [ 'scripts' ]
            },
            jade: {
                files: 'dev/**/*.jade',
                tasks: [ 'jade' ]
            },
            copy: {
                files: [ 'dev/**', '!dev/**/*.styl', '!dev/**/*.js', '!dev/**/*.jade' ],
                tasks: [ 'copy' ]
            }
        },
        cleanempty: {
            options: {},
            src: ['prod/**']
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: 'prod',
                    hostname: '*'
                }
            }
        }
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-cleanempty');

    // define the tasks
    grunt.registerTask(
        'default',
        'Watches the project for changes, automatically builds them and runs a server.',
        [ 'build', 'connect', 'watch' ]
    );

    grunt.registerTask(
        'scripts',
        'Compiles the JavaScript files.',
        [ 'clean:minscript', 'concat', 'uglify', 'clean:scripts', 'cleanempty' ]
    );

    grunt.registerTask(
        'stylesheets',
        'Compiles the stylesheets.',
        [ 'clean:minstyle', 'stylus', 'autoprefixer', 'cssmin', 'clean:stylesheets', 'cleanempty' ]
    );

    grunt.registerTask(
        'build',
        'Compiles all of the assets and copies the files to the build directory.',
        [ 'clean:build', 'copy', 'stylesheets', 'scripts', 'jade', 'cleanempty' ]
    );
};
