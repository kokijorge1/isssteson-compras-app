<template>
  <div id="contenedor-agregar-proveedor">
    <v-form v-model="valido">
      <v-card flat>
        <v-toolbar flat color="primary" dark class="headline">
          Editar
          <v-spacer></v-spacer>
          <v-btn icon @click="cerrar">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
      <template>
        <v-stepper non-linear>
          <v-stepper-header class="grey lighten-3">
            <v-stepper-step editable step="1">
              Obligatorios
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step editable step="2">
              Categorias
            </v-stepper-step>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1" class="my-1 py-1">
              <v-card flat>
                <v-card-text>
                  <v-text-field
                    v-model="proveedor.nombre"
                    label="Nombre/Razon"
                    :rules="[reglas.requerido]"
                    hint="Requerido *"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-model="proveedor.rfc"
                    label="RFC"
                    :rules="[reglas.requerido]"
                    hint="Requerido *"
                    persistent-hint
                  ></v-text-field>
                  <v-textarea v-model="proveedor.domicilio" label="Domicilio" auto-grow rows="2">
                  </v-textarea>
                  <v-text-field
                    v-model="proveedor.nombre_representante"
                    label="Representante"
                    :rules="[reglas.requerido]"
                    hint="Requerido *"
                    persistent-hint
                    class="mb-3"
                  ></v-text-field>
                  <v-layout row wrap>
                    <v-flex xs10>
                      <v-text-field
                        ref="emailValido"
                        v-model="email"
                        label="Correo Electrónico"
                        placeholder="correo@dominio.com"
                        :rules="[reglas.email]"
                        hint="Requerido *"
                        persistent-hint
                        class="mb-3"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <v-btn
                        color="primary"
                        @click.prevent="agregarCorreo"
                        :disabled="!isEmailValido"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex xs12>
                      <v-chip
                        v-for="(correo, index) in proveedor.correos_electronicos"
                        :key="correo"
                        color="teal lighten-2"
                        text-color="white"
                        @input="removeCorreo(index)"
                        close
                      >
                        <v-avatar class="teal">
                          <v-icon>email</v-icon>
                        </v-avatar>
                        {{ correo }}
                      </v-chip>
                    </v-flex>
                  </v-layout>
                  <v-textarea
                    v-model="proveedor.informacion_contacto"
                    label="Contacto"
                    placeholder="Datos del Contacto"
                    auto-grow
                    rows="2"
                  ></v-textarea>
                </v-card-text>
              </v-card>
            </v-stepper-content>
            <v-stepper-content step="2" class="my-1 py-1">
              <v-card flat>
                <v-card-text class="my-0 py-0">
                  <v-layout row wrap>
                    <v-flex xs12 md12 class="mt-1 pt-1">
                      <v-text-field
                        v-model="searchText"
                        placeholder="Buscar..."
                        append-icon="search"
                        clearable
                        solo
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-data-table
                    v-model="partidasSelected"
                    :items="listado"
                    :search.sync="searchText"
                    :headers="partidasHeaders"
                    item-key="id"
                    select-all
                    :pagination.sync="pagination"
                    :rows-per-page-items="itemsCantidad"
                  >
                    <template v-slot:items="props">
                      <tr :active="props.selected">
                        <td style="position: relative;">
                          <v-checkbox v-model="props.selected" primary hide-details> </v-checkbox>
                        </td>
                        <td>{{ props.item.clave }}</td>
                        <td>{{ props.item.nombre }}</td>
                      </tr>
                    </template>
                    <v-alert slot="no-results" :value="true" color="error" icon="warning">
                      No se encontró ninguna coincidencia para "{{ searchText }}".
                    </v-alert>
                    <template v-slot:footer>
                      <td :colspan="partidasHeaders.length + 1">
                        <v-chip
                          v-for="partida in ordenarChips"
                          :key="partida.id"
                          @input="remove(partida)"
                          close
                        >
                          {{ partida.clave }}
                        </v-chip>
                      </td>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
          <v-card flat>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click.prevent="actulizar"
                :loading="enviando"
                :disabled="!validarForm"
              >
                <v-icon>save</v-icon>Guardar
              </v-btn>
              <v-btn flat @click="cerrar">
                Cancelar
              </v-btn>
            </v-card-title>
          </v-card>
        </v-stepper>
      </template>
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
      searchText: '',
      valido: true,
      enviando: false,
      email: '',
      isEmailValido: false,
      proveedor: {
        nombre: null,
        rfc: null,
        nombre_representante: null,
        domicilio: null,
        informacion_contacto: null,
        correos_electronicos: [],
        categorias: [],
      },
      partidasSelected: [],
      partidasHeaders: [
        { text: 'Clave', sortable: true, value: 'clave' },
        { text: 'Nombre', sortable: true, value: 'nombre' },
      ],
      pagination: {
        sortBy: 'clave',
        descending: false,
        rowsPerPage: 4,
      },
      itemsCantidad: [4],
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        email: (val) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!val) return true;
          if (this.proveedor.correos_electronicos.includes(val)) {
            return 'El correo ya se encuentra agregado.';
          }
          if (pattern.test(val)) {
            this.isEmailValido = true;
            return true;
          }
          if (!val) {
            if (this.cantidadCorreos > 0) {
              return true;
            }
            return 'Debe agregar por lo menos un correo.';
          }
          this.isEmailValido = false;
          return 'Correo electrónico invalido.';
        },
      },
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['actulizarProveedor']),
    actulizar() {
      this.enviando = true;
      this.actulizarProveedor({
        id: this.id,
        proveedor: this.proveedor,
      })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;
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
    remove(categoria) {
      const index = this.partidasSelected.findIndex(item => item.id === categoria.id);
      this.partidasSelected.splice(index, 1);
    },
    agregarCorreo() {
      this.proveedor.correos_electronicos.push(this.email);
      this.email = '';
      this.isEmailValido = false;
    },
    removeCorreo(index) {
      this.proveedor.correos_electronicos.splice(index, 1);
    },
  },
  computed: {
    ...mapGetters({
      proveedorId: 'settings/catalogos/proveedor',
      partidasGenericas: 'settings/catalogos/partidasGenericas',
    }),
    getProveedor() {
      return this.proveedorId(this.id);
    },
    listado() {
      return this.partidasGenericas;
    },
    ordenarChips() {
      return this.partidasSelected.slice().sort((a, b) => {
        if (a.clave > b.clave) return 1;
        if (a.clave < b.clave) return -1;
        return 0;
      });
    },
    cantidadCorreos() {
      return this.proveedor.correos_electronicos.length;
    },
    validarForm() {
      return this.valido && this.cantidadCorreos > 0;
    },
  },
  watch: {
    id: {
      handler(value) {
        if (!value) return;
        this.proveedor.nombre = this.getProveedor.nombre;
        this.proveedor.rfc = this.getProveedor.rfc;
        this.proveedor.nombre_representante = this.getProveedor.nombre_representante;
        this.proveedor.domicilio = this.getProveedor.domicilio;
        this.proveedor.informacion_contacto = this.getProveedor.informacion_contacto;
        this.proveedor.correos_electronicos = this.getProveedor.correo_electronico.split(';');
        this.partidasSelected = this.getProveedor.categorias.map(item => item.partida_generica);
      },
    },
    partidasSelected: {
      handler(selectedPartidaGenerica) {
        this.proveedor.categorias = [];
        this.proveedor.categorias = selectedPartidaGenerica.map(item => ({
          id_partida_generica: item.id,
        }));
      },
    },
  },
};
</script>

<style lang="scss"></style>
