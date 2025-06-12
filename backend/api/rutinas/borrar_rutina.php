<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_rutina'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'mensaje' => 'Falta el ID de la rutina']);
    exit;
}

$id_rutina = intval($data['id_rutina']);

try {
    $database = new Database();
    $db = $database->getConnection();

    // Paso 1: Obtener todos los id_dia relacionados
    $stmt = $db->prepare("SELECT id_dia FROM rutina_personalizada_dia WHERE id_rutina = ?");
    $stmt->execute([$id_rutina]);
    $dias = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Paso 2: Borrar ejercicios relacionados a cada día
    foreach ($dias as $id_dia) {
        $stmt = $db->prepare("DELETE FROM rutina_personalizada_ejercicio WHERE id_dia = ?");
        $stmt->execute([$id_dia]);
    }

    // Paso 3: Borrar días
    $stmt = $db->prepare("DELETE FROM rutina_personalizada_dia WHERE id_rutina = ?");
    $stmt->execute([$id_rutina]);

    // Paso 4: Borrar la rutina personalizada
    $stmt = $db->prepare("DELETE FROM rutina_personalizada WHERE id_rutina = ?");
    $stmt->execute([$id_rutina]);

    echo json_encode(['success' => true, 'mensaje' => 'Rutina personalizada eliminada correctamente']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'mensaje' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>
