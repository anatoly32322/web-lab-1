<?php

function json_encode1($o)
{
    switch (gettype($o)) {
        case 'NULL':
            return 'null';
        case 'integer':
        case 'double':
            return strval($o);
        case 'string':
            return '"' . addslashes($o) . '"';
        case 'boolean':
            return $o ? 'true' : 'false';
        case 'object':
            $o = (array)$o;
        case 'array':
            $foundKeys = false;

            foreach ($o as $k => $v) {
                if (!is_numeric($k)) {
                    $foundKeys = true;
                    break;
                }
            }

            $result = array();

            if ($foundKeys) {
                foreach ($o as $k => $v) {
                    $result [] = json_encode1($k) . ':' . json_encode1($v);
                }

                return '{' . implode(',', $result) . '}';
            } else {
                foreach ($o as $k => $v) {
                    $result [] = json_encode1($v);
                }
                return '[' . implode(',', $result) . ']';
            }
    }
}

function validateX($inp)
{
    return isset($inp) && is_numeric($inp) && $inp >= -4 && $inp <= 4;
}

function validateY($inp) {

    if (!isset($inp)) return false;

    $Y_MIN = -3;
    $Y_MAX = 3;

    $y_num = str_replace(",", ".", $inp);
    return is_numeric($y_num) && $Y_MIN <= $y_num && $y_num <= $Y_MAX;
}

function validateR($inp) {
    return isset($inp) && is_numeric($inp) &&  $inp >= 1 && $inp <= 5; // protection from changing value attr
}


function isSquareHit($x, $y, $r) {
    return ($x < 0 && $y < 0 && $x > -$r && $y > -1/2 * $r);
}

function isTriangleHit($x, $y, $r) {
    $hypotenuse = $r - 1/2 * $x;
    return ($x >= 0 && $y >= 0 && $y <= $hypotenuse);

}

function isCircleHit($x, $y, $r)
{
    $isInsideCircle = pow($x, 2) + pow($y, 2) <= pow($r, 2);

    return ($x <= 0 && $y >= 0 && $isInsideCircle);
}

function isBlueAreaHit($x, $y, $r) {
    return isCircleHit($x, $y, $r) || isTriangleHit($x, $y, $r) || isSquareHit($x, $y, $r);
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$x = $_GET['x'];
$y = $_GET['y'];
$r = $_GET['r'];
$timezone = $_GET['timezone'];



$isValid = validateR($r) && validateX($x) && validateY($y);
$isBlueAreaHit = NULL;
$userTime = NULL;
$timePassed = NULL;
if ($isValid) {
    $isBlueAreaHit = isBlueAreaHit($x, $y, $r);
    $userTime = @date('H:i:s', time() - $timezone * 60);
    $timePassed = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 4);
}
$response = array(
    "isValid" => $isValid,
    "isBlueAreaHit" => $isBlueAreaHit,
    "userTime" => $userTime,
    "execTime" => $timePassed,
    "x" => $x,
    "y" => $y,
    "r" => $r);
echo json_encode1($response);