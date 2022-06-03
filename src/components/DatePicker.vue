<template>
  <div id="contenedor-date-picker">
    <v-menu
      ref="menu"
      :close-on-content-click="false"
      v-model="menu"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      max-width="290px"
      min-width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="dateFormatted"
        :label="label"
        :rules="rules"
        clearable
        solo
        :hint="hint"
        :persistent-hint="persistent"
        prepend-inner-icon="event"
        @blur="date = parseDate(dateFormatted)"
      ></v-text-field>
      <v-date-picker
        v-model="date"
        locale="es"
        no-title
        @input="menu = false">
        </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'DatePickerCustom',
  props: {
    label: {
      type: String,
      required: false,
    },
    actual: {
      type: Boolean,
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
    rules: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      date: '',
      dateFormatted: null,
      menu: false,
    };
  },
  mounted() {
    this.date = this.value;
    if (this.actual) {
      this.date = new Date().toISOString().substr(0, 10);
      this.dateFormatted = this.formatDate(new Date().toISOString().substr(0, 10));
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(val);
      this.$emit('input', val);
    },
    value(val, oldVal) {
      if (val && !oldVal) {
        this.date = val;
      }
    },
  },
};
</script>

<style lang="scss">
</style>
