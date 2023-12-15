const usuarioRouter = require("express").Router()
const { faker } = require("@faker-js/faker")
const Usuarios = require("../model/usuario.model");
const usuariosController = require('../controllers/usuario.controllers'); 
const { request } = require("express");
const verificarToken = require("../middleware/authMiddleware").verificarToken;
const obtenerPermisos = require('../permisos/permisos');
const { validacionesInputs, validacionLogin } = require('../validaciones/usuariosValidaciones')
const permisos = require('../permisos/permisos');
const { capturarToken } = require("../middleware/tokenMiddleware");

// aca defino una constante con el nombre del controlador de la ruta, y la envio a permisos.js por parametro con el fin
// de saber que permiso tiene el usuario logueado:

const permisoCrear = "crearUsuario";
const permisoActualizar = "actualizarUsuario";
const permisoActualizarPorID = "actualizarUsuarioPorID"
const permisoObtenerTodos = "obtenerTodosLosUsuarios";
const permisoObtenerPorID = "obtenerUsuarioPorID";
const permisoEliminar = "eliminarUsuario";


// RUTAS:


usuarioRouter.get("/usuarios/obtenerTodosLosUsuarios", verificarToken, permisos.obtenerPermisos(permisoObtenerTodos), usuariosController.obtenerTodosLosUsuarios);

usuarioRouter.get("/usuarios/obtenerUsuarioPorID",  verificarToken, permisos.obtenerPermisos(permisoObtenerPorID),usuariosController.obtenerUsuarioPorID);

usuarioRouter.post("/usuarios/crearUsuario", verificarToken, permisos.obtenerPermisos(permisoCrear), validacionesInputs, usuariosController.crearUsuario);

usuarioRouter.put("/usuarios/actualizarUsuario", verificarToken, permisos.obtenerPermisos(permisoActualizar), usuariosController.actualizarUsuario);

usuarioRouter.put("/usuarios/actualizarUsuarioPorID", verificarToken, permisos.obtenerPermisos(permisoActualizarPorID), usuariosController.actualizarUsuarioPorID);

usuarioRouter.delete("/usuarios/eliminarUsuario", verificarToken, permisos.obtenerPermisos(permisoEliminar), usuariosController.eliminarUsuario);

usuarioRouter.post("/login", validacionLogin, usuariosController.login);

usuarioRouter.post('/reestablecer', usuariosController.enviarToken);

usuarioRouter.post("/reestablecerPass/:token", capturarToken, usuariosController.actualizarPass);


module.exports = usuarioRouter; 