export default {
  monitorAquisiciones: state => (filtros) => {
    const hoy = new Date();
    if (filtros.incluirConcluidos) {
      return state.listado;
    }

    return state.listado.slice()
      .filter(adquisicion => new Date(adquisicion.fecha_termino) > hoy);
  },
  monitorAdquisicionesFiltradas: (state, getters) => (filtros) => {
    const adquisicionesIds = filtros.seleccionados.map(adquisicion => adquisicion.id);
    const adquisiciones = getters.monitorAquisiciones(filtros);
    if (filtros.seleccionados.length > 0) {
      return adquisiciones.filter(adquisicion => adquisicionesIds.includes(adquisicion.id));
    }

    return adquisiciones;
  },
  monitorTodosArticulos: (state, getters) => filtros => getters
    .monitorAdquisicionesFiltradas(filtros)
    .map(adquisicion => adquisicion.articulos).flat(),
  monitorArticulosConCotizacion: (state, getters) => filtros => getters
    .monitorAdquisicionesFiltradas(filtros)
    .map(adquisicion => adquisicion.articulos
      .filter((articulo) => {
        const cotizacionesNoDeclinadas = articulo.cotizaciones
          .filter(cotizacion => cotizacion.declina_participar === false);
        return cotizacionesNoDeclinadas.length > 0;
      }).flat()).flat(),
  monitorArticulosSinCotizacion: (state, getters) => filtros => getters
    .monitorAdquisicionesFiltradas(filtros)
    .map(adquisicion => adquisicion.articulos
      .filter((articulo) => {
        const cotizacionesNoDeclinadas = articulo.cotizaciones
          .filter(cotizacion => !cotizacion.declina_participar);
        return cotizacionesNoDeclinadas.length <= 0;
      }).flat()).flat(),
  monitorCotizacionesRecibidas: (state, getters) => filtros => getters
    .monitorArticulosConCotizacion(filtros)
    .map(articulo => articulo.cotizaciones).flat()
    .filter(cotizacion => cotizacion.precio_unitario > 0
        && cotizacion.declina_participar === false),
  monitorProveedoresConCotizacion: (state, getters) => (filtros) => {
    const proveedores = getters
      .monitorArticulosConCotizacion(filtros)
      .map(articulo => articulo.cotizaciones).flat()
      .filter(cotizacion => cotizacion.precio_unitario > 0
        && cotizacion.declina_participar === false)
      .map(cotizacion => cotizacion.proveedor.id);
    return [...new Set(proveedores)];
  },
  monitorArticulosConDeclinaciones: (state, getters) => filtros => getters
    .monitorAdquisicionesFiltradas(filtros)
    .map(adquisicion => adquisicion.articulos.map((articulo) => {
      const cotizacionesDeclinadas = articulo.cotizaciones
        .filter(cotizacion => cotizacion.declina_participar);

      return {
        articulo: articulo.articulo,
        declanaciones: cotizacionesDeclinadas,
      };
    }).flat()).flat().filter(articulo => articulo.declanaciones.length > 0)
  ,
};
