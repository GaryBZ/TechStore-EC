import express from 'express';
import cors from 'cors';
import { initPool } from './config/db.js';
import marcaRoutes from './routes/marca.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import productoRoutes from './routes/producto.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import proveedorRoutes from './routes/proveedor.routes.js';

import authRoutes from './routes/auth.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import inventarioRoutes from './routes/inventario.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/pedido', pedidoRoutes);
app.use('/api/usuarios', usuarioRoutes);


app.use('/api/marcas', marcaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/proveedores', proveedorRoutes);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API E-Commerce Oracle 19c' });
});

initPool()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Error conectando a Oracle:', err);
    process.exit(1);
  });