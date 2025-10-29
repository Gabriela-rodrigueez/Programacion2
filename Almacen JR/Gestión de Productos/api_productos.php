<?php
include '../conexion.php'; 

header('Content-Type: application/json');

// Obtenemos la acción a realizar
$accion = isset($_GET['accion']) ? $_GET['accion'] : '';

switch ($accion) {
    case 'listar_categorias':
        $stmt = $pdo->query("SELECT id_Categoria, Nombre FROM Categoria ORDER BY Nombre");
        $categorias = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $categorias]);
        break;

    case 'agregar_categoria':
        $datos = json_decode(file_get_contents('php://input'), true);
        
        if (isset($datos['nombre']) && !empty($datos['nombre'])) {
            try {
                $sql = "INSERT INTO Categoria (Nombre) VALUES (?)";
                $stmt= $pdo->prepare($sql);
                $stmt->execute([$datos['nombre']]);
                
                echo json_encode(['success' => true, 'id_insertado' => $pdo->lastInsertId()]);
            } catch (\PDOException $e) {
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'El nombre es obligatorio.']);
        }
        break;

    case 'listar_productos':
        $sql = "SELECT 
                    p.id_Producto,
                    p.Nombre,
                    p.Descripcion,
                    p.Precio_Compra,
                    p.Precio_Venta,
                    p.Stock_Actual,
                    c.Nombre AS CategoriaNombre 
                FROM Productos p
                JOIN Categoria c ON p.id_Categoria = c.id_Categoria
                ORDER BY p.Nombre";
                
        $stmt = $pdo->query($sql);
        $productos = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $productos]);
        break;

    case 'agregar_producto':
        $datos = json_decode(file_get_contents('php://input'), true);

        // Validación simple
        if (empty($datos['Nombre']) || empty($datos['id_Categoria']) || empty($datos['Precio_Compra']) || empty($datos['Precio_Venta']) || !isset($datos['Stock_Actual'])) {
            echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios.']);
            exit;
        }

        try {
            $sql = "INSERT INTO Productos (id_Categoria, Nombre, Descripcion, Precio_Compra, Precio_Venta, Stock_Actual, Stock_Minimo) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $datos['id_Categoria'],
                $datos['Nombre'],
                $datos['Descripcion'] ?? null,
                $datos['Precio_Compra'],
                $datos['Precio_Venta'],
                $datos['Stock_Actual'],
                $datos['Stock_Minimo'] ?? 0
            ]);
            
            echo json_encode(['success' => true, 'id_insertado' => $pdo->lastInsertId()]);
        
        } catch (\PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    default:
        // Si no se especifica una acción válida
        echo json_encode(['success' => false, 'error' => 'Acción no válida.']);
        break;
}
?>