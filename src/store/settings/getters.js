export default {
  usuariosConectados: state => state.usuariosConectados,
  soloProveedoresConectados: (state, getters) => getters.usuariosConectados
    .filter(usuario => usuario.roles === 'proveedor'),
};
