<template>
  <div id="contenedor-requisiciones-picker">
      <v-card>
        <v-toolbar flat color="primary" dark class="headline">
          <v-card-title
            primary-title>
              Agregar Requisiciones
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="cerrar">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
              <v-layout row wrap>
                  <v-flex xs12 md12>
                      <v-toolbar
                        dense
                        flat>
                        <v-toolbar-title>
                            Requisiciones
                        </v-toolbar-title>
                      </v-toolbar>
                      <v-data-table
                        v-model="datos.requisiciones"
                        :items="requisiciones"
                        :headers="requisicionesHeaders"
                        item-key="id"
                        select-all
                        hide-actions>
                        <template v-slot:items="props">
                          <tr :active="props.selected">
                            <td style="position: relative;">
                              <div class="contenedor-dot">
                                <div
                                  class="dot"
                                  :style="`background-color: ${props.item.color}`">
                                </div>
                              </div>
                              <v-checkbox
                                v-model="props.selected"
                                primary
                                hide-details>
                              </v-checkbox>
                            </td>
                            <td>
                              {{ props.item.numero }}
                            </td>
                            <td>
                              {{ props.item.partida.nombre }}
                            </td>
                            <td>
                              {{ props.item.justificacion }}
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                  </v-flex>
              </v-layout>
              <v-layout row wrap class="my-4">
                  <v-flex xs12 md12>
                      <v-toolbar
                        dense
                        flat>
                        <v-toolbar-title>
                            Articulos
                        </v-toolbar-title>
                      </v-toolbar>
                      <v-data-table
                        :items="datos.articulos"
                        :headers="articulosHeaders"
                        hide-actions>
                        <template v-slot:items="props">
                          <tr>
                            <td>
                              <div
                                class="dot"
                                :style="`background-color: ${props.item.color}`">
                              </div>
                            </td>
                            <td>
                              <strong>{{ props.item.articulo.clave_interna }}</strong>
                            </td>
                            <td>{{ props.item.articulo.nombre }}</td>
                            <td>
                              <numeric-text-field
                                v-model="props.item.cantidad"
                                label="Cantidad" solo>
                              </numeric-text-field>
                            </td>
                            <td>{{ props.item.articulo.unidad }}</td>
                            <td>
                              {{ props.item.articulo.presentacion }}
                            </td>
                            <td>
                              <v-textarea
                                v-model="props.item.caracteristicas"
                                solo
                                auto-grow
                                rows="3"
                                class="mt-2"
                                style="font-size:12px;"
                              ></v-textarea>
                            </td>
                            <td class="text-xs-right px-0">
                              <v-tooltip top>
                                <v-btn
                                  icon
                                  slot="activator"
                                  color="error"
                                  small
                                  @click="removerArticulo(props.index)"
                                >
                                  <v-icon>remove</v-icon>
                                </v-btn>
                                <span>Remover Artículo</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                  </v-flex>
              </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="datos.requisiciones.length <= 0
                || datos.articulos.length <= 0"
              @click.prevent="agregar">
              <v-icon dark left>add</v-icon>
              Agregar
            </v-btn>
            <v-btn flat @click="cerrar">
              Cancelar
            </v-btn>
          </v-card-actions>
      </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NumericTextField from '@/components/NumericTextField.vue';

export default {
  name: 'RequisicionesPicker',
  components: {
    NumericTextField,
  },
  data() {
    return {
      datos: {
        requisiciones: [],
        articulos: [],
      },
      requisicionesHeaders: [
        { text: 'Número', sortable: true, value: 'numero' },
        { text: 'Partida', sortable: true, value: 'partida.id' },
        { text: 'Justificación', sortable: false, value: '' },
      ],
      articulosHeaders: [
        { text: '', sortable: false, value: '' },
        { text: 'Clave', sortable: true, value: 'clave_interna' },
        { text: 'Descripción', sortable: false, value: '' },
        { text: 'Cantidad', sortable: true, value: 'cantidad' },
        { text: 'Unidad M.', sortable: false, value: 'unidad' },
        { text: 'Presentación', sortable: false, value: 'presentacion' },
        { text: 'Caracteristicas', sortable: false, value: '' },
        { text: '', sortable: false, value: '' },
      ],
    };
  },
  methods: {
    agregar() {
      this.$emit('enviar', this.datos);
      this.cerrar();
    },
    removerArticulo(index) {
      this.datos.articulos.splice(index, 1);
    },
    cerrar() {
      this.$emit('cerrar');
    },
  },
  computed: {
    ...mapGetters({
      requisicionesAutorizadas: 'requisiciones/autorizadas',
    }),
    requisiciones() {
      return this.requisicionesAutorizadas.map((item) => {
        const requisicion = item;
        requisicion.color = this.$randomColor();
        return requisicion;
      });
    },
    listadoArticulos() {
      return [];
    },
  },
  watch: {
    'datos.requisiciones': {
      handler(selectedRequisiciones) {
        this.datos.articulos = [];

        if (selectedRequisiciones.length <= 0) return;

        selectedRequisiciones.forEach((requisicion) => {
          if (requisicion.articulos.length > 0) {
            requisicion.articulos.forEach((articulo) => {
              const nuevoArticulo = {
                ...articulo,
                color: requisicion.color,
                id_requisicion: requisicion.id,
              };
              this.datos.articulos.push(nuevoArticulo);
            });
          }
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.contenedor-dot {
  position: absolute;
  left: 0px;
}
.dot {
  margin-top: 4px;
  height: 17px;
  width: 17px;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
}
</style>
