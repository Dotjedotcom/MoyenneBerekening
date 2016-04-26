<?php
include('lib/simple_html_dom.php');
$id = intval($_GET['id']);
$pid = intval($_GET['player']);
// Parse HTML
$url = 'http://competitie.knbb.nl/carambole4.htm.php?GameID=' . $id;
$html = file_get_html($url);
$players = $html->find('tr.player');


$map = array('id', 'name', 'required', 'amount', 'turns', 'moyenne', 'hs', 'points');
$results = array();
foreach ($players as $player) {
    $match = array();
    foreach ($player->find('td') as $key => $column) {
        $match[$map[$key]] = intval($column->plaintext);
    }
    $results[intval($match['id'])] = $match;
}
echo json_encode(array(
    'required' => $results[$pid]['required'],
    'amount' => $results[$pid]['amount'],
    'turns' => $results[$pid]['turns']
));