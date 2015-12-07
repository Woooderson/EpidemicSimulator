  var app = angular.module("nvd3EpiSim", ['nvd3ChartDirectives']);

  function ExampleCtrl($scope){
    $scope.settings = {contactChance:0.04,infectionRate:0.0004,recoveryRate:10,timePeriod:90,totalPop:1100000,suscPop:1000000,infectPop:50000,recoverPop:45000,mortalityRate:10}; 
    $scope.sDailyRate = function (sPop, iPop) {
      return -$scope.getTransmissionRate()*sPop*iPop;
    }
    $scope.iDailyRate = function (sPop, iPop) {
      return $scope.getTransmissionRate()*sPop*iPop-1/$scope.settings.recoveryRate*iPop;
    }
    $scope.rDailyRate = function (iPop) {
      return 1/$scope.settings.recoveryRate*iPop;
    }
    $scope.getTransmissionRate = function() {
      return (($scope.settings.contactChance*0.1)*($scope.settings.infectionRate*0.1));
    }
    $scope.generateData = function () {
      $scope.dataSet = [
        {"key":"Susceptible","values":[{"x":0,"y":$scope.settings.suscPop}], "color": '#1e90ff'},
        {"key":"Infected","values":[{"x":0,"y":$scope.settings.infectPop}], "color": '#ff7f0e'},
        {"key":"Recovered","values":[{"x":0,"y":$scope.settings.recoverPop}], "color": '#2ca02c'}
      ];
      var sPop = $scope.dataSet[0].values[0].y;
      var iPop = $scope.dataSet[1].values[0].y;
      var rPop = $scope.dataSet[2].values[0].y;
      $scope.mortalities = [[ 0 , 5000 ]];

      for (j=0;j<=$scope.settings.timePeriod;j++) {
        sPop += $scope.sDailyRate(sPop,iPop);
        $scope.dataSet[0].values.push({"x":j, "y":sPop.toFixed(0)});
        iPop += $scope.iDailyRate(sPop,iPop);
        $scope.dataSet[1].values.push({"x":j, "y":iPop.toFixed(0)});
        rPop += $scope.rDailyRate(iPop)*(1-$scope.settings.mortalityRate*0.01);
        $scope.dataSet[2].values.push({"x":j, "y":rPop.toFixed(0)});
        var mortChange = Number($scope.mortalities[$scope.mortalities.length-1][1])+$scope.rDailyRate(iPop)*($scope.settings.mortalityRate*0.01);
        $scope.mortalities.push([j,mortChange]);
        console.log('day '+j +' ' +' s '+sPop.toFixed(0) + ' i '+iPop.toFixed(0) +' r '+rPop.toFixed(0));
      }
      $scope.pieData = [
            {key: "Susceptible", y: $scope.dataSet[0].values[$scope.dataSet[0].values.length-1].y, color: '#1e90ff'},
            {key: "Infected", y: $scope.dataSet[1].values[$scope.dataSet[1].values.length-1].y},
            {key: "Recovered", y: $scope.dataSet[2].values[$scope.dataSet[2].values.length-1].y},
            {key: "Dead", y: $scope.mortalities[$scope.mortalities.length-1][1].toFixed(0)}
      ];
    }
    var colorArray = ['#1e90ff', '#ff7f0e', '#2ca02c', '#ff3232'];
    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    }
    $scope.xFunction = function(){
        return function(d){
            return d[0];
        };
    }
    $scope.xAttributeFunction = function(){
        return function(d){
            return d.x;
        };
    }
    $scope.yFunction = function(){
        return function(d){
            return d[1];
        };
    }
    $scope.yAttributeFunction = function(){
        return function(d){
            return d.y;
        };
    }
    $scope.yAxisTickFormatFunction = function(){
        return function(d){
            return d3.format(',d')(d);
        }
    }
    $scope.toolTipContentFunction = function(){
        return function(key, x, y, e, graph) {
            return  '<h3>' + key + '</h3>' +
                '<p>' +  y + ' at day ' + x + '.</p>'
        }
    }
    $scope.xFunctionP = function(){
      return function(d) {
          return d.key;
      };
    }
    $scope.yFunctionP = function(){
      return function(d) {
          return d.y;
      };
    }
    $scope.$watch('settings', function() {
        $scope.generateData();
    }, true);
  }
  