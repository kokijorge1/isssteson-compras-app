<template>
  <div id="contenedor-file-input" @click="$refs.file.click()">
    <v-layout justify-center>
      <fieldset>
        <legend>
          <b>{{ label }}</b>
        </legend>
        <v-chip label color="transparent">
          <v-icon v-if="!seleccionado" class="primary--text">attach_file</v-icon>
          <v-icon v-else class="success--text">verified</v-icon>
          <b class="primary--text">Adjuntar el archivo</b>
        </v-chip>
      </fieldset>
    </v-layout>
    <v-layout mt-1>
      <small class="primary--text text-truncate">{{ nombreArchivo }}</small>
    </v-layout>
    <input
      type="file"
      :id="id"
      :accept="accept"
      ref="file"
      v-show="false"
      v-on:change="fileSelected"
    />
  </div>
</template>

<script>
export default {
  name: 'fileInput',
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    accept: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      nombreArchivo: '',
      seleccionado: false,
    };
  },
  methods: {
    fileSelected(e) {
      if (e.target.files[0]) {
        this.seleccionado = true;
        this.$emit('change', e.target.files[0].name);
        this.nombreArchivo = `${e.target.files[0].name}(${this.$humanFileSize(
          e.target.files[0].size,
        )})`;
      }
    },
  },
};
</script>

<style lang="scss">
#contenedor-file-input {
  position: relative;
  cursor: pointer;
}
fieldset {
  border-collapse: collapse;
  border-color: #972455;
  border-style: solid;
  border-width: 2px;
  border-radius: 4px;
  transition-duration: 0.3s;
  transition-property: color, 1px;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  padding-bottom: 3px;

  legend {
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    margin-left: 10px;
    padding: 0 5px;
  }
  &:hover {
    border-color: #C46142;
  }

  &:active {
    border-width: 3px;
    border-color: red;
  }
}
</style>
