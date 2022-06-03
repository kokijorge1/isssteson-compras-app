import mutations from './mutationsGenerales';
import getters from './getters';

const generales = {
  namespaced: true,
  state: {
    respuesta: {
      mostrar: false,
      texto: '',
      color: '',

    },
    fluid: true,
    isCargando: false,
    darkMode: false,
    cambiarPassword: false,
    usuariosConectados: [],
  },
  mutations,
  getters,
};

export default generales;
