<?php // Archivo: backend/api/medidas/guardar_medidas.php
session_start();

header("Access-Control-Allow-Origin: https://mi-proyecto.infinityfreeapp.com");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once '../../config/database.php';

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "mensaje" => "No autorizado."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (empty($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "mensaje" => "No se recibieron datos."]);
    exit();
}

$id_usuario = $_SESSION['id_usuario'];
$fecha = date('Y-m-d'); // La fecha actual

$database = new Database();
$db = $database->getConnection();

// Preparamos la consulta para insertar en la nueva tabla
$query = "INSERT INTO medidas_usuario (id_usuario, fecha, peso, pecho, cintura, brazo_der, brazo_izq, antebrazo_der, antebrazo_izq, pierna_der, pierna_izq, gemelo_der, gemelo_izq, cuello) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $db->prepare($query);

// Usamos el operador '??' para asignar NULL si un campo no viene
$success = $stmt->execute([
    $id_usuario,
    $fecha,
    $data['peso'] ?? null,
    $data['pecho'] ?? null,
    $data['cintura'] ?? null,
    $data['brazo_der'] ?? null,
    $data['brazo_izq'] ?? null,
    $data['antebrazo_der'] ?? null,
    $data['antebrazo_izq'] ?? null,
    $data['pierna_der'] ?? null,
    $data['pierna_izq'] ?? null,
    $data['gemelo_der'] ?? null,
    $data['gemelo_izq'] ?? null,
    $data['cuello'] ?? null
]);

if($success) {
    http_response_code(201);
    echo json_encode(["success" => true, "mensaje" => "Registro guardado exitosamente."]);
} else {
    http_response_code(503);
    echo json_encode(["success" => false, "mensaje" => "No se pudo guardar el registro."]);
}
?>