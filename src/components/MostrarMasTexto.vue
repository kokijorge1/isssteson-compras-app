<template>
    <div id="contenedor-mostrar-mas-texto">
        <span>
            {{ texto.substring(0, carMaximo) }}
        </span>
        <div>
            <a
                v-if="this.texto.length > caracteresMaximos"
                @click="mostrarMas">
                <template
                    v-if="!mostrarMasTexto">
                    <v-icon
                        small>
                        expand_more
                    </v-icon>
                    Mostrar más
                </template>
                <template
                    v-else>
                    <v-icon
                        small>
                        expand_less
                    </v-icon>
                    Mostrar menos
                </template>
            </a>
        </div>
    </div>
</template>

<script>
export default {
  name: 'mostrarMasTexto',
  props: {
    texto: {
      type: String,
      required: false,
    },
    caracteresMaximos: {
      type: Number,
      required: false,
      default: 50,
    },
  },
  data: () => ({
    carMaximo: 0,
    mostrarMasTexto: false,
  }),
  mounted() {
    const esto = this;
    esto.carMaximo = esto.caracteresMaximos;
  },
  methods: {
    mostrarMas() {
      this.mostrarMasTexto = !this.mostrarMasTexto;
      if (this.mostrarMasTexto) {
        this.carMaximo = this.texto.length;
        return;
      }
      this.carMaximo = this.caracteresMaximos;
    },
  },
};
</script>

<style lang="scss">

</style>
