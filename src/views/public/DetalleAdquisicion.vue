<template>
  <div id="contenedor-detalles-adquisicion">
    <v-container fluid px-2>
      <v-card class="mb-4 elevation-10 mx-2 roundedCustom">
        <v-layout
          align-center
          justify-space-between
          row
          :class="{
          'warning': estatusEvento.tipo === 1,
          'success white--text': estatusEvento.tipo === 2,
          'error white--text': estatusEvento.tipo === 3}">
          <v-flex xs12 md4>
            <h1>
              {{ getAdquisicion.numero }}
            </h1>
            <span>
              {{ getAdquisicion.nombre }}
            </span>
          </v-flex>
          <v-flex xs12 md4 class="hidden-sm-and-down">
            <v-text-field
              v-model="searchText"
              placeholder="Buscar artículo"
              append-icon="search"
              clearable
              hide-details
              solo
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md4>
            <count-down
              :inicio="getFechasEvento.inicio"
              :termino="getFechasEvento.termino"
              @change="comprobarEvento"
              @estatus="cambiarEstatus"
              v-if="getFechasEvento.termino"
            ></count-down>
          </v-flex>
        </v-layout>
        <template v-slot:extension v-if="isMobile">
          <v-text-field
            v-model="searchText"
            placeholder="Buscar..."
            append-icon="search"
            clearable
            solo
            class="pt-1 pr-1 hidden-md-and-up d-inline-flex"
          ></v-text-field>
        </template>
      </v-card>
      <v-card class="roundedCustom">
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="getArticulos"
            :pagination.sync="pagination"
            :search="searchText"
            item-key="id"
            dense
          >
            <template v-slot:items="props">
              <tr
                @click="props.expanded = !props.expanded"
                :class="{ 'success white--text': props.item.adjudicada }">
                <td>
                  {{ props.index + 1 }}
                </td>
                <td>
                  {{ props.item.articulo.nombre }}
                </td>
                <!-- <td>
                  {{ props.item.caracteristicas }}
                </td>
                <td>
                  {{ props.item.articulo.cabms }}
                </td> -->
                <td>
                  {{ props.item.articulo.unidad }}
                </td>
                <td align="center">
                  {{ props.item.cantidad }}
                </td>
                <td align="center">
                  <v-chip color="blue-grey lighten-3" class="elevation-4">
                    <b>{{ props.item.cotizacionesLog.length }}</b>
                  </v-chip>
                </td>
                <!-- <td>
                  {{ props.item.articulo.presentacion }}
                </td> -->
                <td align="right">
                  <span v-if="!props.item.adjudicada">
                    <v-chip color="lime lighten-2" class="elevation-4">
                      <b>{{ props.item.precioMenor | currency }}</b>
                    </v-chip>
                  </span>
                  <!-- <span
                      v-else>
                      {{ props.item.propuestaAdjudicada.precio_unitario | currency }}
                    </span> -->
                  <ol v-else-if="props.item.propuestasAdjudicadas.length > 1">
                    <li v-for="propuesta in props.item.propuestasAdjudicadas" :key="propuesta.id">
                      {{ propuesta.datosAdjudicados.precio_unitario | currency }}
                    </li>
                  </ol>
                  <span v-else>
                    <v-chip color="lime lighten-1">
                      <b>
                        {{
                          props.item.propuestasAdjudicadas.sort(
                            (a, b) => a.precio_unitario - b.precio_unitario
                          )[0].datosAdjudicados.precio_unitario | currency
                        }}
                      </b>
                    </v-chip>
                    <!-- {{
                      props.item.propuestasAdjudicadas.sort(
                        (a, b) => a.precio_unitario - b.precio_unitario
                      )[0].datosAdjudicados.precio_unitario | currency
                    }} -->
                  </span>
                </td>
                <!-- <td align="justify">
                  <span v-if="!props.item.adjudicada">
                    {{ props.item.propuestaMenorComentarios }}
                  </span>
                  <span
                      v-else>
                      {{ props.item.propuestaAdjudicada.caracteristicas || '' }}
                    </span>
                  <ol v-else-if="props.item.propuestasAdjudicadas.length > 1">
                    <li v-for="propuesta in props.item.propuestasAdjudicadas" :key="propuesta.id">
                      {{ propuesta.caracteristicas || "SIN COMENTARIOS" }}
                    </li>
                  </ol>
                  <span v-else>
                    {{
                      props.item.propuestasAdjudicadas.sort(
                        (a, b) => a.precio_unitario - b.precio_unitario
                      )[0].caracteristicas
                    }}
                  </span>
                </td> -->
                <!-- <td align="right">
                  <span
                      v-if="props.item.adjudicada">
                      {{ props.item.propuestaAdjudicada.precio_unitario | currency }}
                    </span>
                  <template v-if="props.item.adjudicada">
                    <ol v-if="props.item.propuestasAdjudicadas.length > 1">
                      <li v-for="propuesta in props.item.propuestasAdjudicadas" :key="propuesta.id">
                        {{ propuesta.datosAdjudicados.precio_unitario | currency }}
                      </li>
                    </ol>
                    <span v-else>
                      {{
                        props.item.propuestasAdjudicadas.sort(
                          (a, b) => a.precio_unitario - b.precio_unitario
                        )[0].datosAdjudicados.precio_unitario | currency
                      }}
                    </span>
                  </template>
                </td> -->
              </tr>
            </template>
            <template v-slot:expand="props">
              <v-layout justify-end class="mt-1 mr-1 grey--text text--lighten-2">
                <v-flex xs3 class="primary roundedTopLeft" v-if="!eventoLive">
                  <b>Proveedor</b>
                </v-flex>
                <v-flex xs2 class="primary" :class="{roundedTopLeft: eventoLive}">
                  <b>Fecha postura</b>
                </v-flex>
                <v-flex xs1 class="primary roundedTopRight">
                  <b>Postura</b>
                </v-flex>
              </v-layout>
              <v-layout
                v-for="cotizacion in props.item.cotizacionesLog"
                :key="cotizacion.id"
                justify-end
                fill-height
                align-center
                mr-1>
                <v-flex
                  v-if="!eventoLive"
                  xs3
                  :class="cotizacion.tipo !== 2 ? '' : 'orange lighten-5'">
                  <small>{{ cotizacion.proveedor.nombre }}</small>
                </v-flex>
                <v-flex xs2 :class="cotizacion.tipo !== 2 ? '' : 'orange lighten-5'">
                  <small>
                    {{ $moment(cotizacion.created_at).format('DD-MM-YY HH:mm:ss') }}
                  </small>
                </v-flex>
                <v-flex xs1 v-if="cotizacion.tipo !== 2">
                  <v-chip color="lime lighten-2" class="elevation-2" small>
                    <b>{{ cotizacion.precio_unitario | currency }}</b>
                  </v-chip>
                  <!-- <small>{{ cotizacion.precio_unitario | currency }}</small> -->
                </v-flex>
                <v-flex xs1 v-else class="orange lighten-5">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <b class="orange--text text--darken-4">
                          {{ cotizacion.precio_unitario | currency }}
                        </b>
                        <v-icon small class="orange--text text--darken-2">
                          undo
                        </v-icon>
                      </div>
                    </template>
                    <span>Regresó a postura anterior</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';
import CountDown from '@/components/CountDown.vue';

export default {
  name: 'detalleAdquisicion',
  components: {
    CountDown,
  },
  data: () => ({
    searchText: '',
    eventoLive: false,
    isMobile: false,
    estatusEvento: {
      tipo: 1,
      texto: null,
    },
    pagination: {
      sortBy: 'nombre',
      descending: false,
      rowsPerPage: 5000,
    },
    headers: [
      {
        text: '#',
        align: 'left',
        sortable: false,
        value: '',
      },
      { text: 'Nombre', sortable: true, value: 'articulo.nombre' },
      // { text: 'Característica', sortable: false, value: 'caracteristicas' },
      // { text: 'CABMS', sortable: true, value: 'articulo.cabms' },
      { text: 'Unidad M.', sortable: true, value: 'articulo.unidad' },
      {
        text: 'Cantidad', sortable: true, value: 'cantidad', align: 'center',
      },
      {
        text: 'Posturas', sortable: true, value: 'posturas', align: 'center',
      },
      // { text: 'Presentación', sortable: true, value: 'arituclo.presentacion' },
      {
        text: 'Mejor Oferta', sortable: true, value: 'precioMenor', align: 'right',
      },
      // { text: 'Comentarios y condiciones del proveedor', sortable: false, value: '' },
      // { text: 'Monto Adjudicado', sortable: false, value: '' },
    ],
  }),
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true });
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
    if (this.adquisiciones.length <= 0) this.cargarPortal();
  },
  methods: {
    ...mapActions('portal', ['cargarPortal']),
    onResize() {
      this.isMobile = window.innerWidth < 960;
    },
    comprobarEvento(valor) {
      this.eventoLive = valor;
    },
    cambiarEstatus(estatus) {
      this.estatusEvento = estatus;
    },
    cargar() {
      this.cargarPortal()
        .then()
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
  },
  computed: {
    ...mapGetters({
      adquisiciones: 'portal/adquisiciones',
      adquisicion: 'portal/adquisicion',
    }),
    getAdquisicion() {
      if (this.adquisiciones.length <= 0) return {};
      return this.adquisicion(this.$route.params.id);
    },
    getFechasEvento() {
      if (this.getAdquisicion === {}) {
        return {
          inicio: null,
          termino: null,
        };
      }
      return {
        inicio: this.getAdquisicion.fecha_inicio,
        termino: this.getAdquisicion.fecha_termino,
      };
    },
    getArticulos() {
      if (this.getAdquisicion === {}) return [];
      return this.getAdquisicion.articulos;
    },
  },
  sockets: {
    nuevoProveedor(proveedor) {
      this.$store.commit('portal/AGREGAR_PROVEEDOR', { proveedor });
    },
    nuevaAdquisicion(adquisicion) {
      this.$store.commit('portal/AGREGAR_ADQUISICION', { adquisicion });
    },
    editarAdquisicion(adquisicion) {
      this.$store.commit('portal/ACTUALIZAR_ADQUISICION', { adquisicion });
    },
    adjudicarArticulo(datos) {
      this.$store.commit('portal/ACTUALIZAR_COTIZACIONES_ARTICULO', { datos });
    },
    actualizarCotizacionAdquisicion(payload) {
      this.$store.commit('portal/ACTUALIZAR_PANEL', { payload });
    },
    borrarArticuloAdquisicion(payload) {
      this.$store.commit('portal/BORRAR_ARTICULO_ADQUISICION', { payload });
    },
  },
};
</script>

<style lang="scss">
.roundedCustom {
  border-radius: 8px;
}
.roundedTopLeft {
  border-top-left-radius: 8px;
}
.roundedTopRight {
  border-top-right-radius: 8px;
}
</style>
