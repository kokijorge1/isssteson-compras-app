export default {
  requisiciones: state => state.requisiciones,
  autorizadas: state => state.requisiciones.filter(item => item.estatus === 1),
  requisicion: state => id => state.requisiciones.find(item => item.id === id),
  filtros: state => state.filtros,
};
