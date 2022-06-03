import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const adquisiciones = {
  namespaced: true,
  state: {
    listado: [],
    filtros: {
      tipo: '',
      estatus: 0,
      searchText: '',
    },
    tipos: [
      {
        id: '', texto: 'Todos',
      },
      { id: 'AD', texto: 'Adjudicación Directa' },
      { id: 'IR', texto: 'Licitación Restringida' },
      { id: 'LP', texto: 'Licitación Publica' },
    ],
  },
  actions,
  mutations,
  getters,
};

export default adquisiciones;
