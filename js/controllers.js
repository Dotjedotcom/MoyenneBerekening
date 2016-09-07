var moyenneApp = angular.module('moyenneApp', []);

moyenneApp.controller('MainCtrl', function ($scope, $http) {
    $scope.matchloader = false;
    $scope.error = false;
    $scope.predictions = {};
    $scope.player = {
        id: '',
        name: 'Selecteer speler',
        required: 0
    };
    $scope.players = {
        147498: 'Raymond van Garderen',
        178938: 'Ricardo Diters',
        164899: 'Martin Vreekamp',
        103677: 'Fred Driessen',
        141933: 'René van Aerle',
        213841: 'Hans Walraven',
        221517: 'Ed Huisman'
    };
    $scope.calculations = {};
    var onlineMatchDetails = [];
    $scope.matchDetails = [];
    $scope.matches = [];
    $scope.userMatches = [];
    $scope.setPlayer = function (id) {
        $scope.matches = [];
        $scope.player = {
            id: parseInt(id),
            name: $scope.players[id]
        };
        $scope.fetchPlayer();
    };
    $scope.addPlayer = function (player) {
        $scope.players[player.id] = player.name;
    };
    $scope.fetchPlayer = function () {
        $scope.matchloader = true;
        $http.get("biljartpoint.php?id=" + $scope.player.id).then(function (response) {
            if (response.data.error) {
                $scope.error = true;
            } else {
                $scope.error = false;
                $scope.addPlayer({'id': $scope.player.id, 'name': response.data.player});
                $scope.matches = response.data.matches;
            }
            $scope.matchloader = false;
            $scope.calculateMatchDetails();
        });
    };
    $scope.calculateMatchDetails = function () {
        $scope.matchDetails = [];
        onlineMatchDetails = [];
        $scope.calculations.current = {};
        resetPredictions();
        resetUserMatches();
        $.each($scope.matches, function (order, data) {
            data.order = order;
            onlineMatchDetails.push(data);
            if (order == 0) {
                $scope.player.required = data.required;
            }
            return order < 11;
        });
        $scope.calculateCurrent();
    };
    var markMatchDetails = function (matchDetails) {
        matchDetails.sort(function (a, b) {
            if (a.moyenne > b.moyenne) {
                return 1;
            } else if (a.moyenne < b.moyenne) {
                return -1;
            }
            return 0;
        });
        $.each(matchDetails, function (id, data) {
            matchDetails[id].included = true;
        });
        var cutoffAmount = getCutoffAmount(matchDetails.length);
        for(var i=0; i<2; i++) {
            var counter = 0;
            $.each(matchDetails, function (id, data) {
                counter++;
                if(counter <= cutoffAmount) {
                    matchDetails[id].included = false;
                }
            });
            matchDetails.reverse();
        }
        return matchDetails;
    };

    var getCutoffAmount = function (size) {
        if (size >= 11) {
            return 3;
        } else if (size >= 8) {
            return 2;
        } else if (size >= 5) {
            return 1;
        }
        return 0;
    };

    var calculate = function (matches) {
        var result = {
            'amount': 0,
            'turns': 0,
            'moyenne': 0
        };
        $.each(matches, function (id, data) {
            if (data.included) {
                result.amount += data.amount;
                result.turns += data.turns;
            }
        });
        result.moyenne = result.amount / result.turns;
        return result;
    };

    $scope.calculateCurrent = function () {
        $scope.matchDetails = [];
        var tmp_matches = angular.copy(onlineMatchDetails);
        $.each(angular.copy($scope.userMatches), function (id, match) {
            match.required = $scope.player.required;
            tmp_matches = addMatch(tmp_matches, match, true);
        });
        $scope.matchDetails = markMatchDetails(tmp_matches);
        $scope.calculations.current = calculate($scope.matchDetails);
        calculatePredictions();
    };

    var addMatch = function (matches, match, userMatch) {
        matches.sort(function (a, b) {
            if (a.order > b.order) {
                return 1;
            } else if (a.order < b.order) {
                return -1;
            }
            return 0;
        });
        if(matches.length >= 12) {
            matches.pop();
        }
        $.each(matches, function (id) {
            matches[id].order++;
        });
        match.order = 0;
        match.usermatch = userMatch;
        match.moyenne = match.amount / match.turns;
        matches.push(match);
        return matches;
    };
    $scope.setPredictionMatch = function (index, match) {
        $scope.predictions.matches[index] = match;
        calculatePredictions();
    };
    $scope.removePredictionMatch = function (index) {
        $scope.predictions.matches.splice(index, 1);
        calculatePredictions();
    };
    var resetPredictions = function () {
        $scope.predictions = {matches: [], results: []};
        calculatePredictions();
    };
    var resetUserMatches = function () {
        $scope.userMatches = [];
    };
    $scope.addUserMatch = function () {
        $scope.userMatches.push({amount: 1, turns: 1});
        $scope.calculateCurrent();
    };
    $scope.removeUserMatch = function (index) {
        if (index >= 0) {
            $scope.userMatches.splice(index, 1);
        }
        $scope.calculateCurrent();
    };
    var markPredictions = function (matches) {
        $.each(matches, function (index, prediction) {
            var nextMatch = matches[index + 1];
            if (typeof nextMatch != "undefined") {
                if (nextMatch.moyenne != prediction.moyenne) return false;
            }
            matches[index].status = 'low';
        });
        matches.reverse();
        $.each(matches, function (index, prediction) {
            var nextMatch = matches[index + 1];
            if (typeof nextMatch != "undefined") {
                if (nextMatch.moyenne != prediction.moyenne) return false;
            }
            matches[index].status = 'high';
        });
        matches.reverse();
        return matches;
    };
    var calculatePredictions = function () {
        var predictions_amount = 30;
        var required = $scope.player.required;
        $scope.predictions.results = [];
        var tmp_matches = angular.copy($scope.matchDetails);
        for (var match_id = 0; match_id <= $scope.predictions.matches.length; match_id++) {
            $scope.predictions.results[match_id] = [];
            tmp_matches = angular.copy(tmp_matches);
            var predictedMatch = $scope.predictions.matches[match_id - 1];
            if (typeof predictedMatch != "undefined") {
                tmp_matches = addMatch(tmp_matches, predictedMatch);
            }
            for (var i = 0; i < predictions_amount; i++) {
                var matches = angular.copy(tmp_matches);
                var turns = i + 1;
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