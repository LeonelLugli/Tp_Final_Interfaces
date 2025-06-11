<?php
// Incluimos el archivo de conexión que acabamos de crear
include_once '../../config/database.php';

// Creamos una instancia de la base de datos y obtenemos la conexión
$database = new Database();
$db = $database->getConnection();

// Leemos los datos enviados desde el frontend en formato JSON
$data = json_decode(file_get_contents("php://input"));

// Verificamos que los datos necesarios no estén vacíos
if (!empty($data->nombre) && !empty($data->email) && !empty($data->contrasena)) {
    
    // Antes de registrar, verificamos que el email no exista
    $query_check = "SELECT id_usuario FROM usuarios WHERE email = :email";
    $stmt_check = $db->prepare($query_check);
    
    // Limpiamos el email para seguridad
    $email_sanitized = htmlspecialchars(strip_tags($data->email));
    $stmt_check->bindParam(":email", $email_sanitized);
    $stmt_check->execute();

    if($stmt_check->rowCount() > 0) {
        // Si el email ya existe, enviamos un error de "Conflicto"
        http_response_code(409); 
        echo json_encode(array("mensaje" => "El correo electrónico ya está registrado."));
        return; // Detenemos la ejecución
    }

    // Si el email no existe, preparamos la consulta para insertar el nuevo usuario
    $query = "INSERT INTO usuarios (nombre, email, contrasena) VALUES (:nombre, :email, :contrasena)";
    $stmt = $db->prepare($query);

    // Limpiamos los datos para evitar ataques
    $nombre = htmlspecialchars(strip_tags($data->nombre));
    $email = htmlspecialchars(strip_tags($data->email));
    // ¡IMPORTANTE! Hasheamos la contraseña para no guardarla como texto plano
    $contrasena_hash = password_hash($data->contrasena, PASSWORD_BCRYPT);

    // Vinculamos los datos limpios a la consulta
    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":contrasena", $contrasena_hash);

    // Ejecutamos la consulta
    if ($stmt->execute()) {
        // Si la inserción fue exitosa, enviamos un código de "Creado"
        http_response_code(201);
        echo json_encode(array("mensaje" => "Usuario creado exitosamente."));
    } else {
        // Si hubo un error en el servidor
        http_response_code(503);
        echo json_encode(array("mensaje" => "No se pudo crear el usuario."));
    }
} else {
    // Si faltan datos en la petición
    http_response_code(400);
    echo json_encode(array("mensaje" => "Datos incompletos. Se requiere nombre, email y contraseña."));
}
?>