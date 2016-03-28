var moyenneApp = angular.module('moyenneApp', []);

moyenneApp.controller('MainCtrl', function($scope, $http) {
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
        });
    };
});