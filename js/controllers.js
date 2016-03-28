var moyenneApp = angular.module('moyenneApp', []);

moyenneApp.controller('MainCtrl', function($scope, $http) {
    $scope.progress = 0;
    $scope.matchloader = false;
    $scope.error = false;
    $scope.player = {
        id: '',
        name: 'Selecteer speler'
    };
    $scope.players = {
        142008: 'Gert van Beek',
        147498: 'Raymond van Garderen',
        178938: 'Ricardo Diters',
        164899: 'Martin Vreekamp',
        141933: 'René van Aerle',
        101115: 'Cees Oskam',
        213841: 'Hans Walraven',
        221517: 'Ed Huisman'
    };
    $scope.matchDetails = [];
    $scope.matches = [];
    $scope.setPlayer = function(id) {
        $scope.matches = [],
        $scope.player = {
            id: parseInt(id),
            name: $scope.players[id]
        };
        $scope.fetchPlayer();
    };
    $scope.addPlayer = function(player) {
        $scope.players[player.id] = player.name;
    };
    $scope.fetchPlayer = function(){
        $scope.matchloader = true;
        $http.get("participance.php?id=" + $scope.player.id).then(function(response){
            if(response.data.error) {
                $scope.error = true;
            } else {
                $scope.error = false;
                $scope.addPlayer(response.data.player);
                $scope.matches = response.data.matches;
            }
            $scope.matchloader = false;
            $scope.fetchMatchDetails();
        });
    };

    $scope.updateProgress = function(required, done){
        $scope.progress = Math.round((done/required)*100);
    };
    $scope.fetchMatchDetails = function() {
        $scope.matchDetails = [];
        $scope.progress = 0;
        var required = 12;
        var done = 0;
        $scope.updateProgress(required, done);
        $.each($scope.matches, function(order, data){
            $http.get("carambole4.htm.php?player=" + $scope.player.id + "&id=" + data.gameid).then(function(response) {
                response.data.order = order;
                response.data.included = 'pending';
                response.data.moyenne = response.data.amount / response.data.turns;
                $scope.matchDetails.push(response.data);
                $scope.updateProgress(required, ++done);
                if(done == required) {
                    $scope.markMatchDetails();
                }
            });
            return order<11;
        });
    };
    $scope.markMatchDetails = function() {
        $scope.matchDetails.sort(function(a, b) {
            return a.moyenne - b.moyenne;
        });

        var size = $scope.matchDetails;
        var counter = 0;
        $.each($scope.matchDetails, function(id, data){
            counter++;
            if (counter <= 3 || counter > 9){
                $scope.matchDetails[id].included = false;
            } else {
                $scope.matchDetails[id].included = true;
            }
        });
    }
});