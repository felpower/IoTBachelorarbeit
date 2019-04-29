<?php
$servername = "localhost";
$username = "felpower";
$password = "pedi7536";
$dbname = "ada_scc";

// Header setup
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//echo "Connected successfully";

// Read params - $_POST["name"]
$data = json_decode(file_get_contents('php://input'), true);
//echo $data["email"];

// SQL statement
$sql = "SELECT nUser.pushId
      	FROM nWGs
	INNER JOIN nUser ON nUser.wgId = nWGs.wgId
     	WHERE nWGs.wgId = (SELECT wgId FROM nUser WHERE nUser.email = '" . $data["email"] . "' AND nUser.secret = '" . $data["secret"] . "')";

$result = $conn->query($sql);

// Print result
$registrationIds = array();
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $registrationIds[] = $row;
    }
    echo json_encode($rows);
} else {
    echo "error";
}
$conn->close();

// Push ##########################################################################
// API access key from Google API's Console
define( 'API_ACCESS_KEY', 'AIzaSyDZs_h5KsPWBz7TT4oVIrSdNYChYkBHOAk' );
// sender ID: 431373013681

// prep the bundle
$msg = array
(
'message'=> 'here is a message. message',
'title'=> 'This is a title. title',
'subtitle'=> 'This is a subtitle. subtitle',
'tickerText'=> 'Ticker text here...Ticker text here...Ticker text here',
'vibrate'=>1,
'sound'=>1,
'largeIcon'=>'large_icon',
'smallIcon'=>'small_icon'
);

$fields = array
('registration_ids'=>$registrationIds,
'data'=>$msg
);

$headers = array
('Authorization: key=' . API_ACCESS_KEY,
'Content-Type: application/json'
);

$ch = curl_init();
curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
curl_setopt( $ch,CURLOPT_POST, true );
curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );

$result = curl_exec($ch );
curl_close( $ch );
echo $result;

?>
