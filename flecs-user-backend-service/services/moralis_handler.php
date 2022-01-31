<?php
    
    function initiateWalletAuthentication($username, $transaction, $res, $db) {
        $response = update_verification_deposit($username, $transaction, $db);
        if ($response == "Wallet verification deposit updated!") {
            // $transactions = getAddressTransactions();
            $res = authenticateWalletAddress($username, $transaction, $res, $db);
        } else {
			$res= App_Response::getResponse('204');
			$res['responseDescription'] .= $response . " Try again.";
        }
        return $res;
    }

    function authenticateWalletAddress($username, $transaction, $res, $db) {
        $wallet_addr="";
		$transactions = getAddressTransactions();
		$result = $transactions['result'];
        $count = 0;
		foreach($result as $value) {
			if($value['value'] == $transaction) {
                update_wallet_addr($username, $value['from_address'], $db);
                $wallet_addr=$value['from_address'];
            }
            ++$count;
		}
		$res['responsePayload'] = $wallet_addr;
        return $res;
    }

    function getAddressTransactions() {
        $moralis_api_key = 'X0B9Ed6XuPhJofn39XG6wziVbX0siNPnMjYesfKNov3tw0xEhVvnlOTCGaQYum1a';
        $host = 'https://deep-index.moralis.io/api/v2/0xD15BE984F5e58358b905B19e8fdAFced86954970?chain=0xa869';

        $curl = curl_init($host);
        curl_setopt($curl, CURLOPT_URL, $host);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $headers = array(
            "X-API-Key:" . $moralis_api_key,   
            "Content-Type: application/json",
        );
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $resp = curl_exec($curl);
        curl_close($curl);
        return json_decode($resp, TRUE);
    }

?>