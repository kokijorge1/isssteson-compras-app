export default {
  unidadesAdministrativas: state => state.unidadesAdministrativas,
  unidad: state => id => state.unidadesAdministrativas.find(item => item.id === id),
  areas: state => state.areas,
  area: state => id => state.areas.find(area => area.id === id),
  areasByUnidad: state => (idUnidad) => {
    if (!idUnidad) return [];
    return state.areas
      .filter(item => item.unidad_administrativa.id === idUnidad);
  },
  partidasGenericas: state => state.partidasGenericas,
  partidaGenerica: state => id => state.partidasGenericas.find(item => item.id === id),
  partidas: state => state.partidas,
  partida: state => id => state.partidas.find(partida => partida.id === id),
  articulos: state => state.articulos,
  articulosByPartida: state => (idPartida) => {
    if (!idPartida) return state.articulos;
    return state.articulos.filter(item => item.partida.id === idPartida);
  },
  articulo: state => id => state.articulos.find(articulo => articulo.id === id),
  proveedores: state => state.proveedores,
  proveedor: state => id => state.proveedores.find(proveedor => proveedor.id === id),
  tipoRequisiciones: state => state.tipoRequisiciones,
  tipoRequisicion: state => id => state.tipoRequisiciones.find(tipo => tipo.id === id),
  usuarios: state => state.usuarios,
  usuario: state => id => state.usuarios.find(usuario => usuario.id === id),
  usuariosProveedores: state => state.usuarios.filter(usuario => usuario.tipo === 'proveedor'),
};
