<template>
  <div id="contenedor-listado-areas">
    <v-card flat>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 md4>
            <v-text-field
              v-model="searchText"
              placeholder="Buscar..."
              append-icon="search"
              clearable
              solo
            ></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="hidden-xs-only roundedCustom"
            @click="agregar = !agregar">
            <v-icon left dark>add</v-icon>
            Nuevo
          </v-btn>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="listado"
          :search.sync="searchText"
          :pagination.sync="pagination">
          <template slot="items" slot-scope="props">
            <td valign="top">
              {{ (props.index + 1) }}
            </td>
            <td valign="top">
              {{ props.item.descripcion }}
            </td>
            <td>
              <ol>
                <li
                  v-for="(partida, i) in props.item.tipo_partidas_genericas"
                  :key="i">
                  <b>{{ partida.partida_generica.clave }}</b>
                  - {{ partida.partida_generica.nombre }}
                </li>
              </ol>
            </td>
            <td class="justify-end layout px-0">
              <v-tooltip top>
                <v-btn
                  slot="activator"
                  icon
                  @click="onEditar(props.item.id)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn
                  slot="activator"
                  icon
                  @click="preRemoverElemento(props.item.id)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>Borrar</span>
              </v-tooltip>
            </td>
          </template>
          <template slot="no-data">
            <v-btn
              round
              block
              dark
              color="primary"
              @click="agregar = !agregar">
              <v-icon right dark>add</v-icon>
              Agregar
            </v-btn>
          </template>
          <v-alert slot="no-results"
            :value="true"
            color="error"
            icon="warning">
               No se encontró ninguna coincidencia para "{{ searchText }}".
          </v-alert>
        </v-data-table>
        <v-tooltip top v-if="listado.length > 0">
          <v-btn
            slot="activator"
            color="primary"
            class="hidden-sm-and-up"
            dark
            fixed
            bottom
            right
            fab
            @click="agregar = !agregar">
            <v-icon>add</v-icon>
          </v-btn>
          <span>Nuevo</span>
        </v-tooltip>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="agregar"
      persistent
      max-width="600px">
        <agregar
          v-on:cerrar="cerrarDialog">
        </agregar>
    </v-dialog>
    <v-dialog
      v-model="editar"
      persistent
      max-width="600px">
      <editar
        :id="idEditar"
        v-on:cerrar="cerrarDialog">
      </editar>
    </v-dialog>
    <v-dialog v-model="dialogAutorizar" persistent max-width="290">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Confirmación
        </v-card-title>
        <v-card-text>
          ¿Seguro que desea remover este Elemento?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="removerElemento" :loading="enviando">
            <v-icon dark left>done</v-icon>
            Autorizar
          </v-btn>
          <v-btn flat color="error" @click="dialogAutorizar = !dialogAutorizar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Agregar from './Agregar.vue';
import Editar from './Editar.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'ListadoAreas',
  components: {
    Agregar,
    Editar,
  },
  data() {
    return {
      searchText: '',
      dialogAutorizar: false,
      enviando: false,
      idElementoRemover: null,
      agregar: false,
      editar: false,
      idEditar: null,
      pagination: {
        sortBy: 'nombre',
        descending: false,
        rowsPerPage: 25,
      },
      headers: [
        {
          text: '#',
          align: 'left',
          sortable: false,
          value: '',
        },
        { text: 'Descripción', sortable: true, value: 'descripcion' },
        { text: 'Partidas Genericas', sortable: false, value: '' },
        { text: '', sortable: false, value: '' },
      ],
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['borrarTipoRequisicion']),
    onEditar(id) {
      this.idEditar = id;
      this.editar = true;
    },
    preRemoverElemento(id) {
      this.idElementoRemover = id;
      this.dialogAutorizar = true;
    },
    removerElemento() {
      if (!this.idElementoRemover) return;

      this.enviando = true;
      this.borrarTipoRequisicion({
        id: this.idElementoRemover,
      })
        .then(() => {
          this.idElementoRemover = null;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;
          this.dialogAutorizar = false;
        })
        .catch((err) => {
          this.idElementoRemover = null;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;
          this.dialogAutorizar = false;
        });
    },
    cerrarDialog() {
      this.idEditar = null;
      this.agregar = false;
      this.editar = false;
    },
  },
  computed: {
    ...mapGetters({
      tipoRequisiciones: 'settings/catalogos/tipoRequisiciones',
    }),
    listado() {
      return this.tipoRequisiciones;
    },
  },
};
</script>

<style lang="scss">
</style>
