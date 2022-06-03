<template>
    <div id="contenedor-chip-nuevo">
        <v-chip
            :value="mostrar"
            color="primary"
            text-color="white"
            small
            disabled>
            Nuevo
        </v-chip>
    </div>
</template>

<script>
let intervalo = null;

export default {
  name: 'ChipNuevo',
  props: {
    fecha: {
      type: [Date, String],
      required: true,
    },
  },
  data() {
    return {
      mostrar: true,
    };
  },
  mounted() {
    this.actulizar();
  },
  methods: {
    actulizar() {
      if (!this.fecha) return;

      if (this.checarDiffUnaHora()) {
        this.mostrar = false;
        return;
      }

      intervalo = setInterval(() => {
        if (this.checarDiffUnaHora()) {
          clearInterval(intervalo);
          this.mostrar = false;
        }
      }, 1000 * 60);
    },
    checarDiffUnaHora() {
      const ahorita = this.$moment(new Date());
      const duracion = this.$moment.duration(ahorita.diff(this.fecha));
      const minutos = duracion.asMinutes();

      return minutos > 2;
    },
  },
  watch: {
    fecha: {
      handler() {
        clearInterval(intervalo);
        this.actulizar();
      },
    },
  },
};
</script>

<style lang="scss">

</style>
