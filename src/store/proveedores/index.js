import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const proveedores = {
  namespaced: true,
  state: {
    listado: [],
  },
  actions,
  mutations,
  getters,
};

export default proveedores;
