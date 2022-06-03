<template>
  <div id="contenedor-editar">
    <v-form v-model="valido">
      <v-card flat>
        <v-toolbar flat color="primary" dark class="headline">
            Editar
            <v-spacer></v-spacer>
            <v-btn icon @click="cerrar">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
        <v-card-text>
           <v-text-field
            v-model="partidaGenerica.clave"
            label="Clave"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint>
          </v-text-field>
          <v-text-field
            v-model="partidaGenerica.nombre"
            label="Nombre"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click.prevent="actulizar"
            :loading="enviando"
            :disabled="!valido">
            <v-icon>save</v-icon>
            Guardar
          </v-btn>
          <v-btn flat @click="cerrar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'Editar',
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      valido: false,
      enviando: false,
      partidaGenerica: {
        clave: null,
        nombre: null,
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['actulizarPartidaGenerica']),
    actulizar() {
      this.enviando = true;
      this.actulizarPartidaGenerica({
        id: this.id,
        partidaGenerica: this.partidaGenerica,
      })
        .then((data) => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;

          const datos = {
            tipo: 'ACTUALIZAR_PARTIDA_GENERICA',
            data,
          };

          this.$socket.emit('afectacionCatalogoGlobal', datos);

          this.cerrar();
        })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    cerrar() {
      this.$emit('cerrar');
    },
  },
  computed: {
    ...mapGetters({
      partidaGenericaId: 'settings/catalogos/partidaGenerica',
    }),
    getPartidaGenerica() {
      return this.partidaGenericaId(this.id);
    },
  },
  watch: {
    id: {
      handler(value) {
        if (!value) return;
        this.partidaGenerica.clave = this.getPartidaGenerica.clave;
        this.partidaGenerica.nombre = this.getPartidaGenerica.nombre;
      },
    },
  },
};
</script>

<style lang="scss">
</style>
