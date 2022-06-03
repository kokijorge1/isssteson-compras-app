<template>
  <div id="page">
    <page-head-global
        :menu="menu">
    </page-head-global>
  </div>
</template>

<script>
import PageHeadGlobal from '@/components/PageHeadGlobal.vue';

export default {
  name: 'PageHeaderAdquisicion',
  components: {
    PageHeadGlobal,
  },
  data() {
    return {
      menu: [
        {
          texto: 'Detalles',
          route: 'adquisicionesEditar',
          icon: 'find_in_page',
        },
        {
          texto: 'Proveedore(s)',
          route: 'adquisicionesProveedores',
          icon: 'group',
        },
        {
          texto: 'Posturas Iniciales',
          route: 'adquisicionesProveedoresPosturasIniciales',
          icon: 'flag',
        },
        {
          texto: 'Monitor',
          route: 'adquisicionesMonitor',
          icon: 'bar_chart',
        },
        {
          texto: 'Evaluación',
          route: 'adquisicionesEvaluacion',
          icon: 'edit_attributes',
        },
        {
          texto: 'Propuestas',
          route: 'adquisicionesPropuestaProveedor',
          icon: 'format_list_numbered',
        },
        {
          texto: 'Expediente',
          route: 'adquisicionExpediente',
          icon: 'folder',
        },
        {
          texto: 'Cotizaciones',
          route: 'adquisicionesCotizaciones',
          icon: 'attach_file',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
</style>
