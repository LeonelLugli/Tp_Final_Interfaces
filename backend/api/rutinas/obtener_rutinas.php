<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir archivos de conexión
include_once '../../config/database.php';

// Conectar a la base de datos
$database = new Database();
$db = $database->getConnection();

// --- LEER FILTROS DE LA URL ---
$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : 'casa';
$frecuencia = isset($_GET['frecuencia']) ? $_GET['frecuencia'] : 'full-body';
$nivel = isset($_GET['nivel']) ? $_GET['nivel'] : 'principiante';

// --- CONSTRUIR LA CONSULTA SQL ---
$query = "SELECT r.id_rutina, r.nombre_rutina, r.descripcion, r.frecuencia, r.nivel, re.series, re.repeticiones, re.orden, re.dia, e.nombre_ejercicio
          FROM rutinas r
          LEFT JOIN rutina_ejercicios re ON r.id_rutina = re.id_rutina
          LEFT JOIN ejercicios e ON re.id_ejercicio = e.id_ejercicio
          WHERE 1=1";

if (!empty($tipo)) {
    $query .= " AND r.tipo = :tipo";
}
if (!empty($frecuencia)) {
    $query .= " AND r.frecuencia = :frecuencia";
}
if (!empty($nivel)) {
    $query .= " AND r.nivel = :nivel";
}

$query .= " ORDER BY r.id_rutina, re.dia, re.orden";

$stmt = $db->prepare($query);

if (!empty($tipo)) {
    $stmt->bindParam(':tipo', $tipo);
}
if (!empty($frecuencia)) {
    $stmt->bindParam(':frecuencia', $frecuencia);
}
if (!empty($nivel)) {
    $stmt->bindParam(':nivel', $nivel);
}

$stmt->execute();
$num = $stmt->rowCount();

if($num > 0) {
    $rutinas_arr = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $id_rutina = $row['id_rutina'];

        // Si la rutina aún no está en nuestro array, la inicializamos
        if (!isset($rutinas_arr[$id_rutina])) {
            $rutinas_arr[$id_rutina] = [
                "title" => $row['nombre_rutina'],
                "frequency" => $row['frecuencia'],
                "rest" => $row['descripcion'],
                "days" => []
            ];
        }

        // Solo agregamos días y ejercicios si existen
        if ($row['dia'] !== null && $row['nombre_ejercicio'] !== null) {
            $dia = $row['dia'];
            $nombre_dia = "Día " . $dia;

            if (!isset($rutinas_arr[$id_rutina]['days'][$nombre_dia])) {
                $rutinas_arr[$id_rutina]['days'][$nombre_dia] = [
                    "name" => $nombre_dia,
                    "exercises" => []
                ];
            }
            $rutinas_arr[$id_rutina]['days'][$nombre_dia]['exercises'][] = $row['nombre_ejercicio'] . " (" . $row['series'] . "x" . $row['repeticiones'] . ")";
        }
    }

    // Re-indexamos los arrays para que el JSON final sea limpio
    $final_response = array_values($rutinas_arr);
    foreach($final_response as &$rutina) {
        $rutina['days'] = array_values($rutina['days']);
    }

    http_response_code(200);
    echo json_encode($final_response);

} else {
    http_response_code(404);
    echo json_encode(array("mensaje" => "No se encontraron rutinas con esos filtros."));
}
?>