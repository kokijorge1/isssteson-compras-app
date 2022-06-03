<template>
  <div id="contenedor-comparativo-cotizaciones">
    <v-data-table :items="[1]" hide-actions :key="llave">
      <template v-slot:headers>
        <tr>
          <th rowspan="2" class="border">
            <strong>
              Partida
            </strong>
          </th>
          <th rowspan="2" class="border">
            <strong>
              Clave Médica
            </strong>
          </th>
          <th rowspan="2" class="border">
            <strong>
              CAMBS
            </strong>
          </th>
          <th rowspan="2" align="left" class="border">
            <strong>
              Descripción
            </strong>
          </th>
          <th rowspan="2" class="border">
            <strong>
              Cant.
            </strong>
          </th>
          <th rowspan="2" align="left" class="border">
            <strong>
              U. M.
            </strong>
          </th>
          <th rowspan="2" align="left" class="border">
            <strong>
              Precio Ref.
            </strong>
          </th>
          <template v-for="(participante, index) in getProveedores">
            <th
              :key="`participante-${index}`"
              colspan="3"
              class="border"
              :class="{'red lighten-4': participante.declina_participar}">
              <!-- <v-checkbox
                v-model="proveedorSeleccionado"
                hide-details
                :label="participante.proveedor.nombre"
                :value="participante.proveedor.id"
                @click.prevent="adjudicarProveedor"
                color="primary"
              ></v-checkbox> -->
              {{ participante.proveedor.nombre }}
              <div
                v-if="participante.declina_participar"
                class="red lighten-3 white--text text-xs-center">
                <span style="text-transform: uppercase;">
                  No participa.
                </span>
              </div>
            </th>
          </template>
        </tr>
        <tr>
          <template v-for="(participante, index) in getProveedores">
            <th
              :key="`participante-precio-${index}`"
              class="border"
              :class="{'red lighten-4': participante.declina_participar || false}"
              >Precio Unitario</th>
            <th
              :key="`participante-subtotal-${index}`"
              class="border"
              :class="{'red lighten-4': participante.declina_participar || false}"
              >SubTotal</th>
            <th
              :key="`participante-adjudicar-${index}`"
              class="border"
              :class="{'red lighten-4': participante.declina_participar || false}"
              >Adjudicado</th>
          </template>
        </tr>
      </template>
      <template v-slot:items>
        <template v-for="(articulo, index) in getArticulos">
          <tr :key="`articulo-${index}`">
            <td align="center">{{ (index + 1) }}</td>
            <td>{{ articulo.articulo.clave_interna }}</td>
            <td>{{ articulo.articulo.cabms }}</td>
            <td
              class="py-0 px-0">
              <mostrar-mas-texto
                :texto="articulo.articulo.nombre">
              </mostrar-mas-texto>
            </td>
            <td align="center">{{ articulo.cantidad }}</td>
            <td>{{ articulo.articulo.unidad }}</td>
            <td>{{ articulo.precio_referencia | currency }}</td>
            <template v-for="(participante, index) in getProveedores">
              <td
                class="py-0 px-0 pr-1"
                align="right"
                :key="`participante-precio-unitario${index}`"
              :class="{'teal lighten-4': (articulo.precioMenor ===
                        getPrecioUnitario(getDatosProveedor(articulo,
                        participante.proveedor.id)))
                        && (getPrecioUnitario(getDatosProveedor(articulo,
                        participante.proveedor.id)) > 0) &&
                        !getDeclinaParticiparArticulo(getDatosProveedor(articulo,
                        participante.proveedor.id)),
                        'red lighten-4': getDeclinaParticiparArticulo(getDatosProveedor(articulo,
                        participante.proveedor.id))}">
                <template
                  v-if="getAdjudicada(getDatosProveedor(articulo,
                  participante.proveedor.id))">
                  ({{ getDatosProveedor(articulo,
                  participante.proveedor.id).datosAdjudicados.cantidad
                  | currency('', 0, { thousandsSeparator: ',' }) }})
                </template>
                <template
                  v-if="(articulo.precioMenor === getPrecioUnitario(getDatosProveedor(articulo,
                        participante.proveedor.id)))
                        && getPrecioUnitario(getDatosProveedor(articulo,
                        participante.proveedor.id)) > 0"
                >
                  <v-icon small>arrow_downward</v-icon>
                  <strong>
                    {{ getPrecioUnitario(getDatosProveedor(articulo,
                    participante.proveedor.id)) | currency }}
                  </strong>
                </template>
                <template v-else>
                  {{ getPrecioUnitario(getDatosProveedor(articulo,
                  participante.proveedor.id)) | currency }}
                </template>
              </td>
              <td
                align="right"
                :key="`participante-subtotal${index}`"
                :class="{'red lighten-4':
                  getDeclinaParticiparArticulo(getDatosProveedor(articulo,
                  participante.proveedor.id))}">
                <span>
                  {{ getImporte(getDatosProveedor(articulo,
                  participante.proveedor.id)) | currency }}
                </span>
              </td>
              <td
                align="right"
                class="text-xs-right"
                :key="`participante-adjudicar${index}`"
                :class="{'green lighten-4': getAdjudicada(getDatosProveedor(articulo,
                  participante.proveedor.id))  &&
                  !getDeclinaParticiparArticulo(getDatosProveedor(articulo,
                  participante.proveedor.id)),
                  'red lighten-4': getDeclinaParticiparArticulo(getDatosProveedor(articulo,
                    participante.proveedor.id))}">
                <v-tooltip top>
                  <!-- <v-checkbox
                    :input-value="getAdjudicada(getDatosProveedor(articulo,
                              participante.proveedor.id))"
                    hide-details
                    :label="getImporte(getDatosProveedor(articulo,
                              participante.proveedor.id)) | currency"
                    :disabled="getDeclinaParticiparArticulo(getDatosProveedor(articulo,
                              participante.proveedor.id))
                              || getDeclinaParticiparAdquisicion(participante.proveedor.id)
                              || !getDatosProveedor(articulo,
                                participante.proveedor.id)"
                    @click.prevent="adjusicarPartida(getDatosProveedor(articulo,
                              participante.proveedor.id), participante.proveedor.id)"
                    slot="activator"
                    color="primary">
                  </v-checkbox> -->
                  <v-checkbox
                    :input-value="getAdjudicada(getDatosProveedor(articulo,
                              participante.proveedor.id))"
                    hide-details
                    :label="getImporte(getDatosProveedor(articulo,
                              participante.proveedor.id)) | currency"
                    :disabled="getDeclinaParticiparArticulo(getDatosProveedor(articulo,
                              participante.proveedor.id))
                              || getDeclinaParticiparAdquisicion(participante.proveedor.id)
                              || !getDatosProveedor(articulo,
                                participante.proveedor.id)"
                    slot="activator"
                    color="primary">
                  </v-checkbox>
                  <template
                    v-if="getAdjudicada(getDatosProveedor(articulo,
                              participante.proveedor.id))"
                  >
                    <span>Adjudicada</span>
                  </template>
                  <template v-else>
                    <span>Adjudicar</span>
                  </template>
                </v-tooltip>
                <div
                  v-if="!participante.proveedor.anexoCotizacion.public_key"
                  class="red darken-1 white--text text-xs-center">
                  <small>
                    Sin Cotización Anexa.
                  </small>
                </div>
              </td>
            </template>
          </tr>
        </template>
      </template>
      <template v-slot:footer>
        <tr>
          <td colspan="7" rowspan="6"></td>
          <template v-for="(participante, index) in getProveedores">
            <td align="right" :key="`subtotal-titulo${index}`">SubTotal</td>
            <td align="right" :key="`subtotal-sumatoria${index}`" class="grey lighten-3">
              <strong>
                {{ sumatorias(participante.proveedor.id)
                .subtotal | currency }}
              </strong>
            </td>
            <td :key="`subtotal-empty${index}`"></td>
          </template>
        </tr>
        <tr>
          <template v-for="(participante, index) in getProveedores">
            <td align="right" :key="`iva-titulo${index}`">IVA</td>
            <td align="right" :key="`iva-sumatoria${index}`" class="grey lighten-3">
              <strong>
                {{ sumatorias(participante.proveedor.id)
                .iva | currency }}
              </strong>
            </td>
            <td :key="`iva-empty${index}`"></td>
          </template>
        </tr>
        <tr>
          <template v-for="(participante, index) in getProveedores">
            <td align="right" :key="`total-titulo${index}`">Total</td>
            <td align="right" :key="`total-sumatoria${index}`" class="grey lighten-3">
              <strong>
                {{ sumatorias(participante.proveedor.id)
                .total | currency }}
              </strong>
            </td>
            <td :key="`total-empty${index}`"></td>
          </template>
        </tr>
        <tr>
          <template v-for="(participante, index) in getProveedores">
            <td :key="`subtotal-empty${index}`" rowspan="3">
              <strong>Importe Adjudicar</strong>
            </td>
            <td align="right" :key="`subtotal-titulo${index}`">SubTotal</td>
            <td
              align="right"
              :key="`subtotal-sumatoria${index}`"
              :class="{'green lighten-3': sumatoriasAdjudicadas(participante.proveedor.id)
                    .subtotal > 0}"
            >
              <strong>
                {{ sumatoriasAdjudicadas(participante.proveedor.id)
                .subtotal | currency }}
              </strong>
            </td>
          </template>
        </tr>
        <tr>
          <template v-for="(participante, index) in getProveedores">
            <td align="right" :key="`iva-titulo${index}`">IVA</td>
            <td
              align="right"
              :key="`iva-sumatoria${index}`"
              :class="{'green lighten-3': sumatoriasAdjudicadas(participante.proveedor.id)
                    .subtotal > 0}"
            >
              <strong>
                {{ sumatoriasAdjudicadas(participante.proveedor.id)
                .iva | currency }}
              </strong>
            </td>
          </template>
        </tr>
        <tr>
          <template v-for="(participante, index) in getProveedores">
            <td align="right" :key="`total-titulo${index}`">Total</td>
            <td
              align="right"
              :key="`total-sumatoria${index}`"
              :class="{'green lighten-3': sumatoriasAdjudicadas(participante.proveedor.id)
                    .subtotal > 0}"
            >
              <strong>
                {{ sumatoriasAdjudicadas(participante.proveedor.id)
                .total | currency }}
              </strong>
            </td>
          </template>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
// eslint-disable-next-line import/no-unresolved
import MostrarMasTexto from '@/components/MostrarMasTexto.vue';

export default {
  name: 'ComparativoCotizaciones',
  components: {
    MostrarMasTexto,
  },
  data() {
    return {
      proveedorSeleccionado: null,
      dialogAdjudicarPartida: false,
      propuestaAdjudicar: {},
      subTotales: [],
      llave: 0,

    };
  },
  methods: {
    ...mapActions('adquisiciones', [
      'actulizarAdquisicionJustificacion',
      'adjudicarArticulo',
      'adjudicarArticulosProveedor',
    ]),
    getDatosProveedor(articulo, idProveedor) {
      this.llave = 1;
      const cotizacion = articulo.cotizaciones.find(
        item => item.id_proveedor === idProveedor,
      );
      return cotizacion;
    },
    getPrecioUnitario(cotizacion) {
      if (!cotizacion) return 0;
      if (cotizacion.datosAdjudicados) return cotizacion.datosAdjudicados.precio_unitario;
      return cotizacion.precio_unitario || 0;
    },
    getImporte(cotizacion) {
      if (!cotizacion) return 0;
      if (cotizacion.datosAdjudicados) return cotizacion.datosAdjudicados.importe;
      return cotizacion.importe || 0;
    },
    getAdjudicada(cotizacion) {
      if (!cotizacion) return 0;
      return cotizacion.adjudicada || false;
    },
    getDeclinaParticiparAdquisicion(idProveedor) {
      const proveedor = this.getProveedores
        .find(item => item.proveedor.id === idProveedor);

      return proveedor.declina_participar;
    },
    getDeclinaParticiparArticulo(cotizacion) {
      if (!cotizacion) return false;

      return cotizacion.declina_participar || false;
    },
    mejorPropuesta(precioMenor, precioProveedor) {
      if (precioProveedor <= 0) return false;
      return precioMenor === precioProveedor;
    },
    sumatorias(idProveedor) {
      const articulosConCotizaciones = this.getArticulos
        .filter(articulo => articulo.cotizaciones.length > 0);

      const cotizacionesProveedor = articulosConCotizaciones
        .map((articulo) => {
          const cotizaciones = articulo.cotizaciones
            .filter(cotizacion => cotizacion.id_proveedor === idProveedor
            && cotizacion.declina_participar === false
            && cotizacion.precio_unitario > 0);
          return cotizaciones;
        })
        .flat();
      return {
        subtotal: cotizacionesProveedor.reduce((ac, obj) => (ac + Number(obj.importe)), 0) || 0,
        iva: cotizacionesProveedor.reduce((ac, obj) => (ac + Number(obj.iva_importe)), 0) || 0,
        total: cotizacionesProveedor.reduce((ac, obj) => (ac + Number(obj.gran_total)), 0) || 0,
      };
    },
    sumatoriasAdjudicadas(idProveedor) {
      const articulosConCotizaciones = this.getArticulos
        .filter(articulo => articulo.cotizaciones.length > 0);

      const cotizacionesProveedor = articulosConCotizaciones
        .map((articulo) => {
          const cotizaciones = articulo.cotizaciones
            .filter(cotizacion => cotizacion.id_proveedor === idProveedor
            && cotizacion.adjudicada === true);
          return cotizaciones;
        })
        .flat();

      return {
        subtotal: cotizacionesProveedor
          .reduce((ac, obj) => (ac + Number(obj.datosAdjudicados.importe)), 0) || 0,
        iva: cotizacionesProveedor
          .reduce((ac, obj) => (ac + Number(obj.datosAdjudicados.iva_importe)), 0) || 0,
        total: cotizacionesProveedor
          .reduce((ac, obj) => (ac + Number(obj.datosAdjudicados.gran_total)), 0) || 0,
      };
    },
    adjusicarPartida(propuesta) {
      const nuevaPropuesta = propuesta;
      const { cantidad, articulo, cotizaciones } = this.getArticulos
        .find(art => art.id === propuesta.id_adquisicion_articulo);
      const cantidadAdjudicada = this.cantidadAdjudicadaPorCotizaciones(cotizaciones);
      nuevaPropuesta.cantidad = cantidad;
      nuevaPropuesta.cantidadDisponible = (cantidad - cantidadAdjudicada);
      nuevaPropuesta.articulo = articulo;
      this.propuestaAdjudicar = nuevaPropuesta;
      this.dialogAdjudicarPartida = true;
    },
    cantidadAdjudicadaPorCotizaciones(cotizaciones) {
      let total = 0;
      const soloAdjudicadas = cotizaciones.filter(cotizacion => cotizacion.adjudicada === true);
      if (soloAdjudicadas.length <= 0) return total;
      soloAdjudicadas.forEach((cotizacion) => {
        total += Number(cotizacion.datosAdjudicados.cantidad);
      });

      return total;
    },
    adjudicarProveedor() {
    },
    cerrarDialogAdjudicar() {
      this.dialogAdjudicarPartida = false;
    },
  },
  computed: {
    ...mapGetters({
      adquisicion: 'adquisiciones/adquisicion',
      articulosAdquisicion: 'adquisiciones/articulosAdquisicion',
      proveedoresParticipando: 'adquisiciones/proveedoresParticipando',
    }),
    getAdquisicion() {
      return this.adquisicion(Number(this.$route.params.id));
    },
    getArticulos() {
      return this.articulosAdquisicion(Number(this.$route.params.id));
    },
    getProveedores() {
      if (!this.adquisicion) return [];
      return this.proveedoresParticipando(Number(this.$route.params.id));
    },
  },
  mounted() {
    const room = `ACTUALIZAR_COMPARATIVO_ADQUISICION_${this.$route.params.id}`;
    this.sockets.subscribe(room, (payload) => {
      this.$store.commit('adquisiciones/ACTUALIZAR_PANEL', { payload });
    });
  },
};
</script>

<style lang="scss" scoped>
.boder-right {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: rgba(0, 0, 0, 0.54);
}
table.v-table thead th {
  white-space: normal !important;
}
.display-inline {
  display: inline !important;
}
.border {
  border: 1px solid #ccc;
}
</style>
