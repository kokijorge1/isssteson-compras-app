<template lang="html">
    <div id="main-header">
        <main-menu
          v-on:mostrarDrawer="haldDrawer"
          :drawer="mostrarDrawer"
          :menu="menu">
        </main-menu>
        <tool-bar
          v-on:mostrarDrawer="haldDrawer"
          :drawer="mostrarDrawer">
        </tool-bar>
    </div>
</template>

<script>
import MainMenu from './Header/MainMenu.vue';
import ToolBar from './Header/ToolBar.vue';

export default {
  name: 'MainHeader',
  components: {
    MainMenu,
    ToolBar,
  },
  props: {
    menu: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      mostrarDrawer: false,
    };
  },
  methods: {
    haldDrawer(data) {
      this.mostrarDrawer = data;
    },
  },
};
</script>
