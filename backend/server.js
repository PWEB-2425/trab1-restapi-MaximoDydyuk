// backend/server.js
import app from './app.js';
import config from './config/config.js'; // Importar configurações
import 'dotenv/config';

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Servidor a rodar na porta ${PORT}`);
  console.log(` A usar banco: ${config.MONGODB_URI}`);
});

export default app;
