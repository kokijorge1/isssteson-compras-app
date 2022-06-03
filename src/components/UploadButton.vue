<template>
  <div>
    <input
      type="file"
      id="anexo"
      v-on:change="fileSelected"
      ref="file"
      :accept="accept"
      v-show="false">
      <v-tooltip left>
        <v-btn
          slot="activator"
          icon
          small
          color="blue-grey"
          class="white--text"
          @click="$refs.file.click()">
          <v-icon small>cloud_upload</v-icon>
        </v-btn>
        <span>
          {{ title }}
        </span>
      </v-tooltip>
    <!-- <label class="file-label">
      <input
        type="file"
        id="anexo"
        class="file-input"
        v-on:change="fileSelected"
        ref="file"
        :accept="accept">
      <span class="file-cta">
        <span class="file-icon">
          <v-icon dark>cloud_upload</v-icon>
        </span>
        <span>{{ title }}</span>
      </span>
      <span class="file-name">{{ fileName }}</span>
    </label> -->
  </div>
</template>

<script>
export default {
  name: 'uploadButton',
  props: {
    selectedCallback: Function,
    title: String,
    accept: String,
  },
  data() {
    return {
      fileName: null,
    };
  },
  methods: {
    fileSelected(e) {
      if (e.target.files[0]) {
        this.$emit('change', e.target.files[0].name);
        this.fileName = e.target.files[0].name;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.file {
  align-items: stretch;
  display: flex;
  justify-content: flex-start;
  position: relative;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  align-items: stretch;
  margin-bottom: 1em;
}
.file-label {
  align-items: stretch;
  display: flex;
  cursor: pointer;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
}
.file-cta {
  background-color: #f5f5f5;
  color: #4a4a4a;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
.file-cta, .file-name {
  border-color: #dbdbdb;
  border-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-size: 1em;
  padding-left: 1em;
  padding-right: 1em;
  white-space: nowrap;
}
.file-cta .file-icon {
  justify-content: flex-start;
  padding-right: 5px;
}
.file-cta .file-label {
  justify-content: flex-start;
  overflow: hidden;
}
.file .file-name {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
.file-name {
  position: relative;
  border-color: #dbdbdb;
  border-style: solid;
  border-width: 1px 1px 1px 0;
  display: block;
  max-width: 16em;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
}
.file-input {
  display: none;
}
</style>
