<template>
<div id="contenedor-page-title mx-auto">
    <v-layout row class="mb-1">
        <v-flex>
            <div class="titulo grey--text text--darken-3">
                <span class="text-truncate">{{ titulo }}</span>
                <p class="py-0 px-0 text-truncate">
                  {{ subtitulo }}
                </p>
            </div>
        </v-flex>
        <v-divider
            vertical
            class="mx-3 hidden-xs-only"
            v-show="isResumenVisible && subtitulo">
        </v-divider>
        <v-flex v-show="isResumenVisible && subtitulo" class="hidden-xs-only">
        </v-flex>
    </v-layout>
</div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    titulo: {
      type: String,
      required: true,
      default() {
        return this.titulo || 'Ventana sin titulo.';
      },
    },
    subtitulo: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      isResumenVisible: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.titulo{
     position: relative;
     font-weight: 100;
     font-size: 34px;
     left: 0;
     top: 10px;
     bottom: 0;
     margin: 0;
     padding: 0;
     p {
       font-size: 12px;
     }
     div{
         position: relative;
         margin-top: -10px;
         margin-left: 5px;
         font-size: 12px;
         font-weight: 400;
     }
 }
</style>
