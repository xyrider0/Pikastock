<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <style>
            table,th,td
            {
                border:1px solid black;
                border-collapse:collapse;
            }
            td,th
            {
                font-size:14px;
            }
            th
            {
                background-color:#555555;
                color:white;
                font-family:verdana;
            }
            td
            {
                font-family:arial;
            }
        </style>
        
        <table cellpadding="5px">
            <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Asking Price</th>
                <th>Bid Price</th>
                <th>Last Price</th>
                <th>Change</th>
                <th>% Change</th>
            </tr>
        <?php
            $consumer_key    = "";
            $consumer_secret = "";
            $access_token    = "";
            $access_secret   = "";
            
            try 
            {   
                // Setup an OAuth consumer
                $oauth = new OAuth(
                        $consumer_key,
                        $consumer_secret,
                        OAUTH_SIG_METHOD_HMACSHA1,
                        OAUTH_AUTH_TYPE_AUTHORIZATION);
                
                //Bypass incompatible version of cURL
                $oauth->disableSSLChecks();
                
                // Manually update the access token/secret.  
                // Typically this would be done through an OAuth callback when 
                // authenticating other users.
                $oauth->setToken($access_token,$access_secret);

                // Read symbols into array here. Hardcoded for now
                $stockSymbols = array(
                    0 => "MSFT",
                    1 => "AAPL",
					2 => "VZ",
					3 => "WMT",
					4 => "CL",
					5 => "AUY",
					6 => "MMM",
					7 => "MCD",
					8 => "KO",
					9 => "PEP",
					10 => "JNJ",
					11 => "LNG",
					12 => "GE",
					13 => "INTC",
					14 => "GLW",
					15 => "MO",
					16 => "T",
					17 => "COP",
					18 => "PM",
					19 => "PG",
					20 => "GSK",
					21 => "CLX",
					
                );
                
                // Make a request to the API endpoint
                // First build the url.
                $url = "https://api.tradeking.com/v1/" .
                        "market/ext/quotes.xml?symbols=";
                $firstSymbol = true;
                foreach ($stockSymbols as &$stockSymbol)
                {
                    if ($firstSymbol == false)
                    {
                        $url = $url . ",";
                    }
                    $firstSymbol = false;
                    
                    $url = $url . $stockSymbol;
                }
                
                //Now make the request
                $oauth->fetch($url);
                
                // Handle the response
                $response_info = $oauth->getLastResponseInfo();
                $response = $oauth->getLastResponse();

                // Use SimpleXML to parse the xml into an object
                $object = (new SimpleXMLElement($response));
                $numQuotes = ($object->quotes->children()->count());
                //print ($response);
                //Loop through each quote and display the data in the table
                for ($ii = 0; $ii < $numQuotes; $ii = ($ii + 1))
                {
                    $xmlQuote = $object->quotes->quote[$ii];
                    $quote = new StockQuote($xmlQuote);
                    $quote->printQuote($ii);
					$sub = $quote->lastPrice-($quote->lastPrice*0.1);
					$url2 = "https://api.tradeking.com/v1/" .
							"market/options/search.xml?symbol=" .
							$quote->symbol .
							"&query=" .
							"xyear-eq%3A2015%20AND%20" .
							"xmonth-eq%3A09%20AND%20" .
							//"put_call-eq%3Aput%20AND20" .
							"strikeprice-gt%3A" . $sub . "%20AND%20" .
							"strikeprice-lt%3A" . $quote->lastPrice;
														
							//"strikeprice-gt%3A39%20AND%20" .
							//"strikeprice-lt%3A40";
					//Now make the request
					$oauth->fetch($url2);
					
					// Handle the response
					$response_info2 = $oauth->getLastResponseInfo();
					$response2 = $oauth->getLastResponse();

					// Use SimpleXML to parse the xml into an object
					$object2 = (new SimpleXMLElement($response2));
					$numQuotes2 = ($object2->quotes->children()->count());
					if ($numQuotes2 > 0)		
					{					
						for ($jj = 0; $jj < $numQuotes2; $jj = ($jj + 1))
						{
							$xmlQuote2 = $object2->quotes->quote[$jj];
							$quote2 = new OptionQuote($xmlQuote2, $quote->lastPrice);
							$x = ($quote2->bidPrice+$quote2->askPrice)/2;
							if ($quote2->days_to_expiration <= 9 &&
								$quote2->put_call == "put" &&
								$x > 0.15)
							{
								$quote2->printQuote($jj);
							}
						}			
					}											
                }
				
            } 
            catch(OAuthException $E)
            {
                // Display any errors
                print "Exception caught!<br>";
                print "Response: ". $E->getMessage() . "\n";
            }
        ?>
        <?php
            class OptionQuote
            {
                public $symbol;
                public $days_to_expiration;
                public $strikeprice;
				public $put_call;
                public $bidPrice;
				public $askPrice;
                public $lastPrice;
				public $stocklastprice;
                
                // Coinstructor
                public function OptionQuote($object, $last)
                {
                    $this->symbol = $object->symbol;
                    $this->days_to_expiration = $object->days_to_expiration;
					$this->put_call = $object->put_call;
                    $this->strikeprice = floatval($object->strikeprice);
                    $this->bidPrice = floatval($object->bid);
					$this->askPrice = floatval($object->ask);
					$this->stocklastprice = floatval($last);
                }
                
                public function printQuote($rowNumber)
                {

						// Begin row
						print("<tr>");
						
						//Even and odd row colors
						if (($rowNumber%2) == 1)
						{
							print("<tr bgcolor='#F6F4F0'>");
						}
						else
						{
							print("<tr bgcolor='#FFFFFF'>");
						}
						
						// Symbol
						print("<td>");
						print($this->symbol);
						print("</td>");
						
						// Name
						print("<td>");
						print($this->days_to_expiration);
						print("</td>");
						
						// Name
						print("<td>");
						print($this->put_call);
						print("</td>");
						
						// Asking price
						print("<td align='right'>");
						print ("$" . number_format($this->strikeprice, 2, '.', ''));
						print("</td>");		
						
						// Asking price
						print("<td align='right'>");
						print ("$" . number_format($this->askPrice, 2, '.', ''));
						print("</td>");
						
						// Bid Price
						print("<td align='right'>");
						print ("$" . number_format($this->bidPrice, 2, '.', ''));
						print("</td>");
						
						// Last Price
						print("<td align='right'>");
						print ("$" . number_format($this->lastPrice, 2, '.', ''));
						print("</td>");
						
						// Change
						print("<td align='right'>");
						print (number_format((((($this->bidPrice+$this->askPrice)/2)-0.06)/$this->strikeprice)*100, 4, '.', '') . "%");
						print("</td>");
						
						// % Change
						print("<td align='right'>");
						if ($this->put_call == "put")
						{
							print("<font color='blue'>");
						}
						//print (number_format(((365/$this->days_to_expiration)*((($this->bidPrice+$this->askPrice)/2)/$this->strikeprice))*100, 4, '.', '') . "%");
						// if <= 7 ... 52 weeks
						print (number_format(((52)*(((($this->bidPrice+$this->askPrice)/2)-0.06)/$this->strikeprice))*100, 4, '.', '') . "%");
						if ($this->put_call == "put")
						{
							print("</font>");
						}
						print("</td>");

						print("<td align='right'>");
						print (number_format((($this->stocklastprice-$this->strikeprice)/$this->stocklastprice)*100, 4, '.', '') . "%");
						print("</td>");
						
						// End Row
						print("</tr>");

                }
            }
        ?>        
        <?php
            class StockQuote
            {
                public $symbol;
                public $name;
                public $askPrice;
                public $bidPrice;
                public $change;
                public $lastPrice;
                public $pctChange;
                
                // Coinstructor
                public function StockQuote($object)
                {
                    $this->symbol = $object->symbol;
                    $this->name = $object->name;
                    $this->askPrice = floatval($object->ask);
                    $this->bidPrice = floatval($object->bid);
                    $this->lastPrice = floatval($object->last);
                }
                
                public function printQuote($rowNumber)
                {
                    // Begin row
                    print("<tr>");
                    
                    //Even and odd row colors
                    if (($rowNumber%2) == 1)
                    {
                        print("<tr bgcolor='#F6F4F0'>");
                    }
                    else
                    {
                        print("<tr bgcolor='#FFFFFF'>");
                    }
                    
                    // Symbol
                    print("<td>");
                    print($this->symbol);
                    print("</td>");
                    
                    // Name
                    print("<td>");
                    print($this->name);
                    print("</td>");
                    
                    // Asking price
                    print("<td align='right'>");
                    print ("$" . number_format($this->askPrice, 2, '.', ''));
                    print("</td>");
                    
                    // Bid Price
                    print("<td align='right'>");
                    print ("$" . number_format($this->bidPrice, 2, '.', ''));
                    print("</td>");
                    
                    // Last Price
                    print("<td align='right'>");
                    print ("$" . number_format($this->lastPrice, 2, '.', ''));
                    print("</td>");
                    
                    // Change
                    print("<td align='right'>");
                    //Nothing yet
                    print("</td>");
                    
                    // % Change
                    print("<td align='right'>");
                    //Nothing yet
                    print("</td>");
                    
                    // End Row
                    print("</tr>");
                }
            }
        ?>
        </table>
    </body>
</html>