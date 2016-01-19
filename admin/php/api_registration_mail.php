
<?php


	$postdata = file_get_contents("php://input");
    $data = json_decode($postdata, true);


    // Very useful - prints out the contents of data sent via the http request.
    //print_r($data);
 	$action = $data['action'];



	

	//$action="send_confirmation_mail";

	    switch ($action)
			{
				case "send_registration_mail":


						$nw_address = "contact@qatarlaunch.com";
						//$nw_address = "ajjnorton@icloud.com";
						$nw_client_name = $data['name'];
						$nw_subject = "Qatarlaunch - Company Registration";
						$nw_message = "
						<html>
						<head>
						<title>HTML email</title>
						</head>
						<body>
							<p>You have received a Company Registration for invoicing from the Qatarlaunch website, please respond within 24 hours.<br>Message as follows:</p>
							<p>Name: ".$data['name']."</p>
							<p>Gender:".$data['gender']."</p>
							<p>Job Title:".$data['jobTitle']."</p>
							<p>Company:".$data['company']."</p>
							<p>PhoneNumber:".$data['phoneNumber']."</p>
						 	<p>Email: ".$data['email']."</p>
						 	<p>Industry: ".$data['industry']."</p>
						 	<p>Qty of membership passes: ".$data['membQty']."</p>
						 	<p>Qty of conf passes: ".$data['confQty']."</p>
						 	<p>Requirements:".$data['message']."</p>
						</body>
						</html>";
						


						$reply_address = $data['email'];
						$reply_subject = "Qatarlaunch Conference";


						$reply_message = "
						<html>
						<head>
						<title>HTML email</title>
						</head>
						<body>
						<p>Dear ".$data['name'].", </p>
						<p>Thank you for sending us your requirements.</p>
						<p>We will aim to respond to your request within the next 24 hours.</p>
						<br>
						<p>Thanks again</p>
						<p>The Qatarlaunch Team</p>
						<p>www.qatarlaunch.com</p>
						</body>
						</html>
						";

						// Always set content-type when sending HTML email
						$headers = "MIME-Version: 1.0" . "\r\n";
						$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

						// More headers
						$headers .= 'From: <contact@qatarlaunch.com>' . "\r\n";
						//$headers .= 'From: <ajjnorton@icloud.com>' . "\r\n";

						//This is the confirmation email back to the originator
						mail($reply_address,$reply_subject,$reply_message,$headers);

						//This is the email that goes to nurseryworks info
						mail($nw_address,$nw_subject,$nw_message,$headers);

				  break;


				default:
				  //echo "default";
			
			}




?>


