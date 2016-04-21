var moyenneApp = angular.module('moyenneApp', []);

moyenneApp.controller('MainCtrl', function($scope, $http) {
    $scope.progress = 0;
    $scope.matchloader = false;
    $scope.error = false;
    $scope.predictions = {};
    $scope.player = {
        id: '',
        name: 'Selecteer speler',
        required: 0
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
    $scope.calculations = {};
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
                $scope.matches.sort(function(a, b) {
                    if (a.timestamp < b.timestamp) {
                        return 1;
                    } else if(a.timestamp > b.timestamp) {
                        return -1;
                    } else {
                        if (a.nummer < b.nummer) {
                            return -1;
                        } else if(a.nummer > b.nummer) {
                            return 1;
                        }
                        return 0;
                    }
                });
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
        $scope.calculations.current = {};
        var required = 12;
        var done = 0;
        $scope.updateProgress(required, done);
        resetPredictions();
        $.each($scope.matches, function(order, data){
            $http.get("carambole4.htm.php?player=" + $scope.player.id + "&id=" + data.gameid).then(function(response) {
                response.data.order = order;
                response.data.included = 'pending';
                response.data.moyenne = response.data.amount / response.data.turns;
                $scope.matchDetails.push(response.data);
                $scope.updateProgress(required, ++done);
                if(order == 1) {
                    $scope.player.required = response.data.required;
                }
                if(done == required) {
                    $scope.matchDetails = markMatchDetails($scope.matchDetails);
                    calculateCurrent();
                    calculatePredictions();
                }
            });
            return order<11;
        });
    };
    var markMatchDetails = function(matchDetails) {
        matchDetails.sort(function(a, b) {
            if (a.moyenne > b.moyenne) {
                return 1;
            } else if (a.moyenne < b.moyenne) {
                return -1;
            }
            return 0;
        });
        var counter = 0;
        $.each(matchDetails, function(id, data){
            counter++;
            matchDetails[id].included = !(counter <= 3 || counter > 9);
        });
        return matchDetails;
    };

    var calculate = function(matches) {
        var result = {
            'amount': 0,
            'turns': 0,
            'moyenne': 0
        };
        $.each(matches, function(id, data){
            if(data.included) {
                result.amount += data.amount;
                result.turns += data.turns;
            }
        });
        result.moyenne = result.amount / result.turns;
        return result;
    };

    var calculateCurrent = function() {
        $scope.calculations.current = calculate($scope.matchDetails);
    };

    var addMatch = function(matches, match) {
        matches.sort(function(a,b){
            if(a.order > b.order) {
                return 1;
            } else if(a.order < b.order) {
                return -1;
            }
            return 0;
        });
        matches.pop();
        $.each(matches, function(id, match) {
            matches[id].order++;
        });
        match.order = 0;
        match.moyenne = match.amount / match.turns;
        matches.push(match);
        return matches;
    };
    $scope.setPredictionMatch = function (index, match) {
        $scope.predictions.matches[index] = match;
        calculatePredictions();
    };
    $scope.removePredictionMatch = function(index) {
        $scope.predictions.matches.splice(index, 1);
        calculatePredictions();
    };
    var resetPredictions = function() {
        $scope.predictions = {matches:[], results: []};
        calculatePredictions();
    };
    var markPredictions = function(matches) {
        $.each(matches, function(index, prediction) {
            var nextMatch = matches[index+1];
            if(typeof nextMatch != "undefined") {
                if(nextMatch.moyenne != prediction.moyenne) return false;
            }
            matches[index].status = 'low';
        });
        matches.reverse();
        $.each(matches, function(index, prediction) {
            var nextMatch = matches[index+1];
            if(typeof nextMatch != "undefined") {
                if (nextMatch.moyenne != prediction.moyenne) return false;
            }
            matches[index].status = 'high';
        });
        matches.reverse();
        return matches;
    };
    var calculatePredictions = function() {
        var predictions_amount = 30;
        var required = $scope.player.required;
        $scope.predictions.results = [];
        var tmp_matches = angular.copy($scope.matchDetails);
        for(var match_id = 0; match_id <= $scope.predictions.matches.length; match_id++) {
            $scope.predictions.results[match_id] = [];
            tmp_matches = angular.copy(tmp_matches);
            var predictedMatch = $scope.predictions.matches[match_id-1];
            if(typeof predictedMatch != "undefined") {
                console.log('adding match');
                tmp_matches = addMatch(tmp_matches, predictedMatch);
            }
            for(var i=0; i<predictions_amount; i++){
                var matches = angular.copy(tmp_matches);
                var turns = i+1;
                var match = {'required': required, 'amount': required, 'turns': turns};
                matches = addMatch(matches, match);
                matches = markMatchDetails(matches);
                var moyenne = calculate(matches).moyenne;
                $scope.predictions.results[match_id][i] = {
                    'required': required,
                    'turns': turns,
                    'moyenne': moyenne,
                    'status': 'mid'
                };
            }
            $scope.predictions.results[match_id] = markPredictions($scope.predictions.results[match_id]);
        }
    }
});