<template>
  <div id="contenedor-editar-adquisicion">
    <v-toolbar flat color="transparent">
      <page-title titulo="Detalles" subtitulo="Compra"></page-title>
    </v-toolbar>
    <v-card v-if="getAdquisicion" class="roundedCustom">
      <v-card-text>
        <v-form ref="form" v-model="valido" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 md9>
              <v-layout row wrap>
                <v-flex xs12 md12 class="pr-3">
                  <v-layout row wrap justify-space-between>
                    <v-flex xs12 md6>
                      <template v-if="editarItem !== 'tipo'">
                        <h1 class="subheading">
                          <strong>Tipo:</strong>
                          <v-tooltip right class="pl-1">
                            <v-btn icon flat slot="activator" @click="editarItem = 'tipo'">
                              <v-icon small>edit</v-icon>
                            </v-btn>
                            <span>Editar</span>
                          </v-tooltip>
                        </h1>
                        <p>{{ getTipo(adquisicion.tipo).texto }}</p>
                      </template>
                      <template v-if="editarItem === 'tipo'">
                        <v-radio-group v-model="adquisicion.tipo" row :rules="[reglas.requerido]">
                          <v-radio
                            v-for="t in getTipos"
                            :key="t.id"
                            :label="t.texto"
                            :value="t.id"
                          ></v-radio>
                        </v-radio-group>
                        <v-btn color="primary" @click="editar">
                          <v-icon dark left>done</v-icon>Guardar
                        </v-btn>
                        <v-btn flat @click="editarItem = null">cancelar</v-btn>
                        <v-divider class="my-2"> </v-divider>
                      </template>
                    </v-flex>
                    <v-flex xs12 md3>
                      <v-switch
                        v-model="adquisicion.publicar"
                        label="Publicar"
                        color="primary"
                        @change="editar"
                      >
                      </v-switch>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap justify-space-between>
                    <v-flex xs12 md4>
                      <template v-if="editarItem !== 'numero'">
                        <h1 class="subheading">
                          <strong>Número:</strong>
                          <v-tooltip right class="pl-1">
                            <v-btn icon flat slot="activator" @click="editarItem = 'numero'">
                              <v-icon small>edit</v-icon>
                            </v-btn>
                            <span>Editar</span>
                          </v-tooltip>
                        </h1>
                        <p>{{ adquisicion.numero }}</p>
                      </template>
                      <template v-if="editarItem === 'numero'">
                        <v-text-field
                          v-model="adquisicion.numero"
                          label="Número"
                          :rules="[reglas.requerido]"
                          hint="Requerido *"
                          solo
                          persistent-hint
                        ></v-text-field>
                        <v-btn color="primary" @click="editar">
                          <v-icon dark left>done</v-icon>Guardar
                        </v-btn>
                        <v-btn flat @click="editarItem = null">cancelar</v-btn>
                        <v-divider class="my-2"> </v-divider>
                      </template>
                    </v-flex>
                    <v-flex xs12 md3>
                      <template v-if="editarItem !== 'fecha'">
                        <h1 class="subheading">
                          <strong>Fecha:</strong>
                          <v-tooltip right class="pl-1">
                            <v-btn icon flat slot="activator" @click="editarItem = 'fecha'">
                              <v-icon small>edit</v-icon>
                            </v-btn>
                            <span>Editar</span>
                          </v-tooltip>
                        </h1>
                        <p>{{ $moment(getAdquisicion.fecha).format("D/MM/YYYY") }}</p>
                      </template>
                      <template v-if="editarItem === 'fecha'">
                        <date-picker
                          v-model="adquisicion.fecha"
                          label="Fecha"
                          :rules="[reglas.requerido]"
                        ></date-picker>
                        <v-btn color="primary" @click="editar">
                          <v-icon dark left>done</v-icon>Guardar
                        </v-btn>
                        <v-btn flat @click="editarItem = null">cancelar</v-btn>
                        <v-divider class="my-2"> </v-divider>
                      </template>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap justify-space-between>
                    <v-flex xs12 md3 class="pr-3">
                      <template v-if="editarItem !== 'fechaInicio'">
                        <h1 class="subheading">
                          <strong>Fecha Inicio:</strong>
                          <v-tooltip right class="pr-1">
                            <v-btn icon flat slot="activator" @click="editarItem = 'fechaInicio'">
                              <v-icon small>edit</v-icon>
                            </v-btn>
                            <span>Editar</span>
                          </v-tooltip>
                        </h1>
                        <p>{{ $moment(adquisicion.fecha_inicio).format("D/MM/YYYY") }}</p>
                      </template>
                      <template v-if="editarItem === 'fechaInicio'">
                        <date-picker v-model="adquisicion.fecha_inicio" label="Inicio">
                        </date-picker>
                        <v-btn color="primary" @click="editar">
                          <v-icon dark left>done</v-icon>Guardar
                        </v-btn>
                        <v-btn flat @click="editarItem = null">cancelar</v-btn>
                        <v-divider class="my-2"> </v-divider>
                      </template>
                    </v-flex>
                    <v-flex xs12 md3 class="pr-3">
                      <template v-if="editarItem !== 'horaInicio'">
                        <h1 class="subheading">
                          <strong>Hora Inicio:</strong>
                          <v-tooltip right class="pr-1">
                            <v-btn icon flat slot="activator" @click="editarItem = 'horaInicio'">
                              <v-icon small>edit</v-icon>
                            </v-btn>
                            <span>Editar</span>
                          </v-tooltip>
                        </h1>
                        <p>{{ horaInicio }}</p>
                      </template>
                      <template v-if="editarItem === 'horaInicio'">
                        <time-picker-custom v-model="horaInicio" label="Inicio">
                        </time-picker-custom>
                        <v-btn color="primary" @click="editar">
                          <v-icon dark left>done</v-icon>Guardar
                        </v-btn>
                        <v-btn flat @click="editarItem = null">cancelar</v-btn>
                        <v-divider class="my-2"> </v-divider>
                      </template>
                    </v-flex>
                    <v-flex xs12 md3 class="pr-3">
                      <template v-if="editarItem !== 'fechaTermino'">
                        <h1 class="subheading">
                          <strong>Fecha Término:</strong>
                          <v-tooltip right class="pr-1">
                            <v-btn icon flat slot="activator" @click="editarItem = 'fechaTermino'">
                              <v-icon small>edit</v-icon>
                            </v-btn>
                            <span>Editar</span>
                          </v-tooltip>
                        </h1>
                        <p>
                          {{ $moment(adquisicion.fecha_termino).format("D/MM/YYYY") }}
                        </p>
                      </template>
                      <template v-if="editarItem === 'fechaTermino'">
                        <date-picker v-model="adquisicion.fecha_termino" label="Término">
                        </date-picker>
                        <v-btn color="primary" @click="editar">
                          <v-icon dark left>done</v-icon>Guardar
                        </v-btn>
                        <v-btn flat @click="editarItem = null">cancelar</v-btn>
                        <v-divider class="my-2"> </v-divider>
                      </template>
                    </v-flex>
                    <v-flex xs12 md3>
                      <template v-if="editarItem !== 'horaTermino'">
                        <h1 class="subheading">
                          <strong>Hora Término:</strong>
                          <v-tooltip right>
                            <v-btn icon flat slot="activator" @click="editarItem = 'horaTermino'">
                              <v-icon small>edit</v-icon>
                            </v-btn>
                            <span>Editar</span>
                          </v-tooltip>
                        </h1>
                        <p>{{ horaTermino }}</p>
                      </template>
                      <template v-if="editarItem === 'horaTermino'">
                        <time-picker-custom v-model="horaTermino" label="Término">
                        </time-picker-custom>
                        <v-btn color="primary" @click="editar">
                          <v-icon dark left>done</v-icon>Guardar
                        </v-btn>
                        <v-btn flat @click="editarItem = null">cancelar</v-btn>
                        <v-divider class="my-2"> </v-divider>
                      </template>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <template v-if="editarItem !== 'nombre'">
                        <h1 class="subheading">
                          <strong>Nombre/Descripción:</strong>
                          <v-tooltip right class="pr-1">
                            <v-btn icon flat slot="activator" @click="editarItem = 'nombre'">
                              <v-icon small>edit</v-icon>
                            </v-btn>
                            <span>Editar</span>
                          </v-tooltip>
                        </h1>
                        <p>{{ adquisicion.nombre }}</p>
                      </template>
                      <template v-if="editarItem === 'nombre'">
                        <v-textarea
                          v-model="adquisicion.nombre"
                          label="Nombre/Descripción"
                          :rules="[reglas.requerido]"
                          rows="2"
                          solo
                          counter
                        ></v-textarea>
                        <v-btn color="primary" @click="editar">
                          <v-icon dark left>done</v-icon>Guardar
                        </v-btn>
                        <v-btn flat @click="editarItem = null">cancelar</v-btn>
                        <v-divider class="my-2"> </v-divider>
                      </template>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 md3>
              <documentos-anexos></documentos-anexos>
            </v-flex>
          </v-layout>
        </v-form>
        <v-layout row wrap class="mt-3">
          <v-flex xs12 md12>
            <v-toolbar dense color="colorText" dark>
              <v-badge color="secondary">
                <template v-slot:badge>
                  <span>{{ getRequisiciones.length }}</span>
                </template>
                <v-toolbar-title>Requisiciones</v-toolbar-title>
              </v-badge>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <v-btn
                  slot="activator"
                  icon
                  dark
                  @click="showRequisicionesPicker = !showRequisicionesPicker"
                >
                  <v-icon>add</v-icon>
                </v-btn>
                <span>Agregar Requisición</span>
              </v-tooltip>
            </v-toolbar>
            <v-data-table :headers="requisicionesHeaders" :items="getRequisiciones" hide-actions>
              <template v-slot:items="props">
                <tr>
                  <td>{{ props.item.numero }}</td>
                  <td>{{ props.item.partida.nombre }}</td>
                  <td>{{ props.item.justificacion }}</td>
                  <td>{{ props.item.observaciones }}</td>
                  <td class="text-xs-center px-0">
                    <v-tooltip top>
                      <v-btn
                        slot="activator"
                        icon
                        small
                        dark
                        color="red"
                        @click="preRemoverElemento(props.item.id, 'requisicion')"
                        v-if="!getAdquisicion.invitacion.fecha"
                      >
                        <v-icon>remove</v-icon>
                      </v-btn>
                      <span>Remover Requisición</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
        <v-layout row wrap class="mt-4">
          <v-flex xs12 md12>
            <v-toolbar dense color="colorText" dark>
              <v-badge color="secondary">
                <template v-slot:badge>
                  <span>{{ getArticulos.length }}</span>
                </template>
                <v-toolbar-title>Articulos</v-toolbar-title>
              </v-badge>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <v-btn slot="activator" icon dark @click="showArticuloPicker = !showArticuloPicker">
                  <v-icon>add</v-icon>
                </v-btn>
                <span>Agregar Articulo</span>
              </v-tooltip>
            </v-toolbar>
            <v-data-table :headers="articulosHeaders" :items="getArticulos" hide-actions>
              <template v-slot:items="props">
                <tr>
                  <td>
                    <strong>{{ props.item.articulo.clave_interna }}</strong>
                  </td>
                  <td>{{ props.item.articulo.nombre }}</td>
                  <td>{{ props.item.cantidad }}</td>
                  <td class="text-xs-center">{{ props.item.articulo.unidad }}</td>
                  <td>{{ props.item.articulo.presentacion }}</td>
                  <td>{{ props.item.precio_referencia | currency }}</td>
                  <td>{{ props.item.caracteristicas }}</td>
                  <td class="text-xs-center px-0">
                    <v-tooltip top>
                      <v-btn
                        slot="activator"
                        icon
                        small
                        dark
                        color="red"
                        @click="preRemoverElemento(props.item.id, 'articulo')"
                        v-if="!getAdquisicion.invitacion.fecha"
                      >
                        <v-icon>remove</v-icon>
                      </v-btn>
                      <span>Remover Articulo</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogAutorizar" persistent max-width="290">
      <v-card>
        <v-card-title class="headline grey lighten-2">Confirmación</v-card-title>
        <v-card-text v-if="elementoRemover == 'articulo'">
          ¿Seguro que desea remover este Articulo?
        </v-card-text>
        <v-card-text v-if="elementoRemover == 'requisicion'"
          >¿Seguro que desea remover esta Requisición?</v-card-text
        >
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="removerArticulo" :loading="enviando">
            <v-icon dark left>done</v-icon>Autorizar
          </v-btn>
          <v-btn flat color="error" @click="dialogAutorizar = !dialogAutorizar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showArticuloPicker" persistent max-width="600px">
      <articulos-picker
        @articulo="agregarNuevoArticulo"
        :articulosExistentes="getArticulos"
        v-on:cerrar="cerrarDialog"
      >
      </articulos-picker>
    </v-dialog>
    <v-dialog v-model="showRequisicionesPicker" persistent max-width="900px">
      <requisiciones-picker @enviar="agregarNuevasRequisiciones" v-on:cerrar="cerrarDialog">
      </requisiciones-picker>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
import DatePicker from '@/components/DatePicker.vue';
import TimePickerCustom from '@/components/TimePickerCustom.vue';
import Mensajes from '@/helpers/mensajes';
import ArticulosPicker from '@/components/ArticulosPicker.vue';
import RequisicionesPicker from '@/components/RequisicionesPicker.vue';
import DocumentosAnexos from './DocumentosAnexos.vue';

export default {
  name: 'EditarAdquisicion',
  components: {
    PageTitle,
    DatePicker,
    TimePickerCustom,
    ArticulosPicker,
    RequisicionesPicker,
    DocumentosAnexos,
  },
  data() {
    return {
      horaTerminoKey: 0,
      showRequisicionesPicker: false,
      showArticuloPicker: false,
      valido: false,
      enviando: false,
      editarItem: null,
      horaInicio: '',
      horaTermino: '',
      adquisicion: {
        tipo: null,
        publicar: false,
        numero: null,
        nombre: null,
        fecha: '',
        fecha_inicio: '',
        fecha_termino: '',
      },
      idRemover: null,
      elementoRemover: '',
      dialogAutorizar: false,
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        fechasEventosMayores: () => {
          if (
            this.adquisicion.fecha_inicio
            && this.adquisicion.fecha_termino
            && new Date(this.adquisicion.fecha_termino) > new Date(this.adquisicion.fecha_inicio)
          ) {
            return true;
          }
          return 'La Fecha de Termino debe de ser mayor a la fecha de Inicio.';
        },
      },
      requisicionesHeaders: [
        { text: 'Número', sortable: true, value: 'numero' },
        { text: 'Partida', sortable: true, value: 'partida.id' },
        { text: 'Justificación', sortable: false, value: '' },
        { text: 'Observaciones', sortable: false, value: '' },
        {
          text: '',
          sortable: false,
          value: '',
          width: '',
        },
      ],
      articulosHeaders: [
        { text: 'Clave', sortable: true, value: 'articulo.clave_interna' },
        { text: 'Descripción', sortable: false, value: '' },
        {
          text: 'Cantidad',
          sortable: true,
          value: 'cantidad',
          align: 'left',
        },
        {
          text: 'Unidad M.',
          sortable: false,
          value: 'unidad',
          align: 'center',
        },
        { text: 'Presentación', sortable: false, value: 'presentacion' },
        {
          text: 'Precio Referencia',
          sortable: true,
          value: 'precio_referencia',
          align: 'left',
        },
        { text: 'Caracteristicas', sortable: false, value: '' },
        {
          text: '',
          sortable: false,
          value: '',
          width: '',
        },
      ],
    };
  },
  mounted() {
    if (this.getAdquisicion) {
      this.adquisicion.tipo = this.getAdquisicion.tipo;
      this.adquisicion.publicar = this.getAdquisicion.publicar;
      this.adquisicion.numero = this.getAdquisicion.numero;
      this.adquisicion.fecha = this.$moment(this.getAdquisicion.fecha).format('YYYY-MM-DD');
      this.adquisicion.fecha_inicio = this.$moment(this.getAdquisicion.fecha_inicio).format(
        'YYYY-MM-DD',
      );
      this.horaInicio = this.$moment(this.getAdquisicion.fecha_inicio).format('HH:mm');
      this.adquisicion.fecha_termino = this.$moment(this.getAdquisicion.fecha_termino).format(
        'YYYY-MM-DD',
      );
      this.horaTermino = this.$moment(this.getAdquisicion.fecha_termino).format('HH:mm');
      this.adquisicion.nombre = this.getAdquisicion.nombre;
    }
  },
  methods: {
    ...mapActions('adquisiciones', [
      'actulizarAdquisicion',
      'borrarRequisicion',
      'borrarArticuloAdquisicion',
      'borrarRequisicionAdquisicion',
      'agregarArticulo',
      'agregarRequisiciones',
    ]),
    getTipo(tipo) {
      if (!tipo) return '';
      return this.tipo(tipo);
    },
    editar() {
      this.actulizarAdquisicion(this.adquisicionDatosFormato())
        .then((res) => {
          this.$socket.emit('editarAdquisicion', res);
          this.editarItem = null;
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
    adquisicionDatosFormato() {
      const fechaInicio = this.adquisicion.fecha_inicio
        ? `${this.adquisicion.fecha_inicio} ${this.horaInicio || '00:00'}`
        : '';
      const fechaTermino = this.adquisicion.fecha_termino
        ? `${this.adquisicion.fecha_termino} ${this.horaTermino || '00:00'}`
        : '';

      return {
        id: Number(this.$route.params.id),
        datos: {
          tipo: this.adquisicion.tipo,
          publicar: this.adquisicion.publicar,
          numero: this.adquisicion.numero,
          nombre: this.adquisicion.nombre,
          fecha: this.adquisicion.fecha,
          fecha_inicio: fechaInicio,
          fecha_termino: fechaTermino,
        },
      };
    },
    agregarNuevasRequisiciones(datos) {
      const dataFormat = {
        id_adquisicion: Number(this.$route.params.id),
        data: {
          requisiciones: datos.requisiciones.map(item => ({
            id_requisicion: item.id,
          })),
          articulos: datos.articulos.map(item => ({
            id_articulo: item.articulo.id,
            cantidad: item.cantidad,
            caracteristicas: item.caracteristicas,
          })),
        },
      };

      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.agregarRequisiciones(dataFormat)
        .then(() => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
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
    agregarNuevoArticulo(articulo) {
      if (!articulo) return;
      const datos = {
        id_adquisicion: Number(this.$route.params.id),
        data: {
          id_articulo: articulo.id_articulo,
          cantidad: articulo.cantidad,
          precio_referencia: articulo.precio_referencia,
          caracteristicas: articulo.caracteristicas,
        },
      };

      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.agregarArticulo(datos)
        .then((res) => {
          this.$socket.emit('editarAdquisicion', res);
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
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
    preRemoverElemento(id, elemento) {
      this.elementoRemover = elemento;
      this.idRemover = id;
      this.dialogAutorizar = true;
    },
    removerRequisicion() {
      if (!this.idRemover) return;

      this.enviando = true;
      this.borrarRequisicionAdquisicion({
        id: this.idRemover,
        idAdquisicion: Number(this.$route.params.id),
      })
        .then(() => {
          this.idRemover = null;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.enviando = false;
          this.dialogAutorizar = false;
        })
        .catch((err) => {
          this.idRemover = null;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.enviando = false;
          this.dialogAutorizar = false;
        });
    },
    removerArticulo() {
      if (!this.idRemover) return;

      this.enviando = true;
      this.borrarArticuloAdquisicion({
        id: this.idRemover,
        idAdquisicion: Number(this.$route.params.id),
      })
        .then((res) => {
          this.$socket.emit('borrarArticuloAdquisicion', res);
          this.idRemover = null;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.enviando = false;
          this.dialogAutorizar = false;
        })
        .catch((err) => {
          this.idRemover = null;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.enviando = false;
          this.dialogAutorizar = false;
        });
    },
    cerrarDialog() {
      this.showRequisicionesPicker = false;
      this.showArticuloPicker = false;
    },
  },
  computed: {
    ...mapGetters({
      tipos: 'adquisiciones/tipos',
      requisicionesAutorizadas: 'requisiciones/autorizadas',
      getAdq: 'adquisiciones/adquisicion',
      tipo: 'adquisiciones/tipo',
    }),
    getTipos() {
      return this.tipos.filter(item => item.id !== '');
    },
    getAdquisicion() {
      return this.getAdq(Number(this.$route.params.id));
    },
    getRequisiciones() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.requisiciones;
    },
    getArticulos() {
      if (!this.getAdquisicion) return [];
      const articulos = [...this.getAdquisicion.articulos];
      return articulos.sort(
        (a, b) => a.articulo.clave_interna.localeCompare(b.articulo.clave_interna)
          && a.cantidad - b.cantidad,
      );
    },
  },
  watch: {
    getAdquisicion: {
      handler(adquisicion) {
        if (!adquisicion) return;
        this.adquisicion.tipo = adquisicion.tipo;
        this.adquisicion.publicar = adquisicion.publicar;
        this.adquisicion.numero = adquisicion.numero;
        this.adquisicion.fecha = this.$moment(adquisicion.fecha).format('YYYY-MM-DD');
        this.adquisicion.fecha_inicio = this.$moment(adquisicion.fecha_inicio).format('YYYY-MM-DD');
        this.horaInicio = this.$moment(adquisicion.fecha_inicio).format('HH:mm');
        this.adquisicion.fecha_termino = this.$moment(adquisicion.fecha_termino).format(
          'YYYY-MM-DD',
        );
        this.horaTermino = this.$moment(adquisicion.fecha_termino).format('HH:mm');
        this.adquisicion.nombre = adquisicion.nombre;
      },
    },
  },
};
</script>

<style lang="scss"></style>
