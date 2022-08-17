const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(process.cwd(), 'public')));

app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
