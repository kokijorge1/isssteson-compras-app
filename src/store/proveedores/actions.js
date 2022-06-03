import Http from '@/services/Http';

export default {
  cargarAdquisiciones({ commit }) {
    return new Promise((resolve, reject) => {
      Http.get('/proveedor/adquisiciones').then((res) => {
        commit('SET_ADQUISICIONES', { adquisiciones: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  enviarCotizacion({ commit }, datos) {
    return new Promise((resolve, reject) => {
      Http.post('/proveedor/adquisicion/cotizacion',
        { cotizacion: datos.cotizacion }).then((res) => {
        const data = {
          oldDatos: datos,
          newDatos: res.data,
        };
        commit('ACTULIZAR_ULTIMA_PROPUESTA', { data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  deshacerCotizacion({ commit }, datos) {
    return new Promise((resolve, reject) => {
      Http.post('/proveedor/adquisicion/cotizacion-deshacer/',
        { cotizacion: datos.cotizacion })
        .then((res) => {
          const data = {
            oldDatos: datos,
            newDatos: res.data,
          };
          commit('ACTULIZAR_ULTIMA_PROPUESTA', { data });
          resolve();
        }).catch(err => reject(err));
    });
  },
  anexarCotizacion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const config = {
        header: {
          'Content-Type': 'multipart/form-data',
        },
      };
      Http.post('/proveedor/adquisicion/anexo', payload, config).then((res) => {
        commit('ANEXAR_COTIZACION', { cotizacion: res.data });
        resolve();
      }).catch(err => reject(err));
    });
  },
  declinarAdquisicion({ commit }, payload) {
    return new Promise((resolve, reject) => {
      Http.patch(`/proveedor/adquisicion/declinar/${payload.id}`)
        .then((res) => {
          commit('DECLINAR_ADQUISICION', { adquisicion: res.data });
          resolve(payload);
        }).catch(err => reject(err));
    });
  },
};
