<template>
  <div id="contenedor-main-adquisicion">
      <router-view name="pageHeader"/>
      <router-view/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'MainAdquisicion',
  data() {
    return {};
  },
  mounted() {
    this.cagarProv();
  },
  methods: {
    ...mapActions('adquisiciones/', ['cargarProveedores']),
    cagarProv() {
      if (!this.getAdquisicion) return;
      const datos = {
        id_adquisicion: Number(this.$route.params.id),
      };
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.cargarProveedores(datos)
        .then(() => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
        })
        .catch((err) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
  },
  computed: {
    ...mapGetters({
      adquisicionId: 'adquisiciones/adquisicion',
    }),
    getAdquisicion() {
      return this.adquisicionId(Number(this.$route.params.id));
    },
  },
  watch: {
    getAdquisicion: {
      handler(nuevo, viejo) {
        if (JSON.stringify(nuevo) === JSON.stringify(viejo)) return;
        this.cagarProv();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
</style>
