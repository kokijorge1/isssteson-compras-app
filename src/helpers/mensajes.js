const Mensajes = msg => ({
  success: ({
    mostrar: true,
    color: 'success',
    texto: msg || 'Los datos de han guardado correctamente.',
  }),
  warning: ({
    mostrar: true,
    color: 'warning',
    texto: msg || '',
  }),
  error: ({
    mostrar: true,
    color: 'error',
    texto: msg || '',
  }),
  info: ({
    mostrar: true,
    color: 'info',
    texto: msg || '',
  }),
});

export default Mensajes;
