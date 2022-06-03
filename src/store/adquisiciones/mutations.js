export default {
  SET_ADQUISICIONES: (state, { adquisiciones }) => {
    const estado = state;
    estado.listado = adquisiciones;
  },
  AGREGAR_ADQUISICION: (state, { adquisicion }) => {
    state.listado.push(adquisicion);
  },
  ACTUALIZAR_ADQUISICION: (state, { adquisicion }) => {
    const index = state.listado.findIndex(item => item.id === adquisicion.id);
    state.listado.splice(index, 1, adquisicion);
  },
  AGREGAR_PROVEEDORES: (state, { payload }) => {
    const adquisicion = state.listado.find(item => item.id === payload.idAdquisicion);
    adquisicion.participantes.push(...payload.participantes);
  },
  REMOVER_PARTICIPANTE: (state, { payload }) => {
    const adquisicion = state.listado
      .find(item => item.id === payload.id_adquisicion);
    const index = adquisicion.participantes.findIndex(item => item.id === payload.id_registro);
    adquisicion.participantes.splice(index, 1);
  },
  LIMPIAR: (state) => {
    const estado = state;
    estado.listado = [];
    estado.filtros.tipo = '';
    estado.filtros.estatus = 0;
    estado.filtros.searchText = '';
  },
  ACTUALIZAR_PANEL: (state, { payload }) => {
    const estado = state;
    if (estado.listado.length <= 0) return;
    const adquisicion = estado.listado.find(item => item.id === payload.id_adquisicion);
    if (!adquisicion) return;
    const articulo = adquisicion.articulos.find(item => item.id === payload.id_articulo);
    if (!articulo) return;
    adquisicion.fechaActualizacion = new Date();
    articulo.precioMenor = payload.precioMenor;
    articulo.precioMayor = payload.precioMayor;
    articulo.propuestaMayor = payload.propuestaMayor;
    articulo.cotizaciones = payload.cotizaciones;
  },
  ACTUALIZAR_COTIZACIONES_ARTICULO: (state, { datos }) => {
    const estado = state;
    const adquisicion = estado.listado
      .find(item => item.id === datos.id_adquisicion);
    const articulo = adquisicion.articulos
      .find(item => item.id === datos.id_articulo);
    articulo.adjudicada = datos.adjudicada;
    articulo.cotizaciones = datos.cotizaciones;
  },
  ACTUALIZAR_ARTICULOS_ADQUISICION: (state, { datos }) => {
    const estado = state;
    const adquisicion = estado.listado
      .find(item => item.id === datos.id_adquisicion);
    adquisicion.articulos = datos.articulos;
  },
  ACTUALIZAR_DATOS_CORREOS_INVITACION: (state, { datos }) => {
    const estado = state;
    const adquisicion = estado.listado
      .find(item => item.id === datos.idAdquisicion);
    adquisicion.invitacion = datos.invitacion;
  },
  ACTUALIZAR_ANEXAR_COTIZACION: (state, { cotizacion }) => {
    const estado = state;
    const adquisicion = estado.listado
      .find(item => item.id === cotizacion.id_adquisicion);
    const proveedor = adquisicion.participantes
      .find(item => item.proveedor.id === cotizacion.id_proveedor);
    proveedor.proveedor.anexoCotizacion = cotizacion;
  },
  ANEXAR_ARCHIVO: (state, { anexo }) => {
    const estado = state;
    const adquisicion = estado.listado
      .find(item => item.id === anexo.id_adquisicion);
    adquisicion.expedientes.push(anexo);
  },
  REMOVER_ANEXAR_ARCHIVO: (state, { anexo }) => {
    const adquisicion = state.listado
      .find(item => item.id === anexo.id_adquisicion);
    const index = adquisicion.expedientes.findIndex(item => item.id === anexo.id);
    adquisicion.expedientes.splice(index, 1);
  },
  SET_FILTROS: (state, { filtros }) => {
    const estado = state;
    estado.filtros = filtros;
  },
  BORRAR_ARTICULO_ADQUISICION: (state, { payload }) => {
    const adquisicion = state.listado
      .find(item => item.id === payload.idAdquisicion);
    const index = adquisicion.articulos.findIndex(item => item.id === payload.id);
    adquisicion.articulos.splice(index, 1);
  },
  BORRAR_ARTICULO_COTIZACION: (state, { idAdquisicion, cotizaciones }) => {
    const adquisicion = state.listado.find(item => item.id === idAdquisicion);
    cotizaciones.forEach((elem) => {
      const articulo = adquisicion.articulos.find(item => item.id === elem.idArticulo);
      const index = articulo.cotizaciones.findIndex(item => item.id === elem.idCotizacion);
      if (articulo.cotizaciones[index].es_postura_inicial) {
        articulo.cotizaciones.splice(index, 1);
      }
    });
  },
  SET_PROVEEDORES: (state, { datos }) => {
    const adquisicion = state.listado.find(item => item.id === datos.idAdquisicion);
    adquisicion.participantes = datos.data;
  },
  AGREGAR_ANEXO: (state, { anexo }) => {
    const estado = state;
    const adquisicion = estado.listado
      .find(item => item.id === anexo.id_adquisicion);
    adquisicion.anexos.push(anexo);
  },
  REMOVER_ANEXO: (state, { payload }) => {
    const adquisicion = state.listado
      .find(item => item.id === payload.id_adquisicion);
    const index = adquisicion.anexos.findIndex(item => item.id === payload.id);
    adquisicion.anexos.splice(index, 1);
  },
};
