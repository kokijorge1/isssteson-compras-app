<template>
  <div id="contenedor-agregar-requisiciones">
    <v-toolbar flat color="transparent">
      <page-title
        titulo="Nueva Requisición">
      </page-title>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <v-form ref="form" v-model="valido">
          <v-layout row wrap>
            <!-- <v-flex xs12 md3 class="p-xs-r-15">
              <v-text-field
                v-model="requisicion.numero"
                :rules="[reglas.requerido]"
                label="Clave/Número"
                hint="Requerido *"
                persistent-hint
                solo>
              </v-text-field>
            </v-flex> -->
            <v-flex xs12 md6 class="p-xs-r-15">
              <v-select
                v-model="requisicion.id_tipo"
                label="Tipo"
                :items="tipoRequisiciones"
                :rules="[reglas.requerido]"
                item-text="descripcion"
                item-value="id"
                hint="Requerido *"
                persistent-hint
                solo>
              </v-select>
            </v-flex>
            <v-flex xs12></v-flex>
            <v-flex xs12 md3>
              <date-picker
                v-model="requisicion.fecha_requerida"
                label="Fecha Requerida"
                hint="Fecha en la que se requieren los articulos."
                actual
                persistent>
              </date-picker>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="mt-4">
            <v-flex xs12>
              <v-autocomplete
                v-model="requisicion.id_partida"
                label="Partida"
                :items="listadoPartidas"
                item-text="nombre"
                item-value="id"
                :filter="filtrarPartida"
                :rules="[reglas.requerido]"
                hint="Requerido *"
                persistent-hint
                solo>
                <template slot="item" slot-scope="data">
                  {{ data.item.clave }} - {{ data.item.nombre }}
                </template>
              </v-autocomplete>
            </v-flex>
          </v-layout>
          <v-layout
            row
            wrap
            class="mt-4">
            <v-flex xs12 md6 class="p-xs-r-15"
              v-if="$auth.user().roles === 'superadmin'">
              <v-select
                v-model="id_unidad_administrativa"
                label="Unidad Administrativa"
                :items="unidades"
                :rules="[reglas.requerido]"
                item-text="nombre"
                item-value="id"
                hint="Requerido *"
                persistent-hint
                solo>
              </v-select>
            </v-flex>
            <v-flex xs12 md6
              v-if="$auth.user().roles === 'superadmin'
              || $auth.user().roles === 'compras'">
              <v-select
                v-model="requisicion.id_area"
                label="Area"
                :items="listadoAreas"
                :rules="[reglas.requerido]"
                item-text="nombre"
                item-value="id"
                hint="Requerido *"
                persistent-hint
                solo>
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="mt-4">
            <v-flex xs12 md6 class="p-xs-r-15">
              <v-textarea
                v-model="requisicion.justificacion"
                :rules="[reglas.requerido]"
                label="Justificación"
                hint="Requerido *"
                persistent-hint
                solo>
              </v-textarea>
            </v-flex>
            <v-flex xs12 md6>
              <v-textarea
                v-model="requisicion.observaciones"
                label="Observaciones"
                solo>
              </v-textarea>
            </v-flex>
          </v-layout>
          <div class="mt-5"></div>
          <v-card flat>
            <v-card-title>
              <v-badge  color="red">
                <span slot="badge">
                  {{ requisicion.articulos.length }}
                </span>
                <span>
                  <h1 class="tittle font-weight-thin">
                    Articulos
                  </h1>
                </span>
              </v-badge>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="listado"
                hide-actions>
                <template slot="items" slot-scope="props">
                  <td>
                    {{ (props.index + 1) }}
                  </td>
                  <td>
                    {{ props.item.clave_interna }}
                  </td>
                  <td>
                    {{ props.item.nombre }}
                  </td>
                  <td>
                    <numeric-text-field
                      v-model="props.item.cantidad"
                      label="Cantidad"
                      solo>
                    </numeric-text-field>
                  </td>
                  <td>
                    {{ props.item.unidad }}
                  </td>
                  <td>
                    {{ props.item.presentacion }}
                  </td>
                  <td>
                    <v-textarea
                      v-model="props.item.caracteristicas"
                      outline
                      auto-grow
                      rows="3"
                      class="mt-2">
                    </v-textarea>
                  </td>
                  <td class="text-xs-right">
                    <v-tooltip top>
                      <v-btn
                        slot="activator"
                        fab
                        small
                        dark
                        color="red"
                        @click="removerArticulo(props.index)">
                        <v-icon>remove</v-icon>
                      </v-btn>
                      <span>Remover</span>
                    </v-tooltip>
                  </td>
                </template>
                <template slot="no-data">
                  <v-btn
                    block
                    round
                    :dark="requisicion.id_partida !== null"
                    color="primary"
                    @click="showArticuloPicker = !showArticuloPicker"
                    :disabled="!requisicion.id_partida">
                    <v-icon>add</v-icon>
                    agregar articulo(s)
                  </v-btn>
                </template>
                <template slot="footer" v-if="articulos.length > 0">
                  <tr>
                    <td colspan="8">
                      <v-btn
                        block
                        round
                        :dark="requisicion.id_partida !== null"
                        color="primary"
                        @click="showArticuloPicker = !showArticuloPicker"
                        :disabled="!requisicion.id_partida">
                        <v-icon>add</v-icon>
                        agregar articulo(s)
                      </v-btn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>
      <v-divider class="mt-4"></v-divider>
      <v-card-actions class="pl-2">
        <v-btn
          color="primary"
          :disabled="!validarForm"
          :loading="enviando"
          @click="guardar">
          <v-icon dark left>done</v-icon>
          Guardar
        </v-btn>
        <v-btn flat :to="{name: 'requisiciones'}">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog
      v-model="showArticuloPicker"
      persistent
      max-width="700px">
      <articulos-picker
        @articulo="agregarArticulo"
        v-on:cerrar="cerrarDialog"
        :partida="requisicion.id_partida">
      </articulos-picker>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
import DatePicker from '@/components/DatePicker.vue';
import ArticulosPicker from '@/components/ArticulosPicker.vue';
import NumericTextField from '@/components/NumericTextField.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'AgregarRequisiciones',
  components: {
    PageTitle,
    DatePicker,
    ArticulosPicker,
    NumericTextField,
  },
  data() {
    return {
      enviando: false,
      showArticuloPicker: false,
      valido: false,
      id_unidad_administrativa: null,
      requisicion: {
        id_area: null,
        id_partida: null,
        // numero: null,
        id_tipo: '',
        fecha_requerida: null,
        justificacion: null,
        observaciones: 'lo anterior en base al artículo 27, fracción i, de la ley de administración, arrendamiento y presentaciones de bienes inmuebles de la administración pública estatal, en la cual ampara las adjudicaciones directas que se efectúan',
        articulos: [],
      },
      articulos: [],
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
      headers: [
        { text: '#', sortable: false, value: '' },
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
  mounted() {
    if (this.$auth.user().roles === 'compras'
      || this.$auth.user().roles === 'area') {
      this.id_unidad_administrativa = this.$auth.user().unidad_administrativa.id;
    }
    if (this.$auth.user().roles === 'area') {
      this.requisicion.id_area = this.$auth.user().area.id;
    }
  },
  methods: {
    ...mapActions('requisiciones', ['agregarRequisicion']),
    guardar() {
      this.enviando = true;
      this.agregarRequisicion(this.requisicion)
        .then((data) => {
          this.enviando = false;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });

          const datos = {
            tipo: 'AGREGAR_REQUISICION',
            data,
          };

          this.$socket.emit('afectacionRequisiciones', datos);

          this.$router.push({ name: 'requisiciones' });
        })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    agregarArticulo(articulo) {
      this.articulos.push(articulo);
    },
    removerArticulo(index) {
      this.articulos.splice(index, 1);
    },
    filtrarPartida(item, queryText) {
      const clave = item.clave.toLowerCase();
      const nombre = item.nombre.toLowerCase();
      const searchText = queryText.toLowerCase();

      return clave.indexOf(searchText) > -1
          || nombre.indexOf(searchText) > -1;
    },
    cerrarDialog() {
      this.showArticuloPicker = false;
    },
  },
  computed: {
    ...mapGetters({
      unidades: 'settings/catalogos/unidadesAdministrativas',
      areas: 'settings/catalogos/areasByUnidad',
      partidas: 'settings/catalogos/partidas',
      partidasGenericas: 'settings/catalogos/partidasGenericas',
      tipoRequisiciones: 'settings/catalogos/tipoRequisiciones',
      tipoRequisicion: 'settings/catalogos/tipoRequisicion',
    }),
    listadoAreas() {
      return this.areas(this.id_unidad_administrativa);
    },
    listadoPartidas() {
      if (!this.requisicion.id_tipo) return [];
      const partidasDelTipoRequisicion = this.tipoRequisicion(this.requisicion.id_tipo)
        .tipo_partidas_genericas.map(item => item.partida_generica.id);
      if (partidasDelTipoRequisicion.length <= 0) return [];
      // return this.partidasGenericas.filter(item => partidasDelTipoRequisicion.includes(item.id));
      return this.partidas.filter(item => partidasDelTipoRequisicion
        .includes(item.partida_generica.id));
    },
    listado() {
      return this.articulos;
    },
    validarForm() {
      if (this.valido
      && this.requisicion.fecha_requerida
      && this.requisicion.articulos.length > 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    articulos: {
      handler() {
        this.requisicion.articulos = this.articulos.map(item => (
          {
            id_articulo: item.id_articulo,
            cantidad: item.cantidad,
            caracteristicas: item.caracteristicas,
          }
        ));
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
</style>
