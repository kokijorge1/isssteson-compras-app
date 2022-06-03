<template>
  <div id="contenedor-agregar-usuario">
      <v-form v-model="valido">
      <v-card flat>
        <v-toolbar flat color="primary" dark class="headline">
            Nuevo
            <v-spacer></v-spacer>
            <v-btn icon @click="cerrar">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
        <v-card-text>
            <v-select
              v-model="usuario.tipo"
              :items="tipos"
              item-text="texto"
              item-value="id"
              label="Tipo de Usuario"
              :reglas="[reglas.requerido]">
            </v-select>
            <v-checkbox
              hide-details
              v-model="usuario.valida"
              v-if="usuario.tipo != 'proveedor'"
              label="Valida">
            </v-checkbox>
            <v-select
                v-model="usuario.id_unidad_administrativa"
                label="Unidad Administrativa"
                :items="unidades"
                item-text="nombre"
                item-value="id"
                :reglas="[reglas.requerido]"
                clearable
                v-if="$auth.user().roles === 'superadmin'"
                v-show="usuario.tipo === 'compras' || usuario.tipo === 'area'">
            </v-select>
            <v-select
                v-model="usuario.id_area"
                label="Area"
                :items="listadoAreas"
                item-text="nombre"
                item-value="id"
                :reglas="[reglas.requerido]"
                clearable
                v-show="usuario.tipo === 'area'">
            </v-select>
            <v-autocomplete
                v-model="usuario.id_proveedor"
                label="Proveedor"
                :items="listadoProveedores"
                :filter="filtroBusquedaProveedores"
                item-text="nombre"
                item-value="id"
                :rules="[reglas.requerido]"
                clearable
                v-if="usuario.tipo === 'proveedor'">
                <template slot="item" slot-scope="data">
                    {{ data.item.rfc }} - {{ data.item.nombre }}
                </template>
            </v-autocomplete>
            <v-text-field
                v-model="usuario.nombre"
                label="Nombre"
                :rules="[reglas.requerido]"
                hint="Requerido *"
                persistent-hint>
            </v-text-field>
            <v-text-field
                v-model="usuario.correo_electronico"
                label="Correo Electrónico"
                :rules="[reglas.requerido, reglas.email]"
                hint="Requerido *"
                persistent-hint>
            </v-text-field>
            <v-layout row wrap>
                <v-flex xs12 md6 class="pr-3">
                    <v-text-field
                        v-model="usuario.password"
                        label="Contraseña"
                        :rules="[reglas.requerido, reglas.minCaracteres]"
                        hint="Requerido *"
                        persistent-hint>
                    </v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                    <v-text-field
                        v-model="usuario.rePassword"
                        label="Contraseña"
                        :rules="[reglas.requerido, reglas.minCaracteres,
                            reglas.comprarPasswords]"
                        hint="Requerido *"
                        persistent-hint>
                    </v-text-field>
                </v-flex>
            </v-layout>
            <v-textarea
              v-model="usuario.puesto"
              label="Puesto"
              :rules="[reglas.requerido]"
              hint="Requerido *"
              persistent-hint
              auto-grow
              rows="2">
            </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click.prevent="guardar"
            :loading="enviando"
            :disabled="!valido">
            <v-icon>save</v-icon>
            Guardar
          </v-btn>
          <v-btn flat @click="cerrar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'AgregarUsuario',
  data() {
    return {
      valido: false,
      enviando: false,
      tiposValidan: ['superadmin', 'compras'],
      usuario: {
        id_unidad_administrativa: null,
        id_area: null,
        id_proveedor: null,
        tipo: null,
        nombre: null,
        correo_electronico: null,
        password: '',
        rePassword: '',
        puesto: null,
        valida: false,
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        minCaracteres: v => v.length >= 8 || 'La contraseña debe de tener un minimo de 8 caracteres',
        email: (val) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(val) || 'Correo electrónico invalido.';
        },
        comprarPasswords: () => this.usuario.password === this.usuario.rePassword
            || 'Las contraseñas no coiciden.',
      },
      tiposUsuarios: [
        {
          id: 'superadmin', texto: 'Administrador',
        },
        { id: 'compras', texto: 'Compras' },
        { id: 'area', texto: 'Area' },
        { id: 'programacion', texto: 'Programación' },
        { id: 'proveedor', texto: 'Proveedor' },
      ],
    };
  },
  mounted() {
    if (this.$auth.user() && this.$auth.user().roles === 'compras') {
      this.usuario.id_unidad_administrativa = this
        .$auth
        .user()
        .unidad_administrativa.id;
    }
  },
  methods: {
    ...mapActions('settings/catalogos', ['agregarUsuario']),
    guardar() {
      this.enviando = true;
      this.agregarUsuario(this.usuario).then(() => {
        const respuesta = new Mensajes(null).success;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });

        this.usuario.id_unidad_administrativa = null;
        this.usuario.id_area = null;
        this.usuario.id_proveedor = null;
        this.usuario.tipo = null;
        this.usuario.nombre = null;
        this.usuario.correo_electronico = null;
        this.usuario.password = '';
        this.usuario.rePassword = '';
        this.usuario.puesto = null;

        this.enviando = false;
        this.cerrar();
      })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    filtroBusquedaProveedores(item, queryText) {
      const nombre = item.nombre.toLowerCase();
      const rfc = item.rfc.toLowerCase();
      const searchText = queryText.toLowerCase();

      return nombre.indexOf(searchText) > -1
          || rfc.indexOf(searchText) > -1;
    },
    cerrar() {
      this.usuario.id_unidad_administrativa = null;
      this.usuario.id_area = null;
      this.usuario.id_proveedor = null;
      this.usuario.tipo = null;
      this.usuario.nombre = null;
      this.usuario.correo_electronico = null;
      this.usuario.password = '';
      this.usuario.rePassword = '';
      this.usuario.puesto = null;

      this.$emit('cerrar');
    },
  },
  computed: {
    ...mapGetters({
      unidades: 'settings/catalogos/unidadesAdministrativas',
      areas: 'settings/catalogos/areasByUnidad',
      proveedores: 'settings/catalogos/proveedores',
    }),
    listadoAreas() {
      if (!this.usuario.id_unidad_administrativa) return [];
      return this.areas(this.usuario.id_unidad_administrativa);
    },
    listadoProveedores() {
      if (!this.proveedores) return [];
      return this.proveedores.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
    tipos() {
      return this.tiposUsuarios.filter((item) => {
        if (this.$auth.user().roles === 'compras') {
          return item.id === 'area' || item.id === 'proveedor';
        }
        return true;
      });
    },
    usuarioTipo() {
      return this.usuario.tipo;
    },
  },
  watch: {
    usuarioTipo: {
      handler(tipo) {
        this.usuario.valida = this.tiposValidan.includes(tipo);
      },
    },
  },
};
</script>

<style lang="scss">
</style>
