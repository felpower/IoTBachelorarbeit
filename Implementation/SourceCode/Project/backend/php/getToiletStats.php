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
$sql = "SELECT nWGs.toilet_paper, nWGs.toilet_occupation, nWGs.toilet_timer
      	FROM nWGs
     	WHERE nWGs.wgId = (SELECT wgId FROM nUser WHERE nUser.email = '" . $data["email"] . "' AND nUser.secret = '" . $data["secret"] . "')";

$result = $conn->query($sql);

// Print result
$rows = array();
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo "error";
}

$conn->close();
?>
