V<template>
  <div id="contenedor-text-field">
      <v-text-field
        type="number"
        v-model="valor"
        :label="label"
        :hint="label"
        :persistent-hint="persistentHint"
        :prefix="prefijo"
        :readonly="lectura"
        @keypress="soloNumeros"
        @blur="isInputActivo = false"
        @focus="isInputActivo = true"
        :solo="solo"
        class="inputNumber">
      </v-text-field>
  </div>
</template>

<script>
export default {
  name: 'NumericTextField',
  props: {
    label: {
      type: String,
      required: false,
    },
    moneda: {
      type: Boolean,
      required: false,
    },
    porcentaje: {
      type: Boolean,
      required: false,
    },
    decimales: {
      type: Number,
      required: false,
      default: 2,
    },
    lectura: {
      type: Boolean,
      required: false,
    },
    solo: {
      type: Boolean,
      required: false,
    },
    persistentHint: {
      type: Boolean,
      required: false,
    },
    value: {
      required: false,
      default() {
        return this.value || 0;
      },
    },
  },
  data() {
    return {
      isInputActivo: false,
      existeUnDecimal: false,
    };
  },
  methods: {
    soloNumeros(evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode !== 46 && charCode > 31
            && (charCode < 48 || charCode > 57)) { evt.preventDefault(); }

      if (charCode === 46) {
        if (evt.target.value.toString().includes('.')) {
          evt.preventDefault();
        }
      }

      return true;
    },
  },
  computed: {
    valor: {
      get() {
        if (this.isInputActivo) {
          if (this.value) {
            if (this.value.toString().split('.')[1]) {
              if (this.value.toString().split('.')[1].length > this.decimales) {
                return this.value.toFixed(this.decimales);
              }
            }
          }

          return this.value.toString();
        }

        if (this.moneda && this.value !== 0) {
          return this.$options.filters.currency(this.value, '', this.decimales);
        }

        return this.value;
      },
      set(valorModificado) {
        let nuevoValor = valorModificado.replace(/[^0-9.]/g, '');
        if (Number.isNaN(Number(nuevoValor))) {
          nuevoValor = 0;
        }

        this.$emit('input', parseFloat(nuevoValor) || '');
      },
    },
    prefijo() {
      if (this.moneda && !this.porcentaje) {
        return '$';
      }

      if (this.porcentaje && !this.moneda) {
        return '%';
      }

      return '';
    },
  },
};
</script>

<style lang="scss">
.inputNumber input[type='number'] {
    -moz-appearance:textfield;
}
.inputNumber input::-webkit-outer-spin-button,
.inputNumber input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
</style>
