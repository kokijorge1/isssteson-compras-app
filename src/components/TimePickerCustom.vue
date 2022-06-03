<template>
  <div id="contenedor-time-picker-custom">
      <v-select
        v-model="tiempo"
        :items="getTiempos"
        :label="label"
        :rules="rules"
        solo
        prepend-inner-icon="access_time"
        :hint="hint"
        :persistent-hint="persistent">
      </v-select>
  </div>
</template>

<script>
export default {
  name: 'TimePickerCustom',
  props: {
    label: {
      type: String,
      required: false,
    },
    rules: {
      type: Array,
      required: false,
    },
    hint: {
      type: String,
      required: false,
    },
    persistent: {
      type: Boolean,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      tiempo: this.value,
    };
  },
  methods: {
  },
  computed: {
    getTiempos() {
      const tiempos = [];
      for (let i = 0; i <= 23; i += 1) {
        tiempos.push(`${i.toString().padStart(2, '0')}:00`);
        tiempos.push(`${i.toString().padStart(2, '0')}:30`);
      }

      return tiempos;
    },
  },
  watch: {
    tiempo() {
      return this.$emit('input', this.tiempo);
    },
    value(nuevoValor) {
      this.tiempo = nuevoValor;
    },
  },
};
</script>
s
<style lang="scss">
</style>
