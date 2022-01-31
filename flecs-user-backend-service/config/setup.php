<?php

echo "Setting Up Database.\n" . '</br>';

include "conn.php";

echo "Connected!\n" . '</br>';

// Setup database tables.
// wallet_addr should be set be set to unique 
$query = "CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(100)            UNIQUE NOT NULL,
            user_api_key VARCHAR(100)       UNIQUE NOT NULL,
            wallet_addr VARCHAR(1000) 	                   , 
            username VARCHAR(100) 			         UNIQUE,
            email VARCHAR(100) 			             UNIQUE,
            password VARCHAR(1000) 			       NOT NULL,
            name VARCHAR(100) 			                   ,
            surname VARCHAR(100) 			               ,
            balance numeric(10,2)                  NOT NULL,
            asset_value numeric(10,2)              NOT NULL,
            assets VARCHAR(65000)   		               ,
            settings VARCHAR(65000)   		               ,
            transactions VARCHAR(65000)   		           ,
            credits numeric(10,2)                          ,
            gender VARCHAR(20)                             ,
            date_of_birth date                             ,
            phone_number VARCHAR(100)                UNIQUE,
            profile_pic_url VARCHAR(1000) 			       ,
            cover_photo VARCHAR(1000) 			           ,
            activity_log VARCHAR(65000) 			       ,
            friends VARCHAR(65000) 			               ,
            favourites VARCHAR(65000) 		               ,
            wallet_verification_deposit varchar(1000)      ,
            wallet_verified varchar(10)                    ,
            email_verified varchar(10)                     ,
            kyc VARCHAR(65000) 			                   ,
            status VARCHAR(1000) 			               ,
            bio VARCHAR(1000) 			                   ,
            address VARCHAR(10000) 			               ,
            city VARCHAR(1000) 			                   ,
            state VARCHAR(1000) 			               ,
            country_code VARCHAR(20) 			           ,
            zip_code VARCHAR(20) 			               ,
            subscription_date TIMESTAMP 	               ,
            subscription_end_date TIMESTAMP                ,
            subscription_type VARCHAR(50)                  ,
            access_level VARCHAR(20) 			           ,
            locale VARCHAR(50) 						       ,
            timezone VARCHAR(50) 					       ,
            updated_at TIMESTAMP 				           ,
            last_login TIMESTAMP 				           ,
            sign_up_timestamp TIMESTAMP 	       NOT NULL,
            last_activity_timestamp TIMESTAMP       NOT NULL
        );";

$result = pg_query($db, $query);

// Setup database tables for dashboard.
$query = "CREATE TABLE IF NOT EXISTS api_users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) 			UNIQUE NOT NULL,
    user_id VARCHAR(100)            UNIQUE NOT NULL,
    email VARCHAR(1000) 			UNIQUE NOT NULL,
    api_key VARCHAR(1000) 			UNIQUE NOT NULL,
    profile_pic_url VARCHAR(1000) 			       ,
    locale VARCHAR(50) 						       ,
    timezone VARCHAR(50) 					       ,
    country_code VARCHAR(10) 			           ,
    last_request VARCHAR(1000)				       ,
    sign_up_timestamp TIMESTAMP 	       NOT NULL,
    last_request_timestamp TIMESTAMP       NOT NULL
);";

$result = pg_query($db, $query);

$query = "CREATE TABLE IF NOT EXISTS api_request_log (
    id SERIAL PRIMARY KEY,
    request VARCHAR(1000)                   ,
    user_id VARCHAR(100)                    ,
    response VARCHAR(10000)                 ,
    log_timestamp TIMESTAMP                 ,
    description VARCHAR(100)                ,
    type VARCHAR(100)
);";
$result = pg_query($db, $query);

$query = "CREATE TABLE IF NOT EXISTS api_request_error_log (
    id SERIAL PRIMARY KEY,
    request                   VARCHAR(1000),
    response                 VARCHAR(10000),
    error_code                          INT,
    error_subcode                       INT,
    error_type                 VARCHAR(100),
    error_timestamp               TIMESTAMP,
    trace_id                   VARCHAR(100)
);";
$result = pg_query($db, $query);

$query = "CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) 		 UNIQUE NOT NULL,
    email VARCHAR(1000) 	 UNIQUE NOT NULL,
    password VARCHAR(100) 			NOT NULL,
    permissions int 				NOT NULL,
    last_login TIMESTAMP 			NOT NULL,
    sign_up_timestamp TIMESTAMP 	NOT NULL
);";
$result = pg_query($db, $query);

$name = "Admin";
$password = "NewPassword123";
$password = hash('sha256', $password);
$time = date('Y-m-d H:i:s', time());

$query = "INSERT INTO admin_users (id, name, email, password, permissions, last_login, sign_up_timestamp)
        VALUES (DEFAULT, '" . $name . "','admin@example.com','" . $password . "', 2, '" . $time . "', '" . $time . "')";
$result = pg_query($db, $query);

$query = "CREATE TABLE admin_action_log (
    id SERIAL PRIMARY KEY,
    admin_id BIGINT		 			NOT NULL,
    admin_name VARCHAR(100) 		NOT NULL,
    admin_action VARCHAR(100) 		NOT NULL,
    permissions_level int 			NOT NULL,
    admin_action_timestamp TIMESTAMP NOT NULL
);";
$result = pg_query($db, $query);

// Setup api and jwt tables
// Drop tables
$query = "DROP VIEW IF EXISTS vw_app_api_key;";
$result = pg_query($db, $query);

$query = "DROP TABLE IF EXISTS app_api_key;";
$result = pg_query($db, $query);

// Table structure for table `app_api_key`
$query = "CREATE TABLE app_api_key (
    id BYTEA NOT NULL ,
    site_name VARCHAR(128) NOT NULL ,
    api_key CHAR(16) NOT NULL ,
    api_secret_key VARCHAR(128) NOT NULL ,
    create_timestamp TIMESTAMP(3) NOT NULL ,
    status_flag SMALLINT NOT NULL DEFAULT 1 ,
    PRIMARY KEY (id)
);";
$result = pg_query($db, $query);

"CREATE INDEX (api_key);";
$result = pg_query($db, $query);

// Dumping data for table `app_api_key`
$query = "INSERT INTO app_api_key 
(id, site_name, api_key, api_secret_key, create_timestamp, status_flag) 
VALUES 
(decode('11EA6C5219446DA58B8B0242AC120002','hex'), 'API Starter Client', 'd7e1a3d7dd2a43a4', '80ed01f7ef2e4e538a6d24e50088495f', (Select (current_timestamp)), 1);";
$result = pg_query($db, $query);

// Create View for `app_api_key`
$query = "CREATE 
            VIEW vw_app_api_key AS 
                SELECT
                    encode(id::bytea, 'hex'),
                    site_name,
                    api_key, 
                    api_secret_key, 
                    create_timestamp, 
                    status_flag   
                FROM app_api_key;
        ";
$result = pg_query($db, $query);

echo "Done.\n" . '</br>';

?>