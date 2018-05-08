module.exports=function(grunt){
//Project configuration
grunt.initConfig({
	pkg:grunt.file.readJSON('package.json'),
	uglify:{
	dist:{
		files:{
			'web/commonFilters/commonFilters.min.js':['web/commonFilters/commonFilters.js'],
			'web/lib/angular/angular.min.js':['web/lib/angular/angular.js'],
			'web/lib/angular/angular-route.min.js':['web/lib/angular/angular-route.js'],
			'web/CreateLead/CreateLead.min.js':['web/CreateLead/CreateLead.js'],
			'web/dashboard/dashboard.min.js':['web/dashboard/dashboard.js'],
			'web/forgotPassword/forgotPassword.min.js':['web/forgotPassword/forgotPassword.js'],
			'web/js/drilldown.min.js':['web/js/drilldown.js'],
			'web/js/exporting.min.js':['web/js/exporting.js'],
			'web/js/highcharts.min.js':['web/js/highcharts.js'],
			'web/js/no-data-to-display.min.js':['web/js/no-data-to-display.js'],
			'web/js/pikaday.min.js':['web/js/pikaday.js'],
			'web/js/pikaday-angular.min.js':['web/js/pikaday-angular.js'],
			'web/login/login.min.js':['web/login/login.js'],
			'web/manageLeads/manageLeads.min.js':['web/manageLeads/manageLeads.js'],
			'web/PlatwareClient/aes.min.js':['web/PlatwareClient/aes.js'],
			'web/PlatwareClient/fingerprint.min.js':['web/PlatwareClient/fingerprint.js'],
			'web/PlatwareClient/pbkdf2.min.js':['web/PlatwareClient/pbkdf2.js'],
			'web/PlatwareClient/PlatwareAES.min.js':['web/PlatwareClient/PlatwareAES.js'],
			'web/PlatwareClient/PlatwareClient.min.js':['web/PlatwareClient/PlatwareClient.js'],
			'web/PlatwareClient/sha2.min.js':['web/PlatwareClient/sha2.js'],
			'web/QueryAnalysis/QueryAnalysis.min.js':['web/QueryAnalysis/QueryAnalysis.js'],
			'web/template/WebOnFormDirective.min.js':['web/template/WebOnFormDirective.js'],
			'web/updateLeads/updateLeads.min.js':['web/updateLeads/updateLeads.js'],
			'web/app.min.js':['web/app.js']			
		},
		
	},
	test:{
			files:{
				'web/app.min.js':['web/app-concated.js']
			}
		}
	},
	       concat:{
            js: {
                src: [
				'web/app.js',
				'web/login/login.js',
				'web/PlatwareClient/aes.js',
'web/PlatwareClient/fingerprint.js',
'web/PlatwareClient/pbkdf2.js',
'web/PlatwareClient/PlatwareAES.js',
'web/PlatwareClient/PlatwareClient.js',
'web/PlatwareClient/sha2.js',
				'web/commonFilters/commonFilters.js',
				'web/js/drilldown.js',
'web/js/exporting.js',
'web/js/highcharts.js',
'web/js/no-data-to-display.js',
'web/js/pikaday-angular.js',
'web/js/pikaday-angular.js',
'web/CreateLead/CreateLead.js',
'web/dashboard/dashboard.js',
'web/forgotPassword/forgotPassword.js',


'web/manageLeads/manageLeads.js',

'web/QueryAnalysis/QueryAnalysis.js',
'web/template/WebOnFormDirective.js',
'web/updateLeads/updateLeads.js'

],
                dest: 'web/app-concated.js'
            }
            
        },
		 clean:{
            build:['dist'],
            js:['build/web/app.js',
'build/web/app-concated.js',
'build/web/app-concated.min.js',
'build/web/updateLeads/*.js',
'build/web/template/*.js',
'build/web/QueryAnalysis/*.js',
'build/web/CreateLead/*.js',
'build/web/manageLeads/*.js',
'build/web/js/*.js',
'build/web/dashboard/*.js',
'build/web/PlatwareClient/*.js',
'build/web/login/*.js',
'build/web/commonFilters/*.js',
'build/web/forgotPassword/*.js'
]
            
        },
	 war: {
            target: {
                options: {
                    war_dist_folder: 'dist',    /* Folder where to generate the WAR. */
                    war_name: 'MDM_DEV'                    /* The name fo the WAR file (.war will be the extension) */
                },
                files: [
                    {
                        expand: true,
                        cwd: 'web',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        },
		processhtml: {
            build: {
                files: {
                    'build/web/index.html' : ['web/index.html']
                }
            }
        }
	
});
// Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks( 'grunt-war' );
	grunt.loadNpmTasks( 'grunt-processhtml' );
	 grunt.loadNpmTasks('grunt-contrib-concat');
	//grunt.registerTask("uf",['uglify'])
	//grunt.registerTask('default', ['processhtml','concat','uglify:test','war']);
		grunt.registerTask('dev', ['war']);
};