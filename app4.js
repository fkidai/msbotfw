var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', new builder.CommandDialog()
  .matches('^好きな色は？', builder.DialogAction.beginDialog('/choice'))
  .onDefault(function (session) {
    if (!session.userData.name) {
      session.beginDialog('/getname');
    } else {
      session.send("こんにちは、" + session.userData.name);
    }
}));

bot.dialog('/choice', [
  function(session) {
    builder.Prompts.choice(session,
      "好きな色は？", "赤|青|黄色|その他");
  },
  function(session, results) {
    session.send("あなたの好きな色は、" + results.response.entity);
    session.endDialog();
  }
]);

bot.dialog('/getname', [
  function(session) {
    builder.Prompts.text(session, "あなたのお名前は？");
  },
  function(session, results) {
    session.userData.name = results.response;
    session.send('こんにちわ、' + session.userData.name);
    session.endDialog();
  }
]);
