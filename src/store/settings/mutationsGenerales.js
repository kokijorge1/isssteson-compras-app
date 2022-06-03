export default {
  CAMBIAR_IS_CARGANDO: (state) => {
    const estado = state;
    estado.isCargando = !estado.isCargando;
  },
  MOSTRAR_RESPUESTA: (state, { respuesta }) => {
    const estado = state;
    estado.respuesta.mostrar = respuesta.mostrar;
    estado.respuesta.color = respuesta.color;
    estado.respuesta.texto = respuesta.texto;
  },
  CAMBIAR_DARK_MODE: (state) => {
    const estado = state;
    estado.darkMode = !estado.darkMode;
  },
  CAMBIAR_FLUID_CONTENIDO: (state) => {
    const estado = state;
    estado.fluid = !estado.fluid;
  },
  CAMBIAR_PASSWORD: (state) => {
    const estado = state;
    estado.cambiarPassword = !state.cambiarPassword;
  },
  ACTUALIZAR_USUARIOS_CONECTADOS: (state, { usuarios }) => {
    const estado = state;
    estado.usuariosConectados = usuarios;
  },
};
