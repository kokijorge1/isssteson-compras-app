export default {
  SET_ADQUISICIONES: (state, { adquisiciones }) => {
    const estado = state;
    estado.adquisiciones = adquisiciones;
  },
  SET_PROVEEDORES: (state, { proveedores }) => {
    const estado = state;
    estado.proveedores = proveedores;
  },

  AGREGAR_ADQUISICION: (state, { adquisicion }) => {
    state.adquisiciones.push(adquisicion);
  },
  ACTUALIZAR_ADQUISICION: (state, { adquisicion }) => {
    const index = state.adquisiciones.findIndex(item => item.id === adquisicion.id);
    state.adquisiciones.splice(index, 1, adquisicion);
  },
  ACTUALIZAR_COTIZACIONES_ARTICULO: (state, { datos }) => {
    const estado = state;
    const adquisicion = estado.adquisiciones
      .find(item => item.id === datos.id_adquisicion);
    const articulo = adquisicion.articulos
      .find(item => item.id === datos.id_articulo);
    articulo.adjudicada = datos.adjudicada;
    articulo.cotizaciones = datos.cotizaciones;
  },
  BORRAR_ARTICULO_ADQUISICION: (state, { payload }) => {
    const adquisicion = state.adquisiciones
      .find(item => item.id === payload.idAdquisicion);
    const index = adquisicion.articulos.findIndex(item => item.id === payload.id);
    adquisicion.articulos.splice(index, 1);
  },
  ACTUALIZAR_PANEL: (state, { payload }) => {
    const { cotizaciones, cotizaciones_log: cotizacionesLog } = payload;
    const estado = state;
    if (estado.adquisiciones.length <= 0) return;
    const adquisicion = estado.adquisiciones.find(item => item.id === cotizaciones.id_adquisicion);
    if (!adquisicion) return;
    const articulo = adquisicion.articulos.find(item => item.id === cotizaciones.id_articulo);
    if (!articulo) return;
    adquisicion.fechaActualizacion = new Date();
    articulo.precioMenor = cotizaciones.precioMenor;
    articulo.precioMayor = cotizaciones.precioMayor;
    articulo.propuestaMayor = cotizaciones.propuestaMayor;
    articulo.cotizaciones = cotizaciones.cotizaciones;
    articulo.cotizaciones_log = cotizacionesLog;
  },

  AGREGAR_PROVEEDOR: (state, { proveedor }) => {
    const estado = state;
    estado.proveedores.push(proveedor);
  },
};
