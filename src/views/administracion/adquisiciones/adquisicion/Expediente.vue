<template>
  <div id="contenedor-expediente">
    <page-title titulo="Expediente"></page-title>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-list>
          <div v-for="(anexo, index) in getAdquisicion.expedientes" :key="`t__${anexo.public_key}`">
            <v-list-tile ripple avatar :key="anexo.public_key">
              <v-list-tile-avatar>
                <v-btn icon flat class="blue white--text" @click="descagarExpediente(anexo, 0)">
                  <v-icon>cloud_download</v-icon>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ anexo.file_original_name }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  <small>
                    {{ anexo.usuario.nombre }} -
                    <fecha-humano :fecha="new Date(anexo.created_at)"> </fecha-humano>
                    - <v-icon small>attachment</v-icon>
                    {{ $humanFileSize(anexo.file_size) }}
                  </small>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon>
                  <v-icon color="error">
                    delete
                  </v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider
              inset
              v-if="index + 1 < getAdquisicion.expedientes.length"
              :key="`div-${index}`"
              class="pt-1"
            >
            </v-divider>
          </div>
          <div v-for="(requisicion, index) in expedienteRequisiciones" :key="`t_d-${index}`">
            <v-subheader :key="`sub-titulo-requisicion-${index}`">
              <b>{{ requisicion.numero }}</b>
            </v-subheader>
            <div v-for="(exp, inx) in requisicion.expedientes" :key="`t_d_${exp.public_key}`">
              <v-list-tile :key="exp.public_key">
                <v-list-tile-avatar>
                  <v-btn icon flat class="blue white--text" @click="descagarExpediente(exp, 1)">
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ exp.file_original_name }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <small>
                      {{ exp.usuario.nombre }} -
                      <fecha-humano :fecha="new Date(exp.created_at)"> </fecha-humano>
                      - <v-icon small>attachment</v-icon>
                      {{ $humanFileSize(exp.file_size) }}
                    </small>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action> </v-list-tile-action>
              </v-list-tile>
              <v-divider
                inset
                v-if="inx + 1 < requisicion.expedientes.length"
                :key="`div-${exp.public_key}`"
                class="pt-1"
              >
              </v-divider>
            </div>
          </div>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
import FechaHumano from '@/components/FechaHumano.vue';
import FileDownloader from 'js-file-download';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'adquisicionExpediente',
  components: {
    PageTitle,
    FechaHumano,
  },
  data() {
    return {};
  },
  methods: {
    descagarExpediente(anexo, tipo) {
      const urlsDescargas = ['/adquisiciones/expediente/', '/requisiciones/expediente/'];
      this.axios
        .get(`${urlsDescargas[tipo]}${anexo.public_key}`, {
          responseType: 'blob',
          timeout: 30000,
        })
        .then((res) => {
          FileDownloader(res.data, `${anexo.file_original_name}.pdf`);
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
  },
  computed: {
    ...mapGetters({
      adquisicion: 'adquisiciones/adquisicion',
      requisiciones: 'requisiciones/requisiciones',
    }),
    getAdquisicion() {
      return this.adquisicion(Number(this.$route.params.id));
    },
    expedienteRequisiciones() {
      if (!this.getAdquisicion) return [];
      const requisicionesIds = this.getAdquisicion.requisiciones.map(item => item.id);
      return this.requisiciones.filter(item => requisicionesIds.includes(item.id));
    },
  },
};
</script>

<style lang="scss"></style>
