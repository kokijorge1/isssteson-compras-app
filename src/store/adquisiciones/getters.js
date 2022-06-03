import monitorGetters from './getters/monitor';

export default {
  adquisiciones: state => state.listado,
  adquisicion: state => (id) => {
    if (!id) return {};
    return state.listado.find(item => item.id === id);
  },
  articulosAdquisicion: (state, getters) => id => getters.adquisicion(id).articulos,
  proveedoresParticipando: (state, getters) => (id) => {
    const proveedoresParticipantes = getters.articulosAdquisicion(id)
      .map(articulo => articulo.cotizaciones
        .map(cotizacion => cotizacion.id_proveedor).flat()).flat();

    return getters.adquisicion(id).participantes
      .filter(participante => proveedoresParticipantes
        .includes(participante.proveedor.id));
  },
  tipos: state => state.tipos,
  tipo: state => id => state.tipos.find(item => item.id === id),
  filtros: state => state.filtros,
  articulosAdjudicados: state => state.listado.map((item) => {
    const { partida } = item.articulos[0].articulo;
    const adquisicion = {
      id: item.id,
      tipo: item.tipo,
      numero: item.numero,
      nombre: item.nombre,
      fecha: item.fecha,
      articulos: item.articulos
        .filter(articulo => articulo.adjudicada)
        .map(articulo => ({
          idAdquisicionArticulo: articulo.id,
          idArticulo: articulo.articulo.id,
          nombre: articulo.articulo.nombre,
          cantidad: articulo.cantidad,
          cabms: articulo.articulo.cabms,
          clave_interna: articulo.articulo.clave_interna,
          caracteristicas: articulo.caracteristicas,
          cotizacionesAdjudicadas: articulo.cotizaciones
            .filter(coti => coti.datosAdjudicados),
          // .map(coti => coti.datosAdjudicados),
        })),
      unidad_administrativa: item.unidad_administrativa,
      nombre_unidad: item.unidad_administrativa
        ? item.unidad_administrativa.nombre : 'SIN UNIDAD',
      partida: `${partida.clave} - ${partida.nombre}`,
    };

    //
    // adquisicion.articulos.forEach((elemento) => {
    //   const elem = elemento;
    //   elem.cotizacion = elem.cotizaciones.find(cot => cot.adjudicada === true);
    //   // delete elem.cotizaciones;
    // });

    const cotizaciones = adquisicion.articulos
      .map(elem => elem.cotizacionesAdjudicadas
        .reduce((anterior, actual) => anterior + actual.datosAdjudicados.importe, 0));

    const importe = cotizaciones.length === 0 ? 0
      : cotizaciones.reduce((anterior, actual) => anterior + actual);

    adquisicion.importe = importe;

    return adquisicion;
  }),
  adquisicionesSoloArticulosAdjudicados: (state, getters) => {
    const nuevasAdquisiciones = getters.adquisiciones
      .map((adquisicion) => {
        const nuevaAdquisicion = {
          id: adquisicion.id,
          nombre: adquisicion.nombre,
        };
        const arituclosFiltrados = adquisicion.articulos
          .filter(articulo => articulo.adjudicada === true);

        const articulosNuevos = arituclosFiltrados
          .map((articulo) => {
            const propuestasAdjudicadas = articulo.cotizaciones
              .filter(propuesta => propuesta.adjudicada === true);

            const nuevoArticulo = {
              cantidad: articulo.cantidad,
              precioMenor: articulo.precioMenor,
              precioMayor: articulo.precioMayor,
              ahorro: (articulo.precioMayor - articulo.precioMenor),
              cotizaciones: articulo.cotizaciones,
              articulo: articulo.articulo,
              propuestasAdjudicadas,
              propuestaMayor: articulo.propuestaMayor,
            };
            return nuevoArticulo;
          });

        nuevaAdquisicion.articulos = articulosNuevos;
        return nuevaAdquisicion;
      });
    return nuevasAdquisiciones;
  },
  adquisicionesEnProceso: (state) => {
    const hoy = new Date();
    return state.listado.slice()
      .filter(adquisicion => new Date(adquisicion.fecha_termino) < hoy);
  },
  adquisicionesTerminadas: (state) => {
    const hoy = new Date();
    return state.listado.slice()
      .filter(adquisicion => new Date(adquisicion.fecha_termino) < hoy);
  },
  adquisicionesPorIniciar: (state) => {
    const hoy = new Date();
    return state.listado.slice()
      .filter(adquisicion => new Date(adquisicion.fecha_inicio) > hoy);
  },
  ...monitorGetters,
};
