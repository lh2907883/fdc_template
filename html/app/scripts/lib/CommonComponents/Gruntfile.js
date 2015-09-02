module.exports = function(grunt) {


    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
  		concat: {
  		    module: {
  		      options: {
  		        banner: '/*!\n * <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM") %>)\n */\n'
  		      },
  		      src: [
  		        	'src/**/*.js'
  		      ],
  		      dest: 'src/core/core.js'
  		    }
  		},
  		uglify: {
  	      	min:{
  	        	options: {
  	              	banner: '/*!\n * <%= pkg.name %> - compressed JS  - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM") %>)\n */\n',
  	              	sourceMap: true
  	            },
  	            files: {
  	              	'dest/environment/environment.min.js': ['src/environment/environment.js'],
                    'dest/core/core.min.js': ['src/core/core.js']
  	            }
  	        }
  	    },
  	  watch: {
  		  scripts: {
  		    files: [
  		        'src/**/*.js'
  		    ],
  		    tasks: ['concat','uglify']
  		  }
  		},
  		jshint: {
	        files: ['gruntfile.js', 'dist/js/**/*.js']
	    }
	});

    // 加载要使用的插件
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // 注冊任务
    grunt.registerTask('default', ['concat','uglify']);
    grunt.registerTask('test', ['jshint']);

    grunt.event.on('watch', function(action, filepath, target) {
	  grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};