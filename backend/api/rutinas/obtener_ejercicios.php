<?php
// Incluimos el archivo de conexión a la base de datos
// Usamos ../../ para subir dos niveles de carpetas (de rutinas a api, y de api a backend)
include_once '../../config/database.php';

// Instanciamos la base de datos para obtener la conexión
$database = new Database();
$db = $database->getConnection();

// Preparamos la consulta SQL para obtener todos los ejercicios
$query = "SELECT id_ejercicio, nombre_ejercicio, grupo_muscular FROM ejercicios ORDER BY nombre_ejercicio ASC";

// Preparamos la declaración de la consulta
$stmt = $db->prepare($query);

// Ejecutamos la consulta
$stmt->execute();

// Verificamos si se encontraron resultados
$num = $stmt->rowCount();

if($num > 0) {
    // Si hay ejercicios, los preparamos para devolver en formato JSON
    $ejercicios_arr = array();

    // Recorremos los resultados de la tabla
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // Extraemos la fila para hacerla más legible
        extract($row);
        
        $ejercicio_item = array(
            "id" => $id_ejercicio,
            "nombre" => $nombre_ejercicio,
            "grupo_muscular" => $grupo_muscular
        );

        // Agregamos cada ejercicio al array de ejercicios
        array_push($ejercicios_arr, $ejercicio_item);
    }

    // Establecemos el código de respuesta HTTP - 200 OK
    http_response_code(200);

    // Convertimos nuestro array de PHP a formato JSON y lo mostramos
    echo json_encode($ejercicios_arr);

} else {
    // Si no se encontraron ejercicios
    // Establecemos el código de respuesta HTTP - 404 Not Found
    http_response_code(404);

    // Mostramos un mensaje de error
    echo json_encode(
        array("mensaje" => "No se encontraron ejercicios.")
    );
}
?>