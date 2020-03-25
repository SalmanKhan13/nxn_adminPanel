const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log(`env = ${app.get('env')}\n__dirname = ${__dirname}\nprocess.cwd = ${process.cwd()}`);
});
