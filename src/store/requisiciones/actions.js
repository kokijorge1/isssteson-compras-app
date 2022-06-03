import Http from '@/services/Http';

export default {
  cargarRequisiciones({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/requisiciones').then((res) => {
        commit('SET_REQUISICIONES', { requisiciones: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  agregarRequisicion({ commit }, requisicion) {
    return new Promise((resolve, reject) => {
      Http.post('/requisiciones', { requisicion }).then((res) => {
        commit('AGREGAR_REQUISICION', { requisicion: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  actulizarRequisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/requisiciones/${payload.id}`, { requisicion: payload.requisicion }).then((res) => {
        commit('ACTUALIZAR_REQUISICION', { requisicion: res.data });
        resolve(res.data);
      }).catch(err => reject(err));
    });
  },
  agregarArticuloRequisicion({ commit }, payload) {
    const articulos = [];
    articulos.push(payload.articulo);
    return new Promise((resolve, reject) => {
      Http.post(`/requisiciones/${payload.requisicion}/articulos`,
        { articulos }).then((res) => {
        commit('AGREGAR_ARTICULO_REQUISICION',
          { idRequisicion: payload.requisicion, articulo: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  autorizarRequisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/requisiciones/${payload}/autorizar`).then((res) => {
        commit('ACTUALIZAR_REQUISICION', { requisicion: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  cancelarRequisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/requisiciones/${payload.id_requisicion}/cancelar`,
        { observaciones: payload.observaciones }).then((res) => {
        commit('ACTUALIZAR_REQUISICION', { requisicion: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  borrarArticuloRequisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.delete(`/requisiciones/articulos/${payload.id}`).then(() => {
        commit('BORRAR_ARTICULO_REQUISICION', { payload });
        resolve();
      }).catch(err => reject(err));
    });
  },
};
