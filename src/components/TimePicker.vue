<template>
  <div id="contenedor-time-picker">
    <v-menu
      ref="menu"
      :close-on-content-click="false"
      v-model="menu"
      :nudge-right="40"
      :return-value.sync="time"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      max-width="290px"
      min-width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="time"
        :label="label"
        :rules="rules"
        solo
        prepend-inner-icon="access_time"
        :hint="hint"
        :persistent-hint="persistent"
        readonly
      ></v-text-field>
      <v-time-picker
        v-if="menu"
        v-model="time"
        full-width
        @change="$refs.menu.save(time)">
      </v-time-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'TimePicker',
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
      time: this.value,
      menu: false,
    };
  },
  watch: {
    time() {
      return this.$emit('input', this.time);
    },
    value(val) {
      this.time = val;
    },
  },
};
</script>

<style lang="scss">
</style>
