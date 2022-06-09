<template>
  <div id="contenedor-main-public">
    <v-toolbar color="white" app>
      <v-layout row align-center>
        <v-flex xs3 sm2 md1 mr-2>
          <v-img src="/img/LogoISSSTESON-01.png"></v-img>
        </v-flex>
        <v-flex xs3 sm3 md3 lg3>
          <!-- <span class="font-weight-black title pri--text">eCompras</span> -->
        </v-flex>
      </v-layout>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn :to="{ name: 'portal' }" flat>
        <span class="text-capitalize pri--text">Inicio</span>
      </v-btn>
      <v-btn @click.prevent="abrirManual" flat>
        <span class="text-capitalize pri--text">Manual de usuario</span>
      </v-btn>
      <v-btn :to="{ name: 'registrarse' }" flat>
        <span class="text-capitalize pri--text">Registrarse</span>
      </v-btn>
      <v-btn :to="{ name: 'login' }" flat>
        <v-icon small class="pri--text">
          person_outline
        </v-icon>
        <span class="text-capitalize pri--text">Entrar</span>
      </v-btn>
    </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'PublicHeader',
  data: () => ({
  }),
  methods: {
    abrirManual() {
      const ruta = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';
      window.open(`${ruta}/manual_proveedores.pdf`, '_blank');
    },
  },
};
</script>

<style lang="scss">

</style>
