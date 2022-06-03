import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const requisiciones = {
  namespaced: true,
  state: {
    requisiciones: [],
    filtros: {
      unidadAdm: '',
      area: '',
      estatus: 999,
      searchText: '',
    },
  },
  actions,
  mutations,
  getters,
};

export default requisiciones;
