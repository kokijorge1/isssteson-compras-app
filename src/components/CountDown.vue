<template>
  <div id="contenedor-count-down">
    <v-card
      flat
      class="roundedCustom"
      :class="{
        warning: estatus.tipo === 1,
        'success white--text': estatus.tipo === 2,
        'error white--text': estatus.tipo === 3
      }"
    >
      <v-card-text class="py-1">
        <v-layout align-end justify-space-between class="text-xs-center">
          <v-flex xs2 md3 pb-0>
            <template v-if="estatus.tipo === 1">
              <v-icon>access_time</v-icon>
            </template>
            <template v-if="estatus.tipo === 2">
              <v-icon dark>timer</v-icon>
            </template>
            <template v-if="estatus.tipo === 3">
              <v-icon dark>timer_off</v-icon>
            </template>
          </v-flex>
          <v-flex xs3 pb-0>
            <b>{{ dias | DosDigitos }}</b>
          </v-flex>
          <v-flex xs3 pb-0>
            <b>{{ horas | DosDigitos }}</b>
          </v-flex>
          <v-flex xs3 pb-0>
            <b>{{ minutos | DosDigitos }}</b>
          </v-flex>
          <v-flex xs3 pb-0>
            <b>{{ segundos | DosDigitos }}</b>
          </v-flex>
        </v-layout>
        <v-layout align-start justify-space-between>
          <v-flex pt-0 px-1 xs2 md3 class="text-xs-center">
            <small class="text-truncate">
              {{ estatus.texto }}
            </small>
          </v-flex>
          <v-flex pt-0 px-1 xs3 class="text-xs-center">
            <small class="text-truncate">
              Día(s)
            </small>
          </v-flex>
          <v-flex pt-0 px-1 xs3 class="text-xs-center">
            <small class="text-truncate">
              Hora(s)
            </small>
          </v-flex>
          <v-flex pt-0 px-1 xs3 class="text-xs-center">
            <small class="text-truncate hidden-md-and-down">
              Minuto(s)
            </small>
            <small class="hidden-lg-and-up">
              Min.
            </small>
          </v-flex>
          <v-flex pt-0 px-1 xs3 class="text-xs-center">
            <small class="text-truncate hidden-md-and-down">
              Segundo(s)
            </small>
            <small class="hidden-lg-and-up">
              Seg.
            </small>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
let intervalo = null;
export default {
  name: 'CountDown',
  props: {
    inicio: {
      type: [Date, String],
      required: false,
    },
    termino: {
      type: [Date, String],
      required: false,
    },
    detener: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      ahora: Math.trunc(new Date().getTime() / 1000),
      fechaInicio: null,
      fechaTermino: null,
      diferencia: 0,
      eventoLive: false,
      tipoEstatus: [
        { tipo: 1, texto: 'Por Iniciar' },
        { tipo: 2, texto: 'En Proceso' },
        { tipo: 3, texto: 'Término' },
      ],
    };
  },
  created() {
    if (!this.termino) throw new Error('Debe de espesificar la fecha y hora de termino');

    this.fechaTermino = Math.trunc(Date.parse(this.termino) / 1000);

    if (this.inicio) {
      this.fechaInicio = Math.trunc(Date.parse(this.inicio) / 1000);

      if (this.fechaInicio >= this.ahora) {
        this.fechaTermino = this.fechaInicio;
      }
    }

    if (!this.fechaTermino) throw new Error('Debe de espesificar la fecha y hora de termino');

    if (this.ahora >= this.fechaTermino) return;
    intervalo = setInterval(() => {
      this.eventoInicio = true;
      this.ahora = Math.trunc(new Date().getTime() / 1000);
    }, 1000);
  },
  methods: {
    timer() {
      intervalo = setInterval(() => {
        this.ahora = Math.trunc(new Date().getTime() / 1000);
      }, 1000);
    },
  },
  computed: {
    segundos() {
      return Math.trunc(this.diferencia) % 60;
    },
    minutos() {
      return Math.trunc(this.diferencia / 60) % 60;
    },
    horas() {
      return Math.trunc(this.diferencia / 60 / 60) % 24;
    },
    dias() {
      return Math.trunc(this.diferencia / 60 / 60 / 24);
    },
    estatus() {
      if (this.fechaInicio > this.ahora) return this.tipoEstatus[0];
      if (this.ahora >= this.fechaInicio && this.ahora < this.fechaTermino) {
        return this.tipoEstatus[1];
      }
      return this.tipoEstatus[2];
    },
  },
  watch: {
    ahora: {
      handler() {
        const fechaTermino = Math.trunc(Date.parse(this.termino) / 1000);

        if (this.ahora >= this.fechaInicio) this.fechaTermino = fechaTermino;

        this.diferencia = this.fechaTermino - this.ahora;

        if (this.diferencia <= 0 || this.detener) {
          clearInterval(intervalo);
          this.eventoLive = false;
          return;
        }
        if (this.ahora >= this.fechaInicio && this.ahora < this.fechaTermino) {
          this.eventoLive = true;
        }
      },
    },
    eventoLive: {
      handler(nuevoValor) {
        this.$emit('change', nuevoValor);
        this.$emit('estatus', this.estatus);
      },
    },
    estatus: {
      handler(val) {
        this.$emit('estatus', val);
      },
    },
  },
  destroyed() {
    clearInterval(intervalo);
  },
};
</script>

<style lang="scss"></style>
