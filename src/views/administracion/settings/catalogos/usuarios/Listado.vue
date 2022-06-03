<template>
  <div id="contenedor-listado-usuarios">
    <v-card flat>
      <v-card-text>
        <v-layout row wrap>
          <v-flex
            xs12 md2
            class="mr-2">
            <v-select
              v-model="tipo"
              :items="tiposUsuarios"
              item-text="texto"
              item-value="id"
              label="Tipo de Usuario"
              solo>
            </v-select>
          </v-flex>
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
            <template
              v-if="tipo === 'normal'">
              <tr>
                <td>{{ (props.index + 1) }}</td>
                <td>{{ props.item.tipo }}</td>
                <td>{{ props.item.nombre }}</td>
                <td>
                  <strong>
                    {{ props.item.correo_electronico }}
                  </strong>
                </td>
                <td>
                  {{ props.item.unidad_administrativa !== null
                    ? props.item.unidad_administrativa.nombre : '' }}
                </td>
                <td>
                  {{ props.item.area !== null ? props.item.area.nombre : '' }}
                </td>
                <td>
                  <v-switch
                    color="primary"
                    :input-value="props.item.valida"
                    hide-details>
                  </v-switch>
                </td>
                <td>
                  {{ props.item.proveedor !== null ? props.item.proveedor.nombre : '' }}
                </td>
                <td>{{ props.item.puesto }}</td>
                <td>
                  <v-switch
                    color="primary"
                    :input-value="props.item.status"
                    hide-details>
                  </v-switch>
                </td>
                <td>
                  <fecha-humano
                    :fecha="props.item.created_at">
                  </fecha-humano>
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
              </tr>
            </template>
            <template
              v-else>
              <tr>
                  <td>
                      {{ (props.index + 1) }}
                  </td>
                  <td>
                      {{ props.item.proveedor.nombre }}
                  </td>
                  <td>
                      <b>
                          {{ props.item.correo_electronico }}
                      </b>
                  </td>
                  <td>
                      {{ props.item.proveedor.nombre_representante }}
                  </td>
                  <td>
                      {{ props.item.proveedor.rfc }}
                  </td>
                  <td>
                      {{ props.item.proveedor.domicilio }}
                  </td>
                  <td>
                    <v-switch
                      color="primary"
                      :input-value="props.item.status"
                      hide-details>
                    </v-switch>
                  </td>
                  <td>
                      <fecha-humano
                          :fecha="props.item.updated_at">
                      </fecha-humano>
                  </td>
                  <td class="justify-end layout px-0">
                    <v-tooltip top>
                      <v-btn
                        slot="activator"
                        icon
                        class="ml-0 mr-1 amber--text"
                        @click.stop="verDocumentos(props.item.proveedor.id)">
                        <v-icon>folder</v-icon>
                      </v-btn>
                      <span>Documentos</span>
                    </v-tooltip>
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
              </tr>
            </template>
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
    <v-dialog
      v-model="dialogVerDocumentos"
      max-width="400px">
      <documentos
        :id="idProveedor"
        v-on:cerrar="cerrarDialog">
      </documentos>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';
import FechaHumano from '@/components/FechaHumano.vue';
import Agregar from './Agregar.vue';
import Editar from './Editar.vue';
import Documentos from '../proveedores/Documentos.vue';

export default {
  name: 'ListadoUsuarios',
  components: {
    Agregar,
    Editar,
    FechaHumano,
    Documentos,
  },
  data() {
    return {
      searchText: '',
      dialogAutorizar: false,
      enviando: false,
      idElementoRemover: null,
      dialogVerDocumentos: false,
      agregar: false,
      editar: false,
      idEditar: null,
      tipo: 'normal',
      idProveedor: null,
      pagination: {
        sortBy: 'nombre',
        descending: false,
        rowsPerPage: 25,
      },
      tiposUsuarios: [
        {
          id: 'normal', texto: 'Usuarios',
        },
        { id: 'proveedor', texto: 'Proveedores' },
      ],
      headersUsuariosSistema: [
        {
          text: '#',
          align: 'left',
          sortable: false,
          value: '',
        },
        { text: 'Tipo', sortable: true, value: 'tipo' },
        { text: 'Nombre', sortable: true, value: 'nombre' },
        { text: 'Correo/Usuario', sortable: true, value: 'correo_electronico' },
        { text: 'Unidad Adm.', sortable: true, value: 'unidad_administrativa.nombre' },
        { text: 'Area', sortable: true, value: 'area.nombre' },
        { text: 'Valida', sortable: true, value: 'valida' },
        { text: 'Proveedor', sortable: true, value: 'proveedor.nombre ' },
        { text: 'Puesto', sortable: true, value: 'puesto' },
        { text: 'Activo', sortable: true, value: 'status' },
        { text: 'F. creación', sortable: true, value: 'created_at' },
        { text: '', sortable: false, value: '' },
      ],
      headersUsuariosProveedores: [
        {
          text: '#',
          align: 'left',
          sortable: false,
          value: '',
        },
        { text: 'Nombre/Razon', sortable: true, value: 'proveedor.nombre' },
        { text: 'Correo/Usuario', sortable: true, value: 'correo_electronico' },
        { text: 'Representante', sortable: true, value: 'correo_electronico' },
        { text: 'R.F.C', sortable: true, value: 'proveedor.nombre ' },
        { text: 'Domicilio', sortable: true, value: 'correo_electronico' },
        { text: 'Activo', sortable: true, value: 'status' },
        { text: 'F. creación', sortable: true, value: 'updated_at' },
        { text: '', sortable: false, value: '' },
      ],
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['borrarUsuario']),
    onEditar(id) {
      this.idEditar = id;
      this.editar = true;
    },
    preRemoverElemento(id) {
      this.idElementoRemover = id;
      this.dialogAutorizar = true;
    },
    verDocumentos(id) {
      this.idProveedor = id;
      this.dialogVerDocumentos = true;
    },
    removerElemento() {
      if (!this.idElementoRemover) return;

      this.enviando = true;
      this.borrarUsuario({
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
      this.idEditar = null;
      this.agregar = false;
      this.editar = false;
      this.dialogVerDocumentos = false;
    },
  },
  computed: {
    ...mapGetters({
      usuarios: 'settings/catalogos/usuarios',
      usuariosProveedores: 'settings/catalogos/usuariosProveedores',
    }),
    listado() {
      if (!this.tipo) return [];
      if (this.tipo === 'normal') {
        return this.usuarios
          .filter(usuario => usuario.tipo !== 'proveedor')
          .filter(usuario => usuario.correo_electronico !== 'super@admin.com');
      }

      return this.usuariosProveedores;
    },
    headers() {
      if (!this.tipo) return [];
      if (this.tipo === 'normal') {
        return this.headersUsuariosSistema;
      }

      return this.headersUsuariosProveedores;
    },
  },
};
</script>

<style lang="scss">
</style>
