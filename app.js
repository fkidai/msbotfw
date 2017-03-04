var builder = require('botbuilder');

var bot = new builder.TextBot();
bot.add('/', function (session) {
  session.send('Hello world');
});

bot.listenStdin();
