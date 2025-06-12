<?php
session_start();

header("Access-Control-Allow-Origin: https://myproyectTPinterfaces.infy.uk");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../config/database.php';

if (!isset($_SESSION['id_usuario']) || !isset($_GET['id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "mensaje" => "No autorizado o falta ID de rutina."]);
    exit();
}

$id_rutina_solicitada = intval($_GET['id']);
$id_usuario_actual = $_SESSION['id_usuario'];

$database = new Database();
$db = $database->getConnection();

try {
    // Primero, verificamos que la rutina pertenezca al usuario logueado
    $stmt_rutina = $db->prepare("SELECT * FROM rutina_personalizada WHERE id_rutina = ? AND id_usuario = ?");
    $stmt_rutina->execute([$id_rutina_solicitada, $id_usuario_actual]);
    
    // CORRECCIÓN CLAVE: La variable ahora está en singular
    $rutina = $stmt_rutina->fetch(PDO::FETCH_ASSOC);

    if (!$rutina) {
        http_response_code(404);
        echo json_encode(["success" => false, "mensaje" => "Rutina no encontrada o no pertenece a este usuario."]);
        exit();
    }

    $rutina_completa = $rutina;
    $rutina_completa['dias'] = [];

    // Ahora buscamos los días y ejercicios
    $stmt_dias = $db->prepare("SELECT * FROM rutina_personalizada_dia WHERE id_rutina = ? ORDER BY numero_dia");
    $stmt_dias->execute([$id_rutina_solicitada]);

    while ($dia = $stmt_dias->fetch(PDO::FETCH_ASSOC)) {
        $id_dia_actual = $dia['id_dia'];
        $dia_con_ejercicios = $dia;
        
        $stmt_ejercicios = $db->prepare("SELECT * FROM rutina_personalizada_ejercicio WHERE id_dia = ? ORDER BY orden");
        $stmt_ejercicios->execute([$id_dia_actual]);
        
        $dia_con_ejercicios['ejercicios'] = $stmt_ejercicios->fetchAll(PDO::FETCH_ASSOC);
        $rutina_completa['dias'][] = $dia_con_ejercicios;
    }

    http_response_code(200);
    echo json_encode(["success" => true, "rutina" => $rutina_completa]);

} catch (Exception $e) {
    http_response_code(503);
    echo json_encode(["success" => false, "mensaje" => "Error del servidor.", "error" => $e->getMessage()]);
}
?>