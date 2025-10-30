<?php
// Configuración de cabeceras CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");

// --- 1. Configuración de la Base de Datos ---
$host = 'localhost';
$db   = 'Almacenjr_db';
$user = 'root'; // Reemplaza con tu usuario
$pass = 'your_db_password'; // 🛑 REEMPLAZA ESTO
$port = '3307'; // 🛑 USA EL PUERTO QUE CONFIGURASTE EN XAMPP

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     echo json_encode(["message" => "Error de conexión: " . $e->getMessage()]);
     exit();
}


// --- 2. Obtener Proveedores ---
try {
    // Solo mostramos los proveedores que están en Estado = 1 (Activo)
    $sql = "SELECT id_Proveedor, Nombre, Direccion, Contacto FROM Proveedor WHERE Estado = 1 ORDER BY Nombre ASC";
    $stmt = $pdo->query($sql);
    $suppliers = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode(["suppliers" => $suppliers]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error al consultar los proveedores: " . $e->getMessage()]);
}
?>