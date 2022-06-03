<template>
  <div id="contenedor-proveedor-adquisicion">
    <v-layout row class="mb-2" v-if="getAdquisicion">
      <v-flex xs12 pa-0>
        <v-card class="mb-4 elevation-10 mx-2 roundedCustom">
          <v-layout
            align-center
            justify-space-between
            row
            :class="{
            'warning': estatusEvento.tipo === 1,
            'success white--text': estatusEvento.tipo === 2,
            'error white--text': estatusEvento.tipo === 3}">
            <v-flex xs12 md4 pl-2 pb-2>
              <h1>
                {{ getAdquisicion.numero }}
              </h1>
              <span>
                {{ getAdquisicion.nombre }}
              </span>
            </v-flex>
            <v-flex xs12 md4 class="hidden-sm-and-down">
              <v-text-field
                v-model="searchText"
                placeholder="Buscar artículo"
                append-icon="search"
                clearable
                hide-details
                solo
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <count-down
                :inicio="getFechasEvento.inicio"
                :termino="getFechasEvento.termino"
                @change="comprobarEvento"
                @estatus="cambiarEstatus"
                v-if="getFechasEvento.termino"
              ></count-down>
            </v-flex>
          </v-layout>
          <template v-slot:extension v-if="isMobile">
            <v-text-field
              v-model="searchText"
              placeholder="Buscar..."
              append-icon="search"
              clearable
              solo
              class="pt-1 pr-1 hidden-md-and-up d-inline-flex"
            ></v-text-field>
          </template>
        </v-card>
      </v-flex>
    </v-layout>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-layout row justify-center>
          <v-flex xs4 md2>
            <v-checkbox
              v-model="causaIVA"
              label="Causa IVA?">
            </v-checkbox>
          </v-flex>
          <v-flex xs4 md2>
            <v-text-field
              v-model="porIVA"
              label="I.V.A"
              prefix="%"
              outline
              hide-details
              @keypress="soloNumeros"
              :disabled="!eventoLive || !causaIVA"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <div id="contenedor-articulos" class="mt-4">
          <div
            v-for="(data, index) in listadoArticulos"
            :key="index" class="mb-2">
            <v-toolbar flat dense>
              <v-toolbar-title>{{ data.articulo.clave_interna }}</v-toolbar-title>
              <v-divider vertical inset class="mx-3 hidden-md-and-down"></v-divider>
              <div class="text-truncate hidden-md-and-down">{{ data.articulo.nombre }}</div>
            </v-toolbar>
            <v-layout row wrap class="px-1 mt-1">
              <v-flex xs12 md8 class="pr-3">
                <div class="hidden-lg-and-up">
                  {{ data.articulo.nombre }}
                  <v-divider class="py-2"></v-divider>
                </div>
                <v-layout row class="mb-2">
                  <v-flex xs8>
                    Unidad Medida:
                    <strong>{{ data.articulo.unidad }}</strong>
                  </v-flex>
                  <v-flex xs4>
                    Cantidad:
                    <strong>{{ data.cantidad }}</strong>
                  </v-flex>
                </v-layout>
                <v-layout row class="mb-2">
                  <v-flex xs8>
                    Presentación:
                    <strong>{{ data.articulo.presentacion }}</strong>
                  </v-flex>
                  <v-flex xs4>
                    Precio de Referencia:
                    <strong>{{ data.precio_referencia | currency }}</strong>
                  </v-flex>
                </v-layout>
                <v-layout row class="mb-2">
                  <v-flex xs8>
                    <span class="font-weight-medium subheading">Características:</span>
                    <div class="font-weight-thin">{{ data.caracteristicas }}</div>
                  </v-flex>
                  <v-flex xs4>
                    Mejor postura:
                    <v-chip dark :color="colorChip(data)">
                      <strong
                        v-if="data.mejorPropuesta"
                      >{{ data.mejorPropuesta.precio_unitario | currency }}</strong>
                      <strong v-else>ND</strong>
                    </v-chip>
                  </v-flex>
                  <v-divider class="hidden-md-and-up my-3"></v-divider>
                </v-layout>
              </v-flex>
              <v-flex xs12 md4 order-md2 order-lg2 order-sm3 order-xs3 class="pr-0 mt-2">
                <v-layout row wrap align-start justify-center>
                  <v-flex xs12 md6>
                    <v-text-field
                      :value="data.miPropuesta.precio_unitario"
                      label="Precio Unitario (Antes de I.V.A)"
                      prefix="$"
                      outline
                      hide-details
                      @keypress="soloNumeros"
                      @keypress.enter="preEnviar(data)"
                      @keyup.native="actulizarPrecioUnitario($event, data)"
                      :disabled="!eventoLive || Boolean(data.miPropuesta.declina_participar)"
                    ></v-text-field>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex>
                    <undo-button
                      v-if="sePuedeDeshacer(data)"
                      :ultimaPropuesta="data.miPropuesta.updated_at"
                      :fechaTermino="getFechasEvento.termino"
                      @click="preDeshacer(data)"/>
                  </v-flex>
                  <!-- <v-flex xs12 md5 v-if="!Boolean(data.miPropuesta.declina_participar)">
                    <v-btn
                      dark
                      round
                      block
                      color="red lighten-1"
                      @click.prevent="preEnviar(data, true)"
                      :disabled="!eventoLive || Boolean(data.miPropuesta.declina_participar)"
                    >
                      <v-icon small dark>clear</v-icon>Declinar
                    </v-btn>
                  </v-flex> -->
                  <!-- <v-flex xs4 md2 class="pr-1">
                    <v-text-field
                      type="number"
                      :value="data.miPropuesta.por_iva
                        || data.articulo.partida.porcentaje_iva_propuesto"
                      label="I.V.A"
                      prefix="%"
                      outline
                      @keypress="soloNumeros"
                      @blur="comprobarIvaNull($event, data)"
                      @keyup.native="actualizarIva($event, data)"
                      :disabled="!eventoLive || Boolean(data.miPropuesta.declina_participar)"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs8 md3 class="pr-1">
                    <v-text-field
                      :value="data.miPropuesta.iva"
                      label="Importe I.V.A"
                      prefix="$"
                      outline
                      readonly
                      @keypress="soloNumeros"
                      :disabled="!eventoLive || Boolean(data.miPropuesta.declina_participar)"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-text-field
                      :value="data.miPropuesta.total"
                      label="Total"
                      prefix="$"
                      outline
                      readonly
                      @keypress="soloNumeros"
                      :disabled="!eventoLive || Boolean(data.miPropuesta.declina_participar)"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-textarea
                      :value="data.miPropuesta.caracteristicas"
                      label="Comentarios"
                      placeholder="Comentarios del producto..."
                      outline
                      auto-grow
                      rows="2"
                      @keyup.native="actulizarCaracteristicas($event, data)"
                      :disabled="!eventoLive || Boolean(data.miPropuesta.declina_participar)"
                    ></v-textarea>
                  </v-flex> -->
                </v-layout>
                <v-layout align-center justify-space-between row wrap>
                  <v-flex xs12 md6>
                    <v-layout column>
                      <v-flex>
                        <v-btn
                          round
                          color="primary"
                          block
                          @click.prevent="preEnviar(data)"
                          :loading="data.id === enviandoEste"
                          :disabled="!eventoLive || data.miPropuesta.precio_unitario
                            <= 0 || Boolean(data.miPropuesta.declina_participar)">
                          <v-icon left dark>done</v-icon>Enviar
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-divider
                    vertical
                    class="hidden-xs-only mx-3"
                    v-if="data.miPropuesta.updated_at"
                  ></v-divider>
                  <v-flex
                    xs12
                    md5
                    class="p-xs-l-15 text-md-left"
                    v-if="data.miPropuesta.updated_at"
                  >
                    <span class="grey--text text--darken-1">
                      <v-icon small>
                        {{ Boolean(data.miPropuesta.declina_participar) ?
                        'clear' : 'access_time' }}
                      </v-icon>
                      {{ Boolean(data.miPropuesta.declina_participar)
                      ? 'Artículo declinado' : 'Última propuesta' }}
                    </span>
                    <fecha-humano
                      :fecha="data.miPropuesta.updated_at" class="font-weight-medium">
                      </fecha-humano>
                  </v-flex>
                  <!-- <v-spacer></v-spacer>
                  <v-flex xs12 md2 v-if="!Boolean(data.miPropuesta.declina_participar)">
                    <v-btn
                      dark
                      round
                      block
                      color="red lighten-1"
                      @click.prevent="preEnviar(data, true)"
                      :disabled="!eventoLive || Boolean(data.miPropuesta.declina_participar)"
                    >
                      <v-icon small dark>clear</v-icon>Declinar
                    </v-btn>
                  </v-flex> -->
                </v-layout>
              </v-flex>
            </v-layout>
          </div>
        </div>
        <div v-if="listadoArticulos.length <= 0">
          <v-alert :value="true" type="warning">
            No se encontraron articulos en los que se encuentre participando.
          </v-alert>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogAnexarCotizacion" max-width="400px">
      <anexar-cotizacion v-on:cerrar="cerrarDialog"></anexar-cotizacion>
    </v-dialog>
    <v-dialog v-model="dialogDocumentosAnexos" max-width="400px">
      <documentos-anexos v-on:cerrar="cerrarDialog"></documentos-anexos>
    </v-dialog>
    <v-dialog v-model="mostrarConfirmacion" persistent max-width="400">
      <v-card v-if="mostrarConfirmacion" class="roundedCustom">
        <v-card-title class="headline primary white--text">
          Confirmación
        </v-card-title>
        <v-card-text class="text-center" v-if="!preEnviarDatos.declinar">
          <span>
            ¿Seguro que desea enviar el precio
            <b>${{ preEnviarDatos.data.miPropuesta.precio_unitario }}</b>?
          </span>
        </v-card-text>
        <v-card-text v-else>
          ¿Seguro que desea declinar este artículo?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            class="roundedCustom"
            color="success"
            @click="enviar">
            <v-icon dark left>done</v-icon>
            Confirmar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="roundedCustom"
            color="error"
            @click="mostrarConfirmacion = !mostrarConfirmacion">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="mostrarConfirmacionDeshacer" persistent max-width="600">
      <v-card class="roundedCustom">
        <v-card-title class="headline primary white--text">
          Confirmación
        </v-card-title>
        <v-card-text class="text-center">
          <span>
            Sólo se permite deshacer una sola vez por artículo, desea realizar
            dicha acción ahora?
          </span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            class="roundedCustom"
            color="success"
            @click="deshacerUltimaPropuesta">
            <v-icon dark left>done</v-icon>
            Deshacer postura
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="roundedCustom"
            color="error"
            @click="mostrarConfirmacionDeshacer = !mostrarConfirmacionDeshacer">
            Cancelar acción
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FileDownloader from 'js-file-download';
// import PageTitle from '@/components/PageTitle.vue';
import Mensajes from '@/helpers/mensajes';
import FechaHumano from '@/components/FechaHumano.vue';
import CountDown from '@/components/CountDown.vue';
import AnexarCotizacion from './AnexarCotizacion.vue';
import DocumentosAnexos from './DocumentosAnexos.vue';
import UndoButton from '@/components/UndoButton.vue';

export default {
  name: 'ProveedorAdquisicion',
  components: {
    // PageTitle,
    FechaHumano,
    CountDown,
    AnexarCotizacion,
    DocumentosAnexos,
    UndoButton,
  },
  data() {
    return {
      mostrarConfirmacion: false,
      mostrarConfirmacionDeshacer: false,
      bajando: false,
      isMobile: false,
      dialogAnexarCotizacion: false,
      dialogDocumentosAnexos: false,
      pagination: {
        sortBy: 'numero',
        rowsPerPage: -1,
      },
      causaIVA: false,
      porIVA: 0,
      headers: [
        { text: 'Número', sortable: false, value: 'numero' },
        { text: 'Nombre', sortable: false, value: '' },
        { text: 'Características', sortable: false, value: '' },
        { text: 'Unidad', sortable: false, value: '' },
        { text: 'Cantidad', sortable: false, value: 'cantidad' },
        {
          text: 'Tu Oferta',
          sortable: false,
          value: '',
          width: '200',
        },
        {
          text: 'Importe',
          sortable: false,
          align: 'right',
          value: '',
        },
        {
          text: 'Mejor Oferta',
          sortable: false,
          align: 'right',
          value: '',
        },
        {
          text: 'Fecha Reg.',
          align: 'center',
          sortable: false,
          value: '',
        },
      ],
      searchText: '',
      estatus: ['Todos', 'Con Mejor Propuesta', 'Sin Mejor Propuesta'],
      enviandoEste: 0,
      // fechasEvento: {
      //   inicio: null,
      //   termino: null,
      // },
      eventoLive: false,
      estatusEvento: {
        tipo: 1,
        texto: null,
      },
      preEnviarDatos: {
        data: null,
        declinar: null,
      },
    };
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true });
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
    // if (this.getAdquisicion) {
    //   this.fechasEvento.inicio = this.getAdquisicion.fecha_inicio;
    //   this.fechasEvento.termino = this.getAdquisicion.fecha_termino;
    // }
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 960;
    },
    ...mapActions('proveedores', ['enviarCotizacion', 'deshacerCotizacion']),
    sePuedeDeshacer({ miPropuesta, mejorPropuesta }) {
      const { precio_unitario: miPrecioUnitario, tipo } = miPropuesta;
      const { precio_unitario: mejorOferta } = mejorPropuesta;
      // cotizaciones tipo 2 no se pueden deshacer (postura inicial o ya deshecha)
      return tipo !== 2 && miPrecioUnitario <= mejorOferta;
    },
    colorChip({ mejorPropuesta }) {
      if (!mejorPropuesta) return '';
      const { id_proveedor: idProveedor } = mejorPropuesta;
      if (idProveedor === this.$auth.user().proveedor.id) return 'light-green';
      return 'orange';
    },
    descargarReporte() {
      const idAdquisicion = Number(this.$route.params.id);
      this.bajando = true;
      this.axios
        .get(`/proveedor/adquisiciones/reporte/${idAdquisicion}`, {
          responseType: 'blob',
          timeout: 30000,
        })
        .then((res) => {
          this.bajando = false;
          FileDownloader(
            res.data,
            `cotizacion-${this.getAdquisicion.numero}.xlsx`,
          );
        })
        .catch((err) => {
          this.bajando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    preDeshacer(data) {
      this.preEnviarDatos = { data };
      this.mostrarConfirmacionDeshacer = true;
    },
    async deshacerUltimaPropuesta() {
      this.mostrarConfirmacionDeshacer = false;
      const { data } = this.preEnviarDatos;
      if (this.enviandoEste === data.id) return;
      this.enviandoEste = data.id;
      const datos = {
        id_adquisicion: Number(this.$route.params.id),
        cotizacion: {
          id_adquisicion_articulo: data.id,
        },
      };
      await this.deshacerCotizacion(datos)
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
      this.limpiarEnviarDatos();
    },
    preEnviar(data, declinar) {
      this.preEnviarDatos = { data, declinar };
      this.mostrarConfirmacion = true;
    },
    async enviar() {
      const { data, declinar } = this.preEnviarDatos;
      this.mostrarConfirmacion = false;
      /**
       * !TODO
       * revisar para cuando se haga la subasta
       */
      const {
        id,
        cantidad,
        miPropuesta: {
          precio_unitario: precioUnitario,
          // por_iva: porIva,
          // iva,
          ultimaPropuesta,
          caracteristicas,
          total,
        },
        mejorPropuesta: {
          precio_unitario: mejorOferta,
        },
      } = data;
      if (precioUnitario >= ultimaPropuesta) {
        this.mostrarError(`Tu postura debe ser menor a la postura anteriror($${ultimaPropuesta})`);
        return;
      }
      if (precioUnitario >= mejorOferta) {
        this.mostrarError(`Tu postura debe ser menor a la mejor oferta($${mejorOferta})`);
        return;
      }

      this.enviandoEste = id;
      const porIVA = this.causaIVA ? parseFloat(this.porIVA) : 0;
      // const cotizacion = {
      //   precio_unitario: precioUnitario,
      //   // iva: this._.round(precioUnitario * (porIVA / 100), 2),
      //   // porcentajeIvaPropuesto,
      // };
      const iva = this._.round(precioUnitario * (porIVA / 100), 2);
      const datos = {
        id_adquisicion: Number(this.$route.params.id),
        cotizacion: {
          id_adquisicion_articulo: id,
          precio_unitario: parseFloat(precioUnitario),
          por_iva: porIVA,
          iva: parseFloat(iva),
          importe: (cantidad || 0) * (precioUnitario || 0),
          iva_importe: (cantidad || 0) * (iva || 0),
          caracteristicas,
          total: parseFloat(total),
          gran_total: (cantidad || 0) * (precioUnitario || 0) + (cantidad || 0) * (iva || 0),
          declina_participar: declinar || false,
          tipo: 3,
        },
      };
      await this.enviarCotizacion(datos)
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
      this.limpiarEnviarDatos();
    },
    limpiarEnviarDatos() {
      this.enviandoEste = 0;
      this.preEnviarDatos = {
        data: null,
        declinar: null,
      };
    },
    mostrarError(problema) {
      const respuesta = new Mensajes(problema).warning;
      this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
      this.limpiarEnviarDatos();
    },
    actulizarPrecioUnitario(event, articulo) {
      if (!event.target.value) return;
      // const porcentajeIvaPropuesto = articulo.miPropuesta.por_iva
      //   || articulo.articulo.partida.porcentaje_iva_propuesto;
      const porcentajeIvaPropuesto = this.porIVA;
      const precioUnitario = parseFloat(event.target.value);
      const cotizacion = {
        id_adquisicion: Number(this.$route.params.id),
        precio_unitario: precioUnitario,
        iva: this._.round(precioUnitario * (porcentajeIvaPropuesto / 100), 2),
        porcentajeIvaPropuesto,
        articulo,
      };

      this.$store.commit('proveedores/ACTULIZAR_PRECIO_UNITARIO', { cotizacion });
      this.$store.commit('proveedores/ACTUALIZAR_IVA', { cotizacion });
    },
    actualizarIva(event, articulo) {
      if (!event.target.value) return;
      const porcentajeIvaPropuesto = Number(event.target.value);

      const cotizacion = {
        id_adquisicion: Number(this.$route.params.id),
        iva: this._.round(
          articulo.miPropuesta.precio_unitario * (porcentajeIvaPropuesto / 100),
          2,
        ),
        porcentajeIvaPropuesto,
        articulo,
      };
      this.$store.commit('proveedores/ACTUALIZAR_IVA', { cotizacion });
    },
    comprobarIvaNull(event, articulo) {
      const porcentajeIvaPropuesto = Number(event.target.value || 0);

      const cotizacion = {
        id_adquisicion: Number(this.$route.params.id),
        iva: this._.round(
          articulo.miPropuesta.precio_unitario * (porcentajeIvaPropuesto / 100),
          2,
        ),
        porcentajeIvaPropuesto,
        articulo,
      };
      this.$store.commit('proveedores/ACTUALIZAR_IVA', { cotizacion });
    },
    actulizarCaracteristicas(event, articulo) {
      const cotizacion = {
        id_adquisicion: Number(this.$route.params.id),
        caracteristicas: event.target.value,
        articulo,
      };
      this.$store.commit('proveedores/ACTUALIZAR_CARACTERISTICAS', {
        cotizacion,
      });
    },
    comprobarEnviarPropuesta(nuevoPrecio, ultimoPrecio) {
      if (nuevoPrecio >= ultimoPrecio) {
        const respuesta = new Mensajes(
          'La propuesta debe de ser menor a la ultima y mayor a 0',
        ).warning;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
          respuesta,
        });
        return false;
      }
      return true;
    },
    soloNumeros(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode !== 46
        && charCode > 31
        && (charCode < 48 || charCode > 57)
      ) {
        evt.preventDefault();
      }

      if (charCode === 46) {
        if (evt.target.value.toString().includes('.')) {
          evt.preventDefault();
        }
      }

      return true;
    },
    comprobarEvento(valor) {
      this.eventoLive = valor;
    },
    cambiarEstatus(estatus) {
      this.estatusEvento = estatus;
    },
    cerrarDialog() {
      this.dialogAnexarCotizacion = false;
      this.dialogDocumentosAnexos = false;
    },
  },
  computed: {
    ...mapGetters({
      adquisicion: 'proveedores/adquisicion',
      articulos: 'proveedores/articulos',
    }),
    getAdquisicion() {
      return this.adquisicion(Number(this.$route.params.id));
    },
    getFechasEvento() {
      if (this.getAdquisicion === {}) {
        return {
          inicio: null,
          termino: null,
        };
      }
      return {
        inicio: this.getAdquisicion.fecha_inicio,
        termino: this.getAdquisicion.fecha_termino,
      };
    },
    getTitulo() {
      if (!this.getAdquisicion) return '';
      return this.getAdquisicion.numero;
    },
    getSubTitulo() {
      if (!this.getAdquisicion) return '';
      return this.getAdquisicion.nombre;
    },
    listadoArticulos() {
      if (!this.getAdquisicion) return [];
      return this.articulos(Number(this.$route.params.id))
        .filter((item) => {
          if (!item.miPropuesta.precio_unitario) return false;
          if (!this.searchText) return item;
          const expt = new RegExp(this.searchText, 'gi');
          return (
            expt.test(item.articulo.clave_interna || '')
          || expt.test(item.articulo.nombre)
          || expt.test(item.caracteristicas)
          || expt.test(item.articulo.presentacion)
          );
        });
    },
    getAnexocotizacion() {
      if (!this.getAdquisicion) return '';
      return this.getAdquisicion.anexoCotizacion;
    },
    getAnexos() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.anexos;
    },
    cotizacionAnexada() {
      if (!this.getAdquisicion) return false;
      if (!this.getAdquisicion.anexoCotizacion.file_original_name) return false;
      return true;
    },
  },
  watch: {
    // getAdquisicion: {
    //   handler(adquisicion) {
    //     if (adquisicion) {
    //       this.fechasEvento.inicio = adquisicion.fecha_inicio;
    //       this.fechasEvento.termino = adquisicion.fecha_termino;
    //     }
    //   },
    // },
  },
};
</script>

<style lang="scss">
.altura-minima-card-text-paso-uno,
.altura-minima-card-text {
  overflow: hidden;
}
.altura-minima-card-text-paso-uno {
  height: 114px;
}
.altura-minima-card-text {
  height: 70px;
}
.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 10px;
}
</style>
