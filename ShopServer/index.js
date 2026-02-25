const express = require('express');
const {urlencoded, json} = require('express');
const cors = require('cors');
const db = require('./database/mongo.js');
const app = express();
const products = require('./routes/products.routes.js');
const payments = require('./routes/payments.routes.js');

db.dbInit().then(() => console.log('Conexion realizada'))

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
    res.send('<h1>¡Servidor funcionando correctamente! 🚀</h1><p>Rutas disponibles: /r1 (productos) y /r2 (pagos)</p>');
});

app.use('/r1', products);
app.use('/r2', payments);


const PORT = 4000;
// const HOST = '192.168.1.115';
const HOST = 'localhost';

// app.listen(PORT, HOST, () => {
//     console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;