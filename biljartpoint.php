<?php
include('lib/simple_html_dom.php');

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

function includeAfter($bondsNr) {
    if ($bondsNr == "147498") return 1495238400; # Raymond van Garderen, 20-05-2017
    return 0;
}

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
        'd' => 24
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
        if(sizeof($columns) == 14) { // Row containing 12 columns are match details
            list($nr, $date, $kl, $p, $tnr, $tegenstander, $tcar, $car, $brt, $moy, $pnt, $hs, $algmoy, $pmoy) = $columns;
            $match = [
                'datum' => $date,
                'timestamp' => strtotime($date),
                'opponent' => formatOpponent($tegenstander),
                'required' => intval($tcar),
                'amount' => intval($car),
                'turns' => intval($brt),
                'moyenne' => intval($car) / intval($brt),
            ];
            $result[] = $match;
        }
        if(sizeof($columns) == 1 && strpos($columns[0], 'wisseling van spelsoort') !== false) {
            $result = [];
        }
    }
    return $result;
}

function filterMatches($bondsNr, $matches) {
    $includeAfter = includeAfter($bondsNr);
    $matches = array_filter($matches, function($element) use ($includeAfter) {
        return $includeAfter == 0 || intval($element['timestamp']) > $includeAfter;
    });
    return $matches;
}

$string = file_get_contents($argv[1]);
$json = json_decode($string, true);

foreach ($json as $value) {
    $bondsNr = $value["id"];
    list($player, $matches) = fetchPlayerAndMatches($bondsNr, $seasons);
    $decodedMatches = decodeMatches($matches, getLegacyMatches($bondsNr));
    $result = [
        'player' => [
            'id' => $bondsNr,
            'name' => $player,
        ],
        'matches' => filterMatches($bondsNr, array_reverse($decodedMatches)),
    ];
    file_put_contents($argv[2] . $bondsNr . ".json", json_encode($result));
}
