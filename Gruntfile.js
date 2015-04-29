module.exports = function(grunt) {

    // configure the tasks
    grunt.initConfig({

        copy: {
            build: {
                cwd: 'dev',
                src: [ '**', '!**/*.styl', '!**/*.jade' ],
                dest: 'prod',
                expand: true
            },
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
        script: {
            build: {
                expand: true,
                cwd: 'dev',
                src: [ '**/*.js' ],
                dest: 'prod'
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
                    'prod/style.css': [ 'prod/**/*.css' ]
                }
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'prod/script.js': [ 'prod/**/*.js' ]
                }
            }
        },
        clean: {
            build: {
                src: [ 'prod' ]
            },
            stylesheets: {
                src: [ 'prod/**/*.css', '!prod/style.css' ]
            },
            scripts: {
                src: [ 'prod/**/*.js', '!prod/script.js' ]
            },
        },
        jade: {
            compile: {
                options: {
                    data: {}
                },
                files: [{
                    expand: true,
                    cwd: 'dev',
                    src: [ '**/*.jade' ],
                    dest: 'prod',
                    ext: '.html'
                }]
            }
        },
        watch: {
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

    // define the tasks
    grunt.registerTask(
        'default',
        'Watches the project for changes, automatically builds them and runs a server.',
        [ 'build', 'connect', 'watch' ]
    );

    grunt.registerTask(
        'scripts',
        'Compiles the JavaScript files.',
        [ 'script', 'uglify', 'clean:scripts' ]
    );

    grunt.registerTask(
        'stylesheets',
        'Compiles the stylesheets.',
        [ 'stylus', 'autoprefixer', 'cssmin', 'clean:stylesheets' ]
    );

    grunt.registerTask(
        'build',
        'Compiles all of the assets and copies the files to the build directory.',
        [ 'clean:build', 'copy', 'stylesheets', 'scripts', 'jade' ]
    );
};
