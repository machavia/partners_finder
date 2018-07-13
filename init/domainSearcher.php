<?php

$organisations = file_get_contents( "http://localhost:3000/organizations" );
$organisations = json_decode( $organisations, true );

foreach( $organisations as $organisation  ) {
	if( !empty( $organisation['site_web']) ) continue;

	try {
		$result = file_get_contents("http://0.0.0.0:3001/website/get_domain/" . rawurlencode( $organisation['name'] ) );
		$result = json_decode($result, true);
	}
	catch( Exception $e) {
		throw new Exception( $e );
	}

	echo $organisation['name'] . " -> " . $result['url'] . "\n";
	if( $result['distance'] > 1 ) {
		echo '-> Distance ' . $result['distance'] . '. Save anyway (y/n)?'. "\n";
		$input = fgets(STDIN);
		$input = trim( $input );
		if( $input != 'y' ) continue;
	}


	$ch = curl_init();
	$headers  = [
		'x-api-key: XXXXXX',
		'Content-Type: application/json; charset=utf-8'
	];
	$postData = [
		'site_web' => $result['url']
	];

	$url = 'http://localhost:3000/organization/' . rawurlencode( $organisation['id'] );
	curl_setopt($ch, CURLOPT_URL,$url );
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result     = curl_exec ($ch);
	$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);


	if( $statusCode == 406 ) throw new Exception('Error on ' . $url);
	echo "-> Saved" . "\n";

}
