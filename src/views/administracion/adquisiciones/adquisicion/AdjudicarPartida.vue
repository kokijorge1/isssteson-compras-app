<template>
    <div id="contenedor-adjudicar-partida">
        <v-card>
            <v-toolbar
                flat color="primary" dark class="headline">
                <v-toolbar-title>
                    Adjudicar
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
            <v-card-text>
                <v-alert
                    :value="true"
                    type="info"
                    outline
                    icon="">
                    <div>
                        <div>
                            <span>
                                <b>
                                    Proveedor:
                                </b>
                            </span>
                            <span>
                                {{ propuesta.proveedor.nombre }}
                            </span>
                        </div>
                        <div>
                            <span>
                                <b>
                                    Artículo:
                                </b>
                            </span>
                            <span>
                                {{ propuesta.articulo.cabms }} -
                                <mostrar-mas-texto
                                  :texto="propuesta.articulo.nombre"
                                  :caracteresMaximos="120">
                                </mostrar-mas-texto>
                            </span>
                        </div>
                        <div>
                            <span>
                                <b>
                                    Cantidad:
                                </b>
                            </span>
                            <span>
                                {{ propuesta.cantidad }}
                            </span>
                        </div>
                    </div>
                </v-alert>
                <v-divider
                    class="my-2">
                </v-divider>
                <v-form
                    v-model="valido">
                    <v-text-field
                        v-model="cantidadAdjudicar"
                        type="number"
                        label="Cantidad"
                        :rules="[reglas.requerido, cantidadMayor]"
                        @keypress="soloNumeros"
                        @keyup.native="hacerCalculos"
                        outline>
                    </v-text-field>
                    <v-text-field
                        v-model="cotizacion.datosAdjudicados.subtotal"
                        type="number"
                        label="Sub-total"
                        prefix="$"
                        outline
                        readonly>
                    </v-text-field>
                    <v-text-field
                        v-model="cotizacion.datosAdjudicados.iva"
                        type="number"
                        label="I.V.A"
                        prefix="$"
                        outline
                        readonly>
                    </v-text-field>
                    <v-text-field
                        v-model="cotizacion.datosAdjudicados.total"
                        type="number"
                        label="Total"
                        prefix="$"
                        outline
                        readonly>
                    </v-text-field>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    @click="cerrar"
                    flat>
                    Cancelar
                </v-btn>
                <v-btn
                    :disabled="!valido"
                    :loading="enviando"
                    color="primary"
                    @click.prevent="adjudicarPartida">
                    <v-icon
                        left>
                        save
                    </v-icon>
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';
import MostrarMasTexto from '@/components/MostrarMasTexto.vue';

export default {
  name: 'adjudicarPartida',
  components: {
    MostrarMasTexto,
  },
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
    cotizacion: {
      id: null,
      id_adquisicion_articulo: null,
      adjudicada: false,
      datosAdjudicados: {
        cantidad: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
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
          this.cerrar();
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
      const subtotal = parseFloat((this.cantidadAdjudicar * this.propuesta.precio_unitario));
      const iva = parseFloat((subtotal * (this.propuesta.por_iva / 100)));
      const total = parseFloat((subtotal + iva));
      this.cotizacion.id = this.propuesta.id;
      this.cotizacion.id_adquisicion_articulo = this.propuesta.id_adquisicion_articulo;
      this.cotizacion.adjudicada = !this.propuesta.adjudicada;
      this.cotizacion.datosAdjudicados.cantidad = this.cantidadAdjudicar;
      this.cotizacion.datosAdjudicados.subtotal = subtotal;
      this.cotizacion.datosAdjudicados.iva = iva;
      this.cotizacion.datosAdjudicados.total = total;
    },
    cantidadMayor() {
      return (this.cantidadAdjudicar || 0) <= (this.propuesta.cantidadDisponible || 0)
      || 'La cantidad Excede';
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
    cerrar() {
      this.$emit('cerrar');
    },
  },
  watch: {
    propuesta: {
      handler(propuesta) {
        this.cantidadAdjudicar = !propuesta.datosAdjudicados
          ? propuesta.cantidadDisponible
          : propuesta.datosAdjudicados.cantidad;
        this.hacerCalculos();
      },
    },
  },
};
</script>

<style lang="scss">

</style>
