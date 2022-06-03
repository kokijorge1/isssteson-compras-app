export default {
  adquisiciones: state => state.listado,
  adquisicion: state => id => state.listado.find(item => item.id === id),
  articulos: (state, getters) => id => getters.adquisicion(id).articulos,
};
