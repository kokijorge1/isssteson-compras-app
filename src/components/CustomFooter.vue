<template>
  <v-footer height="auto">
    <v-layout
      align-center
      justify-space-around
      row
      fill-height
      wrap
      px-5
      py-4
      class="white">
      <!-- <v-flex xs12 mb-4><v-divider class="mx-5" /></v-flex> -->
      <v-flex xs4 md2 >
        <!-- <v-img src="/img/logo-sonora.png"></v-img> -->
      </v-flex>
      <v-flex xs4 md2 >
        <v-card flat>
          <v-card-title
            class="colorTextDark--text font-weight-black subheading pa-0">
            Contacto
          </v-card-title>
          <v-card-text class="pa-0 mt-2">
            <div class="colorText--text">
              <span>
                <a href="mailto:contacto@ecompra.mx">contacto@ecompra.mx</a>
              </span><br>
              <span>
                <a href="mailto:soporte@ecompra.mx">soporte@ecompra.mx</a>
              </span><br>
              <span>
                <a
                  target="__blank"
                  href="http://transparencia.esonora.gob.mx/Sonora/Transparencia/Poder+Ejecutivo/Entidades/Servicios+de+Salud+de+Sonora/Avisos+de+Privacidad/Avisos+de+Privacidad+Integrales/SSS.htm">
                  Aviso de privacidad
                </a>
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs4 md2 >
        <v-card flat>
          <v-card-title
            class="colorTextDark--text font-weight-black subheading pa-0">
            Páginas de interés
          </v-card-title>
          <v-card-text class="pa-0 mt-2">
            <div class="colorText--text">
              <span>
                <a @click.prevent="goToName('registrarse')">Registrarse</a>
              </span><br>
              <span>
                <a @click.prevent="goToName('login')">Iniciar sesión</a>
              </span><br>
              <span>
                <a @click.prevent="abrirManual">Manual de usuario</a>
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  name: 'CustomFooter',
  data: () => ({
  }),
  methods: {
    goToName(ruta) {
      if (this.$route.name === ruta) return;
      this.$router.push({ name: ruta });
    },
    abrirManual() {
      const ruta = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';
      window.open(`${ruta}/manual_proveedores.pdf`, '_blank');
    },
  },
};
</script>

<style lang="scss">

</style>
