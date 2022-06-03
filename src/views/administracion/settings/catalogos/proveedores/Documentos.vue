<template>
  <div id="contenedor-documentos-proveedor">
    <v-card
      v-if="getProveedor">
      <v-toolbar flat>
        <v-toolbar-title>
          Documentos
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="cerrar">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        Proveedor:
        <strong>{{ proveedor.nombre }}</strong>
        <v-list
          subheader
          class="mt-3">
          <template
            v-for="(documento, index) in getProveedor.documentos">
            <v-divider
              v-if="index > 0"
              :key="`__espacio-${index}`"
              class="my-2">
            </v-divider>
            <v-list-tile
              :key="`__documento-${index}`"
              @click="descagarExpediente(documento)">
              <v-list-tile-avatar>
                <v-icon large color="blue" class="white--text">cloud_download</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ documento.documento.nombre }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <template
            v-if="getProveedor.documentos.length <= 0">
            <v-alert
              :value="true"
              type="info">
              Este proveedor no ha anexado documentación.
            </v-alert>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import FileDownloader from 'js-file-download';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'Editar',
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      searchText: '',
      valido: true,
      enviando: false,
      email: '',
      isEmailValido: false,
      proveedor: {
        nombre: null,
        usuarios: null,
        constanciaRfc: null,
        opinionPositiva: null,
      },
    };
  },
  mounted() {
    this.fetchProveedor();
  },
  methods: {
    ...mapActions('settings/catalogos', ['actulizarProveedor']),
    fetchProveedor() {
      if (!this.id) return;
      this.proveedor.nombre = this.getProveedor.nombre;
      this.proveedor.usuarios = this.getProveedor.usuarios;
      this.proveedor.constanciaRfc = this.getProveedor.constanciaRfc;
      this.proveedor.opinionPositiva = this.getProveedor.opinionPositiva;
    },
    actulizar() {
      this.enviando = true;
      this.actulizarProveedor({
        id: this.id,
        proveedor: this.proveedor,
      })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
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
    descagarExpediente(anexo) {
      this.axios.get(`/settings/catalogos/proveedores/documentos/${anexo.public_key}`, {
        responseType: 'blob',
        timeout: 30000,
      })
        .then((res) => {
          FileDownloader(res.data, anexo.file_name);
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
    cerrar() {
      this.$emit('cerrar');
    },
  },
  computed: {
    ...mapGetters({
      proveedorId: 'settings/catalogos/proveedor',
    }),
    getProveedor() {
      return this.proveedorId(this.id);
    },
  },
  watch: {
    id: {
      handler() {
        this.fetchProveedor();
      },
    },
  },
};
</script>

<style lang="scss">
</style>
