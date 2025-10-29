<?php

$servidor = "localhost"; 
$usuario = "root";
$password = "root";
$base_de_datos = "almacenjr_db";


$conexion = new mysqli($servidor, $usuario, $password, $base_de_datos);


if ($conexion->connect_error) {
    // die() detiene la ejecución del script y muestra un mensaje
    die("Conexión fallida: " . $conexion->connect_error);
}

// Opcional: Establecer el juego de caracteres a UTF-8 para evitar problemas con tildes y eñes
$conexion->set_charset("utf8");

?>
