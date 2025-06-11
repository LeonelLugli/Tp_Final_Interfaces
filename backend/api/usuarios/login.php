<?php
// Iniciamos la sesión para poder guardar los datos del usuario que se loguea.
session_start();

// Incluimos la configuración de la base de datos y los headers
include_once '../../config/database.php';

// Instanciamos la base de datos
$database = new Database();
$db = $database->getConnection();

// Obtenemos los datos del frontend (email y contraseña)
$data = json_decode(file_get_contents("php://input"));

// Verificamos que los datos no estén vacíos
if (!empty($data->email) && !empty($data->contrasena)) {
    
    $query = "SELECT id_usuario, nombre, email, contrasena FROM usuarios WHERE email = :email LIMIT 1";

    $stmt = $db->prepare($query);

    // Limpiamos el email para seguridad
    $email = htmlspecialchars(strip_tags($data->email));
    $stmt->bindParam(':email', $email);

    $stmt->execute();
    $num = $stmt->rowCount();

    // Si encontramos un usuario con ese email
    if ($num > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $id_usuario = $row['id_usuario'];
        $nombre = $row['nombre'];
        $contrasena_hash = $row['contrasena'];

        // Verificamos que la contraseña enviada coincida con la guardada en la base de datos
        if (password_verify($data->contrasena, $contrasena_hash)) {
            
            // La contraseña es correcta. Guardamos los datos en la sesión del servidor.
            $_SESSION['id_usuario'] = $id_usuario;
            $_SESSION['nombre_usuario'] = $nombre;
            
            // Enviamos una respuesta OK (200) al frontend con los datos del usuario
            http_response_code(200);
            echo json_encode(array(
                "mensaje" => "Inicio de sesión exitoso.",
                "usuario" => array(
                    "id" => $id_usuario,
                    "nombre" => $nombre,
                    "email" => $email
                )
            ));

        } else {
            // Error: Contraseña incorrecta
            http_response_code(401); // No autorizado
            echo json_encode(array("mensaje" => "Contraseña incorrecta."));
        }
    } else {
        // Error: No se encontró el usuario
        http_response_code(404); // No encontrado
        echo json_encode(array("mensaje" => "El usuario no existe."));
    }
} else {
    // Error: Faltan datos
    http_response_code(400); // Petición incorrecta
    echo json_encode(array("mensaje" => "Faltan email o contraseña."));
}
?>