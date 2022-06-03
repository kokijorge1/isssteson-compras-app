<template>
    <div id="contenedor-adjudicar-propuesta">
        <v-form
            v-model="valido">
            <v-layout
                row
                wrap
                justify-space-between
                align-center
                class="grey lighten-4 pb-3">
                <v-flex
                    xs3
                    class="pl-2">
                    <v-text-field
                        v-model="cantidadAdjudicar"
                        type="number"
                        label="Cantidad Adj."
                        flat
                        small
                        dense
                        :rules="[reglas.requerido, cantidadMayor]"
                        @keypress="soloNumeros"
                        @keyup.native="hacerCalculos"
                        :disabled="estaAdjudicada"
                        class="my-2">
                    </v-text-field>
                    <v-text-field
                        v-model="precioUnitarioAdjudicar"
                        type="number"
                        label="P. Unitario Adj."
                        flat
                        small
                        dense
                        :rules="[reglas.requerido]"
                        @keypress="soloNumeros"
                        @keyup.native="hacerCalculos"
                        :disabled="estaAdjudicada">
                    </v-text-field>
                </v-flex>
                <v-divider
                    vertical
                    inset>
                </v-divider>
                <v-flex
                    xs6>
                    <v-layout
                        row
                        wrap
                        justify-center
                        justify-space-between>
                        <v-flex
                            xs6>
                            <h3
                                class="title font-weight-thin">
                                SubTotal
                            </h3>
                            <span
                                class="font-weight-bold">
                                {{ cotizacion.datosAdjudicados.importe | currency }}
                            </span>
                        </v-flex>
                        <v-flex
                            xs6>
                            <h3
                                class="title font-weight-thin">
                                I.V.A
                            </h3>
                            <span
                                class="font-weight-bold">
                                {{ cotizacion.datosAdjudicados.iva_importe | currency }}
                            </span>
                        </v-flex>
                        <v-flex
                            xs12
                            class="mt-2">
                            <h3
                                class="title font-weight-thin">
                                Total
                            </h3>
                            <span
                                class="font-weight-bold">
                                {{ cotizacion.datosAdjudicados.gran_total | currency }}
                            </span>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex
                    xs12>
                    <v-layout
                        row
                        wrap
                        class="px-3 mt-2"
                        align-center>
                        <v-flex
                            xs12>
                            <v-textarea
                                v-model="cotizacion.datosAdjudicados.comentarios"
                                :rules="[reglas.requerido]"
                                placeholder="Comentarios"
                                solo
                                rows="2"
                                hide-details
                                :disabled="estaAdjudicada">
                            </v-textarea>
                        </v-flex>
                        <v-flex
                            xs12>
                            <v-btn
                                :disabled="!valido"
                                :loading="enviando"
                                small
                                color="primary"
                                @click.prevent="adjudicarPartida"
                                v-if="!estaAdjudicada">
                                <v-icon
                                    left>
                                    save
                                </v-icon>
                                Guardar
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'adjudicarPropuesta',
  props: {
    propuesta: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    valido: false,
    enviando: false,
    cantidadAdjudicar: 0,
    precioUnitarioAdjudicar: 0,
    cotizacion: {
      id: null,
      id_adquisicion_articulo: null,
      adjudicada: false,
      datosAdjudicados: {
        comentarios: '',
        cantidad: 0,
        precio_unitario: 0,
        iva: 0,
        total: 0,
        importe: 0,
        iva_importe: 0,
        gran_total: 0,
      },
    },
    reglas: {
      requerido: v => !!v || 'Campo Requerido.',
    },
  }),
  mounted() {
    const esto = this;
    this.cantidadAdjudicar = !esto.propuesta.datosAdjudicados
      ? esto.propuesta.cantidadDisponible
      : esto.propuesta.datosAdjudicados.cantidad;
    esto.precioUnitarioAdjudicar = !esto.propuesta.datosAdjudicados
      ? esto.propuesta.precio_unitario
      : esto.propuesta.datosAdjudicados.precio_unitario;
    esto.cotizacion.datosAdjudicados.comentarios = !esto.propuesta.datosAdjudicados
      ? ''
      : esto.propuesta.datosAdjudicados.comentarios;
    this.hacerCalculos();
  },
  methods: {
    ...mapActions('adquisiciones', ['adjudicarArticulo']),
    adjudicarPartida() {
      this.adjudicarArticulo(this.cotizacion)
        .then((res) => {
          this.$socket.emit('adjudicarArticulo', res);
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
    },
    hacerCalculos() {
      this.cotizacion.id = this.propuesta.id;
      this.cotizacion.id_adquisicion_articulo = this.propuesta.id_adquisicion_articulo;
      this.cotizacion.adjudicada = true;

      this.cotizacion.datosAdjudicados.precio_unitario = parseFloat(this.precioUnitarioAdjudicar);
      this.cotizacion.datosAdjudicados.iva = parseFloat(
        (this.precioUnitarioAdjudicar * (this.propuesta.por_iva / 100)),
      );
      this.cotizacion.datosAdjudicados.total = (
        this.cotizacion.datosAdjudicados.precio_unitario + this.cotizacion.datosAdjudicados.iva
      );

      const subtotal = parseFloat((this.cantidadAdjudicar * this.precioUnitarioAdjudicar));
      const iva = parseFloat((subtotal * (this.propuesta.por_iva / 100)));
      const total = parseFloat((subtotal + iva));
      this.cotizacion.datosAdjudicados.cantidad = Number(this.cantidadAdjudicar);
      this.cotizacion.datosAdjudicados.importe = subtotal;
      this.cotizacion.datosAdjudicados.iva_importe = iva;
      this.cotizacion.datosAdjudicados.gran_total = total;
    },
    soloNumeros(evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode !== 46 && charCode > 31
            && (charCode < 48 || charCode > 57)) { evt.preventDefault(); }

      if (charCode === 46) {
        if (evt.target.value.toString().includes('.')) {
          evt.preventDefault();
        }
      }

      return true;
    },
    cantidadMayor() {
      if (this.estaAdjudicada) return true;
      return (this.cantidadAdjudicar || 0) <= (this.propuesta.cantidadDisponible || 0)
      || 'La cantidad Excede';
    },
  },
  computed: {
    estaAdjudicada() {
      return this.propuesta.datosAdjudicados !== null;
    },
  },
  watch: {
    propuesta: {
      handler(propuesta) {
        this.cantidadAdjudicar = !propuesta.datosAdjudicados
          ? propuesta.cantidadDisponible
          : propuesta.datosAdjudicados.cantidad;
        this.precioUnitarioAdjudicar = !propuesta.datosAdjudicados
          ? propuesta.precio_unitario
          : propuesta.datosAdjudicados.precio_unitario;
        this.cotizacion.datosAdjudicados.comentarios = !propuesta.datosAdjudicados
          ? ''
          : propuesta.datosAdjudicados.comentarios;
        this.hacerCalculos();
      },
    },
  },
};
</script>

<style lang="scss">

</style>
