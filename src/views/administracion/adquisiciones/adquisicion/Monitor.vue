<template>
  <div id="contenedor-monitor">
    <v-layout align-start justify-space-between row wrap>
      <v-flex xs12 md6>
        <page-title titulo="Monitor"></page-title>
      </v-flex>
      <v-flex xs12 md3 class="text-xs-right">
        <count-down
          :inicio="fechasEvento.inicio"
          :termino="fechasEvento.termino"
          @change="comprobarEvento"
          estatus
          v-if="fechasEvento.termino"
        >
        </count-down>
      </v-flex>
    </v-layout>
    <v-card class="roundedCustom">
      <v-toolbar flat color="transparent">
        <v-spacer></v-spacer>
        <v-btn
          color="blue-grey"
          class="white--text"
          @click.prevent="dialogJustificacion = !dialogJustificacion"
        >
          <v-icon left dark>subject</v-icon>
          Justificación
        </v-btn>
        <v-btn
          :loading="bajando"
          :disabled="bajando"
          color="blue-grey"
          class="white--text"
          @click.prevent="descargarReporte"
        >
          <v-icon left dark>cloud_download</v-icon>
          Reporte
        </v-btn>
        <v-btn color="blue-grey" class="white--text" @click.prevent="generarActa">
          <v-icon left dark>
            list_alt
          </v-icon>
          Generar Acta
        </v-btn>
      </v-toolbar>
      <v-card-text class="altura-maxima">
        <comparativo></comparativo>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogJustificacion" persistent max-width="600px">
      <v-card flat>
        <v-toolbar flat color="primary" dark class="headline">
          Justificación
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogJustificacion = !dialogJustificacion">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-flex>
            <v-textarea
              v-model="justificacion"
              label="Justificación"
              rows="10"
              auto-grow
              solo
            ></v-textarea>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.prevent="editarJustificacion" :loading="enviando">
            <v-icon>save</v-icon>
            Guardar
          </v-btn>
          <v-btn flat @click="dialogJustificacion = !dialogJustificacion">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FileDownloader from 'js-file-download';
import Mensajes from '@/helpers/mensajes';
import PageTitle from '@/components/PageTitle.vue';
import CountDown from '@/components/CountDown.vue';
import CargandoComponente from '@/components/CargandoComponente.vue';
import ErrorComponente from '@/components/ErrorComponente.vue';

const Comparativo = () => ({
  component: import('./Comparativo'),
  loading: CargandoComponente,
  error: ErrorComponente,
  delay: 100,
  timeout: 3000,
});

export default {
  name: 'Monitor',
  components: {
    PageTitle,
    Comparativo,
    CountDown,
  },
  data() {
    return {
      enviando: false,
      dialogJustificacion: false,
      bajando: false,
      justificacion: null,
      generandoActa: false,
      fechasEvento: {
        inicio: null,
        termino: null,
      },
      eventoLive: false,
    };
  },
  mounted() {
    if (this.getAdquisicion) {
      this.fechasEvento.inicio = this.getAdquisicion.fecha_inicio;
      this.fechasEvento.termino = this.getAdquisicion.fecha_termino;
      this.justificacion = this.getAdquisicion.justificacion;
    }
  },
  methods: {
    ...mapActions('adquisiciones', ['actulizarAdquisicionJustificacion']),
    descargarReporte() {
      const idAdquisicion = Number(this.$route.params.id);
      this.bajando = true;
      this.axios
        .get(`/adquisiciones/generar/comparativo/${idAdquisicion}`, {
          responseType: 'blob',
          timeout: 30000,
        })
        .then((res) => {
          this.bajando = false;
          FileDownloader(res.data, `comparativo-${this.getAdquisicion.numero}.xlsx`);
        })
        .catch((err) => {
          this.bajando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    generarActa() {
      const idAdquisicion = Number(this.$route.params.id);
      this.generandoActa = true;
      this.axios
        .get(`/adquisiciones/generar/acta/${idAdquisicion}`, {
          responseType: 'blob',
          timeout: 30000,
        })
        .then((res) => {
          this.generandoActa = false;
          FileDownloader(res.data, `acta-${this.getAdquisicion.numero}.docx`);
        })
        .catch((err) => {
          this.generandoActa = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    comprobarEvento(valor) {
      this.eventoLive = valor;
    },
    editarJustificacion() {
      this.enviando = true;
      this.actulizarAdquisicionJustificacion(this.adquisicionDatosFormato())
        .then(() => {
          this.enviando = false;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
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
    adquisicionDatosFormato() {
      return {
        id: Number(this.$route.params.id),
        datos: {
          justificacion: this.justificacion,
        },
      };
    },
  },
  computed: {
    ...mapGetters({
      adquisicion: 'adquisiciones/adquisicion',
    }),
    getAdquisicion() {
      return this.adquisicion(Number(this.$route.params.id));
    },
  },
  watch: {
    getAdquisicion: {
      handler(adquisicion) {
        if (adquisicion) {
          this.fechasEvento.inicio = adquisicion.fecha_inicio;
          this.fechasEvento.termino = adquisicion.fecha_termino;
          this.justificacion = this.getAdquisicion.justificacion || '';
        }
      },
    },
  },
};
</script>

<style lang="scss">
.altura-maxima {
  overflow: auto;
}
</style>
