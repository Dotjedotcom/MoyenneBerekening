<?php
include('lib/simple_html_dom.php');

$bondsNr = $_GET['id'];

$seasons = [
    '2013-2014',
    '2014-2015',
    '2015-2016',
    '2016-2017',
    '2017-2018',
    '2018-2019',
    '2019-2020',
    '2020-2021',
];

function getLegacyMatches($bondsNr) {
    $matches = [];
    if($bondsNr == "103677") { # Fred Driessen, 2014/1015
        array_push($matches, ['datum' => '2014-10-10', 'opponent' => 'Harold Megens (Touché)', 'required' => 110, 'amount' => 110, 'turns' => 6, 'moyenne' => 110/6]);
        array_push($matches, ['datum' => '2014-10-10', 'opponent' => 'Harold Megens (Touché)', 'required' => 110, 'amount' => 110, 'turns' => 9, 'moyenne' => 110/9]);
        array_push($matches, ['datum' => '2014-12-04', 'opponent' => 'Marten Neuteboom (Gelre 1)', 'required' => 110, 'amount' => 110, 'turns' => 5, 'moyenne' => 110/5]);
        array_push($matches, ['datum' => '2014-12-04', 'opponent' => 'Marten Neuteboom (Gelre 1)', 'required' => 110, 'amount' => 110, 'turns' => 7, 'moyenne' => 110/7]);
    }
    return $matches;
}

function fetchPlayerAndMatches($bondsNr, $seasons) {
    // fetch html
    $url = 'http://biljartpoint.nl/';
    $query = [
        'page' => 'pr',
        'bondsnr' => $bondsNr,
        'klasse' => 'K',
        'seizoen' => '',
        'd' => 47
    ];

    $playerName = null;
    $matches = [];
    foreach($seasons as $index => $season) {
        $query['seizoen'] = $season;
        $html = file_get_html($url . '?' . http_build_query($query));
        if($index == 0) {
            $playerName = getPlayerName($bondsNr, $season, $html->find('h1')[0]->plaintext);
        }
        $tables = $html->find('table');
        if(strpos($tables[0], 'Er zijn nog geen resultaten bekend voor deze speler dit seizoen.') === false) {
            foreach($tables[3]->find('tr') as $match) {
                array_push($matches, $match);
            }
        }
    }
    return [$playerName, $matches];
}

function getPlainText($td) {
    $string = trim($td->plaintext);
    return $string;
}

function formatOpponent($string) {
    $string = str_replace('  ', ' ', $string);
    $string = preg_replace('~[\r\n\t]+~', ' ', $string);
    $string = str_replace('   ', ' (', $string . ')');
    return $string;
}

function getPlayerName($bondsNr, $seizoen, $title) {
    $title = str_replace('Resultaten ' . $bondsNr, '', $title);
    $title = str_replace(' - seizoen ' . $seizoen, '', $title);
    return trim($title);
}

function decodeMatches($matches, $result = []) {
    foreach($matches as $match) {
        $columns = array_map('getPlainText', $match->find('td'));
        if(sizeof($columns) == 12) { // Row containing 12 columns are match details
            list(, $date, , $opponent, $tCar, $car, $turns) = $columns;
            $match = [
                'datum' => $date,
                'opponent' => formatOpponent($opponent),
                'required' => intval($tCar),
                'amount' => intval($car),
                'turns' => intval($turns),
                'moyenne' => intval($car) / intval($turns),
            ];
            $result[] = $match;
        }
        if(sizeof($columns) == 1 && strpos($columns[0], 'wisseling van spelsoort') !== false) {
            $result = [];
        }
    }
    return $result;
}

list($player, $matches) = fetchPlayerAndMatches($bondsNr, $seasons);
$decodedMatches = decodeMatches($matches, getLegacyMatches($bondsNr));
$result = [
    'player' => [
        'id' => $bondsNr,
        'name' => $player,
    ],
    'matches' => array_reverse($decodedMatches),
];
echo json_encode($result);