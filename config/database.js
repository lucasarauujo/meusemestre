const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI não configurada!');
      console.log('📋 Para configurar:');
      console.log('1. Crie conta gratuita em: https://www.mongodb.com/atlas');
      console.log('2. Configure no Render: MONGODB_URI=mongodb+srv://...');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      // Opções recomendadas para produção
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log('🟢 MongoDB conectado com sucesso!');
    console.log(`📊 Banco: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    
    // Em desenvolvimento, continua sem banco (fallback para JSON)
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Continuando em modo de desenvolvimento com arquivos JSON...');
      return null;
    }
    
    // Em produção, falha completamente
    process.exit(1);
  }
};

// Eventos de conexão
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erro no MongoDB:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔴 Conexão MongoDB fechada.');
  process.exit(0);
});

module.exports = connectDB;
