<?php
include('lib/simple_html_dom.php');

function strposa($haystack, $needle, $offset=0) {
    if(!is_array($needle)) $needle = array($needle);
    foreach($needle as $query) {
        if(strpos($haystack, $query, $offset) !== false) return true; // stop on first true result
    }
    return false;
}

$id = intval($_GET['id']);

$results = array(
    'player' => array(
        'id' => intval($id),
    ),
    'matches' => array()
);

// Parse HTML
$url = 'http://competitie.knbb.nl/participance.php?ID=' . $id;
$html = file_get_html($url);

// Find the name
$namespan = $html->find('h3');
foreach($namespan as $span) {
    $span = $span->plaintext;
    if (strpos($span, 'Overzicht van wedstrijden waaraan een speler heeft deelgenomen') !== false ||
        strpos($span, 'Overzicht van wedstrijden waaraan   heeft deelgenomen') !== false) {
        echo json_encode(array('error'=>'Ongeldig bondsnummer'));
        exit;
    }
    $name = str_replace('Overzicht van wedstrijden waaraan', '', $span);
    $name = str_replace('heeft deelgenomen', '', $name);
    $name = trim($name);
    $results['player']['name'] = $name;
}

// Find the matches
$matchesTable = $html->find('table')[1];
$map = array('district', 'poule', 'nummer', 'datum', 'wedstrijdnummer', 'moyenne');
$matches = array('poule', 'beker');
foreach($matchesTable->children as $row) {
    $match = array();
    foreach($row->children as $key => $cell) {
        $match[$map[$key]] = $cell->plaintext;
    }
    foreach($row->find('a') as $link) {
        $match['gameid'] = str_replace('carambole4.htm.php?GameID=', '', $link->href);
    }
    if (strposa(strtolower($match['poule']), $matches)) $results['matches'][] = $match;
}
array_shift($results['matches']);
echo json_encode($results);