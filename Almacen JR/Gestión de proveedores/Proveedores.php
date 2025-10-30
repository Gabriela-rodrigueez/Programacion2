<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$db   = 'Almacenjr_db';
$user = 'root'; 
$pass = 'your_db_password'; 
$port = '3307'; 

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


// --- 2. Procesar Datos de Entrada ---
$data = json_decode(file_get_contents("php://input"));

// Mapeo de los datos esperados (usando Teléfono para el campo Contacto y Direccion)
if (empty($data->Nombre) || empty($data->Telefono)) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Faltan datos obligatorios (Nombre, Teléfono)."]);
    exit();
}

$Nombre = $data->Nombre;
// El campo 'Contacto' en la DB parece ser el contacto principal (email en el formulario)
$Contacto = $data->Contacto ?? ''; 
$Direccion = $data->Direccion ?? '';
$Telefono = $data->Telefono; 
$Productos_Suministrados = ''; // Se deja vacío por ahora o se manejará por separado.


// --- 3. Insertar Proveedor ---
try {
    $sql = "INSERT INTO Proveedor (Nombre, Direccion, Contacto, Productos_Suministrados, Estado) VALUES (?, ?, ?, ?, 1)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$Nombre, $Direccion, $Contacto, $Productos_Suministrados]);

    http_response_code(201); // Created
    echo json_encode(["message" => "Proveedor añadido correctamente.", "id" => $pdo->lastInsertId()]);

} catch (\PDOException $e) {
    http_response_code(500);
    // Error 23000 (Integrity Constraint Violation) podría ser por nombre duplicado.
    if ($e->getCode() == '23000') {
         echo json_encode(["message" => "El nombre del proveedor ya existe o hay un problema de integridad de datos."]);
    } else {
         echo json_encode(["message" => "Error al insertar el proveedor: " . $e->getMessage()]);
    }
}
?>