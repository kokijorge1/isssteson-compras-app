<template>
  <div id="contenedor-listado-proveedores">
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
            @click="agregar = !agregar"
          >
            <v-icon left dark>add</v-icon>
            Nuevo
          </v-btn>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="listado"
          :expand="expand"
          item-key="id"
          :search.sync="searchText"
          :pagination.sync="pagination"
        >
          <template slot="items" slot-scope="props">
            <tr @click.stop="props.expanded = !props.expanded">
              <td>{{ props.index + 1 }}</td>
              <td>{{ props.item.nombre }}</td>
              <td>{{ props.item.rfc }}</td>
              <td>{{ props.item.domicilio }}</td>
              <td>
                <a :href="`mailto:${props.item.correo_electronico}`">
                  {{ props.item.correo_electronico }}
                </a>
              </td>
              <td>{{ props.item.nombre_representante }}</td>
              <td>{{ props.item.informacion_contacto }}</td>
              <td class="justify-end layout px-0">
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    icon
                    small
                    class="ml-0 mr-1 amber--text"
                    @click.stop="verDocumentos(props.item.id)"
                  >
                    <v-icon>folder</v-icon>
                  </v-btn>
                  <span>Documentos</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    icon
                    small
                    class="mx-0"
                    @click.stop="onEditar(props.item.id)"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <span>Editar</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    icon
                    small
                    class="mx-0"
                    @click.stop="preRemoverElemento(props.item.id)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                  <span>Borrar</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <v-btn round block dark color="primary" @click="agregar = !agregar">
              <v-icon right dark>add</v-icon>
              Agregar
            </v-btn>
          </template>
          <template v-slot:expand="props">
            <v-card flat class="grey lighten-3">
              <v-card-title primary-title class="my-0 py-0">
                <h1 class="headline font-weight-thin">
                  Clasificadores
                </h1>
              </v-card-title>
              <v-card-text>
                <v-chip
                  v-for="(categoria, index) in props.item.categorias"
                  :key="`tag-${index}`"
                  label
                  color="pink"
                  text-color="white"
                >
                  <v-icon left>label</v-icon>
                  {{ categoria.partida_generica.nombre }}
                </v-chip>
              </v-card-text>
            </v-card>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
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
            @click="agregar = !agregar"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <span>Nuevo</span>
        </v-tooltip>
      </v-card-text>
    </v-card>
    <v-dialog v-model="agregar" persistent max-width="600px">
      <agregar v-on:cerrar="cerrarDialog"> </agregar>
    </v-dialog>
    <v-dialog v-model="editar" persistent max-width="600px">
      <editar :id="idProveedor" v-on:cerrar="cerrarDialog"> </editar>
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
    <!-- VER DOCUMENTOS -->
    <v-dialog v-model="dialogVerDocumentos" max-width="400px">
      <documentos :id="idProveedor" v-on:cerrar="cerrarDialog"> </documentos>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';
import Agregar from './Agregar.vue';
import Editar from './Editar.vue';
import Documentos from './Documentos.vue';

export default {
  name: 'ListadoProveedores',
  components: {
    Agregar,
    Editar,
    Documentos,
  },
  data() {
    return {
      expand: true,
      searchText: '',
      dialogAutorizar: false,
      dialogVerDocumentos: false,
      enviando: false,
      idElementoRemover: null,
      agregar: false,
      editar: false,
      proveedor: null,
      idProveedor: null,
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
        { text: 'Nombre/Razon', sortable: true, value: 'nombre' },
        { text: 'RFC', sortable: false, value: 'rfc' },
        { text: 'Domicilio', sortable: false, value: 'domicilio' },
        {
          text: 'Correo Electrónico',
          sortable: false,
          value: 'correo_electronico',
        },
        { text: 'Representante', sortable: true, value: 'nombre_representante' },
        { text: 'Contacto', sortable: false, value: 'informacion_contacto' },
        { text: '', sortable: false, value: '' },
      ],
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['borrarProveedor']),
    onEditar(id) {
      this.idProveedor = id;
      this.editar = true;
    },
    verDocumentos(id) {
      this.idProveedor = id;
      this.dialogVerDocumentos = true;
    },
    preRemoverElemento(id) {
      this.idElementoRemover = id;
      this.dialogAutorizar = true;
    },
    removerElemento() {
      if (!this.idElementoRemover) return;

      this.enviando = true;
      this.borrarProveedor({
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
      this.idProveedor = null;
      this.agregar = false;
      this.editar = false;
      this.dialogVerDocumentos = false;
    },
  },
  computed: {
    ...mapGetters({
      proveedores: 'settings/catalogos/proveedores',
    }),
    listado() {
      return this.proveedores;
    },
  },
};
</script>

<style lang="scss"></style>
