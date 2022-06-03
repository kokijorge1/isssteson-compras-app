<template>
  <div>
    <v-breadcrumbs
      :items="rutas"
      class="pa-0"
      divider="/">
      <template
        slot="item"
        slot-scope="props">
        <router-link
          :to="link(props.item)">
          {{ tituloRuta(props.item) }}
        </router-link>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  data() {
    return {};
  },
  methods: {
    nombreruta(item) {
      if (item.meta.namePathInicial) {
        return item.meta.namePathInicial;
      }

      return item.name;
    },
    link(item) {
      return {
        name: this.nombreruta(item),
        params: {
          id: this.$route.params.id,
          identificador: this.$route.params.identificador || 'id',
        },
      };
    },
    tituloRuta(ruta) {
      if (ruta.meta.useParamAsBreadTitle) {
        return this.$route.params.identificador;
      }

      return ruta.meta.breadTitle;
    },
  },
  computed: {
    rutas() {
      return this.$route.matched.filter(ruta => this.$hasProp(ruta.meta, 'breadTitle'));
    },
  },
};
</script>

<style lang="scss">
span {
  display: inline;
}
.v-breadcrumbs{
  a {
      font-size: 14px;
      text-decoration: none;
    }
}
</style>
