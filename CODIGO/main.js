require('dotenv').config();
const { Telegraf } = require('telegraf');
const QRCode = require('qrcode');
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use((ctx, next) => {
  ctx.replyWithChatAction('upload_photo');
  return next();
});

bot.start((ctx) => ctx.reply('Olá! Envie o texto para gerar um QR Code.'));

bot.on('text', async (ctx) => {
  const texto = ctx.message.text.trim();
  const nomeArquivo = `qr_code_${Date.now()}.png`;

  try {
    await gerarQRCode(texto, nomeArquivo);
    await ctx.replyWithPhoto({ source: nomeArquivo });
    fs.unlinkSync(nomeArquivo); 
  } catch (error) {
    console.error('Erro ao gerar o QR Code:', error);
    ctx.reply('Ocorreu um erro ao processar o QR Code.');
  }
});

async function gerarQRCode(texto, nomeArquivo) {
  try {
    await QRCode.toFile(nomeArquivo, texto);
    console.log(`QR Code gerado com sucesso: ${nomeArquivo}`);
  } catch (error) {
    console.error('Erro ao gerar o QR Code:', error);
    throw error;
  }
}

bot.launch().then(() => {
  console.log('Bot está online.');
});
