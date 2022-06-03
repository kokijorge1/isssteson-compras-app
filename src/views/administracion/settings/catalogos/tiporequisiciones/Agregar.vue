<template>
  <div id="contenedor-agregar">
    <v-form v-model="valido">
      <v-card flat>
        <v-toolbar flat color="primary" dark class="headline">
          Nuevo
          <v-spacer></v-spacer>
          <v-btn icon @click="cerrar">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
      <v-stepper non-linear>
        <v-stepper-header class="grey lighten-3">
          <v-stepper-step editable step="1">Generales</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable step="2">Partidas</v-stepper-step>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1" class="my-1 py-1">
            <v-text-field
              v-model="tipoRequisicion.descripcion"
              label="Descripción"
              :rules="[reglas.requerido]"
              hint="Requerido *"
              persistent-hint
            ></v-text-field>
          </v-stepper-content>
          <v-stepper-content step="2" class="my-1 py-1">
            <v-layout row wrap>
              <v-flex xs12 md12 class="mt-1 pt-1">
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
              v-model="partidasSelected"
              :items="listado"
              :search.sync="searchText"
              :headers="partidasHeaders"
              item-key="id"
              select-all
              :pagination.sync="pagination"
              :rows-per-page-items="itemsCantidad"
            >
              <template v-slot:items="props">
                <tr :active="props.selected">
                  <td style="position: relative;">
                    <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                  </td>
                  <td>{{ props.item.clave }}</td>
                  <td>{{ props.item.nombre }}</td>
                </tr>
              </template>
              <v-alert
                slot="no-results"
                :value="true"
                color="error"
                icon="warning"
              >No se encontró ninguna coincidencia para "{{ searchText }}".</v-alert>
              <template v-slot:footer>
                <td :colspan="partidasHeaders.length + 1">
                  <v-chip
                    v-for="partida in ordenarChips"
                    :key="partida.id"
                    @input="remove(partida)"
                    close
                  >{{partida.clave}}</v-chip>
                </td>
              </template>
            </v-data-table>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <v-card flat>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click.prevent="guardar"
            :loading="enviando"
            :disabled="!valido"
          >
            <v-icon>save</v-icon>Guardar
          </v-btn>
          <v-btn flat @click="cerrar">Cancelar</v-btn>
        </v-card-title>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'AgregarArea',
  data() {
    return {
      searchText: '',
      valido: false,
      enviando: false,
      tipoRequisicion: {
        descripcion: '',
        partidas_genericas: [],
      },
      partidasSelected: [],
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
      partidasHeaders: [
        { text: 'Clave', sortable: true, value: 'clave' },
        { text: 'Nombre', sortable: true, value: 'nombre' },
      ],
      pagination: {
        sortBy: 'clave',
        descending: false,
        rowsPerPage: 4,
      },
      itemsCantidad: [4],
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['agregarTipoRequisicion']),
    guardar() {
      this.enviando = true;
      this.agregarTipoRequisicion(this.tipoRequisicion)
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });

          this.tipoRequisicion.descripcion = null;
          this.tipoRequisicion.partidas_genericas = [];

          this.enviando = false;
          this.cerrar();
        })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    remove(categoria) {
      const index = this.partidasSelected
        .findIndex(item => item.id === categoria.id);
      this.partidasSelected.splice(index, 1);
    },
    cerrar() {
      this.tipoRequisicion.descripcion = '';
      this.partidasSelected = [];
      this.enviando = false;
      this.$emit('cerrar');
    },
  },
  computed: {
    ...mapGetters({
      partidasGenericas: 'settings/catalogos/partidasGenericas',
    }),
    listado() {
      return this.partidasGenericas;
    },
    ordenarChips() {
      return this.partidasSelected.slice().sort((a, b) => {
        if (a.clave > b.clave) return 1;
        if (a.clave < b.clave) return -1;
        return 0;
      });
    },
  },
  watch: {
    partidasSelected: {
      handler(selectedPartidaGenerica) {
        this.tipoRequisicion.partidas_genericas = [];
        this.tipoRequisicion.partidas_genericas = selectedPartidaGenerica
          .map(item => ({ id_partida: item.id }));
      },
    },
  },
};
</script>

<style lang="scss">
</style>
