<?php

    $con = mysqli_connect("localhost", "root", "", "ui5_test");

    if($_GET["Sales"])
    {
        $query = "SELECT ID_Umsatz, SUM(Betrag) as Betrag, Datum_Umsatz as Datum from Umsatz Group by Year(Datum_Umsatz), MONTH(Datum_Umsatz)";

        $result = mysqli_query($con, $query);

        $data = array("Sales-Data" => []);

        while($row = mysqli_fetch_array($result)) {
            $obj = new stdClass();
            $obj->Value = $row["Betrag"];
            $obj->Date = date_format(date_create($row["Datum"]), 'm.d.Y'); 
            array_push($data["Sales-Data"], $obj);    
        }

        exit(json_encode($data));
        
    }
    
    if($_GET["Customer"]){

        $query = "SELECT ID_Status, Typ_Status, count(Typ_Status) as sum_stat, Datum_Status as Datum from kundenstatus Group by Typ_Status, Year(Datum_Status), MONTH(Datum_Status)";

        $result = mysqli_query($con, $query);

        $data = array("Customer-Transactions" => []);

        while($row = mysqli_fetch_array($result)) {
            $obj = new stdClass();
            $obj->Type = $row["Typ_Status"];
            $obj->Value = $row["sum_stat"];
            $obj->Date = date_format(date_create($row["Datum"]), 'm.d.Y'); 
            array_push($data["Customer-Transactions"], $obj);    
        }

        exit(json_encode($data));
    }

    
    if($_GET["DP"])
    {
        $query = "SELECT ID_Zahlung, SUM(Betrag) as Betrag, Typ_Zahlung, Datum_Zahlung as Datum from Zahlungen Group by Typ_Zahlung, Year(Datum_Zahlung), MONTH(Datum_Zahlung)";

        $result = mysqli_query($con, $query);

        $data = array("Deposit-Payout" => []);

        while($row = mysqli_fetch_array($result)) {
            $obj = new stdClass();
            $obj->Value = $row["Betrag"];
            $obj->Type = $row["Typ_Zahlung"];
            $obj->Date = date_format(date_create($row["Datum"]), 'm.d.Y'); 
            array_push($data["Deposit-Payout"], $obj);    
        }

        exit(json_encode($data));
        
    }

    if($_GET["Volume"])
    {
        $query = "SELECT ID_Volumen, SUM(Betrag) as Betrag, Datum_Volumen as Datum from bankvolumen Group by Year(Datum_Volumen), MONTH(Datum_Volumen)";

        $result = mysqli_query($con, $query);

        $data = array("Volumes" => []);

        while($row = mysqli_fetch_array($result)) {
            $obj = new stdClass();
            $obj->Value = $row["Betrag"];
            $obj->Date = date_format(date_create($row["Datum"]), 'm.d.Y'); 
            array_push($data["Volumes"], $obj);    
        }

        exit(json_encode($data));
        
    }

    if($_GET["Table"])
    {
        $query = "SELECT * from kunden Join konto on ID_Kunde = Kunde_FK";

        $result = mysqli_query($con, $query);

        $data = array("Customer-Data" => []);

        while($row = mysqli_fetch_array($result)) {
            $obj = new stdClass();
            $obj->ID = $row["ID_Kunde"];
            $obj->Vorname = $row["Vorname_Kunde"];
            $obj->Nachname = $row["Nachname_Kunde"];
            $obj->Alter = $row["Alter_Kunde"];
            $obj->Geschlecht = $row["Geschlecht_Kunde"];
            $obj->Kontostand = $row["Kontostand"]; 
            array_push($data["Customer-Data"], $obj);    
        }

        exit(json_encode($data));
        
    }
    
    exit(json_encode(""));
    
  