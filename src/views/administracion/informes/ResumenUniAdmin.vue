<template>
  <div id="contenedor-informes-adquisiciones-unidades">
    <v-container fluid class="pt-0">
      <page-title titulo="Informes de Adquisiciones por Unidades Compradoras"
      class="pl-5"></page-title>
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
            :items="agruparUnindades"
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
                <td class="font-weight-black">{{ (props.index + 1) }}</td>
                <td class="font-weight-black">{{ props.item.nombre }}</td>
                <td></td>
                <td></td>
                <td align="right" class="font-weight-black">
                  {{ props.item.importe | currency }}
                </td>
                <td colspan="4"></td>
              </tr>
              <template v-if="props.item.importe && mostrarDetalles">
                <template v-for="(articulosUnidadAdmin, i ) in props.item.articulos">
                  <tr
                    class="green lighten-5 elevation-1"
                    :key="articulosUnidadAdmin.id">
                    <td align="center" class="font-weight-medium">
                      <small>
                        {{ i + 1 }}
                      </small>
                    </td>
                    <td class="font-weight-medium">
                      <small>
                        {{ articulosUnidadAdmin.nombre }}
                      </small>
                    </td>
                    <td  align="center" class="font-weight-medium">
                      <small>
                        <span v-if="articulosUnidadAdmin.cantidad.length === 1">
                          {{ articulosUnidadAdmin.cantidad[0] }}
                        </span>
                        <ol v-else-if="articulosUnidadAdmin.cantidad.length > 1">
                          <li
                            v-for="(cantidad, indCant) in articulosUnidadAdmin.cantidad"
                            :key="indCant">
                            {{ cantidad }}
                          </li>
                        </ol>
                      </small>
                    </td>
                    <td  align="right" class="font-weight-medium">
                      <small>
                        <span v-if="articulosUnidadAdmin.precio_unitario.length === 1">
                          {{ articulosUnidadAdmin.precio_unitario[0] }}
                        </span>
                        <ol v-else-if="articulosUnidadAdmin.precio_unitario.length > 1">
                          <li
                            v-for="(precio_unitario, indPU) in articulosUnidadAdmin.precio_unitario"
                            :key="indPU">
                            {{ precio_unitario | currency }}
                          </li>
                        </ol>
                      </small>
                    </td>
                    <td align="right" class="font-weight-medium">
                      <small>
                        <span v-if="articulosUnidadAdmin.importe.length === 1">
                          {{ articulosUnidadAdmin.importe[0] }}
                        </span>
                        <ol v-else-if="articulosUnidadAdmin.importe.length > 1">
                          <li
                            v-for="(importe, indImpo) in articulosUnidadAdmin.importe"
                            :key="indImpo">
                            {{ importe | currency }}
                          </li>
                        </ol>
                      </small>
                    </td>
                    <td align="center" class="font-weight-light">
                      <small>
                        {{ $moment(articulosUnidadAdmin.fecha).format('DD-MM-YYYY') }}
                      </small>
                    </td>
                    <td align="center" class="font-weight-light">
                      <small>
                        {{ articulosUnidadAdmin.numero }}
                      </small>
                    </td>
                    <td class="font-weight-light">
                      <small>
                        {{ articulosUnidadAdmin.partida }}
                      </small>
                    </td>
                    <td class="font-weight-light">
                      <small>
                        <span v-if="articulosUnidadAdmin.proveedor.length === 1">
                          {{ articulosUnidadAdmin.proveedor[0] }}
                        </span>
                        <ol v-else-if="articulosUnidadAdmin.proveedor.length > 1">
                          <li
                            v-for="(proveedor, indProve) in articulosUnidadAdmin.proveedor"
                            :key="indProve">
                            {{ proveedor }}
                          </li>
                        </ol>
                      </small>
                    </td>
                  </tr>
                </template>
              </template>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';

export default {
  name: 'ListadoAdquisicionesUnidades',
  components: {
    PageTitle,
  },
  data() {
    return {
      searchText: '',
      mostrarDetalles: false,
      unidadSeleccionada: null,
      fechaInicial: this.$moment().subtract(1, 'months').format('YYYY-MM-DD'),
      fechaFinal: new Date().toISOString().substr(0, 10),
      menuFechaInicial: false,
      menuFechaFinal: false,
      listadoPartidas: [],
      pagination: {
        sortBy: 'fecha',
        descending: true,
        rowsPerPage: 25,
      },
      headers: [
        { text: '#', align: 'left', value: '' },
        { text: 'Unidad Compradora / Articulo', sortable: true, value: 'nombre' },
        { text: 'Cant.', sortable: false, value: 'cant' },
        { text: 'P.Unit', sortable: false, value: 'precio_unitario' },
        { text: 'Importe', sortable: true, value: 'importe' },
        { text: 'Fecha', sortable: false, value: 'fecha' },
        { text: 'Número', sortable: false, value: 'numero' },
        { text: 'Partida', sortable: false, value: 'partida' },
        { text: 'Proveedor', sortable: false, value: 'proveedor' },
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
    fetchPartidas() {
      this.listadoPartidas = [];
    },
    setFiltros() {
      const filtros = {
        tipo: this.filtros.tipo,
        searchText: this.filtros.searchText,
        estatus: this.filtros.estatus,
      };
      this.$store.commit('adquisiciones/SET_FILTROS', { filtros });
    },
  },
  computed: {
    ...mapGetters({
      unidades: 'settings/catalogos/unidadesAdministrativas',
      tipos: 'adquisiciones/tipos',
      tipo: 'adquisiciones/tipo',
      getFiltros: 'adquisiciones/filtros',
      getAdquisiciones: 'adquisiciones/adquisiciones',
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
    agruparUnindades() {
      const unidadesAdmin = [];
      this.listado.forEach((adquisicion) => {
        const articulos = adquisicion.articulos.map((item) => {
          const datosArticulo = {
            nombre: item.nombre,
            cantidad: item.cotizacionesAdjudicadas
              .map(coti => coti.datosAdjudicados.cantidad),
            precio_unitario: item.cotizacionesAdjudicadas
              .map(coti => coti.datosAdjudicados.precio_unitario),
            importe: item.cotizacionesAdjudicadas
              .map(coti => coti.datosAdjudicados.importe),
            fecha: adquisicion.fecha,
            numero: adquisicion.numero,
            partida: adquisicion.partida,
            proveedor: item.cotizacionesAdjudicadas
              .map(coti => coti.proveedor.nombre),
          };
          return datosArticulo;
        });

        const unidadExistente = unidadesAdmin
          .find(elem => elem.nombre === adquisicion.nombre_unidad);
        if (unidadExistente) {
          unidadExistente.articulos.push(...articulos);
          unidadExistente.importe += adquisicion.importe;
        } else {
          const datosUnidad = {
            nombre: adquisicion.nombre_unidad,
            importe: adquisicion.importe,
            articulos: [],
          };
          datosUnidad.articulos.push(...articulos);
          unidadesAdmin.push(datosUnidad);
        }
      });
      return unidadesAdmin;
    },
  },
};
</script>

<style lang="scss">
.tablaReporte th {
  background-color:#E0E0E0;
}
</style>
