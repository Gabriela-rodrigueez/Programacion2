<?php
header('Content-Type: application/json');
require '../conexion.php'; 

$metodo = $_SERVER['REQUEST_METHOD'];
$accion = isset($_GET['accion']) ? $_GET['accion'] : '';

try {
    if ($metodo == 'GET') {
        if ($accion == 'obtener_usuarios') {
            $stmt = $pdo->query(
                "SELECT u.id_Usuario, u.Nombre, u.Apellido, u.Email, u.Estado, u.Fecha_Registro, r.Nombre_Rol 
                 FROM Usuario u
                 JOIN Roles r ON u.id_Roles = r.id_Roles
                 ORDER BY u.id_Usuario DESC"
            );
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($usuarios);

        } elseif ($accion == 'obtener_roles') {
            // solo los roles que están activos
            $stmt = $pdo->query("SELECT id_Roles, Nombre_Rol FROM Roles WHERE Estado = 1");
            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($roles);
        }

    } elseif ($metodo == 'POST') {
        // AÑADIR un nuevo usuario
        $datos = json_decode(file_get_contents('php://input'), true);

        // Validar datos
        if (!isset($datos['Nombre']) || !isset($datos['Email']) || !isset($datos['Contrasena']) || !isset($datos['id_Roles'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos obligatorios.']);
            exit;
        }

        // Hashear la contraseña
        $contrasena_hasheada = password_hash($datos['Contrasena'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO Usuario (Nombre, Apellido, Email, Contrasena, id_Roles) 
                VALUES (:nombre, :apellido, :email, :contrasena, :id_roles)";
        
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindParam(':nombre', $datos['Nombre']);
        $stmt->bindParam(':apellido', $datos['Apellido']);
        $stmt->bindParam(':email', $datos['Email']);
        $stmt->bindParam(':contrasena', $contrasena_hasheada);
        $stmt->bindParam(':id_roles', $datos['id_Roles']);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['mensaje' => 'Usuario creado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear el usuario.']);
        }
    }

} catch (PDOException $e) {
    http_response_code(500);
    // Código '23000' email duplicado
    if ($e->getCode() == 23000) {
         echo json_encode(['error' => 'El correo electrónico ya está registrado.']);
    } else {
         echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
}
?>