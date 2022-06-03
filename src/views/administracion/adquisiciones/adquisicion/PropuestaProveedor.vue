<template>
  <div id="contenedor-propuesta-proveedor">
    <page-title titulo="Propuesta Proveedor"></page-title>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 md4 class="p-xs-r-15">
            <v-select
              v-model="proveedorSeleccionado"
              label="Proveedor"
              :items="getParticipantes"
              item-text="nombre"
              item-value="id"
              solo>
            </v-select>
          </v-flex>
          <v-flex>
            <v-checkbox
              v-model="mostrarLog"
              hide-details
              label="Mostrar historial"
            ></v-checkbox>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 md4>
            <v-text-field
              v-model="searchText"
              placeholder="Buscar..."
              append-icon="search"
              clearable
              solo>
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="getHistorial"
          :search.sync="searchText"
          :pagination.sync="pagination">
          <template slot="items" slot-scope="props">
            <tr :class="{'grey lighten-4': mostrarLog}">
              <td>{{ (props.index + 1) }}</td>
              <td>{{ props.item.articulo.clave_interna }}</td>
              <td>{{ props.item.articulo.cabms }}</td>
              <td>{{ props.item.articulo.nombre }}</td>
              <template v-if="props.item.cotizacion">
                <template v-if="props.item.cotizacion.declina_participar">
                  <td colspan="5" align="center">
                    <div
                      class="red lighten-3 white--text text-xs-center"
                      style="text-transform: uppercase;">
                      <span>
                        Declinó participar.
                      </span>
                    </div>
                  </td>
                </template>
                <template v-else>
                  <td align="justify">
                    {{ props.item.cotizacion.caracteristicas }}
                  </td>
                  <td align="right">
                    {{ props.item.cotizacion.precio_unitario | currency }}
                  </td>
                  <td align="right">
                    {{ props.item.cotizacion.por_iva || 0 }}%
                  </td>
                  <td align="right">
                    {{ props.item.cotizacion.gran_total | currency }}
                  </td>
                  <td>
                    <small>
                      {{ $moment(props.item.cotizacion.created_at).format('DD-MM-YY HH:mm:ss') }}
                    </small>
                  </td>
                </template>
              </template>
              <template v-else>
                <td align="center">-</td>
                <td align="center">-</td>
                <td align="center">-</td>
                <td align="center">-</td>
                <td align="center">-</td>
              </template>
            </tr>
            <template v-if="mostrarLog">
              <tr
                v-for="cotizacion in props.item.cotizaciones_log"
                :key="cotizacion.id"
                :class="cotizacion.tipo === 1 ? '' : 'orange lighten-5'">
                <td colspan="5"></td>
                <td align="right">
                  {{ cotizacion.precio_unitario | currency }}
                </td>
                <td>{{ cotizacion.por_iva }}%</td>
                <td align="right">{{ cotizacion.gran_total | currency  }}</td>
                <td>
                  <small>
                    {{ $moment(cotizacion.created_at).format('DD-MM-YY HH:mm:ss') }}
                  </small>
                </td>
              </tr>
            </template>
          </template>
          <v-alert slot="no-results"
            :value="true"
            color="error"
            icon="warning">
            No se encontró ninguna coincidencia para "{{ searchText }}".
          </v-alert>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
// import Mensajes from '@/helpers/mensajes';

export default {
  name: 'PropuestaProveedor',
  components: {
    PageTitle,
  },
  data() {
    return {
      searchText: '',
      mostrarLog: true,
      proveedorSeleccionado: null,
      listado: [],
      headers: [
        { text: '#', sortable: true, value: '' },
        { text: 'Clave Int.', sortable: true, value: 'articulo.clave_interna' },
        { text: 'CABMS', sortable: true, value: 'articulo.cabms' },
        { text: 'Nombre', sortable: true, value: 'articulo.nombre' },
        { text: 'Comentarios', sortable: false, value: 'caracteristicas' },
        { text: 'Precio U.', sortable: false, value: 'precio_unitario' },
        { text: 'IVA', sortable: false, value: 'por_iva' },
        { text: 'Total', sortable: false, value: 'gran_total' },
        { text: 'Fecha', sortable: false, value: 'created_at' },
      ],
      pagination: {
        sortBy: 'numero',
        descending: false,
        rowsPerPage: 25,
      },
    };
  },
  mounted() {},
  methods: {
    ordenarCotizacionLog(arreglo) {
      return arreglo.sort((a, b) => {
        if (a.created_at < b.created_at) return 1;
        if (a.created_at > b.created_at) return -1;
        return 0;
      });
    },
  },
  computed: {
    ...mapGetters({
      getAdq: 'adquisiciones/adquisicion',
    }),
    getAdquisicion() {
      return this.getAdq(Number(this.$route.params.id));
    },
    getProveedoresParticipando() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.articulos
        .map(articulo => articulo.cotizaciones
          .map(cotizacion => cotizacion.id_proveedor).flat()).flat();
    },
    getParticipantes() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.participantes
        .filter(participante => this.getProveedoresParticipando
          .includes(participante.proveedor.id))
        .map(item => item.proveedor);
    },
    getHistorial() {
      if (!this.getAdquisicion) return [];
      if (!this.proveedorSeleccionado) return [];
      return this.getAdquisicion.articulos.map((item) => {
        const cotProveedor = item.cotizaciones
          .filter(cotizacion => cotizacion.id_proveedor === this.proveedorSeleccionado);
        const logCotProveedor = item.cotizaciones_log
          .filter(cotizacion => cotizacion.id_proveedor === this.proveedorSeleccionado);
        return {
          articulo: item.articulo,
          cotizacion: cotProveedor[0],
          cotizaciones_log: this.ordenarCotizacionLog(logCotProveedor),
        };
      });
    },
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
