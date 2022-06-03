import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const catalogos = {
  namespaced: true,
  state: {
    usuarios: [],
    unidadesAdministrativas: [],
    areas: [],
    partidasGenericas: [],
    partidas: [],
    articulos: [],
    proveedores: [],
    tipoRequisiciones: [],
    paa: [],
  },
  actions,
  mutations,
  getters,
};

export default catalogos;
