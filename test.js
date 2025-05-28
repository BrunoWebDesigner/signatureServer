const forge = require('node-forge');
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

try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update('{"user":"test"}', 'utf8');
    const signature = privateKey.sign(md);
    const signatureBase64 = forge.util.encode64(signature);
    console.log('Signature:', signatureBase64);
} catch (error) {
    console.error('Error:', error.message);
}