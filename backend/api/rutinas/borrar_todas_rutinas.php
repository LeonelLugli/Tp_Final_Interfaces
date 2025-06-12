<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://myproyectTPinterfaces.infy.uk');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Cambia 'rutina_programada' si tu tabla tiene otro nombre
    $sql = "DELETE FROM rutina_programada";
    $stmt = $db->prepare($sql);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al borrar rutinas']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'mensaje' => $e->getMessage()]);
}
?>