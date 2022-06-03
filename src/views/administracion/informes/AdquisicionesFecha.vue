<template>
  <div id="contenedor-informes-adquisiciones-fechas">
    <v-container fluid class="pt-0">
      <page-title titulo="Informes de Adquisiciones" class="pl-5"></page-title>
      <v-card>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 md3 class="p-xs-r-15">
              <v-select
                v-model="unidadSeleccionada"
                label="Unidad Compradora"
                placeholder="Todas las Unidades"
                hide-details
                :items="getUnidades"
                item-text="nombre"
                item-value="id"
                :menu-props="{ maxHeight: '400' }"
                clearable>
              </v-select>
            </v-flex>
            <v-flex xs12 sm4 md2 class="p-xs-r-15">
              <v-menu
                v-model="menuFechaInicial"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formatoFechaInicial"
                    label="Fecha Inicial"
                    prepend-inner-icon="event"
                    readonly
                    hide-details
                    v-on="on">
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="fechaInicial"
                  locale="es-MX"
                  @input="menuFechaInicial = false">
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm4 md2 class="p-xs-r-15">
              <v-menu
                v-model="menuFechaFinal"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formatoFechaFinal"
                    label="Fecha Final"
                    hide-details
                    prepend-inner-icon="event"
                    readonly
                    v-on="on">
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="fechaFinal"
                  locale="es-MX"
                  @input="menuFechaFinal = false">
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm4 md2 class="p-xs-r-15">
              <v-select
                v-model="filtros.tipo"
                label="Tipo Compra"
                placeholder="Todos"
                :items="tipos"
                item-text="texto"
                item-value="id"
                hide-details
                clearable
                @click:clear="$nextTick(() => filtros.tipo = '')"
                @change="setFiltros">
              </v-select>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field
                v-model="searchText"
                placeholder="Buscar..."
                append-icon="search"
                hide-details
                clearable
                @click:clear="setFiltros">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md2 class="p-xs-r-15">
              <v-checkbox
                class="pb-3"
                v-model="mostrarDetalles"
                hide-details
                label="Mostrar Detalles">
              </v-checkbox>
            </v-flex>
          </v-layout>
          <v-data-table
            class="tablaReporte"
            :items="listado"
            :headers="headers"
            :search="searchText"
            :pagination.sync="pagination">
            <template slot="headerCell" slot-scope="props">
              <span class="black--text font-weight-black">
                {{ props.header.text }}
              </span>
            </template>
            <template slot="items" slot-scope="props">
              <tr class="green lighten-4 elevation-2">
                <td>{{ (props.index + 1) }}</td>
                <td>
                  {{ $moment(props.item.fecha).format('DD-MM-YYYY') }}
                </td>
                <td>{{ props.item.partida }}</td>
                <td>{{ getTipo(props.item.tipo).texto }}</td>
                <td>{{ props.item.numero }}</td>
                <td align="right">
                  {{ props.item.importe | currency }}
                </td>
                <td></td>
              </tr>
              <template v-if="props.item.importe && mostrarDetalles">
                <tr class="green lighten-5 elevation-1">
                  <td colspan="2" align="center" class="font-weight-bold">#</td>
                  <td align="left" class="font-weight-bold">Articulo</td>
                  <td align="center" class="font-weight-bold">Cant.</td>
                  <td align="center" class="font-weight-bold">P.Unit.</td>
                  <td align="center" class="font-weight-bold">Importe</td>
                  <td align="center" class="font-weight-bold">Proveedor</td>
                </tr>
                <tr v-for="(item, i) in props.item.articulos" :key="item.idAdquisicionArticulo">
                  <td colspan="2" align="center">{{ i + 1 }}</td>
                  <td>
                    <small>
                      {{ item.nombre }}
                    </small>
                    <!-- <v-chip
                      @click="onMostrarCaracteristicas(item.nombre)">
                      ver..
                    </v-chip> -->
                  </td>
                  <td align="center">
                    <small v-if="item.cotizacionesAdjudicadas.length === 1">
                      {{
                        item.cotizacionesAdjudicadas
                        .sort((a, b) => a.precio_unitario - b.precio_unitario)[0]
                        .datosAdjudicados.cantidad
                      }}
                    </small>
                    <small v-else-if="item.cotizacionesAdjudicadas.length > 1">
                      <ol>
                        <li
                          v-for="propuesta in item.cotizacionesAdjudicadas"
                          :key="propuesta.id">
                          {{ propuesta.datosAdjudicados.cantidad }}
                        </li>
                      </ol>
                    </small>
                  </td>
                  <td align="right">
                    <small>
                      <span v-if="item.cotizacionesAdjudicadas.length === 1">
                        {{
                          item.cotizacionesAdjudicadas
                          .sort((a, b) => a.precio_unitario - b.precio_unitario)[0]
                          .datosAdjudicados.precio_unitario | currency
                        }}
                      </span>
                      <ol v-else-if="item.cotizacionesAdjudicadas.length > 1">
                        <li
                          v-for="propuesta in item.cotizacionesAdjudicadas"
                          :key="propuesta.id">
                          {{ propuesta.datosAdjudicados.precio_unitario | currency }}
                        </li>
                      </ol>
                    </small>
                  </td>
                  <td align="right">
                    <small>
                      <span v-if="item.cotizacionesAdjudicadas.length === 1">
                        {{
                          item.cotizacionesAdjudicadas
                          .sort((a, b) => a.precio_unitario - b.precio_unitario)[0]
                          .datosAdjudicados.importe | currency
                        }}
                      </span>
                      <ol v-else-if="item.cotizacionesAdjudicadas.length > 1">
                        <li
                          v-for="propuesta in item.cotizacionesAdjudicadas"
                          :key="propuesta.id">
                          {{ propuesta.datosAdjudicados.importe | currency }}
                        </li>
                      </ol>
                    </small>
                  </td>
                  <td align="right">
                    <small>
                      <span v-if="item.cotizacionesAdjudicadas.length === 1">
                        {{
                          item.cotizacionesAdjudicadas
                          .sort((a, b) => a.precio_unitario - b.precio_unitario)[0]
                          .proveedor.nombre
                        }}
                      </span>
                      <ol v-else-if="item.cotizacionesAdjudicadas.length > 1">
                        <li
                          v-for="propuesta in item.cotizacionesAdjudicadas"
                          :key="propuesta.id">
                          {{ propuesta.proveedor.nombre }}
                        </li>
                      </ol>
                    </small>
                  </td>
                </tr>
              </template>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <!-- <dialog-articulo-caracteristicas
      :texto="caracteristicasArticulo"
      :mostrarCaracteristicas="mostrarCaracteristicas" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
// import DialogArticuloCaracteristicas from '@/components/DialogArticuloCaracteristicas.vue';

export default {
  name: 'ListadoAdquisiciones',
  components: {
    PageTitle,
    // DialogArticuloCaracteristicas,
  },
  data() {
    return {
      mostrarCaracteristicas: false,
      caracteristicasArticulo: '',
      searchText: '',
      mostrarDetalles: false,
      fechaInicial: this.$moment().subtract(1, 'months').format('YYYY-MM-DD'),
      fechaFinal: new Date().toISOString().substr(0, 10),
      menuFechaInicial: false,
      menuFechaFinal: false,
      adquisicion: {},
      unidadSeleccionada: null,
      pagination: {
        sortBy: 'fecha',
        descending: true,
        rowsPerPage: 25,
      },
      headers: [
        { text: '#', align: 'left', value: '' },
        { text: 'Fecha', sortable: true, value: 'fecha' },
        { text: 'Partida', sortable: true, value: 'partida' },
        { text: 'Tipo', sortable: true, value: 'tipo' },
        { text: 'Número', sortable: true, value: 'numero' },
        { text: 'Importe', sortable: true, value: 'importe' },
        { text: '', sortable: false, value: '' },
      ],
      filtros: {
        tipo: '',
        searchText: '',
        estatus: '',
      },
    };
  },
  mounted() {
    if (this.getFiltros) {
      const filtros = {
        tipo: this.getFiltros.tipo,
        searchText: this.getFiltros.searchText,
        estatus: this.getFiltros.estatus,
      };
      this.filtros = filtros;
    }
  },
  methods: {
    getTipo(tipo) {
      return this.tipo(tipo);
    },
    borrarAdquisicion() {},
    setFiltros() {
      const filtros = {
        tipo: this.filtros.tipo,
        searchText: this.filtros.searchText,
        estatus: this.filtros.estatus,
      };
      this.$store.commit('adquisiciones/SET_FILTROS', { filtros });
    },
    // onMostrarCaracteristicas(caracteristicas) {
    //   this.caracteristicasArticulo = caracteristicas;
    //   this.mostrarCaracteristicas = true;
    // },
  },
  computed: {
    ...mapGetters({
      unidades: 'settings/catalogos/unidadesAdministrativas',
      tipos: 'adquisiciones/tipos',
      tipo: 'adquisiciones/tipo',
      getFiltros: 'adquisiciones/filtros',
      articulosAdjudicados: 'adquisiciones/articulosAdjudicados',
    }),
    getUnidades() {
      const uniAdmin = [{
        id: 'sinUnidad',
        nombre: 'SIN UNIDAD',
      }];
      uniAdmin.push(...this.unidades);
      return uniAdmin;
    },
    listado() {
      return this.articulosAdjudicados
        .filter((item) => {
          if (!this.unidadSeleccionada) return item;
          if ((this.unidadSeleccionada === 'sinUnidad') && (item.nombre_unidad === 'SIN UNIDAD')) return item;
          if (item.nombre_unidad === 'SIN UNIDAD') return false;
          return item.unidad_administrativa.id === this.unidadSeleccionada;
        })
        .filter((item) => {
          if (!this.filtros.tipo) return item;
          return item.tipo === this.filtros.tipo;
        })
        .filter(item => this.$moment(item.fecha).isSameOrAfter(this.fechaInicial)
          && this.$moment(item.fecha).isSameOrBefore(this.fechaFinal));
    },
    formatoFechaInicial() {
      return this.$moment(this.fechaInicial).format('DD-MM-YYYY');
    },
    formatoFechaFinal() {
      return this.$moment(this.fechaFinal).format('DD-MM-YYYY');
    },
  },
};
</script>

<style lang="scss">
.tablaReporte th {
  background-color:#E0E0E0;
}
</style>
