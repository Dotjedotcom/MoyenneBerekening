<?php
include('lib/simple_html_dom.php');

$bondsNr = $_GET['id'];

function includeAfter($bondsNr) {
    if ($bondsNr == "147498") return 1495238400; # Raymond van Garderen, 20-05-2017
    return 0;
}

function fetchPlayerAndMatches($bondsNr, $season) {
    // fetch html
    $url = 'http://biljartpoint.nl/';
    $query = [
        'page' => 'pr',
        'bondsnr' => $bondsNr,
        'klasse' => 'C1',
        'seizoen' => $season,
        'd' => 47,
        'poule' => 'A'
    ];
    $context = array(
      'http'=>array(
        'method'=>"GET",
        'header'=>"Referer: http://biljartpoint.nl/index.php?page=teamdetail&team_id=45965&compid=3946&poule=A&district=47"
      )
    );
    $playerName = null;
    $matches = [];
    $html = file_get_html($url . '?' . http_build_query($query), 0, stream_context_create($context));
    if($index == 0) {
        $playerName = getPlayerName($bondsNr, $season, $html->find('h1')[0]->plaintext);
    }
    $tables = $html->find('table');
    if(strpos($tables[0], 'Er zijn nog geen resultaten bekend voor deze speler dit seizoen.') === false) {
        foreach($tables[3]->find('tr') as $match) {
            array_push($matches, $match);
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
//            list(, $date, , , $opponent, $tCar, $car, $turns) = $columns;
            list($nr, $date, $kl, $poule, $tnr, $tegenstander, $tear, $car, $brt, $moy, $pnt, $hs, $algmoy, $pmoy) = $columns;
            if($poule == "A") {
                $match = [
                    'datum' => $date,
                    'timestamp' => strtotime($date),
                    'opponent' => formatOpponent($tegenstander),
                    'required' => intval($tear),
                    'amount' => intval($car),
                    'turns' => intval($brt),
                    'moyenne' => intval($car) / intval($brt),
                ];
                $result[] = $match;
            }
        }
        if(sizeof($columns) == 1 && strpos($columns[0], 'wisseling van spelsoort') !== false) {
            $result = [];
        }
    }
    return $result;
}

function filterMatches($bondsNr, $poule, $matches) {
    $includeAfter = includeAfter($bondsNr);
    $matches = array_filter($matches, function($element) use ($includeAfter) {
        return $includeAfter == 0 || intval($element['timestamp']) > $includeAfter;
    });
    return $matches;
}

list($player, $matches) = fetchPlayerAndMatches($bondsNr, '2018-2019');
$decodedMatches = decodeMatches($matches);
$result = [
    'player' => [
        'id' => $bondsNr,
        'name' => $player,
    ],
    'matches' => filterMatches($bondsNr, "A", array_reverse($decodedMatches)),
];
echo json_encode($result);
