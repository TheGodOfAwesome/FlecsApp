<?php

function getRecordByAPIKeyPostgres($varAPIKey = NULL, $db) {

	// job category is required
	if (!isset($varAPIKey) || $varAPIKey === '') {
		$responseArray = App_Response::getResponse('403');
		return $responseArray;
	}

	$query = "SELECT * FROM app_api_key WHERE (api_key = '" . $varAPIKey . "') AND (status_flag = 1);";
	$result = pg_query($db, $query);
	$api_key_entry = pg_fetch_all($result);
	$res = $api_key_entry[0];
	
	// if nothing comes back, then return a failure
	if ($res['response'] !== '200') {
		$responseArray = App_Response::getResponse('403');
	} else {
		$responseArray = $res;
	}

	// send back what we got
	return $responseArray;
}

function create_new_user(
    $username, $password_hash, $db
) {
	//Check to see if the user is in the Database. If not add them to the db. 
	// $email_query = "SELECT user_id FROM users WHERE email= '" . $email . "'";
	// $email_result = pg_query($db, $email_query);

	//Check to see if the user wallet is in the Database. If not add them to the db. 
	// $wallet_query = "SELECT user_id FROM users WHERE email= '" . $email . "'";
	// $wallet_result = pg_query($db, $wallet_query);

	//Check to see if the user name is in the Database. If not add them to the db. 
    $username_query = "SELECT user_id FROM users WHERE username= '" . $username . "'";
	$username_result = pg_query($db, $username_query);

	$response = "";

	// if (pg_num_rows($email_result) > 0) {
	// 	$name = pg_fetch_result($email_result, 0, 0);
	// 	$response = "The email address " . $email . " has already been registered!";
	// } else if (pg_num_rows($username_result) > 0) {

	if (pg_num_rows($username_result) > 0) {
		$name = pg_fetch_result($username_result, 0, 0);
		$response = "The user name " . $username . " has already been taken!";
	} else {
		$sign_up_timestamp = date('Y-m-d H:i:s', time());
		$user_id = generateId();
		$user_api_key = generateId();
		$new_empty_list = "[]";
		$start_amt = 0;

		$query = "INSERT INTO users
		(id, user_id, user_api_key, username, password, balance, asset_value, assets, settings, transactions, updated_at, last_login, sign_up_timestamp, last_activity_timestamp)
		VALUES
		(DEFAULT, '" . $user_id . "','" . $user_api_key . "','" . $username . "','" . $password_hash . "', " . $start_amt . ", " . $start_amt . ", '" . $new_empty_list . "', '" . $new_empty_list . "', '" 
		. $new_empty_list . "', '" . $sign_up_timestamp . "', '" . $sign_up_timestamp . "', '" . $sign_up_timestamp . "', '" . $sign_up_timestamp . "')";
		$result = pg_query($db, $query);
		$response = "User Created!"; 
	}
	return $response;
}

function get_user($username, $db) {
	//Check to see if the user is in the Database. If so retrieve No. of failed allempts. If not add them to it the db and retrive No. of failed attempts 
	$query = "SELECT * FROM users WHERE username = '" . $username . "';";
	$result = pg_query($db, $query);
	$user = pg_fetch_all($result);
	return $user;
}

function get_user_on_signin($username_or_email, $password, $db) {
	$user = NULL;
	$password_hash = password_hash($password, PASSWORD_BCRYPT);
	$query1 = "SELECT * FROM users WHERE username = '" . $username_or_email . "' AND password = '" . $password_hash . "';";
	$result1 = pg_query($db, $query1);
	
	if (pg_num_rows($result1) > 0) {
		$valid_login = true;
		$user = pg_fetch_row($result1);
	} else {
		$query2 = "SELECT * FROM users WHERE email = '" . $username_or_email . "' AND password = '" . $password_hash . "';";
		$result2 = pg_query($db, $query2);
		if (pg_num_rows($result2) > 0) {
			$valid_login = true;
			$user = pg_fetch_row($result2);
		}
	}
	return $user;
}

function get_user_by_id($user_id, $db) {
	//Check to see if the user is in the Database. If so retrieve No. of failed allempts. If not add them to it the db and retrive No. of failed attempts 
	$query = "SELECT * FROM users WHERE user_id = '" . $user_id . "';";
	$result = pg_query($db, $query);
	$user = pg_fetch_row($result);
	return $user;
}

function get_user_by_id_v2($user_id, $db) {
	$query = "SELECT * FROM users WHERE user_id = '" . $user_id . "';";
	$result = pg_query($db, $query);
	$user = pg_fetch_all($result);
	return $user[0];
}

function get_user_by_name($username, $db) {
	$query = "SELECT * FROM users WHERE username = '" . $username . "';";
	$result = pg_query($db, $query);
	$user = pg_fetch_all($result);
	return $user[0];
}

function get_users_by_id($users, $db) {
	$query = "SELECT user_id, username, email, name, surname, profile_pic_url, cover_photo, games, favourites, status, bio, clan, teams, twitch_channel_link, youtube_channel_link, mixer_channel_link, facebook_channel_link, stream_link " .
	"FROM users WHERE user_id IN ('" . implode("', '", $users) . "')";
	$result = pg_query($db, $query);
	$retrieved_users = pg_fetch_all($result);
	return $retrieved_users;
}

function get_users($users, $db) {
	$query = "SELECT user_id, username, email, name, surname, profile_pic_url, cover_photo, games, " .
	"favourites, status, bio, clan, teams, twitch_channel_link, youtube_channel_link, mixer_channel_link, facebook_channel_link, stream_link " .
	"FROM users WHERE user_id IN ('" . implode("', '", $users) . "')";
	$result = pg_query($db, $query);
	$retrieved_users = pg_fetch_all($result);
	return $retrieved_users;
}

function validate_user($username_or_email, $password, $db) {
	$valid_login =array(
		"isValid" => false,
		"user" => NULL
	);
	$query = "SELECT * FROM users WHERE ((username = '" . $username_or_email . "') or (email='" . $username_or_email . "'));";
	$result = pg_query($db, $query);
	if (pg_num_rows($result) > 0) {
		$users = pg_fetch_all($result);
		$user = $users[0];
		$password_hash = $user['password'];
		if(password_verify($password, $password_hash)) {
			$valid_login['isValid'] = true;
			$valid_login['user'] = $user;
		}
	}

	return $valid_login;
} 

function validate_api_user($api_key, $db) {
	//Check to see if the user is in the Database. If so retrieve No. of failed allempts. If not add them to it the db and retrive No. of failed attempts 
	$query = "SELECT * FROM api_users WHERE api_key = '" . $api_key . "'";
	$result = pg_query($db, $query);
	if (pg_num_rows($result) > 0){
		$validated = true;
	}else {
		$validated = false;
	}
	return $validated;
}

function create_api_request_log($request, $user_id, $response, $description, $type, $db) {
	$log_timestamp = date('Y-m-d H:i:s', time());
	$query = "INSERT INTO api_request_log
		(id, request, user_id, response, log_timestamp, description, type)
		VALUES 
		(DEFAULT, '" . $request . "','" . $user_id . "','" . $response . "','" . $log_timestamp . "', '" . $description . "', '" . $type . "')";
	$result = pg_query($db, $query);
}

function update_verification_deposit($username, $transaction, $db) {
	$check = "SELECT exists (SELECT 1 FROM users WHERE username = '" . $username . "' LIMIT 1)";

	if (pg_fetch_row(pg_query($db, $check))[0] == 't') {
		$query = "UPDATE users SET wallet_verification_deposit = '" . $transaction . "' WHERE username = '" . $username . "'";
		$result = pg_query($db, $query);
		return "Wallet verification deposit updated!";
	} else {
		return " Could not find the user " . $username . "!";
	}

}

function update_wallet_addr($username, $wallet_addr, $db) {
	$check = "SELECT exists (SELECT 1 FROM users WHERE username = '" . $username . "' LIMIT 1)";

	if (pg_fetch_row(pg_query($db, $check))[0] == 't') {
		$query = "UPDATE users SET wallet_addr = '" . $wallet_addr . "', wallet_verified = 'verified' WHERE username = '" . $username . "'";
		$result = pg_query($db, $query);
		return "Wallet address updated!";
	} else {
		return " Could not find the user " . $username . "!";
	}

}

function update_user_email($user_id, $email, $db) {
	$check = "SELECT exists (SELECT 1 FROM users WHERE email = '" . $email . "' LIMIT 1)";

	if (pg_fetch_row(pg_query($db, $check))[0] == 'f') {
		$query = "UPDATE users SET email = '" . $email . "' WHERE user_id = '". $user_id ."'";
		$result = pg_query($db, $query);
		return "Player profile updated";
	} else {
		return "Failed to update email. The email already exists!";
	}

}

function update_user_username($user_id, $username, $db) {
	$check = "SELECT exists (SELECT 1 FROM users WHERE username = '" . $username . "' LIMIT 1)";
	
	if (pg_fetch_row(pg_query($db, $check))[0] == 'f') {
		$query = "UPDATE users SET username = '" . $username . "' WHERE user_id = '". $user_id ."'";
		$result = pg_query($db, $query);
		return "Player profile updated";
	} else {
		return "Failed to update username. The username already exists!";
	}
}

function update_user_name($user_id, $name, $db) {
	$query = "UPDATE users SET name = '" . $name . "' WHERE user_id = '". $user_id ."'";
	$result = pg_query($db, $query);
}

function update_user_surname($user_id, $surname, $db) {
	$query = "UPDATE users SET surname = '" . $surname . "' WHERE user_id = '". $user_id ."'";
	$result = pg_query($db, $query);
}

function update_user_profile_pic_url($user_id, $profile_pic_url, $db) {
	$query = "UPDATE users SET profile_pic_url = '" . $profile_pic_url . "' WHERE user_id = '". $user_id ."'";
	$result = pg_query($db, $query);
}

function update_user_bio($user_id, $bio, $db) {
	$query = "UPDATE users SET bio = '" . $bio . "' WHERE user_id = '". $user_id ."'";
	$result = pg_query($db, $query);
}

function update_user_clan($user_id, $clan, $db) {
	$query = "UPDATE users SET clan = '" . $clan . "' WHERE user_id = '". $user_id ."'";
	$result = pg_query($db, $query);
}

function update_user_teams($user_id, $teams, $db) {
	$query = "UPDATE users SET teams = '" . $teams . "' WHERE user_id = '". $user_id ."'";
	$result = pg_query($db, $query);
}

function update_user_favourites($user_id, $new_favourites, $db) {
	$user = get_user_by_id_v2($user_id, $db);
	$favourites = json_decode($user['favourites']);
	if (!in_array($new_favourites, $favourites)) {
		array_push($favourites, $new_favourites);
	}
	$favourites = json_encode((array) $favourites);

	$query = "UPDATE users SET favourites = '" . $favourites . "' WHERE user_id = '". $user_id ."'";
	$result = pg_query($db, $query);
}

function remove_user_favourite($user_id, $favourite, $db) {
	$user = get_user_by_id_v2($user_id, $db);
	$favourites = (array) json_decode($user['favourites']);
	$key = array_search($favourite, $favourites);
	if (false !== $key) {
		unset($favourites[$key]);
	}
	$favourites = json_encode((array) $favourites);

	$query = "UPDATE users SET favourites = '" . $favourites . "' WHERE user_id = '". $user_id ."'";
	$result = pg_query($db, $query);
}

function sendCompletedCheckoutEmails($user, $cart, $cost) {
	$email = new \SendGrid\Mail\Mail(); 
	$email->setFrom("kuzi@ranxed.com", "Kuzi");
	$email->setSubject("Checkout confirmed");
	$email->addTo($user['email'], $user['name'] . ' ' . $user['surname']);
	$email->addContent(
		"text/plain", "Checkout Completed! Cost: " . $cost . " Cart: " . json_encode($cart)
	);

	$email1 = new \SendGrid\Mail\Mail(); 
	$email1->setFrom("checkout@ranxed.com", "checkout");
	$email1->setSubject("Checkout confirmed!");
	$email1->addTo($user['email'], $user['name'] . ' ' . $user['surname']);
	$email1->addContent(
		"text/html", '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<!--<![endif]-->
		<!--[if (gte mso 9)|(IE)]>
		<xml>
		  <o:OfficeDocumentSettings>
			<o:AllowPNG/>
			<o:PixelsPerInch>96</o:PixelsPerInch>
		  </o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
		<!--[if (gte mso 9)|(IE)]>
			<style type="text/css">
			body {width: 600px;margin: 0 auto;}
			table {border-collapse: collapse;}
			table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
			img {-ms-interpolation-mode: bicubic;}
			</style>
		<![endif]-->
				<style type="text/css">
			body, p, div {
				font-family: arial,helvetica,sans-serif;
				font-size: 14px;
			}
			body {
				color: #000000;
			}
			body a {
				color: #42ee99;
				text-decoration: none;
			}
			p { margin: 0; padding: 0; }
			table.wrapper {
				width:100% !important;
				table-layout: fixed;
				-webkit-font-smoothing: antialiased;
				-webkit-text-size-adjust: 100%;
				-moz-text-size-adjust: 100%;
				-ms-text-size-adjust: 100%;
			}
			img.max-width {
				max-width: 100% !important;
			}
			.column.of-2 {
				width: 50%;
			}
			.column.of-3 {
				width: 33.333%;
			}
			.column.of-4 {
				width: 25%;
			}
			@media screen and (max-width:480px) {
				.preheader .rightColumnContent,
				.footer .rightColumnContent {
				text-align: left !important;
				}
				.preheader .rightColumnContent div,
				.preheader .rightColumnContent span,
				.footer .rightColumnContent div,
				.footer .rightColumnContent span {
				text-align: left !important;
				}
				.preheader .rightColumnContent,
				.preheader .leftColumnContent {
				font-size: 80% !important;
				padding: 5px 0;
				}
				table.wrapper-mobile {
				width: 100% !important;
				table-layout: fixed;
				}
				img.max-width {
				height: auto !important;
				max-width: 100% !important;
				}
				a.bulletproof-button {
				display: block !important;
				width: auto !important;
				font-size: 80%;
				padding-left: 0 !important;
				padding-right: 0 !important;
				}
				.columns {
				width: 100% !important;
				}
				.column {
				display: block !important;
				width: 100% !important;
				padding-left: 0 !important;
				padding-right: 0 !important;
				margin-left: 0 !important;
				margin-right: 0 !important;
				}
			}
			</style>
				<!--user entered Head Start-->
		
			<!--End Head user entered-->
			</head>
			<body>
				<center class="wrapper" data-link-color="#42ee99" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#000000;">
				<div class="webkit">
					<table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#000000">
					<tbody><tr>
						<td valign="top" bgcolor="#000000" width="100%">
						<table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
							<tbody><tr>
							<td width="100%">
								<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tbody><tr>
									<td>
									<!--[if mso]>
			<center>
			<table><tr><td width="600">
			<![endif]-->
											<table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
												<tbody><tr>
												<td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
			<tbody><tr>
				<td role="module-content">
				<p>Order being processed!</p>
				</td>
			</tr>
			</tbody></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="vB9TDziyvx65CC2nx3oyRH">
				<tbody><tr>
				<td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="#000000">
				</td>
				</tr>
			</tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="uXsDxMnn1bRMmDcX8NB6rW">
				<tbody><tr>
				<td style="font-size:6px; line-height:10px; padding:30px 0px 30px 0px;" bgcolor="#000000" valign="top" align="center">
					<img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" src="http://cdn.mcauto-images-production.sendgrid.net/02e48ced53e1eb6d/daa2e9f0-4fa5-4462-8a80-841aebda65ea/1888x306.png" alt="SongRiddle" width="600" data-responsive="true" data-proportionally-constrained="false">
				</td>
				</tr>
			</tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="hL6wjQ2qknNd5qDwT1p7Up" data-mc-module-version="2019-10-22">
				<tbody><tr>
				<td style="background-color:#000000; padding:10px 20px 10px 20px; line-height:40px; text-align:justify;" height="100%" valign="top" bgcolor="#000000"><div><h1 style="text-align: center"><span style="color: #ffffff; font-size: 28px; font-family: verdana, geneva, sans-serif"><strong>Checkout Confirmed!</strong></span></h1><div></div></div></td>
				</tr>
			</tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="37c1DUYE1TN31PTwSNoaE7">
				<tbody><tr>
				<td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px; background-color:#000000;" valign="top" align="center">
					<img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" src="http://cdn.mcauto-images-production.sendgrid.net/02e48ced53e1eb6d/c799df92-c66f-4e34-bd61-0ec081bb73e9/1080x1080.png" alt="" width="600" data-responsive="true" data-proportionally-constrained="false">
				</td>
				</tr>
			</tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="qk51Jjn4bm3rn2Yb31Dxzb" data-mc-module-version="2019-10-22">
				<tbody><tr>
				<td style="background-color:#ffffff; padding:50px 50px 10px 50px; line-height:22px; text-align:center;" height="100%" valign="top" bgcolor="#ffffff"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px; font-family: verdana, geneva, sans-serif"><strong>Your order is being processed and you will receive an email with your access codes when it is complete.</strong></span></div>
		<div style="font-family: inherit; text-align: inherit"><br></div>
		<div style="font-family: inherit; text-align: inherit"><br></div><div></div></div></td>
				</tr>
			</tbody></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2ga5f7koD5ApvUfnqUK6aT">
				<tbody><tr>
				<td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="#000000">
				</td>
				</tr>
			</tbody></table><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="iTBXe9c6QUCujvmJs8hYKr">
			<tbody>
				<tr>
				<td height="100%" valign="top" role="module-content"><div style="font-family: inherit; text-align: center; color: #ff0e1e; background-color:black;">
			If you have any issues contact us on our support channel.
		</div>
		<div style="font-family: inherit; text-align: center; background-color:black;">
			<a href="https://discord.gg/r53F2Sx">
				<img src="https://res.cloudinary.com/ranxed/image/upload/v1581648179/imgs/gwel1tafmi7jlrsmcq0c.png" alt="join our discord" height="50px">
			</a>
			<br>
		</div></td>
				</tr>
			</tbody>
			</table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c3nRrjMndqXf1snYDFPSF9">
				<tbody><tr>
				<td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="#000000">
					<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
					<tbody><tr>
						<td style="padding:0px 0px 3px 0px;" bgcolor="#ff0e1e"></td>
					</tr>
					</tbody></table>
				</td>
				</tr>
			</tbody></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="pa9PeYjCEFyByuP5878Sd2">
				<tbody><tr>
				<td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="#000000">
				</td>
				</tr>
			</tbody></table><table class="module" role="module" data-type="social" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="n7FceQWVnLmounEt32B1gj">
				<tbody>
				<tr>
					<td valign="top" style="padding:0px 0px 0px 0px; font-size:6px; line-height:10px; background-color:#000000;" align="center">
					<table align="center">
						<tbody>
						<tr><td style="padding: 0px 5px;">
				<a role="social-icon-link" href="https://www.facebook.com/ranxedofficial" target="_blank" alt="Facebook" title="Facebook" style="display:inline-block; background-color:#ff0e1e; height:30px; width:30px;">
				<img role="social-icon" alt="Facebook" title="Facebook" src="https://marketing-image-production.s3.amazonaws.com/social/white/facebook.png" style="height:30px; width:30px;" height="30" width="30">
				</a>
			</td><td style="padding: 0px 5px;">
				<a role="social-icon-link" href="https://twitter.com/ranxedofficial" target="_blank" alt="Twitter" title="Twitter" style="display:inline-block; background-color:#ff0e1e; height:30px; width:30px;">
				<img role="social-icon" alt="Twitter" title="Twitter" src="https://marketing-image-production.s3.amazonaws.com/social/white/twitter.png" style="height:30px; width:30px;" height="30" width="30">
				</a>
			</td><td style="padding: 0px 5px;">
				<a role="social-icon-link" href="https://www.instagram.com/ranxed" target="_blank" alt="Instagram" title="Instagram" style="display:inline-block; background-color:#ff0e1e; height:30px; width:30px;">
				<img role="social-icon" alt="Instagram" title="Instagram" src="https://marketing-image-production.s3.amazonaws.com/social/white/instagram.png" style="height:30px; width:30px;" height="30" width="30">
				</a>
			</td></tr>
						</tbody>
					</table>
					</td>
				</tr>
				</tbody>
			</table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="35xFa9abxGTBYt9yR9BeQ2">
				<tbody><tr>
				<td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="#000000">
				</td>
				</tr>
			</tbody></table></td>
												</tr>
											</tbody></table>
											<!--[if mso]>
											</td>
										</tr>
										</table>
									</center>
									<![endif]-->
									</td>
								</tr>
								</tbody></table>
							</td>
							</tr>
						</tbody></table>
						</td>
					</tr>
					</tbody></table>
				</div>
				</center>
			
			
		</body></html>'
	);

	$sendgrid = new \SendGrid(getenv('SENDGRID_API_KEY'));

	try {
		$response = $sendgrid->send($email);
		print $response->statusCode() . "\n";
		print_r($response->headers());
		print $response->body() . "\n";
	} catch (Exception $e) {
		echo 'Caught exception: '. $e->getMessage() ."\n";
	}

	try {
		$response1 = $sendgrid->send($email1);
		print $response1->statusCode() . "\n";
		print_r($response1->headers());
		print $response1->body() . "\n";
	} catch (Exception $e) {
		echo 'Caught exception: '. $e->getMessage() ."\n";
	}
}

function generateId() {
	return md5(uniqid(time()));
}

?>