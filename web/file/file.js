$scope.readCSV = function () {
            var csvfile = document.getElementById('csvfile');
            csvfile.addEventListener('change', function (e) {
                var file = csvfile.files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var result = e.target.result;
                    console.log(result);
                    var allTextLines = result.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];

		for ( var i = 0; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				var tarr = [];
				for ( var j = 0; j < headers.length; j++) {
					tarr.push(data[j]);
				}
				lines.push(tarr);
			}
		}
		$scope.data = lines;
                console.log($scope.data);

                }
                reader.readAsText(file);
                
            });
            
        };
        $scope.readCSV();


