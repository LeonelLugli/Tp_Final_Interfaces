<?php
// Headers para permitir que tu frontend se comunique con este backend (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Database {
    private $host = "localhost";
    private $db_name = "fitness_pwa"; // El nombre que le diste a tu base de datos
    private $username = "root";       // Tu usuario de MySQL (usualmente 'root')
    private $password = "";          // Tu contraseña de MySQL (usualmente vacía en XAMPP)
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>