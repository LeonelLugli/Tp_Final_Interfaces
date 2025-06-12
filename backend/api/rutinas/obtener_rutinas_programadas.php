<?php
session_start();

header("Access-Control-Allow-Origin:https://myproyectTPinterfaces.infy.uk");
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

try {
    $stmt = $db->prepare("
        SELECT 
            rp.id_programacion,
            rp.fecha_inicio,
            r.id_rutina,
            r.nombre_rutina,
            r.tipo,
            r.frecuencia
        FROM rutina_programada rp
        JOIN rutinas r ON rp.id_rutina = r.id_rutina
        WHERE rp.id_usuario = :id_usuario
    ");

    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->execute();

    $programadas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $eventos = [];

    foreach ($programadas as $prog) {
        $startDate = new DateTime($prog['fecha_inicio']);
        $frecuencia = $prog['frecuencia'];
        $id_rutina = $prog['id_rutina'];
        $nombre_rutina = $prog['nombre_rutina'];
        $tipo = $prog['tipo'];

        $schedule = [];
        // Define los días de entrenamiento relativo al día de inicio (0 = mismo día)
        if (str_contains($frecuencia, '3')) { // Full Body (3 días)
            $schedule = [0, 2, 4];
        } elseif (str_contains($frecuencia, '4')) { // Torso/Pierna (4 días)
            $schedule = [0, 1, 3, 4];
        } elseif (str_contains($frecuencia, '6')) { // Push/Pull/Legs (6 días)
            $schedule = [0, 1, 2, 3, 4, 5];
        } elseif ($frecuencia === 'full-body') { // Casa Full Body (asumimos 2 o 3 días)
             $schedule = [0, 2, 4]; // Lunes, Miercoles, Viernes
        } else if ($frecuencia === 'upper-lower') { // Casa Torso/Pierna (asumimos 4 días)
            $schedule = [0, 1, 3, 4]; // Lunes, Martes, Jueves, Viernes
        }


        foreach ($schedule as $dayIndex => $dayOffset) {
            $eventDate = clone $startDate;
            $eventDate->modify("+$dayOffset days");

            $eventos[] = [
                'id' => $id_rutina,
                'title' => $nombre_rutina,
                'start' => $eventDate->format('Y-m-d'),
                'backgroundColor' => $tipo === 'gimnasio' ? '#00b4d8' : '#ff6b6b',
                'borderColor' => $tipo === 'gimnasio' ? '#0077b6' : '#e55353',
                'extendedProps' => [
                    'tipo' => $tipo,
                    'frecuencia' => $frecuencia,
                    'dayIndex' => $dayIndex // El índice del día (0 para el primer día, 1 para el segundo, etc.)
                ]
            ];
        }
    }

    http_response_code(200);
    echo json_encode($eventos);

} catch (Exception $e) {
    http_response_code(503);
    echo json_encode(["success" => false, "mensaje" => "Error del servidor.", "error" => $e->getMessage()]);
}
?>