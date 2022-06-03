import Http from '@/services/Http';

export default {
  async cargarPortal({ dispatch }) {
    try {
      return await Promise.all([
        dispatch('cargarAdquisiciones'),
        dispatch('cargarProveedores'),
      ]);
    } catch (e) {
      return Promise.reject(e.message);
    }
  },
  cargarAdquisiciones({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/portal/adquisiciones').then((res) => {
        commit('SET_ADQUISICIONES', { adquisiciones: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  cargarProveedores({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/portal/listado/proveedores').then((res) => {
        commit('SET_PROVEEDORES', { proveedores: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
};
