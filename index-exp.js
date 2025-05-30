// app.js

const express = require('express');
const forge = require('node-forge');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse raw JSON body
app.use(bodyParser.json());


app.post('/', (req, res) => {
  const { privateKey, data } = req.body;

  console.log(privateKey)

  if (!privateKey || !data) {
    return res.status(400).json({ error: 'Missing privateKey or data in request body' });
  }

  // Replace this with actual signing logic
//   const fakeSignature = Buffer.from(`signed(${data})`).toString('base64');

        const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
        const md = forge.md.sha256.create();
        md.update(data, 'utf8');
        const signature = privateKeyObj.sign(md);
        const signatureBase64 = forge.util.encode64(signature);

  return res.status(200).json({ signature: signatureBase64 });
});

// Catch all other methods on /sign
app.all('/', (req, res) => {
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
