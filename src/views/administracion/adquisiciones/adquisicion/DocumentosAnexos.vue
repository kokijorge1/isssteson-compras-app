<template>
  <div id="contenedor-documentos-anexos">
    <v-toolbar dense class="mb-3 secondary" dark>
      <v-toolbar-title>
        Documentos anexos
        <v-chip outline text-color="white">
          {{ getAnexos.length }}
        </v-chip>
      </v-toolbar-title>
    </v-toolbar>
    <v-list two-line>
      <template v-for="(documento, index) in getAnexos">
        <v-divider :key="`__divisor-${index}`" v-if="index > 0"> </v-divider>
        <v-list-tile :key="`__documento-${index}`">
          <v-list-tile-avatar>
            <v-btn
              flat
              dark
              class="blue text-xs-center text-md-right"
              round
              icon
              @click="descagarAnexo(documento)"
            >
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
                <fecha-humano :fecha="new Date(documento.created_at)"> </fecha-humano>
                - <v-icon small>attachment</v-icon>
                {{ $humanFileSize(documento.file_size) }}
              </small>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn
              icon
              :loading="borrandoEsteDocumento === documento.id"
              @click.prevent="borrarDocumento(documento)"
            >
              <v-icon>
                delete
              </v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </template>
      <v-divider></v-divider>
      <v-list-tile v-if="nombreArchivo === ''">
        <v-list-tile-content>
          <v-btn flat block @click.prevent="$refs.file.click()" small>
            <v-icon left color="blue">
              cloud_upload
            </v-icon>
            Anexar Documento
          </v-btn>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="nombreArchivo !== ''">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ nombreArchivo }}
          </v-list-tile-title>
          <v-progress-linear v-model="progreso"> </v-progress-linear>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <input
      type="file"
      id="anexo"
      accept=".pdf, .zip, .rar, .xlsx, .docx"
      ref="file"
      v-show="false"
      v-on:change="anexarDocumento"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FileDownloader from 'js-file-download';
import Mensajes from '@/helpers/mensajes';
import FechaHumano from '@/components/FechaHumano.vue';

export default {
  name: 'documentosAnexos',
  components: {
    FechaHumano,
  },
  data: () => ({
    enviando: false,
    progreso: 0,
    nombreArchivo: '',
    borrandoEsteDocumento: null,
  }),
  methods: {
    ...mapActions('adquisiciones', ['borrarAnexoAdquisicion']),
    anexarDocumento(e) {
      if (e.target.files[0]) {
        this.nombreArchivo = e.target.files[0].name;
      }
      this.enviando = true;
      const dataForm = new FormData();
      dataForm.append('id_adquisicion', Number(this.$route.params.id));
      dataForm.append('numero', this.getAdquisicion.numero);
      dataForm.append('adjunto', document.getElementById('anexo').files[0]);

      this.axios
        .post('/adquisiciones/anexos/', dataForm, {
          timeout: 300000,
          onUploadProgress: (progressEvent) => {
            this.progreso = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          },
        })
        .then((res) => {
          this.nombreArchivo = '';
          this.$store.commit('adquisiciones/AGREGAR_ANEXO', {
            anexo: res.data,
          });
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.progreso = 0;
        })
        .catch((err) => {
          this.nombreArchivo = '';
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    descagarAnexo(anexo) {
      this.axios
        .get(`adquisiciones/anexos/${anexo.public_key}`, {
          responseType: 'blob',
          timeout: 30000,
        })
        .then((res) => {
          FileDownloader(res.data, anexo.file_original_name);
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
    borrarDocumento(documento) {
      this.borrandoEsteDocumento = documento.id;
      this.borrarAnexoAdquisicion({
        id_adquisicion: documento.id_adquisicion,
        id: documento.id,
      })
        .then(() => {
          this.borrandoEsteDocumento = null;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        })
        .catch((err) => {
          this.borrandoEsteDocumento = null;
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
  },
  computed: {
    ...mapGetters({
      documentosAnexos: 'adquisiciones/documentosAnexos',
      getAdq: 'adquisiciones/adquisicion',
    }),
    getAdquisicion() {
      return this.getAdq(Number(this.$route.params.id));
    },
    getAnexos() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.anexos;
    },
  },
};
</script>

<style lang="scss"></style>
