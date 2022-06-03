export default {
  SET_ADQUISICIONES: (state, { adquisiciones }) => {
    const estado = state;
    estado.listado = adquisiciones;
  },
  ACTULIZAR_PRECIO_UNITARIO: (state, { cotizacion }) => {
    const este = state;
    const estaCotizacion = cotizacion;
    const adquisicion = este.listado.find(item => item.id === cotizacion.id_adquisicion);
    const index = adquisicion.articulos.findIndex(item => item.id === cotizacion.articulo.id);
    estaCotizacion.articulo.miPropuesta.precio_unitario = cotizacion.precio_unitario;
    estaCotizacion.articulo.miPropuesta.total = (
      (estaCotizacion.articulo.miPropuesta.iva || 0)
    + (cotizacion.precio_unitario || 0));
    adquisicion.articulos.splice(index, 1, cotizacion.articulo);
  },
  ACTUALIZAR_CARACTERISTICAS: (state, { cotizacion }) => {
    const este = state;
    const estaCotizacion = cotizacion;
    const adquisicion = este.listado.find(item => item.id === cotizacion.id_adquisicion);
    const index = adquisicion.articulos.findIndex(item => item.id === cotizacion.articulo.id);
    estaCotizacion.articulo.miPropuesta.caracteristicas = cotizacion.caracteristicas;
    adquisicion.articulos.splice(index, 1, cotizacion.articulo);
  },
  ACTUALIZAR_IVA: (state, { cotizacion }) => {
    const este = state;
    const estaCotizacion = cotizacion;
    const adquisicion = este.listado.find(item => item.id === cotizacion.id_adquisicion);
    const index = adquisicion.articulos.findIndex(item => item.id === cotizacion.articulo.id);
    estaCotizacion.articulo.miPropuesta.iva = cotizacion.iva;

    estaCotizacion.articulo.articulo.partida
      .porcentaje_iva_propuesto = estaCotizacion.porcentajeIvaPropuesto || 0;
    estaCotizacion.articulo.miPropuesta.por_iva = estaCotizacion.porcentajeIvaPropuesto || 0;
    estaCotizacion.articulo.miPropuesta.total = (estaCotizacion
      .articulo.miPropuesta.precio_unitario || 0)
    + (cotizacion.iva || 0);
    adquisicion.articulos.splice(index, 1, cotizacion.articulo);
  },
  ACTULIZAR_ULTIMA_PROPUESTA: (state, { data }) => {
    // id_adquisicion, id_adquisicion_articulo
    const este = state;
    const adquisicion = este.listado
      .find(item => item.id === data.oldDatos.id_adquisicion);
    const index = adquisicion.articulos
      .findIndex(item => item.id === data.oldDatos.cotizacion.id_adquisicion_articulo);
    const articulo = adquisicion.articulos
      .find(item => item.id === data.oldDatos.cotizacion.id_adquisicion_articulo);
    articulo.miPropuesta = data.newDatos;
    adquisicion.articulos.splice(index, 1, articulo);
  },
  ACTULIZAR_ARTICULO_MEJOR_PROPUESTA: (state, { data }) => {
    const este = state;
    const {
      id_adquisicion: idAdquisicion,
      id_articulo: idArticulo,
      precioMenor,
      idProveedorMejorPropuesta,
    } = data;
    const adquisicion = este.listado.find(item => item.id === idAdquisicion);
    if (!adquisicion) return;
    const articulo = adquisicion.articulos.find(item => item.id === idArticulo);
    if (!articulo) return;
    const { mejorPropuesta } = articulo;

    if (mejorPropuesta) {
      mejorPropuesta.precio_unitario = precioMenor;
      mejorPropuesta.id_proveedor = idProveedorMejorPropuesta;
    } else {
      articulo.mejorPropuesta = {
        precio_unitario: precioMenor,
      };
    }
  },
  ANEXAR_COTIZACION: (state, { cotizacion }) => {
    const adquisicion = state.listado.find(item => item.id === cotizacion.id_adquisicion);
    adquisicion.anexoCotizacion = cotizacion;
  },
  LIMPIAR: (state) => {
    const estado = state;
    estado.listado = [];
  },
  DECLINAR_ADQUISICION: (state, { adquisicion }) => {
    const index = state.listado.findIndex(item => item.id === adquisicion.id);
    state.listado.splice(index, 1, adquisicion);
  },
};
