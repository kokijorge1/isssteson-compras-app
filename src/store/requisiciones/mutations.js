
export default {
  SET_REQUISICIONES: (state, { requisiciones }) => {
    const estado = state;
    estado.requisiciones = requisiciones;
  },
  AGREGAR_REQUISICION: (state, { requisicion }) => {
    state.requisiciones.push(requisicion);
  },
  AGREGAR_ARTICULO_REQUISICION: (state, { idRequisicion, articulo }) => {
    const requisicion = state.requisiciones.find(item => item.id === idRequisicion);

    requisicion.articulos.push(articulo);
  },
  ACTUALIZAR_REQUISICION: (state, { requisicion }) => {
    const index = state.requisiciones.findIndex(item => item.id === requisicion.id);
    state.requisiciones.splice(index, 1, requisicion);
  },
  BORRAR_ARTICULO_REQUISICION: (state, { payload }) => {
    const requisicion = state.requisiciones
      .find(item => item.id === payload.idRequisicion);
    const index = requisicion.articulos.findIndex(item => item.id === payload.id);
    requisicion.articulos.splice(index, 1);
  },
  SET_FILTROS: (state, { filtros }) => {
    const estado = state;
    estado.filtros = filtros;
  },
  ACTUALIZAR_REQUISICIONES_ESTATUS: (state, { requisiciones }) => {
    if (requisiciones.length <= 0) return;
    requisiciones.forEach((req) => {
      const requisicion = state.requisiciones
        .find(item => item.id === req.id_requisicion);

      requisicion.estatus = 2;
    });
  },
  ANEXAR_ARCHIVO: (state, { anexo }) => {
    const requisicion = state.requisiciones
      .find(item => item.id === anexo.id_requisicion);
    requisicion.expedientes.push(anexo);
  },
  REMOVER_ANEXAR_ARCHIVO: (state, { anexo }) => {
    const requisicion = state.requisiciones
      .find(item => item.id === anexo.id_requisicion);
    const index = requisicion.expedientes.findIndex(item => item.id === anexo.id);
    requisicion.expedientes.splice(index, 1);
  },
  LIMPIAR: (state) => {
    const estado = state;
    estado.requisiciones = [];
    estado.filtros.unidadAdm = '';
    estado.filtros.area = '';
    estado.filtros.estatus = 999;
    estado.filtros.searchText = '';
  },
};
