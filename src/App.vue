<template>
    <div>
        <nav class="navbar navbar-inverse">
            <div class="container-fluid navbar-brand">
                <p>MoyenneBerekening</p>
            </div>
        </nav>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <form class="form-inline">
                                <div class="form-group-inline">
                                    <!--                                        ng-class="{'has-error': error}"-->
                                    <label for="bondsnummer">Bondsnummer: </label>
                                    <input type="number" class="form-control" id="bondsnummer"
                                           placeholder="123456">
                                    <!--                                        ng-model="selectedPlayer" -->
                                    <button type="submit" class="form-control btn btn-primary">Go!</button>
                                </div>
                                <!--                                    ng-click="fetchPlayer()"-->
                            </form>
                            <hr/>
                            <span v-for="data in teams" :key="data.id">
                                    <button type="button" class="btn btn-default"
                                            @click="setPlayer(data)"
                                            v-bind:class="{ 'btn-primary': data.id === fetchedPlayer }">{{ data.name }}</button>
                                </span>
                        </div>
                    </div>
                </div>
            </div>
            <!--                <div class="row">-->
            <!--                    <div class="col-md-12 text-center" ng-show="matchloader">-->
            <!--    &lt;!&ndash;                    <img src="../src/assets/loading.gif"/>&ndash;&gt;-->
            <!--                    </div>-->
            <!--                    <div class="col-md-12 text-center" ng-show="!matches.length && !matchloader && player.id">-->
            <!--                        <div class="alert alert-danger" role="alert">Minimaal 1 wedstrijd nodig om berekeningen en-->
            <!--                            voorspellingen te kunnen doen, begin eerst maar eens te biljarten voordat je gaat drukken.-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                    <div class="col-md-12 text-center" ng-show="!matches.length && !matchloader && !player.id">-->
            <!--                        <div class="alert alert-info" role="alert">Selecteer een speler</div>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--                <div class="row">-->
            <!--                    <div class="col-md-12" ng-show="matches.length">-->
            <!--                        <div>-->
            <!--                            <ul class="nav nav-tabs" role="tablist">-->
            <!--                                <li role="presentation" class="active"><a href="#matches" aria-controls="matches" role="tab"-->
            <!--                                                                          data-toggle="tab">Wedstrijden</a></li>-->
            <!--                                <li role="presentation" ng-show="matches.length"><a href="#calculation"-->
            <!--                                                                                    aria-controls="calculation" role="tab"-->
            <!--                                                                                    data-toggle="tab">Berekening</a></li>-->
            <!--                                <li role="presentation" ng-show="matches.length && player.required"><a href="#prediction"-->
            <!--                                                                                                       aria-controls="prediction"-->
            <!--                                                                                                       role="tab"-->
            <!--                                                                                                       data-toggle="tab">Voorspelling</a>-->
            <!--                                </li>-->
            <!--                            </ul>-->
            <!--                            <div class="tab-content">-->
            <!--                                <div role="tabpanel" class="tab-pane active" id="matches">-->
            <!--                                    <div class="table-responsive">-->
            <!--                                        <table class="table table-condensed table-striped">-->
            <!--                                            <tr>-->
            <!--                                                <th>#</th>-->
            <!--                                                <th>Datum</th>-->
            <!--                                                <th>Tegenstander</th>-->
            <!--                                                <th class="text-right">Tcar</th>-->
            <!--                                                <th class="text-right">car</th>-->
            <!--                                                <th class="text-right">brt</th>-->
            <!--                                                <th class="text-right">moy</th>-->
            <!--                                            </tr>-->
            <!--                                            <tr ng-repeat="(index, match) in matches"-->
            <!--                                                ng-class="{'info': index < 12, 'text-muted': index >= 12}">-->
            <!--                                                <th>{{ index + 1 }}</th>-->
            <!--                                                <td>{{ match.datum }}</td>-->
            <!--                                                <td>{{ match.opponent }}</td>-->
            <!--                                                <td class="text-right">{{ match.required }}</td>-->
            <!--                                                <td class="text-right">{{ match.amount }}</td>-->
            <!--                                                <td class="text-right">{{ match.turns }}</td>-->
            <!--                                                <td class="text-right">{{ match.moyenne|number:2 }}</td>-->
            <!--                                            </tr>-->
            <!--                                        </table>-->
            <!--                                    </div>-->
            <!--                                </div>-->
            <!--                                <div role="tabpanel" class="tab-pane" id="calculation">-->
            <!--                                    <div class="panel panel-default" ng-show="calculations.current.amount">-->
            <!--                                        <div class="panel-heading">Huidig</div>-->
            <!--                                        <div class="panel-body">-->
            <!--                                            <div class="row">-->
            <!--                                                <div class="col-xs-3"><label>Gemaakt:</label> {{-->
            <!--                                                    calculations.current['amount'] }}-->
            <!--                                                </div>-->
            <!--                                                <div class="col-xs-3"><label>Beurten:</label> {{-->
            <!--                                                    calculations.current['turns'] }}-->
            <!--                                                </div>-->
            <!--                                                <div class="col-xs-3"><label>Moyenne:</label> {{-->
            <!--                                                    calculations.current['moyenne']|number:2 }}-->
            <!--                                                </div>-->
            <!--                                            </div>-->
            <!--                                        </div>-->
            <!--                                    </div>-->
            <!--                                    <div class="table-responsive">-->
            <!--                                        <table class="table table-condensed">-->
            <!--                                            <tr>-->
            <!--                                                <th>#</th>-->
            <!--                                                <th>Te maken</th>-->
            <!--                                                <th>Gemaakt</th>-->
            <!--                                                <th>Beurten</th>-->
            <!--                                                <th class="text-right">Moyenne</th>-->
            <!--                                            </tr>-->
            <!--                                            <tr ng-repeat="match in matchDetails"-->
            <!--                                                ng-class="{'text-danger': match.usermatch, 'text-muted': !match.included && !match.usermatch, 'danger': !match.included, 'success': match.included, 'warning': match.included == 'pending'}">-->
            <!--                                                <th>{{ match.order + 1 }}</th>-->
            <!--                                                <td>{{ match.required }}</td>-->
            <!--                                                <td>{{ match.amount }}</td>-->
            <!--                                                <td>{{ match.turns }}</td>-->
            <!--                                                <td class="text-right"><span ng-show="match.usermatch"-->
            <!--                                                                             class="glyphicon glyphicon-pencil"></span>-->
            <!--                                                    <span ng-show="match.order == 11"-->
            <!--                                                          class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>-->
            <!--                                                    {{ match.moyenne|number:2 }}-->
            <!--                                                </td>-->
            <!--                                            </tr>-->
            <!--                                        </table>-->
            <!--                                    </div>-->

            <!--                                    <div class="table-responsive">-->
            <!--                                        <table class="table table-condensed" ng-show="userMatches.length">-->
            <!--                                            <tr>-->
            <!--                                                <th>#</th>-->
            <!--                                                <th>Gemaakt</th>-->
            <!--                                                <th>Beurten</th>-->
            <!--                                                <th></th>-->
            <!--                                            </tr>-->
            <!--                                            <tr ng-repeat="match in userMatches track by $index">-->
            <!--                                                <td>{{ $index + 1 }}</td>-->
            <!--                                                <td><input type="number" class="form-control input-sm"-->
            <!--                                                           ng-model="userMatches[$index].amount"-->
            <!--                                                           ng-change="calculateCurrent()"/></td>-->
            <!--                                                <td><input type="number" class="form-control input-sm"-->
            <!--                                                           ng-model="userMatches[$index].turns"-->
            <!--                                                           ng-change="calculateCurrent()"/></td>-->
            <!--                                                <td>-->
            <!--                                                    <button type="button" class="btn btn-default btn-sm"-->
            <!--                                                            ng-click="removeUserMatch($index)"><span-->
            <!--                                                            class="glyphicon glyphicon-remove"></span></button>-->
            <!--                                                </td>-->
            <!--                                            </tr>-->
            <!--                                        </table>-->
            <!--                                    </div>-->
            <!--                                    <div class="panel panel-default">-->
            <!--                                        <div class="panel-body">-->
            <!--                                            <form class="form-inline">-->
            <!--                                                <button type="button" class="btn btn-primary btn-sm"-->
            <!--                                                        ng-click="addUserMatch()">Wedstrijd handmatig toevoegen-->
            <!--                                                </button>-->
            <!--                                            </form>-->
            <!--                                        </div>-->
            <!--                                    </div>-->
            <!--                                </div>-->
            <!--                                <div role="tabpanel" class="tab-pane" id="prediction" ng-show="player.required">-->
            <!--                                    <div class="table-responsive" ng-show="calculations.current.amount">-->
            <!--                                        <table class="table table-condensed table-striped">-->
            <!--                                            <tr>-->
            <!--                                                <th>Voorwaarde</th>-->
            <!--                                                <th ng-repeat="match in predictions.matches">{{ $index+1 }}e partij</th>-->
            <!--                                                <th>{{ predictions.matches.length+1 }}e partij</th>-->
            <!--                                            </tr>-->
            <!--                                            <tr ng-repeat="turn in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]">-->
            <!--                                                <td>{{ player.required }} in {{ turn+1 }}</td>-->
            <!--                                                <td ng-repeat="match in predictions.matches"-->
            <!--                                                    ng-class="{'text-muted': predictions.results[$index][turn].status == 'low' || predictions.results[$index][turn].status == 'high', 'info': predictions.results[$index][turn].status == 'mid'}">-->
            <!--                                                    {{ predictions.results[$index][turn].moyenne|number:2 }}-->
            <!--                                                    <button type="submit"-->
            <!--                                                            ng-class="{'btn-primary': predictions.matches[$index].turns == turn+1}"-->
            <!--                                                            class="btn btn-default btn-xs"-->
            <!--                                                            ng-click="setPredictionMatch($index, {required: player.required, amount: player.required, turns: turn+1})">-->
            <!--                                                        <span class="glyphicon glyphicon-arrow-right"></span></button>-->
            <!--                                                </td>-->
            <!--                                                <td ng-class="{'text-muted': predictions.results[predictions.matches.length][turn].status == 'low' || predictions.results[predictions.matches.length][turn].status == 'high', 'info': predictions.results[predictions.matches.length][turn].status == 'mid'}">-->
            <!--                                                    {{-->
            <!--                                                    predictions.results[predictions.matches.length][turn].moyenne|number:2-->
            <!--                                                    }}-->
            <!--                                                    <span ng-show="predictions.matches.length < 11"><button type="submit"-->
            <!--                                                                                                            class="btn btn-default btn-xs"-->
            <!--                                                                                                            ng-show="predictions.matches.length < 11"-->
            <!--                                                                                                            ng-click="setPredictionMatch(predictions.matches.length, {required: player.required, amount: player.required, turns: turn+1})"><span-->
            <!--                                                            class="glyphicon glyphicon-arrow-right"></span></button></span>-->
            <!--                                                </td>-->
            <!--                                            </tr>-->
            <!--                                        </table>-->
            <!--                                    </div>-->
            <!--                                </div>-->
            <!--                            </div>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                </div>-->
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import teamJSON from './assets/data/team.json'
    import playerJSON from './assets/data/players.json'

    export default {
        name: 'App',
        data: () => ({
            teams: teamJSON,
            playersData: playerJSON,

            fetchedPlayer: {},
            error: false,
            predictions: {},
            selectedPlayer: false,
            player: {
                id: '',
                name: '',
                required: 0
            },
            calculations: {},
            // ??
            onlineMatchDetails: [],
            matchDetails: [],
            matches: [],
            userMatches: [],
        }),
        beforeCreate: function () {
            // console.log(teams)
        },
        methods: {
            setPlayer(playerData) {
                console.log('playerData', playerData, this.fetchedPlayer);
                this.matches = [];
                this.player = playerData;
                this.selectedPlayer = playerData.id;
                this.fetchPlayer();
            },
            fetchPlayer() {
                let player = {'id': this.player.id, 'name': this.player.name, 'required': false};
                this.addPlayer(player);
                this.fetchedPlayer = player.id;
                this.matches = this.playersData[player.id].matches;

                this.matchloader = false;
                this.calculateMatchDetails();
            },
            addPlayer(playerData) {
                console.log(_.upperCase('blaaap'));
                if (this.playersData[playerData.id] === undefined) {
                    this.playersData[playerData.id] = playerData;
                }
            },
            calculateMatchDetails() {
                this.matchDetails = [];
                this.onlineMatchDetails = [];
                this.calculations.current = {};
                this.resetPredictions();
                this.resetUserMatches();
                this.matches.forEach((order, data) => {
                    console.log('calculateMatchDetails', order, data);
                    // data.order = order;
                    this.onlineMatchDetails.push(data);
                    return order < 11;
                });
                this.calculateCurrent();
            },
            markMatchDetails(matchDetails) {
                matchDetails.sort((a, b) => {
                    if (a.moyenne > b.moyenne) {
                        return 1;
                    } else if (a.moyenne < b.moyenne) {
                        return -1;
                    }
                    return 0;
                });
                matchDetails.forEach((data, id) => {
                    console.log('markMatchDetails', id, data, matchDetails[id]);

                    // matchDetails[id].included = true;
                });
                console.log('markMatchDetails', matchDetails);
                const cutoffAmount = this.getCutoffAmount(matchDetails.length);
                for (let i = 0; i < 2; i++) {
                    let counter = 0;
                    matchDetails.forEach((data, id) => {
                        console.log(id, data);
                        counter++;
                        if (counter <= cutoffAmount) {
                            matchDetails[id].included = false;
                        }
                    });
                    matchDetails.reverse();
                }
                return matchDetails;
            },

            getCutoffAmount(size) {
                console.log('size', size);
                if (size >= 11) {
                    return 3;
                } else if (size >= 8) {
                    return 2;
                } else if (size >= 5) {
                    return 1;
                }
                return 0;
            },

            calculate(matches) {
                const result = {
                    'amount': 0,
                    'turns': 0,
                    'moyenne': 0
                };
                matches.forEach((id, data) => {
                    if (data.included) {
                        result.amount += data.amount;
                        result.turns += data.turns;
                    }
                });
                result.moyenne = Math.floor((result.amount / result.turns * 100)) / 100;
                return result;
            },

            calculateCurrent() {
                this.matchDetails = [];
                let tmp_matches = _.cloneDeep(this.onlineMatchDetails);
                _.cloneDeep(this.userMatches).forEach((id, match) => {
                    match.required = this.player.required;
                    tmp_matches = this.addMatch(tmp_matches, match, true);
                });
                this.matchDetails = this.markMatchDetails(tmp_matches);
                this.calculations.current = this.calculate(this.matchDetails);
                this.calculatePredictions();
            },

            addMatch(matches, match, userMatch) {
                matches.sort(function (a, b) {
                    if (a.order > b.order) {
                        return 1;
                    } else if (a.order < b.order) {
                        return -1;
                    }
                    return 0;
                });
                if (matches.length >= 12) {
                    matches.pop();
                }
                matches.forEach((id) => {
                    matches[id].order++;
                });
                match.order = 0;
                match.usermatch = userMatch;
                match.moyenne = match.amount / match.turns;
                matches.push(match);
                return matches;
            },

            setPredictionMatch(index, match) {
                this.predictions.matches[index] = match;
                this.calculatePredictions();
            },

            removePredictionMatch(index) {
                this.predictions.matches.splice(index, 1);
                this.calculatePredictions();
            },

            resetPredictions() {
                this.predictions = {matches: [], results: []};
                this.calculatePredictions();
            },

            resetUserMatches() {
                this.userMatches = [];
            },

            addUserMatch() {
                this.userMatches.push({amount: 1, turns: 1});
                this.calculateCurrent();
            },

            removeUserMatch(index) {
                if (index >= 0) {
                    this.userMatches.splice(index, 1);
                }
                this.calculateCurrent();
            },

            markPredictions(matches) {
                matches.forEach((prediction, index) => {
                    const nextMatch = matches[index + 1];
                    if (typeof nextMatch != "undefined") {
                        if (nextMatch.moyenne !== prediction.moyenne) return false;
                    }
                    matches[index].status = 'low';
                });
                matches.reverse();
                matches.forEach((prediction, index) => {
                    const nextMatch = matches[index + 1];
                    if (typeof nextMatch != "undefined") {
                        if (nextMatch.moyenne != prediction.moyenne) return false;
                    }
                    matches[index].status = 'high';
                });
                matches.reverse();
                return matches;
            },

            calculatePredictions() {
                let predictions_amount = 30;
                let required = this.player.required;
                this.predictions.results = [];
                let tmp_matches = _.cloneDeep(this.matchDetails);
                for (let match_id = 0; match_id <= this.predictions.matches.length; match_id++) {
                    this.predictions.results[match_id] = [];
                    tmp_matches = _.cloneDeep(tmp_matches);
                    let predictedMatch = this.predictions.matches[match_id - 1];
                    if (typeof predictedMatch != "undefined") {
                        tmp_matches = this.addMatch(tmp_matches, predictedMatch);
                    }
                    for (let i = 0; i < predictions_amount; i++) {
                        let matches = _.cloneDeep(tmp_matches);
                        let turns = i + 1;
                        let match = {'required': required, 'amount': required, 'turns': turns};
                        matches = this.addMatch(matches, match);
                        matches = this.markMatchDetails(matches);
                        let moyenne = this.calculate(matches).moyenne;
                        this.predictions.results[match_id][i] = {
                            'required': required,
                            'turns': turns,
                            'moyenne': moyenne,
                            'status': 'mid'
                        };
                    }
                    this.predictions.results[match_id] = this.markPredictions(this.predictions.results[match_id]);
                }
            }
        }
    }
</script>
