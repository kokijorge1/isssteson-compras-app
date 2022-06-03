<template>
  <v-btn
    v-bind="$attrs"
    v-on="$listeners"
    :icon="$attrs.onlyIcon"
    :outline="opciones[tipo].outline && !$attrs.onlyIcon"
    :color="opciones[tipo].color"
    :small="opciones[tipo].small"
    :large="opciones[tipo].large"
    class="rounded-lg elevation-0">
    <v-icon
      v-if="$attrs.iconText">
      {{ $attrs.iconText }}
    </v-icon>
    <span class="mx-2" v-if="$attrs.label">{{ $attrs.label }}</span>
  </v-btn>
</template>

<script>
export default {
  name: 'CustomButton',
  inheritAttrs: false,
  props: {
    tipo: String,
  },
  data() {
    return {
      opciones: {
        formAceptar: {
          color: 'primary',
          outline: false,
          small: false,
        },
        formCancelar: {
          color: 'primary',
          outline: true,
          small: false,
        },
        agregar: {
          color: 'primary',
          outline: true,
          large: true,
        },
      },
    };
  },
  methods: {},
};
</script>

<style lang="scss">
</style>
