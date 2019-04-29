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

// Read params - echo $data["email"];
$data = json_decode(file_get_contents('php://input'), true);

// SQL statement
$userSql = "SELECT userId, wgId FROM nUser WHERE email = '" . $data["email"] . "' AND secret = '" . $data["secret"] . "'";
$userResult = $conn->query($userSql);

if ($userResult->num_rows > 0) {
    // output data of each row
    while($row = $userResult->fetch_assoc()) {
    	$userId = $row["userId"];
    	$wgId= $row["wgId"];
    }
} else {
    echo 'invalid credentials';
}

$sql = "INSERT INTO nShower (userId, wgId, date, duration)
      	VALUES ('" . $userId . "', '" . $wgId . "', '" . date('Y-m-d', getdate()[0]) . "', " . $data["duration"] . ")";

$result = $conn->query($sql);

// Print result
if ($result) {
	echo 'no error occurred';
} else {
	echo 'error';
}

$conn->close();
?>
