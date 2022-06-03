import Http from '@/services/Http';

export default {
  async cargarCatalogos({ dispatch }) {
    try {
      return await Promise.all([
        dispatch('cargarUnidadesAdm'),
        dispatch('cargarAreas'),
        dispatch('cargarPartidasGenericas'),
        dispatch('cargarPartidas'),
        dispatch('cargarArticulos'),
        dispatch('cargarProveedores'),
        dispatch('cargarUsuarios'),
        dispatch('cargarTipoRequisiciones'),
      ]);
    } catch (e) {
      return Promise.reject(e.message);
    }
  },
  cargarUnidadesAdm({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/settings/catalogos/unidadesadministrativas').then((res) => {
        commit('SET_UNIDADES_ADM', { unidades: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarUnidadAdm({ commit }, unidadAdministrativa) {
    return new Promise((resolve, reject) => {
      Http.post('/settings/catalogos/unidadesadministrativas',
        { unidadAdministrativa }).then((res) => {
        commit('AGREGAR_UNIDAD_ADM', { unidadAdministrativa: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarUnidadAdm({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/settings/catalogos/unidadesadministrativas/${payload.id}`,
        { unidadAdministrativa: payload.unidadAdministrativa }).then((res) => {
        commit('ACTUALIZAR_UNIDAD_ADM', { unidadAdministrativa: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  borrarUnidadAdm({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/settings/catalogos/unidadesadministrativas/${payload.id}`).then(() => {
        commit('BORRAR_UNIDAD_ADM', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
  cargarAreas({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/settings/catalogos/areas').then((res) => {
        commit('SET_AREAS', { areas: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarArea({ commit }, area) {
    return new Promise((resolve, reject) => {
      Http.post('/settings/catalogos/areas', { area }).then((res) => {
        commit('AGREGAR_AREA', { area: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarArea({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/settings/catalogos/areas/${payload.id}`,
        { area: payload.area }).then((res) => {
        commit('ACTUALIZAR_AREA', { area: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  borrarArea({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/settings/catalogos/areas/${payload.id}`).then(() => {
        commit('BORRAR_AREA', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
  cargarPartidasGenericas({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/settings/catalogos/partidasgenericas').then((res) => {
        commit('SET_PARTIDAS_GENERICAS', { partidasGenericas: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarPartidaGenerica({ commit }, partidaGenerica) {
    return new Promise((resolve, reject) => {
      Http.post('/settings/catalogos/partidasgenericas', { partidaGenerica }).then((res) => {
        commit('AGREGAR_PARTIDA_GENERICA', { partidaGenerica: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarPartidaGenerica({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/settings/catalogos/partidasgenericas/${payload.id}`,
        { partidaGenerica: payload.partidaGenerica }).then((res) => {
        commit('ACTUALIZAR_PARTIDA_GENERICA', { partidaGenerica: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  borrarPartidaGenerica({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/settings/catalogos/partidasgenericas/${payload.id}`).then(() => {
        commit('BORRAR_PARTIDA_GENERICA', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
  cargarPartidas({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/settings/catalogos/partidas').then((res) => {
        commit('SET_PARTIDAS', { partidas: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarPartida({ commit }, partida) {
    return new Promise((resolve, reject) => {
      Http.post('/settings/catalogos/partidas', { partida }).then((res) => {
        commit('AGREGAR_PARTIDA', { partida: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarPartida({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/settings/catalogos/partidas/${payload.id}`,
        { partida: payload.partida }).then((res) => {
        commit('ACTUALIZAR_PARTIDA', { partida: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  borrarPartida({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/settings/catalogos/partidas/${payload.id}`).then(() => {
        commit('BORRAR_PARTIDA', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
  cargarArticulos({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/settings/catalogos/articulos').then((res) => {
        commit('SET_ARTICULOS', { articulos: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  getArticulo({ commit }, { payload }) {
    return new Promise((resolve, reject) => {
      Http.get(`/settings/catalogos/articulos/${payload.id}`).then((res) => {
        commit('ACTUALIZAR_ARTICULO', { articulo: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  agregarArticulo({ commit }, articulo) {
    return new Promise((resolve, reject) => {
      Http.post('/settings/catalogos/articulos', { articulo }).then((res) => {
        commit('AGREGAR_ARTICULO', { articulo: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarArticulo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/settings/catalogos/articulos/${payload.id}`,
        { articulo: payload.articulo }).then((res) => {
        commit('ACTUALIZAR_ARTICULO', { articulo: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  agregarClaveUnidadArticulo({ dispatch }, articuloClaveUnidad) {
    return new Promise((resolve, reject) => {
      Http.post('/settings/catalogos/articulos/clavesunidades',
        { articuloClaveUnidad }).then(async () => {
        const articulo = await dispatch('getArticulo',
          {
            payload: {
              id: articuloClaveUnidad.id_articulo,
            },
          }).then(resp => resp)
          .catch(errr => errr);
        resolve(articulo);
      }).catch(err => reject(err));
    });
  },
  borrarClaveUnidadArticulo({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/settings/catalogos/articulos/clavesunidades/${payload.id}`).then(async () => {
        const articulo = await dispatch('getArticulo',
          {
            payload: {
              id: payload.id_articulo,
            },
          }).then(resp => resp)
          .catch(errr => errr);
        resolve(articulo);
      }).catch(err => reject(err));
    });
  },
  borrarArticulo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/settings/catalogos/articulos/${payload.id}`).then(() => {
        commit('BORRAR_ARTICULO', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
  cargarProveedores({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/settings/catalogos/proveedores').then((res) => {
        commit('SET_PROVEEDORES', { proveedores: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarProveedor({ commit }, nuevoProveedor) {
    return new Promise((resolve, reject) => {
      // '/settings/catalogos/proveedores'
      Http.post('/settings/catalogos/proveedor-usuario', { proveedor: nuevoProveedor })
        .then((res) => {
          const { usuario, proveedor } = res.data;
          commit('AGREGAR_PROVEEDOR', { proveedor });
          commit('AGREGAR_USUARIO', { usuario });
          resolve(res.data);
        })
        .catch(err => reject(err));
    });
  },
  actulizarProveedor({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/settings/catalogos/proveedores/${payload.id}`,
        { proveedor: payload.proveedor }).then((res) => {
        commit('ACTUALIZAR_PROVEEDORES', { proveedor: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  borrarProveedor({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/settings/catalogos/proveedores/${payload.id}`).then(() => {
        commit('BORRAR_PROVEEDORES', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
  cargarUsuarios({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/usuarios').then((res) => {
        commit('SET_USUARIOS', { usuarios: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarUsuario({ commit }, usuario) {
    return new Promise((resolve, reject) => {
      Http.post('/usuarios', { usuario }).then((res) => {
        commit('AGREGAR_USUARIO', { usuario: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarUsuario({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/usuarios/${payload.id}`,
        { usuario: payload.usuario }).then((res) => {
        commit('ACTUALIZAR_USUARIO', { usuario: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  borrarUsuario({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/usuarios/${payload.id}`).then(() => {
        commit('BORRAR_USUARIO', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
  cargarTipoRequisiciones({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/settings/catalogos/tiposrequisiciones').then((res) => {
        commit('SET_TIPO_REQUISICIONES', { tipoRequisiciones: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarTipoRequisicion({ commit }, tipoRequisicion) {
    return new Promise((resolve, reject) => {
      Http.post('/settings/catalogos/tiposrequisiciones', { tipoRequisicion }).then((res) => {
        commit('AGREGAR_TIPO_REQUISICION', { tipoRequisicion: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarTipoRequisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/settings/catalogos/tiposrequisiciones/${payload.id}`,
        { tipoRequisicion: payload.tipoRequisicion })
        .then((res) => {
          commit('ACTUALIZAR_TIPO_REQUISICION', { tipoRequisicion: res.data });
          resolve(res.data);
        }).catch(err => reject(err));
    });
  },
  borrarTipoRequisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/settings/catalogos/tiposrequisiciones/${payload.id}`).then(() => {
        commit('BORRAR_TIPO_REQUISICION', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
};
