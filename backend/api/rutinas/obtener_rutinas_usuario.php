<?php
session_start();

header("Access-Control-Allow-Origin: https://myproyectTPinterfaces.infy.uk");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/database.php';

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "mensaje" => "No autorizado."]);
    exit();
}

$id_usuario_actual = $_SESSION['id_usuario'];
$database = new Database();
$db = $database->getConnection();
$rutinas_finales = [];

try {
    // Obtenemos las rutinas principales del usuario desde `rutina_personalizada`
    $stmt_rutinas = $db->prepare("SELECT * FROM rutina_personalizada WHERE id_usuario = ? ORDER BY fecha_creacion DESC");
    $stmt_rutinas->execute([$id_usuario_actual]);

    while ($rutina = $stmt_rutinas->fetch(PDO::FETCH_ASSOC)) {
        $rutinas_finales[] = [
            "id" => $rutina['id_rutina'],
            "nombre" => $rutina['nombre'],
            "frecuencia" => $rutina['frecuencia'],
            "descripcion" => $rutina['descanso'],
            "fecha_creacion" => $rutina['fecha_creacion']
        ];
    }

    http_response_code(200);
    echo json_encode(["success" => true, "rutinas" => $rutinas_finales]);

} catch (Exception $e) {
    http_response_code(503);
    echo json_encode(["success" => false, "mensaje" => "Error del servidor al obtener las rutinas.", "error" => $e->getMessage()]);
}
?>