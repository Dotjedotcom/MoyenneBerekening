<?php
include('lib/simple_html_dom.php');
function getPlainText($td) {
    $string = trim($td->plaintext);
    return $string;
}

$url = 'http://biljartpoint.nl/';
$query = [
    'page' => 'teamdetail',
    'team_id' => 52037,
    'compid' => 4895,
    'poule' => 1,
    'district' => 24
];

$html = file_get_html($url . '?' . http_build_query($query));

$tables = $html->find('table');
$teamTable = $tables[1];

$headers = array_map('getPlainText', $teamTable->find('th'));
$keys = [
    'bondsNr' => array_search('bondsnr', $headers),
    'name' => array_search('speler', $headers),
    'car' => array_search('car', $headers),
];
$players = [];
foreach($teamTable->find('tr') as $rows){
    $columns = array_map('getPlainText', $rows->find('td'));
    if (sizeof($columns) < max($keys)) continue;
    array_push($players, [
        'id' => intval($columns[$keys['bondsNr']]),
        'name' => $columns[$keys['name']],
        'required' => intval($columns[$keys['car']]),
    ]);
}

file_put_contents($argv[1], json_encode($players));
