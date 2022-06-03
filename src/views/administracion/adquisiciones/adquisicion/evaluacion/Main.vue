<template>
  <div id="contenedor-main-evaluiacion-propuestas">
    <v-layout align-start justify-space-between row wrap>
      <v-flex xs12 md6>
        <page-title titulo="Evaluación"></page-title>
      </v-flex>
      <v-flex xs12 md3 class="text-xs-right"> </v-flex>
    </v-layout>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-layout justify-space-between row wrap class="mb-3">
          <v-flex xs12 md3>
            <v-text-field
              v-model="buscarTexto"
              placeholder="Buscar..."
              append-icon="search"
              clearable
              hide-details
              solo
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 md3>
            <v-chip color="primary" dark>
              <v-avatar dark>
                {{ getArticulosAdjudicados.length || 0 }}
              </v-avatar>
              Adjudicados
            </v-chip>
            <v-chip>
              <v-avatar>
                {{ getArticulosDesiertos.length || 0 }}
              </v-avatar>
              Desiertos
            </v-chip>
            <v-chip>
              <v-avatar>
                {{ getFaltaPorAdjudicar.length || 0 }}
              </v-avatar>
              Faltantes
            </v-chip>
          </v-flex>
        </v-layout>
        <listado
          :articulos="getArticulos"
          :buscarTexto="buscarTexto"
          v-on:adj="adjudicarArticulo"
          v-if="getAdquisicion"
        >
        </listado>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogAdjudicarArticulo" persistent max-width="700px">
      <adjudicar :articulo="esteArticulo" v-if="esteArticulo.articulo" v-on:cerrar="cerrar">
      </adjudicar>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
import Listado from './Listado.vue';
import Adjudicar from './Adjudicar.vue';

export default {
  name: 'mainEvaluacionPropuestas',
  components: {
    PageTitle,
    Listado,
    Adjudicar,
  },
  data: () => ({
    dialogAdjudicarArticulo: false,
    esteArticulo: {},
    buscarTexto: null,
  }),
  methods: {
    adjudicarArticulo(articulo) {
      this.dialogAdjudicarArticulo = true;
      this.esteArticulo = articulo;
    },
    cerrar() {
      this.dialogAdjudicarArticulo = false;
    },
  },
  computed: {
    ...mapGetters({
      adquisicion: 'adquisiciones/adquisicion',
    }),
    getAdquisicion() {
      return this.adquisicion(Number(this.$route.params.id));
    },
    getArticulos() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.articulos;
    },
    getArticulosAdjudicados() {
      if (!this.getAdquisicion) return [];
      return this.getArticulos.filter(articulo => articulo.adjudicada === true);
    },
    getArticulosDesiertos() {
      if (!this.getAdquisicion) return [];
      return this.getArticulos.filter(articulo => articulo.desierto !== null);
    },
    getFaltaPorAdjudicar() {
      if (!this.getAdquisicion) return [];
      return this.getArticulos.filter(
        articulo => articulo.adjudicada === false && articulo.desierto === null,
      );
    },
  },
};
</script>

<style lang="scss"></style>
