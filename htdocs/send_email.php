<?php
$data = json_decode(file_get_contents("php://input"), true);
$message = $data["message"] ?? "";

if (!empty($message)) {
  $to = "allstudents@vit.edu";
  $subject = "New Club Success Story!";
  $headers = "From: clubs@vit.edu";

  mail($to, $subject, $message, $headers);
  echo json_encode(["status" => "sent"]);
} else {
  echo json_encode(["status" => "empty"]);
}
?>
