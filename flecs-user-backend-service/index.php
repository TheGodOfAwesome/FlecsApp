<?php

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization');
header('Content-Type: application/json');

// the following constant will help ensure all other PHP files will only work as part of this API.
if (!defined('CONST_INCLUDE_KEY')) {define('CONST_INCLUDE_KEY', 'd4e2ad09-b1c3-4d70-9a9a-0e6149302486');}

// run the class autoloader
require_once ('./services/app_autoloader.php');
require_once ('./config/conn.php');
require_once ('./services/request_handler.php');
require_once ('./services/db_classes/db_service.php');
require_once ('./services/moralis_handler.php');

include('vendor/autoload.php');

use prodigyview\network\Curl;
use prodigyview\network\Request;
use prodigyview\network\Response;

//--------------------------------------------------------------------------------------------------------------------
// if this API must be used with a GET, POST, PUT, DELETE or OPTIONS request
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestPayload = json_decode(file_get_contents('php://input'), true);

// retrieve the inbound parameters based on request type.
if (in_array($requestMethod, ["GET", "POST", "PUT", "DELETE", "OPTIONS"])) {

	// Move the request array into a new variable and then unset the apiFunctionName 
	// so that we don't accidentally snag included interfaces after this.
	$requestMethodArray = array();
	$requestMethodArray = $_REQUEST;
	
	if (isset($requestPayload))								{$requestMethodArray['requestPayload'] = $requestPayload;}
	if (isset($requestMethodArray['apiKey']))				{$apiKey = $requestMethodArray['apiKey'];}
	if (isset($requestMethodArray['api_key']))				{$api_key = $requestMethodArray['api_key'];}
	if (isset($requestMethodArray['token']))				{$token = $requestMethodArray['token'];}
	if (isset($requestMethodArray['apiToken']))				{$apiToken = $requestMethodArray['apiToken'];}
	if (isset($requestMethodArray['function']))				{$functionName = $requestMethodArray['function'];}
	if (isset($requestMethodArray['functionParams']))		{$functionParams = $requestMethodArray['functionParams'];}

	// decode the function parameters array.
	if (isset($functionParams) && $functionParams != '') {
		$functionParams = json_decode($functionParams, true);
	}

	// instantiate this class and validate the API request
	$cApiHandler = new API_Handler();

	// Requests should always include the API Key and JSON Web Token *UNLESS* this request is to 
	// to get a token/sign in or sign up. In that case, no validation is required here as the function itself requires 
	// the API Key as a parameter and will do its own validation.
	if ($functionName == 'login') {
        // default validation to a good response
		$res = App_Response::getResponse('200');
		$data = $requestMethodArray['requestPayload'];
		if ((!isset($data['user']) || $data['user'] === '') && (!isset($data['password']) || $data['password'] === '')) {	
			$res = App_Response::getResponse('403');
			$res['message'] = "Missing User Credentials";
		} else {
			$is_user_valid = validate_user($data['user'], $data['password'], $db);
			if(!$is_user_valid['isValid']) {
				$res = App_Response::getResponse('403');
				$res['message'] = "Invalid User Credentials";
			} else {
				$user = $is_user_valid['user'];
				$res = generateUserToken($user, $db);
				$userPayload = array(
					"username" => $user['username'],
					"wallet_address" => $user['wallet_addr'],
					"assets" => $user['assets'],
					"transactions" => $user['transactions'],
					"settings" => $user['settings']
				);
				$res['responsePayload']['user'] = $userPayload;
			}
		}
		$returnArray = json_encode($res, JSON_PRETTY_PRINT);
		echo($returnArray);
	} else if ($requestMethod == 'PUT') {
        // default validation to a good response
		$res = App_Response::getResponse('200');

        // if request is valid, execute command
		$res = generateToken($api_key, $db);

		if ($res['response'] !== '200') {
			// if request is not valid, then raise a bad message.
			$returnArray = json_encode($res);
		} else {	
			$data = $requestMethodArray;
			$res = put($data, $res, $db);
			// encode and return
			$returnArray = json_encode($res, JSON_PRETTY_PRINT);
		}
		echo($returnArray);
	} else {
		// $res = $cApiHandler->validateRequestPostgres($apiKey, $apiToken, $db);
        // default validation to a good response
		$res = App_Response::getResponse('200');
		// Validate Users
		if (isset($api_key) && isset($token)) {
			// $res = validateUserRequestV1($api_key, $token, $db);
			if ($res['response'] !== '200') {
				// if request is not valid, then raise an error message.
				$res = json_encode($res);
			} else {
				$data = $requestMethodArray;
				if ($requestMethod == 'GET') {
					$res = get($data, $res, $db);
				} else if ($requestMethod == 'POST') {
					$res = post($data, $res, $db);
				} else if ($requestMethod == 'Delete') {
					$res = delete($data, $res, $db);
				}
				// encode and return
				$res = json_encode($res, JSON_PRETTY_PRINT);
			}
			echo($res);
		} else {
			$res= App_Response::getResponse('403');
			$res['responseDescription'] .= " Missing API key or token.";
			$res = json_encode($res);
			echo($res);
		}
	}

	if (isset($cApiHandler)) {unset($cApiHandler);}

} else {
	$returnArray = App_Response::getResponse('405');
	echo(json_encode($returnArray));
}

function get($data, $res, $db) {
	// $res["Request Method"] = "Get";
	if ($data['function']  == 'getTransactions') {
		$res['responsePayload'] = getAddressTransactions();
	}
	return $res;
}

function post($data, $res, $db) {
	// $res["Request Method"] = "Post";
	$payload = $data['requestPayload'];
	if (isset($payload['user']) && isset($payload['transaction'])) {
		$res = initiateWalletAuthentication($payload['user'], $payload['transaction'], $res, $db);
	}
	return $res;
}

function put($data, $res, $db) {
	// $res["Request Method"] = "Put";
	$data = $data['requestPayload'];
    if (isset($data['username']) && isset($data['password'])
    ) {
        $code = 200;
        $request = implode(" | ", $data);
        $username = $data['username'];
        $password = $data['password'];
        $password_hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 15]);

        $response = create_new_user(
						$username, $password_hash, $db
					);

        if ($response == "User Created!") {
			$res["message"] = $response;
            $res['responsePayload'] =
			array(
				"username" => $username
			);
        } 
		else {
			$res = App_Response::getResponse('405');
			$res["message"] = $response;
        }
    }
    $request = "Request: " .  $data['username'] . ", " . $data['api_key'];
    $request = (strlen($request) < 100 ? $request : substr($request,0,96) . "..."); 
    $description = "User reg: Username => " . $data['username'] . ". ";
    $description = (strlen($description) < 100 ? $description : substr($description,0,96) . "..."); 
    create_api_request_log($request, $data['api_key'], $response, $description, 'Put', $db);
	return $res;
}

function delete($data, $res, $db) {
	// $res["Request Method"] = "Delete";
	return $res;
}