<template>
    <div id="contenedor-adjudicar-partida">
        <v-card
            v-if="articulo.articulo">
            <v-toolbar color="primary" dark class="headline">
                <v-toolbar-title>
                    Adj. Artículo
                    - {{ articulo.articulo.nombre }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    @click="cerrar">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-layout
              class="px-3 my-3">
              <v-flex>
                <span
                  class="title font-weight-thin">
                  Cantidad a Adjudicar
                </span>
                <div>
                  {{ articulo.cantidad }}
              </div>
              </v-flex>
              <v-flex>
                <span
                  class="title font-weight-thin">
                  Disponible
                </span>
                <div>
                  {{ cantidadDisponible() }}
              </div>
              </v-flex>
            </v-layout>
            <v-card-text
              class="altura-contenido">
                <template
                    v-for="(cotizacion, index) in listadoCotizaciones">
                    <v-divider
                        :key="`__div-${index}`"
                        v-if="index > 0"
                        class="my-1">
                    </v-divider>
                    <div
                        :key="`__cotizacion-${index}`">
                        <v-layout
                          row
                          wrap
                          justify-space-between
                          class="px-2 py-2"
                            :class="
                              mostrarInformacionProveedor(cotizacion.id_proveedor)
                              ? 'light-green lighten-4'
                              : 'yellow lighten-4'">
                          <v-flex
                            xs12
                            md7>
                            <v-chip
                              small
                              outline>
                              {{ (index + 1) }}
                            </v-chip>
                            {{ cotizacion.proveedor.nombre }}
                          </v-flex>
                          <v-divider vertical></v-divider>
                          <v-flex
                            xs12
                            md4>
                            <v-layout
                              row
                              wrap
                              justify-end>
                              <v-flex
                                xs6
                                md12
                                class="text-xs-right title mb-2"
                                order-xs2
                                order-md1>
                                <v-tooltip left>
                                  <template
                                    v-slot:activator="{ on }">
                                    <v-icon
                                      v-on="on"
                                      v-if="articulo.precioMenor === cotizacion.precio_unitario">
                                      arrow_downward
                                    </v-icon>
                                  </template>
                                  <span>
                                    Mejor propuesta
                                  </span>
                                </v-tooltip>
                                <template
                                  v-if="!cotizacion.adjudicada">
                                  {{ cotizacion.precio_unitario | currency }}
                                </template>
                                <template
                                  v-else>
                                  {{ cotizacion.datosAdjudicados.precio_unitario | currency }}
                                </template>
                              </v-flex>
                              <v-flex
                                xs6
                                md12
                                order-xs1
                                order-md2
                                v-if="cantidadDisponible() > 0 || cotizacion.adjudicada">
                                <div
                                  class="text-xs-right">
                                  <template
                                    v-if="cotizacion.adjudicada">
                                    Adjudicada
                                  </template>
                                  <template
                                    v-else>
                                    Adjudicar
                                  </template>
                                </div>
                                <v-switch
                                  :value="mostrarInformacionProveedor(cotizacion.id_proveedor)"
                                  color="primary"
                                  @change="
                                  toggleMostrarProveedor($event, cotizacion)"
                                  hide-details
                                  class="ma-0 switch-end">
                                </v-switch>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                        <v-expand-transition>
                            <div
                                class="mb-2"
                                v-show="mostrarInformacionProveedor(cotizacion.id_proveedor)">
                                <adjudicar-propuesta
                                    :propuesta="cotizacionFormateada(cotizacion)"
                                    v-if="mostrarInformacionProveedor(cotizacion.id_proveedor)">
                                </adjudicar-propuesta>
                            </div>
                        </v-expand-transition>
                    </div>
                </template>
            </v-card-text>
            <v-card-actions>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';
import CargandoComponente from '@/components/CargandoComponente.vue';
import ErrorComponente from '@/components/ErrorComponente.vue';

const AdjudicarPropuesta = () => ({
  component: import('./AdjudicarPropuesta'),
  loading: CargandoComponente,
  error: ErrorComponente,
  delay: 100,
  timeout: 3000,
});

export default {
  name: 'adjudicarPartida',
  components: {
    // MostrarMasTexto,
    AdjudicarPropuesta,
  },
  props: {
    articulo: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    valido: false,
    enviando: false,
    esteProveedor: null,
    mostrarDatosProveedores: [],
    reglas: {
      requerido: v => !!v || 'Campo Requerido.',
    },
  }),
  mounted() {
    this.cargarProveedoresAdjudicados();
  },
  methods: {
    ...mapActions('adquisiciones', ['adjudicarArticulo']),
    desAdjudicarPartida(cotizacion) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.adjudicarArticulo(cotizacion)
        .then((res) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          this.$socket.emit('adjudicarArticulo', res);
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
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
    mostrarInformacionProveedor(id) {
      return this.mostrarDatosProveedores.includes(id);
    },
    cotizacionFormateada(propuesta) {
      const nuevaPropuesta = propuesta;
      const cantidadAdjudicada = this.cantidadAdjudicadaPorCotizaciones(this.articulo.cotizaciones);
      nuevaPropuesta.cantidadAdjudicada = cantidadAdjudicada;
      nuevaPropuesta.cantidad = this.articulo.cantidad;
      nuevaPropuesta.cantidadDisponible = (this.articulo.cantidad - cantidadAdjudicada);

      return nuevaPropuesta;
    },
    cantidadAdjudicadaPorCotizaciones(cotizaciones) {
      let total = 0;
      const soloAdjudicadas = cotizaciones.filter(cotizacion => cotizacion.adjudicada === true
      && cotizacion.datosAdjudicados !== null);
      if (soloAdjudicadas.length <= 0) return total;
      soloAdjudicadas.forEach((cotizacion) => {
        total += Number(cotizacion.datosAdjudicados.cantidad);
      });

      return total;
    },
    cantidadDisponible() {
      return (
        this.articulo.cantidad
        - this.cantidadAdjudicadaPorCotizaciones(this.articulo.cotizaciones));
    },
    toggleMostrarProveedor(evt, cotizacion) {
      if (evt) {
        this.mostrarDatosProveedores.push(cotizacion.proveedor.id);
        return;
      } if (!evt && cotizacion.adjudicada) {
        const propuesta = {
          id: cotizacion.id,
          id_adquisicion_articulo: cotizacion.id_adquisicion_articulo,
          adjudicada: false,
        };
        this.desAdjudicarPartida(propuesta);
      }


      const index = this.mostrarDatosProveedores.findIndex(item => item
        === cotizacion.proveedor.id);
      this.mostrarDatosProveedores.splice(index, 1);
    },
    cargarProveedoresAdjudicados() {
      const idProveedoresAdjudicados = this.articulo.cotizaciones
        .filter(cotizacion => cotizacion.adjudicada === true)
        .map(cotizacion => cotizacion.proveedor.id)
        .flat();
      this.mostrarDatosProveedores = idProveedoresAdjudicados;
    },
    cerrar() {
      this.$emit('cerrar');
    },
  },
  computed: {
    listadoCotizaciones() {
      if (!this.articulo.cotizaciones) return [];
      return this.articulo.cotizaciones
        .filter(cotizacion => cotizacion.precio_unitario > 0
            && cotizacion.declina_participar === false)
        .slice()
        .sort((a, b) => a.precio_unitario > b.precio_unitario);
    },
  },
  watch: {
    articulo: {
      handler() {
        this.cargarProveedoresAdjudicados();
      },
    },
  },
};
</script>

<style lang="scss">
.altura-contenido {
  height: 70vh;
  overflow: auto;
}
.switch-end {
  display: flex;
  justify-content: flex-end;
}
</style>
