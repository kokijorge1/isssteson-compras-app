<template>
  <div id="contenedor-fecha-tipo-calendario">
    <template
      v-if="mostrarEstatus">
      <v-tooltip left>
        <template #activator="data">
          <div
              v-on="data.on"
              class="py-1 px-1 rounded elevation-2 white--text"
              :class="estatus">
              {{ $moment(fecha).calendar().split(" a")[0] }}
          </div>
        </template>
        <span>
            {{ $moment(fecha).format('D/MM/YYYY') }}
        </span>
      </v-tooltip>
    </template>
    <template
      v-else>
      {{ $moment(fecha).format('D/MM/YYYY') }}
    </template>
  </div>
</template>

<script>
export default {
  name: 'FechaTipoCalendario',
  props: {
    fecha: {
      type: Date,
      required: true,
      default() {
        return this.fecha || new Date();
      },
    },
    mostrarEstatus: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    estatus() {
      const diffDias = this.$fechaDiffDias(new Date(), this.fecha);
      if (diffDias <= 0) return 'error';
      if (diffDias > 0 && diffDias <= 5) return 'warning';
      return 'success';
    },
  },
};
</script>

<style lang="scss" scoped>
.rounded {
    border-radius: 3px;
}
</style>
