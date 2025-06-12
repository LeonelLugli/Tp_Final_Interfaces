<?php // Archivo: backend/api/medidas/obtener_medidas.php
session_start();

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/database.php';

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "mensaje" => "No autorizado."]);
    exit();
}

$id_usuario = $_SESSION['id_usuario'];
$database = new Database();
$db = $database->getConnection();

// Seleccionamos todos los registros del usuario, del más reciente al más antiguo
$stmt = $db->prepare("SELECT * FROM medidas_usuario WHERE id_usuario = ? ORDER BY fecha DESC, id_medida DESC");
$stmt->execute([$id_usuario]);

$medidas = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode(["success" => true, "historial" => $medidas]);
?>