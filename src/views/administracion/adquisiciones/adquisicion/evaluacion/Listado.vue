<template>
    <div id="contenedor-listado-articulos"
      v-if="articulos">
        <v-data-table
            :headers="headers"
            :items="listado"
            :expand="true">
            <template
                v-slot:items="props">
                <tr
                    @click="props.expanded = true"
                    :class="
                      { 'success white--text': props.item.adjudicada,
                      'yellow lighten-4': !props.item.adjudicada}">
                    <td>
                        {{ (props.index + 1) }}
                    </td>
                    <td>
                        {{ props.item.articulo.clave_interna }}
                    </td>
                    <td>
                        {{ props.item.articulo.cabms }}
                    </td>
                    <td>
                        <mostrar-mas-texto
                            :texto="props.item.articulo.nombre"
                            v-if="props.item.articulo.nombre !== null">
                        </mostrar-mas-texto>
                    </td>
                    <td>
                        <mostrar-mas-texto
                            :texto="props.item.caracteristicas"
                            v-if="props.item.caracteristicas !== null">
                        </mostrar-mas-texto>
                    </td>
                    <td
                      align="center">
                        {{ props.item.cantidad }}
                    </td>
                    <td>
                        {{ props.item.articulo.unidad }}
                    </td>
                    <td>
                        {{ props.item.articulo.presentacion }}
                    </td>
                    <td
                      align="center">
                        {{ cantidadPropuestasSinDeclinar(props.item.cotizaciones).length }}
                    </td>
                    <td
                      align="right">
                      <v-btn
                        icon
                        :dark="props.item.adjudicada">
                        <v-icon>
                          how_to_reg
                        </v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        @click="adjudicar(props.item)"
                        :dark="props.item.adjudicada">
                        <v-icon>
                          group_add
                        </v-icon>
                      </v-btn>
                    </td>
                </tr>
                <v-expand-transition>
                  <tr
                    v-show="listadoAdjudicados(props.item.cotizaciones).length > 0">
                    <td
                      colspan="10">
                      <v-data-table
                          :headers="headersAdjudicados"
                          :items="listadoAdjudicados(props.item.cotizaciones)"
                          hide-actions>
                          <template
                            v-slot:items="props">
                            <tr>
                              <td>
                                {{ (props.index + 1) }}
                              </td>
                              <td>
                                {{ props.item.proveedor.nombre }}
                              </td>
                              <td>
                                {{ props.item.datosAdjudicados.cantidad }}
                              </td>
                              <td
                                align="right">
                                {{ props.item.datosAdjudicados.precio_unitario | currency }}
                              </td>
                              <td
                                align="right">
                                {{ props.item.datosAdjudicados.importe | currency }}
                              </td>
                              <td
                                align="right">
                                {{ props.item.datosAdjudicados.iva_importe| currency }}
                              </td>
                              <td
                                align="right">
                                {{ props.item.datosAdjudicados.gran_total | currency }}
                              </td>
                            </tr>
                          </template>
                          <template
                            v-slot:footer>
                            <tr>
                              <td
                                colspan="4"
                                align="right"
                                class="font-weight-bold">
                                Total
                              </td>
                              <td
                                align="right"
                                class="font-weight-bold">
                                {{ sumatoriaTotalesAdjudicados
                                (listadoAdjudicados(props.item.cotizaciones)).importe | currency }}
                              </td>
                              <td
                                align="right"
                                class="font-weight-bold">
                                {{ sumatoriaTotalesAdjudicados
                                (listadoAdjudicados(props.item.cotizaciones)).iva | currency }}
                              </td>
                              <td
                                align="right"
                                class="font-weight-bold">
                                {{ sumatoriaTotalesAdjudicados
                                (listadoAdjudicados(props.item.cotizaciones)).total | currency }}
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                    </td>
                  </tr>
                </v-expand-transition>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import MostrarMasTexto from '@/components/MostrarMasTexto.vue';

export default {
  name: 'listadoArticulos',
  components: {
    MostrarMasTexto,
  },
  props: {
    articulos: {
      type: Array,
      required: true,
    },
    buscarTexto: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    headers: [
      { text: '#', sortable: false, value: '' },
      { text: 'Clave. Int.', sortable: false, value: 'articulo.clave_interna' },
      { text: 'CABMS', sortable: false, value: 'articulo.cabms' },
      { text: 'Nombre', sortable: false, value: 'articulo.nombre' },
      { text: 'Características', sortable: false, value: 'caracteristicas' },
      { text: 'Cantidad', sortable: false, value: 'cantidad' },
      { text: 'U. Medida', sortable: false, value: 'articulo.unidad_medida' },
      { text: 'Presentación', sortable: false, value: 'articulo.presentacion' },
      { text: 'Cant. Proptas', sortable: false, value: '' },
      {
        text: '',
        sortable: false,
        value: '',
        width: '',
      },
    ],
    headersAdjudicados: [
      { text: '#', sortable: false, value: '' },
      { text: 'Proveedor', sortable: false, value: '' },
      { text: 'Cant. Adj', sortable: false, value: '' },
      {
        text: 'P. Unitario', sortable: false, value: '', align: 'right',
      },
      {
        text: 'SubTotal', sortable: false, value: '', align: 'right',
      },
      {
        text: 'I.V.A', sortable: false, value: '', align: 'right',
      },
      {
        text: 'Total', sortable: false, value: '', align: 'right',
      },
    ],
  }),
  methods: {
    adjudicar(articulo) {
      this.$emit('adj', articulo);
    },
    listadoAdjudicados(cotizaciones) {
      if (!cotizaciones) return [];
      return cotizaciones.filter(cotizacion => cotizacion.adjudicada === true);
    },
    cantidadPropuestasSinDeclinar(cotizaciones) {
      return cotizaciones.filter(cotizacion => !cotizacion.declina_participar);
    },
    sumatoriaTotalesAdjudicados(cotizaciones) {
      return {
        importe: cotizaciones
          .reduce((old, item) => (old + item.datosAdjudicados.importe), 0) || 0,
        iva: cotizaciones
          .reduce((old, item) => (old + item.datosAdjudicados.iva_importe), 0) || 0,
        total: cotizaciones
          .reduce((old, item) => (old + item.datosAdjudicados.gran_total), 0) || 0,
      };
    },
  },
  computed: {
    listado() {
      if (this.articulos.length <= 0) return [];
      return this.articulos
        .filter((articulo) => {
          if (!this.buscarTexto) return true;
          const expt = new RegExp(this.buscarTexto, 'gi');
          return expt.test(articulo.cantidad)
          || expt.test(articulo.caracteristicas)
          || expt.test(articulo.articulo.nombre)
          || expt.test(articulo.articulo.clave_interna)
          || expt.test(articulo.articulo.cabms)
          || expt.test(articulo.articulo.presentacion);
        });
    },
  },
};
</script>

<style lang="scss">

</style>
