<template>
  <v-btn
    v-bind="$attrs"
    v-on="$listeners"
    round
    color="secondary"
    block
    :disabled="disabled">
    <v-icon left>undo</v-icon>
    <span>Deshacer</span>
  </v-btn>
</template>

<script>
export default {
  name: 'UndoButton',
  inheritAttrs: false,
  props: {
    ultimaPropuesta: String,
    fechaTermino: String,
  },
  data() {
    return {
      intervalo: null,
      ultimaHora: null,
      disabled: true,
    };
  },
  mounted() {
    this.actulizar();
    this.ultimaHora = this.$moment(this.fechaTermino).add(1, 'h');
  },
  methods: {
    actulizar() {
      if (!this.ultimaPropuesta) return;
      this.revisarTiempo();
      this.intervalo = null;
      this.intervalo = setInterval(() => {
        this.revisarTiempo();
      }, 1000 * 60);
    },
    revisarTiempo() {
      this.disabled = false;
      const menorUnaHora = this.$moment().isSameOrAfter(this.ultimaHora);
      if (menorUnaHora) {
        this.disabled = true;
        return;
      }
      const limiteUndo = this.$moment(this.ultimaPropuesta).add(5, 'm');
      const menorLimite = this.$moment().isSameOrAfter(limiteUndo);
      if (menorLimite) {
        this.disabled = true;
      }

      // const fechaA = this.$moment(this.inicial).isSameOrAfter(this.fecha);
      // const fechaB = this.$moment().isSameOrBefore(this.fecha);
      // const fechaC = this.$moment().isSameOrAfter(this.fecha);
    },
  },
  watch: {
    ultimaPropuesta: {
      handler() {
        this.actulizar();
      },
    },
    ultimaHora: {
      handler() {
        this.actulizar();
      },
    },
  },
};
</script>

<style lang="scss">
</style>
