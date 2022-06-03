<template>
    <div id="contenedor-count-down-text">
        <template
          v-if="estatus.tipo !== 3">
          <v-chip
            :class="{
            'warning': estatus.tipo === 1,
            'success': estatus.tipo === 2}"
            dark
            small>
            <v-icon
              small
              class="mr-1">
              schedule
            </v-icon>
            {{
              dias | DosDigitos
            }}
            {{ horas | DosDigitos }}:{{ minutos | DosDigitos }}:{{ segundos | DosDigitos }}
          </v-chip>
        </template>
        <template
          v-else>
          <v-chip
            small
            color="pink"
            text-color="white">
            Cerrada
          </v-chip>
        </template>
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
      ahora: Math.trunc((new Date()).getTime() / 1000),
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
    this.fetch();
  },
  methods: {
    fetch() {
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
        this.ahora = Math.trunc((new Date()).getTime() / 1000);
      }, 1000);
    },
    timer() {
      intervalo = setInterval(() => {
        this.ahora = Math.trunc((new Date()).getTime() / 1000);
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
      if (this.ahora >= this.fechaInicio
      && this.ahora < this.fechaTermino) return this.tipoEstatus[1];
      return this.tipoEstatus[2];
    },
  },
  watch: {
    inicio: {
      handler() {
        this.fetch();
      },
    },
    termino: {
      handler() {
        this.fetch();
      },
    },
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
        if (this.ahora >= this.fechaInicio
      && this.ahora < this.fechaTermino) this.eventoLive = true;
      },
    },
    eventoLive: {
      handler(nuevoValor) {
        this.$emit('change', nuevoValor);
        this.$emit('estatus', this.estatus);
      },
    },
  },
  destroyed() {
    clearInterval(intervalo);
  },
};
</script>

<style lang="scss">

</style>
