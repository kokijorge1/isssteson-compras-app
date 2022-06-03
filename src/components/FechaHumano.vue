<template>
  <div id="contenedor-fecha-humano">
    <template
      v-if="fecha">
      <v-tooltip top>
        <template #activator="data">
          <span v-on="data.on">
            {{ formatoHumano }}
          </span>
        </template>
        <span>
          {{ $moment(fecha).format('D/MM/YYYY, h:mm:ss a') }}
        </span>
      </v-tooltip>
    </template>
    <template v-else>
      N/A
    </template>
  </div>
</template>

<script>
let intervalo = null;
export default {
  name: 'FechaHumano',
  props: {
    fecha: {
      type: [Date, String],
      required: true,
    },
  },
  data() {
    return {
      formatoHumano: null,
    };
  },
  mounted() {
    this.actulizar();
  },
  methods: {
    actulizar() {
      if (!this.fecha) return;

      this.formatoHumano = this.$moment(new Date(this.fecha)).fromNow();

      if (this.checarDiffUnaHora()) return;

      intervalo = setInterval(() => {
        if (this.checarDiffUnaHora()) {
          clearInterval(intervalo);
          return;
        }
        this.formatoHumano = this.$moment(new Date(this.fecha)).fromNow();
      }, 1000 * 60);
    },
    checarDiffUnaHora() {
      const ahorita = this.$moment(new Date());
      const duracion = this.$moment.duration(ahorita.diff(this.fecha));
      const horas = duracion.asHours();

      return horas > 1;
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
#contenedor-fecha-humano{
  display: inline-block;
}
</style>
