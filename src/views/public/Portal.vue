<template>
  <div id="contenedor-portal-publico">
    <v-layout
      align-start
      justify-space-around
      row
      fill-height
      wrap
      px-5
      py-4
      class="white">
      <!-- <v-flex xs12 md3>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card flat color="bkground2">
              <v-card-title class="secondary--text title font-weight-bold pb-0">
                Proveedores
              </v-card-title>
              <v-card-text>
                <div class="subheading mb-1 colorText--text">
                  Eres proveedor y quieres participar?
                </div>
                <span class="colorText--text">
                  Requisitos:
                  <ul>
                    <li>Acta Constitutiva</li>
                    <li>Poder del Representante Legal</li>
                    <li>Identificación Oficial</li>
                    <li>Constancia de Situación Fiscal</li>
                    <li>Opinión positiva (32-D)</li>
                    <li>Comprobante Domicilio</li>
                    <li>Declaratoria de No conflicto de interés (Art. 50 y 60)</li>
                    <li>Declarativa de No inhabilitación</li>
                  </ul>
                </span>
              </v-card-text>
              <v-card-actions class="white">
                <v-layout row justify-center>
                  <v-btn
                    :to="{ name: 'registrarse' }"
                    color="primary"
                    dark
                    class="mt-3"
                    small>
                    <span class="text-capitalize mx-3">Registrarse</span>
                  </v-btn>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex> -->
      <v-flex xs12 md8>
        <!-- <v-img src="/img/medicinas-img.png"></v-img> -->
        <v-img src="/img/ecompras-1.png"></v-img>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center class="py-5 bkground2">
      <!-- Avance -->
      <v-flex xs12 md2 align-self-center>
        <v-card class="altura-minima-contenedor" flat>
          <v-card-title class="pt-2 pb-4">
            <v-layout row wrap>
              <v-flex xs9>
                <span class="colorText--text font-weight-bold subheading">
                  Avance
                </span>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs2>
                <span class="colorText--text font-weight-bold subheading">
                  <v-icon class="secondary--text">show_chart</v-icon>
                </span>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider class="mx-3" />
          <v-card-text>
            <v-layout row fill-height>
              <v-flex xs12 class="display-2 font-weight-medium primary--text">
                <span>{{ porcentajeAvance }}%</span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <!-- Adquisiciones Efectuadas -->
      <v-flex xs12 md2 align-self-center>
        <v-card class="altura-minima-contenedor" flat>
          <v-card-title class="pt-2 pb-1">
            <v-layout row wrap>
              <v-flex xs9>
                <span class="colorText--text font-weight-bold subheading">
                  Adquisiciones Efectuadas
                </span>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs2>
                <span class="colorText--text font-weight-bold subheading">
                  <i class="material-icons-outlined secondary--text">shopping_cart</i>
                  <!-- <v-icon class="secondary--text">shopping_cart</v-icon> -->
                </span>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider class="mx-3" />
          <v-card-text>
            <v-layout row fill-height>
              <v-flex xs12 class="display-2 font-weight-medium primary--text">
                <span>{{ cantidadArticulosAdjudicados }}</span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <!-- Cotizaciones Recibidas -->
      <v-flex xs12 md2 align-self-center>
        <v-card class="altura-minima-contenedor" flat>
          <v-card-title class="pt-2 pb-1">
            <v-layout row wrap>
              <v-flex xs9>
                <span class="colorText--text font-weight-bold subheading">
                  Cotizaciones Recibidas
                </span>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs2>
                <span class="colorText--text font-weight-bold subheading">
                  <!-- <v-icon class="secondary--text">paid</v-icon> -->
                  <i class="material-icons-outlined secondary--text">paid</i>
                </span>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider class="mx-3" />
          <v-card-text>
            <v-layout row fill-height>
              <v-flex xs12 class="display-2 font-weight-medium primary--text">
                <span>{{ cantidadPropuestasPorArticulo }}</span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <!-- Proveedores participantes -->
      <v-flex xs12 md2 align-self-center>
        <v-card class="altura-minima-contenedor" flat>
          <v-card-title class="pt-2 pb-1">
            <v-layout row wrap>
              <v-flex xs9>
                <span class="colorText--text font-weight-bold subheading">
                  Proveedores participantes
                </span>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs2>
                <span class="colorText--text font-weight-bold subheading">
                  <!-- <v-icon class="secondary--text">paid</v-icon> -->
                  <i class="material-icons-outlined secondary--text">person_outline</i>
                </span>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider class="mx-3" />
          <v-card-text>
            <v-layout row fill-height>
              <v-flex xs12 class="display-2 font-weight-medium primary--text">
                <span>{{ cantidadProveedores }}</span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout
      align-start
      justify-space-around
      row
      fill-height
      wrap
      px-5
      py-4
      class="white">
      <v-flex xs12 md5 >
        <v-img src="/img/ecompras-1.png"></v-img>
      </v-flex>
      <v-flex xs12 md4>
        <v-card flat>
          <v-card-title class="primary">
            <span class="white--text font-weight-bold subheading">Catálogo de Necesidades</span>
            <v-spacer></v-spacer>
            <v-chip small outline class="white--text">
              {{ adquisiciones.length }}
            </v-chip>
          </v-card-title>
          <v-card-text class="altura-listado" style="border: 1px solid #C8C8C8;">
            <v-list two-line class="pr-0 mr-0">
              <div
                v-for="(adquisicion, index) in adquisiciones"
                :key="`div_${adquisicion.id}`">
                <v-divider v-if="index > 0" :key="index"></v-divider>
                <v-list-tile
                  :to="{
                    name: 'portalDetalleAdquisicion',
                    params: { id: adquisicion.key_publico }
                  }"
                  :key="`__${adquisicion.id}`">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ adquisicion.numero }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ adquisicion.nombre }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-list-tile-action-text>
                      <count-down
                        :inicio="adquisicion.fecha_inicio"
                        :termino="adquisicion.fecha_termino">
                      </count-down>
                    </v-list-tile-action-text>
                  </v-list-tile-action>
                </v-list-tile>
              </div>
            </v-list>
            <template v-if="adquisiciones.length <= 0">
              <v-alert :value="true" type="info">
                No se encontraron Necesidades por el momento.
              </v-alert>
            </template>
          </v-card-text>
          <v-card-actions> </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CountDown from '@/components/CountDownText.vue';

export default {
  name: 'portalPublico',
  components: {
    CountDown,
  },
  data: () => ({
    chartData: [['Task', 'Hours per Day']],
    chartOptions: {
      chart: {
        title: 'Company Performance',
        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
    },
  }),
  mounted() {},
  methods: {},
  computed: {
    ...mapGetters({
      adquisiciones: 'portal/adquisiciones',
      proveedores: 'portal/proveedores',
      cantidadProveedores: 'portal/cantidadProveedores',
      cantidadArticulosAdjudicados: 'portal/cantidadArticulosAdjudicados',
      montoArticulosAdjudicados: 'portal/montoArticulosAdjudicados',
      cantidadPropuestasPorArticulo: 'portal/cantidadPropuestasPorArticulo',
      ahorro: 'portal/ahorro',
      datosPie: 'portal/datosPie',
      porcentajeAvance: 'portal/porcentajeAvance',
      nuevoAhorroAhorro: 'portal/nuevoAhorroAhorro',
    }),
    pieData() {
      return [['Avances', 'Avance de la compras'], ...this.datosPie];
    },
  },
};
</script>

<style lang="scss">
.altura-minima-contenedor {
  height: 22vh;
}
.altura-listado {
  max-height: 70vh;
  overflow: auto;
}
svg > g > g:last-child {
  pointer-events: none;
}
ul li::marker {
  font-size: 130%;
  color: #C46142 !important;
}
span a{
  color: #7A7575 !important;
}
</style>
