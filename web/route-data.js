angular.module("RouteData",['ng']).
	provider("RouteData",function()
	{
		var settings={};
		var hookToRootScope=false;
		this.applyConfig=function(newSettings){
			settings=newSettings;
		};
		this.hookToRootScope=function(enableRootToScopeHook){
			hookToRootScope=enableRootToScopeHook;
		};
		function RouteData(){
			 this.set = function(index, value) {
      settings[index] = value;
    };
			this.get=function(index){
				if(settings.hasOwnProperty(index)){
					return settings[index];
				}
				else{
					console.log("unable to access item not yet defined");
				}
			};
			this.isHookedToRootScope=function()
			{
				return hookToRootScope;
			};
		}
			this.$get=function()
			{
				return new RouteData();
			};
	}).
	run(["$location","$rootScope","RouteData",function($location,$rootScope,RouteData){
		if(RouteData.isHookedToRootScope){
			$rootScope.RouteData=RouteData;
		}
		$rootScope.$on("$routeChangeStart",function(event,current,previous){
			var route=current.$$route;
			if(typeof route !=="undefined" && typeof(route['RouteData'])!=="undefined"){
				var data=route["RouteData"];
				for (var index in data) {
					 RouteData.set(index, data[index]);					
				}
			}
		});
	}]);