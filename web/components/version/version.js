'use strict';

angular.module('MDM.version', [
    'MDM.version.interpolate-filter',
    'MDM.version.version-directive'
])

//.value('version', '3.2'); //for uat and dev
.value('version', '1.4');//for prod