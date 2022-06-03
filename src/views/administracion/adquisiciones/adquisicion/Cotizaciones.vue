<template>
  <div id="contenedor-cotizaciones-proveedor">
    <page-title titulo="Cotizaciones"></page-title>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-layout row wrap justify-space-between class="mb-4">
          <v-flex md3 xs12>
            <v-text-field
              v-model="buscarText"
              placeholder="Buscar..."
              solo
              hide-details
              clearable
              append-icon="search"
            >
            </v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex md4 xs12>
            <v-btn
              flat
              dark
              class="blue text-xs-center text-md-right"
              round
              @click.prevent="descargarTodosArchivos"
              :loading="descargandoTodos"
            >
              <v-icon left>cloud_download</v-icon>
              Descargar todos los archivos
              <v-chip small outline text-color="white" class="ml-1">
                {{ getProveedoresConCotizacion.length }}
              </v-chip>
            </v-btn>
            <div class="ml-3">
              <span>
                <b class="grey--text text--darken-2">
                  Tamaño:
                </b>
                {{ $humanFileSize(sizeTotalArchivos) }}
              </span>
              <span>
                <v-progress-linear v-model="porcentajeDescarga"></v-progress-linear>
              </span>
            </div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-list two-line subheader>
          <v-subheader inset>
            CON COTIZACIONES ANEXAS
            <v-chip>
              {{ getProveedoresConCotizacion.length }}
            </v-chip>
          </v-subheader>
          <v-list-tile
            v-for="(proveedor, index) in getProveedoresConCotizacion"
            :key="`con-${index}`"
            avatar
            @click.prevent="descargarCotizacion(proveedor.proveedor.anexoCotizacion)"
          >
            <v-list-tile-avatar>
              <v-tooltip top>
                <v-btn
                  slot="activator"
                  fab
                  :loading="proveedor.proveedor.id === descargandoEsteProveedor"
                  small
                  dark
                  class="blue"
                >
                  <v-icon class="white--text">
                    cloud_download
                  </v-icon>
                </v-btn>
                <span>
                  Descargar cotización:
                  {{ proveedor.proveedor.anexoCotizacion.file_original_name }}
                </span>
              </v-tooltip>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ proveedor.proveedor.nombre }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ proveedor.proveedor.rfc }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click.prevent="alert">
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-subheader inset>
            SIN COTIZACIONES ANEXAS
            <v-chip>
              {{ getProveedoresSinCotizacion.length }}
            </v-chip>
          </v-subheader>
          <v-list-tile
            v-for="(proveedor, index) in getProveedoresSinCotizacion"
            :key="`sin-${index}`"
            avatar
          >
            <v-list-tile-avatar>
              <v-icon class="grey lighten-1 white--text">
                folder
              </v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ proveedor.proveedor.nombre }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ proveedor.proveedor.rfc }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FileDownloader from 'js-file-download';
import Mensajes from '@/helpers/mensajes';
import PageTitle from '@/components/PageTitle.vue';

export default {
  name: 'CotizacionesProveedores',
  components: {
    PageTitle,
  },
  data: () => ({
    buscarText: '',
    descargandoEsteProveedor: null,
    descargandoTodos: false,
    porcentajeDescarga: 0,
  }),
  methods: {
    descargarCotizacion(cotizacion) {
      this.descargandoEsteProveedor = cotizacion.id_proveedor;
      this.axios
        .get(`/proveedor/adquisicion/anexo/${cotizacion.public_key}`, {
          responseType: 'blob',
          timeout: 300000,
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              this.porcentajeDescarga = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
            }
          },
        })
        .then((res) => {
          FileDownloader(
            res.data,
            `${cotizacion.file_original_name}.${cotizacion.file_ext.toLowerCase()}`,
          );
          this.descargandoEsteProveedor = null;
        })
        .catch((err) => {
          this.descargandoEsteProveedor = null;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    descargarTodosArchivos() {
      this.descargandoTodos = true;
      const numeroValido = this.getAdquisicion.numero.replace(/[/\\?%*:|"<>]/g, '-');
      this.axios
        .get(`/cotizaciones/zip/${this.getAdquisicion.id}`, {
          responseType: 'blob',
          timeout: 300000,
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              this.porcentajeDescarga = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
            }
          },
        })
        .then((res) => {
          FileDownloader(res.data, `${numeroValido}-archivos.zip`);
          this.descargandoTodos = false;
        })
        .catch((err) => {
          this.descargandoTodos = true;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    alert() {},
  },
  computed: {
    ...mapGetters({
      adquisicion: 'adquisiciones/adquisicion',
    }),
    getAdquisicion() {
      return this.adquisicion(Number(this.$route.params.id));
    },
    proveedoresParticipantes() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.participantes.filter((proveedor) => {
        if (!this.buscarText) return true;
        const expt = new RegExp(this.buscarText, 'gi');
        return expt.test(proveedor.proveedor.nombre) || expt.test(proveedor.proveedor.rfc);
      });
    },
    getProveedoresConCotizacion() {
      if (!this.getAdquisicion) return [];
      return this.proveedoresParticipantes.filter(
        item => Object.entries(item.proveedor.anexoCotizacion).length > 0,
      );
    },
    getProveedoresSinCotizacion() {
      if (!this.getAdquisicion) return [];
      return this.proveedoresParticipantes.filter(
        item => Object.entries(item.proveedor.anexoCotizacion).length === 0,
      );
    },
    sizeTotalArchivos() {
      let total = 0;
      this.getProveedoresConCotizacion.forEach((cotizacion) => {
        total += cotizacion.proveedor.anexoCotizacion.file_size;
      });
      return total;
    },
  },
  mounted() {
    const room = `ACTUALIZAR_ANEXOS_COTIZACIONES_ADQUISICION_${this.$route.params.id}`;
    this.sockets.subscribe(room, (cotizacion) => {
      this.$store.commit('adquisiciones/ACTUALIZAR_ANEXAR_COTIZACION', { cotizacion });
    });
  },
};
</script>

<style lang="scss"></style>
