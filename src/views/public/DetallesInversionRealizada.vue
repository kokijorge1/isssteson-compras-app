<template>
    <div id="contenedor-detalle-inversion-realizada">
      <v-card>
        <v-card-text>
          <v-layout row wrap justify-space-between align-center>
            <v-flex xs12 md3>
              <span>
                <strong>Inversión Acumulada:</strong>
                <span>
                  {{
                    listadoProveedores.reduce((cont, act) => cont + act.gran_total, 0) | currency
                    }}
                </span>
              </span>
            </v-flex>
            <v-flex xs6 md3>
              <v-checkbox
                class="pb-3"
                v-model="mostrarDetalles"
                hide-details
                label="Mostrar Detalles">
              </v-checkbox>
            </v-flex>
            <v-flex xs6 md2>
              <v-btn
                color="blue-grey darken-4"
                class="elevation-5"
                round
                @click="exportarExcel">
                <span class="white--text">Exportar</span>
                <v-icon right class="green--text text--lighten-4">description</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-data-table
            :items="listadoProveedores"
            :headers="headers"
            :pagination="opcionesTablaArticulos"
            hide-actions>
            <template
              v-slot:items="props">
              <tr
                class="grey darken-3 white--text">
                <td>
                  {{ (props.index + 1) }}
                </td>
                <td>
                  {{ props.item.nombre }}
                </td>
                <td>
                  {{ props.item.rfc }}
                </td>
                <td align="right">
                  {{ props.item.gran_total | currency }}
                </td>
              </tr>
              <tr v-if="mostrarDetalles">
                <td
                  colspan="4">
                  <v-data-table
                    :items="props.item.articulos"
                    :headers="headersArticulos"
                    :pagination="opcionesTablaArticulos"
                    hide-actions>
                    <template
                      v-slot:items="props">
                      <tr>
                        <td>
                          {{ (props.index + 1) }}
                        </td>
                        <td>
                          <mostrar-mas-texto
                            :texto="props.item.nombre"
                            :caracteresMaximos="250">
                          </mostrar-mas-texto>
                        </td>
                        <td align="center">
                          {{ (props.item.cantidad) }}
                        </td>
                        <td align="right">
                          {{ (props.item.importe) | currency }}
                        </td>
                        <td align="right">
                          {{ (props.item.iva) | currency }}
                        </td>
                        <td align="right">
                          {{ (props.item.gran_total) | currency }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </td>
              </tr>
            </template>
            <template
              v-slot:footer>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FileDownloader from 'js-file-download';
import Mensajes from '@/helpers/mensajes';
import MostrarMasTexto from '@/components/MostrarMasTexto.vue';

export default {
  name: 'detallesInversionRealizada',
  components: {
    MostrarMasTexto,
  },
  data: () => ({
    mostrarDetalles: true,
    headers: [
      { text: '#', sortable: false, value: '' },
      { text: 'Nombre', sortable: true, value: 'nombre' },
      { text: 'RFC', sortable: false, value: 'rfc' },
      {
        text: 'TOTAL ADJUDICADO', sortable: false, value: 'gran_total', align: 'right',
      },
    ],
    opcionesTablaArticulos: {
      rowsPerPage: -1,
    },
    headersArticulos: [
      { text: '#', sortable: false, value: '' },
      {
        text: 'Nombre', sortable: false, value: 'nombre', width: '60%',
      },
      {
        text: 'Cantidad', sortable: false, align: 'center', value: 'cantidad',
      },
      {
        text: 'Importe', sortable: false, align: 'right', value: 'importe',
      },
      {
        text: 'I.V.A', sortable: false, align: 'right', value: 'iva',
      },
      {
        text: 'Total', sortable: false, align: 'right', value: 'gran_total',
      },
    ],
  }),
  methods: {
    exportarExcel() {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.axios.get('/datosabiertos/porpartida', {
        responseType: 'blob',
        timeout: 30000,
      })
        .then((res) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          FileDownloader(res.data, 'Datos Abiertos.xlsx');
        })
        .catch((err) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
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
      soloArticulosAdjudicados: 'portal/soloArticulosAdjudicados',
      soloProveedoresAdjudicadosAgrupado: 'portal/soloProveedoresAdjudicadosAgrupado',
      agruparProveedores: 'portal/agruparProveedores',
    }),
    listadoProveedores() {
      return this.agruparProveedores
        .slice()
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
  },
};
</script>

<style lang="scss">

</style>
