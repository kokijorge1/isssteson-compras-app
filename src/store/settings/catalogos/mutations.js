
export default {
  SET_UNIDADES_ADM: (state, { unidades }) => {
    const estado = state;
    estado.unidadesAdministrativas = unidades;
  },
  AGREGAR_UNIDAD_ADM: (state, { unidadAdministrativa }) => {
    state.unidadesAdministrativas.push(unidadAdministrativa);
  },
  ACTUALIZAR_UNIDAD_ADM: (state, { unidadAdministrativa }) => {
    const index = state.unidadesAdministrativas.findIndex(
      item => item.id === unidadAdministrativa.id,
    );
    state.unidadesAdministrativas.splice(index, 1, unidadAdministrativa);
  },
  BORRAR_UNIDAD_ADM: (state, { payload }) => {
    const index = state.unidadesAdministrativas.findIndex(
      item => item.id === payload.id,
    );
    state.unidadesAdministrativas.splice(index, 1);
  },
  SET_AREAS: (state, { areas }) => {
    const estado = state;
    estado.areas = areas;
  },
  AGREGAR_AREA: (state, { area }) => {
    state.areas.push(area);
  },
  ACTUALIZAR_AREA: (state, { area }) => {
    const index = state.areas.findIndex(
      item => item.id === area.id,
    );
    state.areas.splice(index, 1, area);
  },
  BORRAR_AREA: (state, { payload }) => {
    const index = state.areas.findIndex(
      item => item.id === payload.id,
    );
    state.areas.splice(index, 1);
  },
  SET_PARTIDAS_GENERICAS: (state, { partidasGenericas }) => {
    const estado = state;
    estado.partidasGenericas = partidasGenericas;
  },
  AGREGAR_PARTIDA_GENERICA: (state, { partidaGenerica }) => {
    state.partidasGenericas.push(partidaGenerica);
  },
  ACTUALIZAR_PARTIDA_GENERICA: (state, { partidaGenerica }) => {
    const index = state.partidasGenericas.findIndex(
      item => item.id === partidaGenerica.id,
    );
    state.partidasGenericas.splice(index, 1, partidaGenerica);
  },
  BORRAR_PARTIDA_GENERICA: (state, { payload }) => {
    const index = state.partidasGenericas.findIndex(
      item => item.id === payload.id,
    );
    state.partidasGenericas.splice(index, 1);
  },
  SET_PARTIDAS: (state, { partidas }) => {
    const estado = state;
    estado.partidas = partidas;
  },
  AGREGAR_PARTIDA: (state, { partida }) => {
    state.partidas.push(partida);
  },
  ACTUALIZAR_PARTIDA: (state, { partida }) => {
    const index = state.partidas.findIndex(
      item => item.id === partida.id,
    );
    state.partidas.splice(index, 1, partida);
  },
  BORRAR_PARTIDA: (state, { payload }) => {
    const index = state.partidas.findIndex(
      item => item.id === payload.id,
    );
    state.partidas.splice(index, 1);
  },
  SET_ARTICULOS: (state, { articulos }) => {
    const estado = state;
    estado.articulos = articulos;
  },
  AGREGAR_ARTICULO: (state, { articulo }) => {
    state.articulos.push(articulo);
  },
  ACTUALIZAR_ARTICULO: (state, { articulo }) => {
    const index = state.articulos.findIndex(
      item => item.id === articulo.id,
    );
    state.articulos.splice(index, 1, articulo);
  },
  BORRAR_ARTICULO: (state, { payload }) => {
    const index = state.articulos.findIndex(
      item => item.id === payload.id,
    );
    state.articulos.splice(index, 1);
  },
  SET_PROVEEDORES: (state, { proveedores }) => {
    const estado = state;
    estado.proveedores = proveedores;
  },
  AGREGAR_PROVEEDOR: (state, { proveedor }) => {
    state.proveedores.push(proveedor);
  },
  ACTUALIZAR_PROVEEDORES: (state, { proveedor }) => {
    const index = state.proveedores.findIndex(
      item => item.id === proveedor.id,
    );
    state.proveedores.splice(index, 1, proveedor);
  },
  BORRAR_PROVEEDORES: (state, { payload }) => {
    const index = state.proveedores.findIndex(
      item => item.id === payload.id,
    );
    state.proveedores.splice(index, 1);
  },
  SET_USUARIOS: (state, { usuarios }) => {
    const estado = state;
    estado.usuarios = usuarios;
  },
  AGREGAR_USUARIO: (state, { usuario }) => {
    state.usuarios.push(usuario);
  },
  ACTUALIZAR_USUARIO: (state, { usuario }) => {
    const index = state.usuarios.findIndex(
      item => item.id === usuario.id,
    );
    state.usuarios.splice(index, 1, usuario);
  },
  BORRAR_USUARIO: (state, { payload }) => {
    const index = state.usuarios.findIndex(
      item => item.id === payload.id,
    );
    state.usuarios.splice(index, 1);
  },
  SET_TIPO_REQUISICIONES: (state, { tipoRequisiciones }) => {
    const estado = state;
    estado.tipoRequisiciones = tipoRequisiciones;
  },
  AGREGAR_TIPO_REQUISICION: (state, { tipoRequisicion }) => {
    state.tipoRequisiciones.push(tipoRequisicion);
  },
  ACTUALIZAR_TIPO_REQUISICION: (state, { tipoRequisicion }) => {
    const index = state.tipoRequisiciones.findIndex(
      item => item.id === tipoRequisicion.id,
    );
    state.tipoRequisiciones.splice(index, 1, tipoRequisicion);
  },
  BORRAR_TIPO_REQUISICION: (state, { payload }) => {
    const index = state.tipoRequisiciones.findIndex(
      item => item.id === payload.id,
    );
    state.tipoRequisiciones.splice(index, 1);
  },
  LIMPIAR: (state) => {
    const estado = state;
    estado.usuarios = [];
    estado.unidadesAdministrativas = [];
    estado.areas = [];
    estado.tipoRequisiciones = [];
  },
  // SOCKET_AGREGAR_CATALOGO_PARTIDA_GENERICA: (state, payload) => {
  //   if (payload.idUsuario === Vue.auth.user().id) return;
  //   if (!payload.partidaGenerica) return;
  //   state.partidasGenericas.push(payload.partidaGenerica);
  // },
  // SOCKET_AGREGAR_CATALOGO_PARTIDA: (state, payload) => {
  //   if (payload.idUsuario === Vue.auth.user().id) return;
  //   if (!payload.partida) return;
  //   state.partidas.push(payload.partida);
  // },
  // SOCKET_AGREGAR_CATALOGO_ARTICULO: (state, payload) => {
  //   if (payload.idUsuario === Vue.auth.user().id) return;
  //   if (!payload.articulo) return;
  //   state.articulos.push(payload.articulo);
  // },
  // SOCKET_AGREGAR_CATALOGO_PROVEEDOR: (state, payload) => {
  //   if (payload.idUsuario === Vue.auth.user().id) return;
  //   if (!payload.proveedor) return;
  //   state.proveedores.push(payload.proveedor);
  // },
};
