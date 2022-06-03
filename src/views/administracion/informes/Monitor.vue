<template>
  <div id="contenedor-monitor-global" class="grid-list-lg">
    <page-title titulo="Monitor" class="pl-5"></page-title>
    <v-layout row wrap>
      <v-flex xs12 md3>
        <v-card class="roundedCustom">
          <v-card-title class="primary white--text py-2" dark>
            Proveedores en línea
            <v-chip small outline text-color="white">
              {{ getUsuariosProveedores.length }}
            </v-chip>
          </v-card-title>
          <v-card-text class="altura-listado">
            <v-list two-line>
              <div v-for="(usuario, index) in getUsuariosProveedores" :key="`t__usr-${index}`">
                <v-divider v-if="index > 0" :key="index"> </v-divider>
                <v-list-tile :key="`__usuario-${index}`">
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ usuario.proveedor.nombre || "Sin Nombre" }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ usuario.nombre }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </div>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-layout row wrap>
          <!-- EVENTOS -->
          <v-flex xs12>
            <v-card class="roundedCustom">
              <v-card-title class="blue-grey darken-3 white--text py-2" dark>
                Eventos en Proceso
                <v-chip small outline text-color="white">
                  {{ getListadoAdquisiciones.length }}
                </v-chip>
              </v-card-title>
              <v-card-text class="altura-maxima-listado">
                <v-data-table
                  v-model="filtros.seleccionados"
                  :items="getListadoAdquisiciones"
                  :headers="headers"
                  hide-actions
                  item-key="id"
                  class="py-0 px-0 my-0 mx-0"
                >
                  <template slot="items" slot-scope="props">
                    <tr :active="props.selected" @click="props.selected = !props.selected">
                      <td>
                        <v-checkbox :input-value="props.selected" hide-details></v-checkbox>
                      </td>
                      <td>
                        <small>
                          <b>{{ props.item.nombre }}</b>
                        </small>
                      </td>
                      <td align="center">
                        {{ props.item.articulos.length }}
                      </td>
                      <td align="center">
                        {{ getAdquisicionArticulosConCotizacion(props.item) }}
                      </td>
                      <td align="center">
                        {{ getAdquisicionProveedoresCotizando(props.item) }}
                      </td>
                      <td class="px-0">
                        <count-down
                          :inicio="props.item.fecha_inicio"
                          :termino="props.item.fecha_termino"
                        >
                        </count-down>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-switch
                  v-model="filtros.incluirConcluidos"
                  color="primary"
                  label="Incluir procesos concluidos"
                  hide-details
                  class="my-0"
                >
                </v-switch>
              </v-card-actions>
            </v-card>
          </v-flex>
          <!-- ARTICULOS -->
          <v-flex xs12 md6>
            <v-card class="brown darken-1 roundedCustom" dark>
              <v-card-text>
                <v-layout row wrap justify-space-between>
                  <v-flex xs12 md6 class="title">
                    Articulos
                  </v-flex>
                  <v-divider vertical> </v-divider>
                  <v-flex
                    xs12
                    md4
                    class="text-xs-left text-md-right
                                            display-2 font-weight-thin"
                  >
                    {{ getArticulos.length }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- Articulos Cotizados -->
          <v-flex xs12 md6>
            <v-card class="primary roundedCustom" dark>
              <v-card-text>
                <v-layout row wrap justify-space-between>
                  <v-flex xs12 md6 class="title">
                    Articulos con Postura
                  </v-flex>
                  <v-divider vertical> </v-divider>
                  <v-flex
                    xs12
                    md4
                    class="text-xs-left text-md-right  display-2 font-weight-thin"
                  >
                    {{ getArticulosConCotizacion.length }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- Articulos sin Cotización -->
          <v-flex xs12 md6>
            <v-card class="yellow darken-2 roundedCustom" dark>
              <v-card-text>
                <v-layout row wrap justify-space-between>
                  <v-flex xs12 md6 class="title">
                    Articulos sin Postura
                  </v-flex>
                  <v-divider vertical> </v-divider>
                  <v-flex
                    xs12
                    md4
                    class="text-xs-left text-md-right
                                            display-2 font-weight-thin"
                  >
                    {{ getArticulosSinCotizacion.length }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- Cotizaciones recibidas -->
          <v-flex xs12 md6>
            <v-card class="cyan darken-3 roundedCustom" dark>
              <v-card-text>
                <v-layout row wrap justify-space-between>
                  <v-flex xs12 md6 class="title">
                    Posturas recibidas
                  </v-flex>
                  <v-divider vertical> </v-divider>
                  <v-flex
                    xs12
                    md4
                    class="text-xs-left text-md-right display-2 font-weight-thin"
                  >
                    {{ getCotizacionesRecibidas.length }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- Proveedores participantes -->
          <v-flex xs12 md6>
            <v-card class="grey darken-2 roundedCustom" dark>
              <v-card-text>
                <v-layout row wrap justify-space-between>
                  <v-flex xs12 md6 class="title">
                    Proveedores participantes
                  </v-flex>
                  <v-divider vertical> </v-divider>
                  <v-flex
                    xs12
                    md4
                    class="text-xs-left text-md-right display-2 font-weight-thin"
                  >
                    {{ proveedores.length }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- Proveedores que han cotizado -->
          <v-flex xs12 md6>
            <v-card class="light-green darken-3 roundedCustom" dark>
              <v-card-text>
                <v-layout row wrap justify-space-between>
                  <v-flex xs12 md6 class="title">
                    Proveedores que han ofertado
                  </v-flex>
                  <v-divider vertical> </v-divider>
                  <v-flex
                    xs12
                    md4
                    class="text-xs-left text-md-right display-2 font-weight-thin"
                  >
                    {{ getProveedoresConPropuesta.length }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- ARTICULOS DECLINADOS -->
          <v-flex xs12 md6>
            <v-card class="pink accent-3 roundedCustom" dark>
              <v-card-text>
                <v-layout row wrap justify-space-between>
                  <v-flex xs12 md6 class="title">
                    Articulos con Declinaciones
                  </v-flex>
                  <v-divider vertical> </v-divider>
                  <v-flex
                    xs12
                    md4
                    class="text-xs-left text-md-right
                                            display-2 font-weight-thin"
                  >
                    {{ getArticulosConDeclinaciones.length }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- ARTICULOS DECLINADOS POR TODOS -->
          <v-flex xs12 md6>
            <v-card class="pink accent-3 roundedCustom" dark>
              <v-card-text>
                <v-layout row wrap justify-space-between>
                  <v-flex xs12 md6 class="title">
                    Total de Declinaciones
                  </v-flex>
                  <v-divider vertical> </v-divider>
                  <v-flex
                    xs12
                    md4
                    class="text-xs-left text-md-right
                                            display-2 font-weight-thin"
                  >
                    {{ getCantidadDeclinaciones }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- Cotizaciones anexadas -->
          <!-- <v-flex
                        xs12
                        md6>
                        <v-card
                            class="deep-orange darken-1"
                            dark>
                            <v-card-text>
                                <v-layout row wrap justify-space-between>
                                    <v-flex
                                        xs12
                                        md6
                                        class="title">
                                        Cotizaciones anexadas
                                    </v-flex>
                                    <v-divider
                                        vertical>
                                    </v-divider>
                                    <v-flex
                                        xs12
                                        md4
                                        class="text-xs-left text-md-right
                                            display-2 font-weight-thin">
                                        {{ cantidadProveedoresAnexadoCotizacionEnProceso }}
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-flex> -->
        </v-layout>
      </v-flex>
      <v-flex xs12 md3>
        <v-card class="roundedCustom">
          <v-card-title class="teal darken-1 white--text py-2" dark>
            <v-icon class="white--text">show_chart</v-icon>
            Avance
          </v-card-title>
          <v-card-text class="text-xs-center">
            <span class="display-4 font-weight-thin grey--text text--darken-1">
              {{ getAvanceGlobal }}%
            </span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
import CountDown from '@/components/CountDownText.vue';

export default {
  name: 'monitorGlobal',
  components: {
    PageTitle,
    CountDown,
  },
  data: () => ({
    incluirProcesosTerminados: false,
    filtros: {
      incluirConcluidos: false,
      seleccionados: [],
    },
    headers: [
      {
        text: '',
        sortable: false,
        value: '',
        width: '20',
      },
      { text: 'Nombre', sortable: false, value: 'nombre' },
      { text: 'Articulos', sortable: false, value: '' },
      { text: 'Art. c/ Cotiza.', sortable: false, value: '' },
      { text: 'Proveedores', sortable: false, value: '' },
      {
        text: '',
        sortable: false,
        value: '',
        width: '1%',
      },
    ],
  }),
  methods: {
    getAdquisicionArticulosConCotizacion(adquisicion) {
      let total = 0;
      adquisicion.articulos.forEach((articulo) => {
        const cotizados = articulo.cotizaciones.filter(item => !item.declina_participar);
        if (cotizados.length > 0) total += 1;
      });
      return total;
    },
    getAdquisicionProveedoresCotizando(adquisicion) {
      const cotizantes = [];
      adquisicion.articulos.forEach((articulo) => {
        const idProveedores = articulo.cotizaciones
          .filter(item => !item.declina_participar)
          .map(item => item.proveedor.id);
        cotizantes.push(...idProveedores);
      });

      return [...new Set(cotizantes)].length;
    },
  },
  computed: {
    ...mapGetters({
      proveedores: 'settings/catalogos/proveedores',
      usuariosConectados: 'settings/generales/usuariosConectados',
      monitorAquisiciones: 'adquisiciones/monitorAquisiciones',
      monitorTodosArticulos: 'adquisiciones/monitorTodosArticulos',
      monitorArticulosConCotizacion: 'adquisiciones/monitorArticulosConCotizacion',
      monitorArticulosSinCotizacion: 'adquisiciones/monitorArticulosSinCotizacion',
      monitorCotizacionesRecibidas: 'adquisiciones/monitorCotizacionesRecibidas',
      monitorProveedoresConCotizacion: 'adquisiciones/monitorProveedoresConCotizacion',
      monitorArticulosConDeclinaciones: 'adquisiciones/monitorArticulosConDeclinaciones',
    }),
    getUsuariosProveedores() {
      return this.usuariosConectados.filter(usuario => usuario.roles === 'proveedor');
    },
    getListadoAdquisiciones() {
      return this.monitorAquisiciones(this.filtros);
    },
    getArticulos() {
      return this.monitorTodosArticulos(this.filtros);
    },
    getArticulosConCotizacion() {
      return this.monitorArticulosConCotizacion(this.filtros);
    },
    getArticulosSinCotizacion() {
      return this.monitorArticulosSinCotizacion(this.filtros);
    },
    getCotizacionesRecibidas() {
      return this.monitorCotizacionesRecibidas(this.filtros);
    },
    getProveedoresConPropuesta() {
      return this.monitorProveedoresConCotizacion(this.filtros);
    },
    getArticulosConDeclinaciones() {
      return this.monitorArticulosConDeclinaciones(this.filtros);
    },
    getCantidadDeclinaciones() {
      let total = 0;
      if (this.getArticulosConDeclinaciones.length <= 0) return 0;
      this.getArticulosConDeclinaciones.forEach((articulo) => {
        total += articulo.declanaciones.length;
      });
      return total;
    },
    getAvanceGlobal() {
      if (this.getArticulos.length <= 0) return 0;
      return Math.round(
        ((this.getArticulosConCotizacion.length || 0) / (this.getArticulos.length || 0)) * 100,
        2,
      );
    },
    getAvg() {
      const tiempos = this.getCotizacionesRecibidas
        .map(cotizacion => cotizacion.created_at)
        .sort((a, b) => new Date(b) - new Date(a));
      const inicio = this.$moment(tiempos[1]);
      const dos = this.$moment(tiempos[2]);
      return inicio.diff(dos, 'minutes') / 60;
    },
  },
};
</script>

<style lang="scss">
.altura-listado {
  max-height: 73vh;
  overflow: auto;
}
.altura-maxima-listado {
  min-height: 300px;
  max-height: 300px;
  overflow: auto;
}
</style>
