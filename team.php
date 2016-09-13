<?php
include('lib/simple_html_dom.php');
function getPlainText($td) {
    $string = trim($td->plaintext);
    return $string;
}

$url = 'http://biljartpoint.nl/';
$query = [
    'page' => 'teamdetail',
    'team_id' => 32305,
    'compid' => 2640,
    'poule' => 3,
    'district' => 24
];

$html = file_get_html($url . '?' . http_build_query($query));

$tables = $html->find('table');
$teamTable = $tables[1];

$players = [];
foreach($teamTable->find('tr') as $rows){
    $columns = array_map('getPlainText', $rows->find('td'));
    if(sizeof($columns) == 17) {
        list($bondsNr, $name, , , , , , , , $car) = $columns;
        $players[intval($bondsNr)] = [
            'id' => intval($bondsNr),
            'name' => $name,
            'required' => intval($car),
        ];
    }
}

echo json_encode($players);