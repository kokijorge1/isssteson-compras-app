export default {
  adquisiciones: state => state.adquisiciones
    .map((adquisicion) => {
      const nuevaAdquisicion = {
        id: adquisicion.id,
        articulos: adquisicion.articulos,
        created_at: adquisicion.created_at,
        fecha: adquisicion.fecha,
        fecha_inicio: adquisicion.fecha_inicio,
        fecha_termino: adquisicion.fecha_termino,
        key_publico: adquisicion.key_publico,
        nombre: adquisicion.nombre,
        numero: adquisicion.numero,
        publicar: adquisicion.publicar,
        participantes: adquisicion.participantes,
      };

      const articulosNuevos = adquisicion.articulos
        .map((articulo) => {
          const propuestasAdjudicadas = articulo.cotizaciones
            .filter(propuesta => propuesta.adjudicada === true);

          const nuevoArticulo = {
            id: articulo.id,
            adjudicada: articulo.adjudicada,
            cantidad: articulo.cantidad,
            precioMenor: articulo.precioMenor,
            precioMayor: articulo.precioMayor,
            caracteristicas: articulo.caracteristicas,
            ahorro: (articulo.precioMayor - articulo.precioMenor),
            cotizaciones: articulo.cotizaciones,
            cotizacionesLog: articulo.cotizaciones_log.slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
            articulo: articulo.articulo,
            propuestasAdjudicadas,
            propuestaMayor: articulo.propuestaMayor,
            propuestaMenorComentarios: articulo.propuestaMenorComentarios,
          };
          return nuevoArticulo;
        });

      nuevaAdquisicion.articulos = articulosNuevos;

      return nuevaAdquisicion;
    })
    .filter(adq => adq.publicar === true)
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  adquisicion: (state, getters) => (id) => {
    if (!id) return {};
    return getters.adquisiciones.find(adquisicion => adquisicion.key_publico === id);
  },
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
  cantidadArticulos: (state, getters) => {
    let cantidad = 0;
    getters.adquisiciones.forEach((element) => {
      cantidad += element.articulos.length;
    });

    return cantidad;
  },
  cantidadArticulosAdjudicados: (state, getters) => {
    let cantidad = 0;
    if (getters.adquisicionesSoloArticulosAdjudicados.length <= 0) return 0;
    getters.adquisicionesSoloArticulosAdjudicados.forEach((element) => {
      cantidad += element.articulos.length;
    });

    return cantidad;
  },
  porcentajeAvance: (state, getters) => {
    if (state.adquisiciones.length <= 0) return 0;
    return Math.round((getters.cantidadArticulosAdjudicados
      / getters.cantidadArticulos) * 100);
  },
  cantidadPropuestasPorArticulo: (state, getters) => {
    let cantidad = 0;
    if (getters.adquisiciones.length <= 0) return 0;
    getters.adquisiciones.forEach((element) => {
      element.articulos.forEach((el) => {
        cantidad += el.cotizaciones.length;
      });
    });

    return cantidad;
  },
  montoArticulosAdjudicados: (state, getters) => {
    let monto = 0;
    const articulosAdjudicados = getters.adquisicionesSoloArticulosAdjudicados;
    if (articulosAdjudicados.length <= 0) return 0;
    articulosAdjudicados.forEach((element) => {
      element.articulos.forEach((el) => {
        monto += el.propuestasAdjudicadas
          .reduce((total, propuesta) => total + propuesta.datosAdjudicados.gran_total, 0);
      });
    });

    return monto;
  },
  montoMayorArticulosAdjudicados: (state, getters) => {
    let monto = 0;
    if (getters.adquisicionesSoloArticulosAdjudicados.length <= 0) return 0;
    getters.adquisicionesSoloArticulosAdjudicados.forEach((element) => {
      element.articulos.forEach((el) => {
        monto += el.propuestaMayor;
      });
    });

    return monto;
  },
  ahorro: (state, getters) => getters.nuevoAhorroAhorro,
  datosPie: (state, getters) => {
    const datos = getters.adquisicionesSoloArticulosAdjudicados
      .map((adquisicion) => {
        let monto = 0;
        adquisicion.articulos.forEach((element) => {
          monto += element.propuestasAdjudicadas
            .reduce((total, propuesta) => total + propuesta.datosAdjudicados.gran_total, 0);
        });
        return [adquisicion.nombre, monto];
      });
    return datos;
  },
  proveedores: state => state.proveedores,
  cantidadProveedores: (state, getters) => getters.proveedores.length,
  soloArticulosAdjudicados: (state, getters) => getters.adquisiciones
    .map(adquisicion => adquisicion.articulos
      .filter(articulo => articulo.adjudicada === true).flat()).flat(),
  soloCotizacionesAdjudicadas: (state, getters) => getters.soloArticulosAdjudicados
    .map(articulo => articulo.cotizaciones
      .filter(cotizacion => cotizacion.adjudicada === true)
      .flat())
    .flat(),
  soloProveedoresAdjudicadosAgrupado: (state, getters) => {
    const proveedores = [];
    const proveedoresPropuetsasAdjudicadas = getters.soloArticulosAdjudicados
      .map(articulo => articulo.cotizaciones
        .filter(cotizacion => cotizacion.adjudicada === true)
        .flat())
      .flat();

    proveedoresPropuetsasAdjudicadas.forEach((proveedor) => {
      const proveedorExiste = proveedores
        .find(prov => prov.id_proveedor === proveedor.id_proveedor);
      if (!proveedorExiste) {
        proveedores.push(proveedor);
      }
    });

    return proveedores;
  },
  articulosAdjudicadosFormateado: state => state.adquisiciones.map((item) => {
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
        })),
      unidad_administrativa: item.unidad_administrativa,
      nombre_unidad: item.unidad_administrativa
        ? item.unidad_administrativa.nombre : 'SIN UNIDAD',
      partida: `${partida.clave} - ${partida.nombre}`,
    };
    const cotizaciones = adquisicion.articulos
      .map(elem => elem.cotizacionesAdjudicadas
        .reduce((anterior, actual) => anterior + actual.datosAdjudicados.importe, 0));

    const importe = cotizaciones.length === 0 ? 0
      : cotizaciones.reduce((anterior, actual) => anterior + actual);

    adquisicion.importe = importe;
    return adquisicion;
  }).filter(item => item.articulos.length > 0),
  agruparProveedores: (state, getters) => {
    const proveedores = [];
    getters.articulosAdjudicadosFormateado.forEach((adquisicion) => {
      adquisicion.articulos.forEach((adquiArticulo) => {
        adquiArticulo.cotizacionesAdjudicadas.forEach((cotizacion) => {
          const { proveedor, datosAdjudicados } = cotizacion;

          const articulo = {
            nombre: adquiArticulo.nombre,
            cantidad: datosAdjudicados.cantidad,
            precio_unitario: datosAdjudicados.precio_unitario,
            iva: datosAdjudicados.iva_importe,
            importe: datosAdjudicados.importe,
            total: datosAdjudicados.total,
            gran_total: datosAdjudicados.gran_total,
            fecha: adquisicion.fecha,
            numero: adquisicion.numero,
            partida: adquisicion.partida,
            nombreUniAdmin: adquisicion.nombre_unidad,
          };
          const proveedorExistente = proveedores.find(elem => elem.id === proveedor.id);
          if (proveedorExistente) {
            proveedorExistente.articulos.push(articulo);
            proveedorExistente.gran_total += datosAdjudicados.gran_total;
          } else {
            const datosProveedor = {
              id: proveedor.id,
              nombre: proveedor.nombre,
              rfc: proveedor.rfc,
              gran_total: datosAdjudicados.gran_total,
              articulos: [],
            };
            datosProveedor.articulos.push(articulo);
            proveedores.push(datosProveedor);
          }
        });
      });
    });
    return proveedores;
  },
  nuevoAhorroAhorro: (state, getters) => {
    let total = 0;
    const articulosAdjudicados = getters.soloArticulosAdjudicados;
    // loop
    articulosAdjudicados.forEach((articulo) => {
      const ahorro = getters.calcularAhorro(articulo.cotizaciones
        .filter(cotizacion => cotizacion.declina_participar === false),
      articulo.articulo.partida.porcentaje_iva_propuesto);
      total += ahorro;
    });

    return total;
  },
  calcularAhorro: () => (cotizaciones, porcentajeIva) => {
    if (cotizaciones.length <= 1) return 0;
    const porIva = (porcentajeIva / 100) + 1;
    // cotizaciones adjudicadas con formato
    const preciosUnitariosCantidadesAdjudicadas = cotizaciones
      .filter(cotizacion => cotizacion.adjudicada === true)
      .map(cotizacion => ({
        porcentajeIva: cotizacion.por_iva,
        cantidad: cotizacion.datosAdjudicados.cantidad,
        precio_unitario: +cotizacion.datosAdjudicados.precio_unitario,
        importe: +cotizacion.datosAdjudicados.importe,
        total: +cotizacion.datosAdjudicados.precio_unitario,
      }));

    // suma de las cantidades adjudicadas
    // const cantidadAdjudicada = preciosUnitariosCantidadesAdjudicadas
    //   .reduce((cont, act) => (cont + act.cantidad), 0);

    // cotizaciones no adjudicadas
    const preciosUnitariosCantidadesNoAdjudicadas = cotizaciones
      .filter(cotizacion => cotizacion.adjudicada === false)
      .map(cotizacion => ({
        porcentajeIva: cotizacion.por_iva,
        precio_unitario: +cotizacion.precio_unitario,
        total: +cotizacion.precio_unitario,
      }));

    // precios unitarios adjudicados
    const preciosUnitariosAdjudicados = preciosUnitariosCantidadesAdjudicadas
      .map(item => +item.precio_unitario);

    // precio menor adjudicado
    const precioMenorAdjudicado = Math.min(...preciosUnitariosAdjudicados);

    // precios unitarios no adjudicados
    const preciosUnitariosNoAdjudicados = preciosUnitariosCantidadesNoAdjudicadas
      .map(item => +item.precio_unitario)
      .filter(item => item < (precioMenorAdjudicado * 2));

    // marge de todos los precios unitarios adjudicados y precios unitarios no adjudicados
    const todosLosPrecios = [...preciosUnitariosAdjudicados, ...preciosUnitariosNoAdjudicados]
      .filter(item => item >= precioMenorAdjudicado)
      .sort((a, b) => a > b);

    // precion unitario promedio
    const precioUnitarioPromedio = (todosLosPrecios
      .reduce((cont, act) => (cont + act), 0)) / todosLosPrecios.length;

    // loop
    let ahorro = 0;
    preciosUnitariosCantidadesAdjudicadas.forEach((cotizacion) => {
      const inversionPromedio = (cotizacion.cantidad * precioUnitarioPromedio);
      if (cotizacion.importe < inversionPromedio) {
        ahorro += (inversionPromedio - cotizacion.importe);
      }
    });

    const calcularAhorro = (ahorro) * porIva;

    return calcularAhorro;
  },
};
