const express = require('express');
const forge = require('node-forge');
const app = express();

// Middleware to parse JSON and raw bodies
app.use(express.json());
app.use(express.text());

// Enable CORS for Postman web
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Hardcoded private key (verified as valid)
const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgHg3P1j/W4du6vnIq51kR6CnPzYCMm3AkM9nmGrtc3/pB31NqQ5e
5v/Q2RQLWkYXQQA9xhpMCX+PbpzzxQRdWLhom39HhZHgbPUELoMtjPPfGf8dobIJ
KUKmbOdb4BsZuhsQVmXnRs8FQiqPo7X5vMH0lFvgEVymKZXZs+J6beg9AgMBAAEC
gYBxEUV7p3GnCCPpm1wOROs5pxRE7/wOTjflW0J4D626eKqaqBiBc7FAmmYR/DuE
AQsZ9wAEa8/jMjyPUpfTaxitxb1rr1pxCnijodPf2RkS4pAnEZ41FzIWP8X9g3Yo
68u9+etwDkgNwIuCkfZJ96Me3keMAcRl5WPdZ4bY93ET4QJBAN985X21TqRZajvz
CNfVUHg7IAhgBcByxveNy5hMLMNi3eEioAcGu8Uhr8aeYNO5LhoE/AW+1r7HCyBz
qhQLa3cCQQCJtE62e/f+EjiSpGVh37l7Qhu2LWk2k0ZqV/WukHUXKQxz5/HkZyob
X+TANmxQp2rIF+ugLTZr+rOcGD+VbE7rAkBa31YRP1+yxAjGR5QY7svBl4j23tR3
5DOzBRz72D17VQATQxj+wmYnSgNHJ68HaAyu18gCLg7zk8uabm2BqQMRAkAUC485
uSoMbhKWJiAr8ylI7AKkrk+WhjHF4S/+TUD+MheB982adfoHKhpecI2r3/MHVZQT
KQG3DjN/EXiQA8gpAkBwW+CkAcKD1eAovnhU0VkilN1LZ1ErFEgLC7bkL/c4mEJe
SVR6NTzVVvWQYy7n6O70lszdRBqzeJep6oDzlMi4
-----END RSA PRIVATE KEY-----`;

// Endpoint to generate RSA-SHA256 signature
app.post('/generate-signature', (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        console.log('Parsed body:', body);
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        console.log('Private key parsed successfully');
        const md = forge.md.sha256.create();
        md.update(body, 'utf8');
        console.log('SHA256 hash created');
        const signature = privateKey.sign(md);
        console.log('Signature generated');
        const signatureBase64 = forge.util.encode64(signature);
        console.log('Signature Base64:', signatureBase64);
        res.json({ signature: signatureBase64 });
    } catch (error) {
        console.error('Error generating signature:', error.stack);
        res.status(500).json({ error: 'Failed to generate signature', details: error.message });
    }
});

// Export for Vercel serverless
module.exports = app;