const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Bon Jovi'));
bands.addBand( new Band('Héroes del Silencio'));
bands.addBand( new Band('Metallica'));


//Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente Conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente Desconectado');
     });

     client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        io.emit('mensaje', {admin: 'Nuevo mensaje from server'});
     });

     //Escuchar cuando el cliente (tablet, navegador, celular, etc.) emita el mensaje vote-band
     client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        //Se le envia a todos los clientrs conectados para que tengan los cambios
        //mas recientes, incluido el mismo cliente que votó
        io.emit('active-bands', bands.getBands());
     });

     client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
      //bands.voteBand(payload.id);
      //Se le envia a todos los clientrs conectados para que tengan los cambios
      //mas recientes, incluido el mismo cliente que votó
      io.emit('active-bands', bands.getBands());
      });

      client.on('delete-band', (payload) => {
         bands.deleteBand(payload.id);
       //bands.voteBand(payload.id);
       //Se le envia a todos los clientrs conectados para que tengan los cambios
       //mas recientes, incluido el mismo cliente que votó
       io.emit('active-bands', bands.getBands());
       });
  });