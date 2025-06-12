<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/database.php';

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "mensaje" => "No autorizado."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id_rutina) || !isset($data->fecha_inicio)) {
    http_response_code(400);
    echo json_encode(["success" => false, "mensaje" => "Faltan datos: se requiere id_rutina y fecha_inicio."]);
    exit();
}

$id_usuario = $_SESSION['id_usuario'];
$id_rutina = filter_var($data->id_rutina, FILTER_SANITIZE_NUMBER_INT);
$fecha_inicio = filter_var($data->fecha_inicio, FILTER_SANITIZE_STRING);

// Validar formato de fecha (YYYY-MM-DD)
if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $fecha_inicio)) {
    http_response_code(400);
    echo json_encode(["success" => false, "mensaje" => "Formato de fecha inválido. Use YYYY-MM-DD."]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->prepare(
        "INSERT INTO rutina_programada (id_usuario, id_rutina, fecha_inicio) VALUES (:id_usuario, :id_rutina, :fecha_inicio)"
    );

    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->bindParam(':id_rutina', $id_rutina);
    $stmt->bindParam(':fecha_inicio', $fecha_inicio);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["success" => true, "mensaje" => "Rutina programada con éxito."]);
    } else {
        http_response_code(503);
        echo json_encode(["success" => false, "mensaje" => "No se pudo programar la rutina."]);
    }

} catch (Exception $e) {
    http_response_code(503);
    echo json_encode(["success" => false, "mensaje" => "Error del servidor.", "error" => $e->getMessage()]);
}
?>