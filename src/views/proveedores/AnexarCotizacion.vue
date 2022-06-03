<template>
  <div id="contenedor-anexar-cotizacion-proveedor">
    <v-card>
      <v-toolbar
        flat color="primary" dark class="headline">
        <v-toolbar-title>
          Anexar Cotización
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
        <v-layout
          align-center justify-space-between px-1 py-1 row wrap fill-height
          class="contenedor-file">
          <v-flex
            xs12
            class="text-xs-center grey lighten-4 seleccionar-archivo"
            fill-height
            @click="$refs.file.click()">
            <v-layout
              align-center
              justify-start
              class="height-min-select-file"
              :class="{'light-blue darken-1 white--text': archivo.tipo !== ''}"
              :dark="archivo.tipo !== ''">
              <v-flex
                xs3>
                <v-icon
                  x-large
                  :dark="archivo.tipo !== ''">
                  cloud_upload
                </v-icon>
              </v-flex>
              <v-flex
                class="text-xs-left"
                xs9>
                {{ archivo.nombre }}
              </v-flex>
            </v-layout>
          </v-flex>
          <div>
            <small
              class="grey--text text--darken-1">
              <span>
                <b>Tipo de archivos validos:</b>
              </span>
              <span>
                pdf, xslx, docx, zip, rar
              </span>
            </small>
          </div>
          <v-flex
            xs12
            fill-height
            class="mt-2">
            <v-divider
              class="mb-2">
            </v-divider>
            <div>
              <b>
                Tipo:
              </b>
              <span>
                <small>
                  {{ archivo.nombre.split('.').pop() }}
                </small>
              </span>
            </div>
            <div>
              <b>
                Tamaño:
              </b>
              <span>
                <small>
                  {{ $humanFileSize(Number(archivo.size)) }}
                </small>
              </span>
            </div>
          </v-flex>
        </v-layout>
        <div
          class="mt-1">
          <small>
            <b>
              Nota:
            </b>
            <span>
              Si desea agregar mas documentos,
              le sugerimos crear un archivo .zip o .rar
              que incluya la cotización firmada y todos los
              documentos relacionados y enviarlos por esta misma vía.
            </span>
          </small>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="cerrar"
          flat>
          Cancelar
        </v-btn>
        <v-btn
          @click="uploadAnexarArchivo"
          :loading="enviando"
          :disabled="archivo.tipo === ''"
          color="primary">
          <v-icon
            left>
            cloud_upload
          </v-icon>
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
    <input
      type="file"
      id="anexo"
      accept=".pdf, .zip, .rar, .xlsx, .docx"
      ref="file"
      v-show="false"
      v-on:change="fileSelected">
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'AnexarCotizacionProveedor',
  components: {
  },
  data() {
    return {
      enviando: false,
      nombreArchivo: '',
      archivo: {
        nombre: 'Seleccionar archivo...',
        tipo: '',
        size: 0,
      },
    };
  },
  methods: {
    ...mapActions('proveedores', ['anexarCotizacion']),
    setArchivo(file) {
      this.nombreArchivo = file;
    },
    uploadAnexarArchivo() {
      this.enviando = true;
      const dataForm = new FormData();
      dataForm.append('id_adquisicion', Number(this.$route.params.id));
      dataForm.append('numero', this.getAdquisicion.numero);
      dataForm.append('adjunto', document.getElementById('anexo').files[0]);

      this.anexarCotizacion(dataForm)
        .then(() => {
          this.enviando = false;
          this.nombreArchivo = '';
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
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
    fileSelected(e) {
      const archivo = e.target.files[0];
      if (e.target.files[0]) {
        this.archivo.nombre = archivo.name;
        this.archivo.tipo = archivo.type;
        this.archivo.size = archivo.size;
      }
    },
    cerrar() {
      document.getElementById('anexo').value = '';
      this.archivo.nombre = 'Seleccionar archivo...';
      this.archivo.tipo = '';
      this.archivo.size = '';
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
.contenedor-file {
  border: 1px solid #E0E0E0;
}
.seleccionar-archivo {
  border-radius: 10px;
  cursor: pointer;
}
.height-min-select-file {
  min-height: 10vh;
}
</style>
