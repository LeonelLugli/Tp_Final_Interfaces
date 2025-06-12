<?php
session_start(); // Esencial para poder leer la sesión del usuario

// Headers para la comunicación
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Incluimos la conexión a la base de datos
include_once '../../config/database.php';

// Verificamos que el usuario realmente haya iniciado sesión en el servidor
if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401); // No autorizado
    echo json_encode(["mensaje" => "Acceso no autorizado. Debes iniciar sesión."]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Leemos los datos que envía el frontend (convertidos a un array asociativo)
$data = json_decode(file_get_contents("php://input"), true);

// Validamos que los datos principales existan
if (empty($data['nombre']) || empty($data['dias'])) {
    http_response_code(400); // Petición incorrecta
    echo json_encode(["mensaje" => "Faltan datos para crear la rutina (nombre y días)."]);
    exit();
}

// Usamos una transacción para que si algo falla, no se guarde nada a medias
$db->beginTransaction();

try {
    // 1. Insertamos la información general en tu tabla `rutina_personalizada`
    $stmt_rutina = $db->prepare("INSERT INTO rutina_personalizada (id_usuario, nombre, frecuencia, descanso) VALUES (?, ?, ?, ?)");
    $stmt_rutina->execute([
        $_SESSION['id_usuario'], // Obtenemos el ID del usuario de la sesión, es más seguro
        $data['nombre'],
        $data['frecuencia'],
        $data['descanso']
    ]);
    $id_rutina_creada = $db->lastInsertId();

    // 2. Insertamos cada día en `rutina_personalizada_dia`
    foreach ($data['dias'] as $dia) {
        $stmt_dia = $db->prepare("INSERT INTO rutina_personalizada_dia (id_rutina, numero_dia, nombre_dia) VALUES (?, ?, ?)");
        $stmt_dia->execute([$id_rutina_creada, $dia['numero_dia'], $dia['nombre_dia']]);
        $id_dia_creado = $db->lastInsertId();

        // 3. Insertamos cada ejercicio de ese día en `rutina_personalizada_ejercicio`
        if (!empty($dia['ejercicios'])) {
            foreach ($dia['ejercicios'] as $i => $ejercicio) {
                $stmt_ejercicio = $db->prepare("INSERT INTO rutina_personalizada_ejercicio (id_dia, grupo_muscular, nombre_ejercicio, series, repeticiones, orden) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt_ejercicio->execute([
                    $id_dia_creado,
                    $ejercicio['grupo_muscular'],
                    $ejercicio['nombre_ejercicio'],
                    $ejercicio['series'],
                    $ejercicio['repeticiones'],
                    $i + 1
                ]);
            }
        }
    }

    // Si todo funcionó, confirmamos los cambios en la base de datos
    $db->commit();
    http_response_code(201); // 201 Creado
    echo json_encode(["mensaje" => "Rutina personalizada creada exitosamente."]);

} catch (Exception $e) {
    // Si algo falló, revertimos todos los cambios
    $db->rollBack();
    http_response_code(503); // Servicio no disponible
    echo json_encode(["mensaje" => "No se pudo crear la rutina en la base de datos.", "error" => $e->getMessage()]);
}
?>