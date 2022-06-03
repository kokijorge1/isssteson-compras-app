import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const portal = {
  namespaced: true,
  state: {
    adquisiciones: [],
    proveedores: [],
  },
  actions,
  mutations,
  getters,
};

export default portal;
