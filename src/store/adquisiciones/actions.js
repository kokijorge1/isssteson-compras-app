import Http from '@/services/Http';

export default {
  cargarAdquisiciones({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/adquisiciones').then((res) => {
        commit('SET_ADQUISICIONES', { adquisiciones: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarAdquisicion({ commit }, adquisicion) {
    return new Promise((resolve, reject) => {
      Http.post('/adquisiciones', { adquisicion }).then((res) => {
        commit('AGREGAR_ADQUISICION', { adquisicion: res.data });
        commit('requisiciones/ACTUALIZAR_REQUISICIONES_ESTATUS',
          { requisiciones: adquisicion.requisiciones }, { root: true });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarAdquisicion({ commit }, adquisicion) {
    return new Promise((resolve, reject) => {
      Http.patch(`/adquisiciones/${adquisicion.id}`,
        { adquisicion: adquisicion.datos }).then((res) => {
        commit('ACTUALIZAR_ADQUISICION', { adquisicion: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarAdquisicionJustificacion({ commit }, adquisicion) {
    return new Promise((resolve, reject) => {
      Http.patch(`/adquisiciones/${adquisicion.id}/justificacion`,
        { adquisicion: adquisicion.datos }).then((res) => {
        commit('ACTUALIZAR_ADQUISICION', { adquisicion: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  invitarProveedores({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.post('/adquisiciones/participantes',
        { participantes: payload.participantes }).then((res) => {
        const datos = {
          idAdquisicion: payload.id,
          participantes: res.data,
        };
        commit('AGREGAR_PROVEEDORES', { payload: datos });
        resolve();
      }).catch(err => reject(err));
    });
  },
  removerParticipante({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/adquisiciones/participantes/${payload.id_registro}`,
        payload).then(() => {
        commit('REMOVER_PARTICIPANTE', { payload });
        resolve();
      }).catch(err => reject(err));
    });
  },
  adjudicarArticulo({ commit }, cotizacion) {
    return new Promise((resolve, reject) => {
      Http.patch(`/adquisiciones/adjudicar/${cotizacion.id}`,
        {
          adjudicada: cotizacion.adjudicada,
          id_adquisicion_articulo: cotizacion.id_adquisicion_articulo,
          datosAdjudicados: cotizacion.datosAdjudicados,
        }).then((res) => {
        commit('ACTUALIZAR_COTIZACIONES_ARTICULO', { datos: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  adjudicarArticulosProveedor({ commit }, datos) {
    return new Promise((resolve, reject) => {
      Http.patch(`/adquisiciones/adjudicar/proveedor/${datos.id_adquisicion}`,
        { id_proveedor: datos.id_proveedor }).then((res) => {
        commit('ACTUALIZAR_ARTICULOS_ADQUISICION', { datos: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  enviarCorreoInvitacion({ commit }, idAdquisicion) {
    return new Promise((resolve, reject) => {
      Http.get(`/adquisiciones/proveedores/invitacion/${idAdquisicion}`)
        .then((res) => {
          const datos = {
            idAdquisicion,
            invitacion: res.data,
          };
          commit('ACTUALIZAR_DATOS_CORREOS_INVITACION', { datos });
          resolve();
        }).catch(err => reject(err));
    });
  },
  borrarArticuloAdquisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/adquisiciones/articulos/${payload.id}`).then(() => {
        commit('BORRAR_ARTICULO_ADQUISICION', { payload });
        resolve(payload);
      }).catch(err => reject(err));
    });
  },
  borrarRequisicionAdquisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/adquisiciones/requisiciones/${payload.id}`).then(() => {
        commit('BORRAR_ARTICULO_ADQUISICION', { payload });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarRequisiciones({ commit }, dataFormat) {
    return new Promise((resolve, reject) => {
      Http.post(`/adquisiciones/requisiciones/${dataFormat.id_adquisicion}`,
        dataFormat.data).then((res) => {
        commit('ACTUALIZAR_ADQUISICION', { adquisicion: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarArticulo({ commit }, datos) {
    return new Promise((resolve, reject) => {
      Http.post(`/adquisiciones/articulos/${datos.id_adquisicion}`,
        { articulo: datos.data }).then((res) => {
        commit('ACTUALIZAR_ADQUISICION', { adquisicion: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  cargarProveedores({ commit }, datos) {
    return new Promise((resolve, reject) => {
      Http.get(`/adquisiciones/${datos.id_adquisicion}/participantes`).then((res) => {
        commit('SET_PROVEEDORES', {
          datos:
          { data: res.data, idAdquisicion: datos.id_adquisicion },
        });
        resolve();
      }).catch(err => reject(err));
    });
  },
  posturaInicial(_, { cotizacion }) {
    return new Promise((resolve, reject) => {
      Http.post('/adquisiciones/postura-inicial', { cotizacion })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },
  borrarAnexoAdquisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/adquisiciones/anexos/${payload.id}`)
        .then(() => {
          commit('REMOVER_ANEXO', { payload });
          resolve();
        }).catch(err => reject(err));
    });
  },
};
