<template>
    <div id="contenedor-documentos-anexos">
        <v-card
          v-if="getAdquisicion">
            <v-toolbar
                flat color="primary" dark class="headline">
                <v-toolbar-title>
                    Documentos anexos
                    <v-chip
                        outline
                        text-color="white">
                        {{ getAdquisicion.anexos.length }}
                    </v-chip>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    @click="cerrar">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-list>
                    <template
                        v-for="(documento, index) in getAdquisicion.anexos">
                        <v-divider
                            :key="`__divisor-${index}`"
                            v-if="index > 0"
                            class="my-2">
                        </v-divider>
                        <v-list-tile
                            :key="`__documento-${index}`">
                            <v-list-tile-avatar>
                                <v-btn
                                    flat
                                    dark
                                    class="blue text-xs-center text-md-right"
                                    round
                                    icon
                                    :loading="descargandoEsteDocumento === documento.id"
                                    @click="descargarAnexo(documento)">
                                    <v-icon>
                                        cloud_download
                                    </v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ documento.file_original_name }}
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                    <small>
                                        <fecha-humano
                                        :fecha="new Date(documento.created_at)">
                                        </fecha-humano>
                                        - <v-icon small>attachment</v-icon>
                                        {{ $humanFileSize(documento.file_size) }}
                                    </small>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FileDownloader from 'js-file-download';
import Mensajes from '@/helpers/mensajes';
import FechaHumano from '@/components/FechaHumano.vue';

export default {
  name: 'documentosAnexos',
  components: {
    FechaHumano,
  },
  data: () => ({
    descargandoEsteDocumento: null,
    porcentajeDescarga: 0,
  }),
  methods: {
    descargarAnexo(documento) {
      this.descargandoEsteDocumento = documento.id;
      this.axios.get(`/adquisiciones/anexos/${documento.public_key}`, {
        responseType: 'blob',
        timeout: 300000,
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            this.porcentajeDescarga = Math.round((progressEvent.loaded * 100)
            / progressEvent.total);
          }
        },
      })
        .then((res) => {
          FileDownloader(res.data, documento.file_original_name);
          this.descargandoEsteDocumento = null;
        })
        .catch((err) => {
          this.descargandoEsteDocumento = null;
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
      adquisicion: 'proveedores/adquisicion',
    }),
    getAdquisicion() {
      return this.adquisicion(Number(this.$route.params.id));
    },
  },
};
</script>

<style lang="scss">

</style>
