import forge from 'node-forge';

const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQB5TchgnQUGkrFx365ubzkHbh+4qrR/p6WlOgTH9n6m7t/1vFH8
dK7N/UP6c4g9q7syFIG5mBZZGxeI61cVAAubKJ+EgAs6iGXl2m+xLlP3vhLjuJxg
gQqGI5tWMPg2vAMmoHZhQLb6Sq141bg5uXwfeQym7eWNphbYLivdwSgel0v+tqlu
nvOD7HbYB9iazKaxCrTDNIbYHzNxJOIJmTxRdVpZ1yEMcYkUtrYax2H8R5h7spYu
/AkccUAsxedH55GivXzXDWuLLwE61Be0ozIkEX8JKiYOMLDBIIOYJGdRQEXQVkDA
VqpZ2FPDbAjnB/LigYRICVnY0XbVkY/Fi0ajAgMBAAECggEAWcUKaRVKxtaAovka
KXf+CFWi/BK4iVAT8fbB2wm8KOXWsBCxy9a+Fos7Z3lgdeNFIYazihnXUBIQlK81
PsFN1YF2q6Pmq2aNolDJH6JdWZY8fHH+qBxXIXXwWxTaXAc/fbJ6aPZvc0MYpbfk
IjP2e4QlrNOZcf5cIZfptq5fdmMR2x4xEDPgf8QCanUnxmzC1HcPBnzKI/UPctk9
WfvK4gKDbd64S5MtiBWwp23z7NaN+wxorqfE2PMtZZXua1MV+PvtGKxDBeo4KXJi
41aksHxxekRd7QLdBTbuyLmGaa1g71ocex2ZYCNwTCSmjjmJ2HPMShQr0IbBsWuI
IfYzwQKBgQDK47zr1TOBwYuaZlicoxkgSxvVKzy2zX4bzc814Hti2BV9rPU/zLTv
z57l3fTOAzLsSElTL4Vjmr7lMSS4C1z70aLybZnaKdSVbUFVD2uoycR4jPmR2vqQ
U+WwHl2CNwJZFKtwr2aVkI5V4LvAPtwfGgv4rFpjrvFAaxCGssCsuQKBgQCZDrrC
JavLWGhS4JMJO/qrqCfnRU9d2zZ5CN2JQ6Ztcs0CvaKSCl1kfYMbm0Up8qYxRSep
7kDvx5/Iyioa2v1PAIkUV7WBs+ECEaEjBNpB43KTYbQtf0di/y/eRDXp66q1U+D4
Mj5oyY8oLYfWYEIqNfc4TkzmpDxMKXJ66LM4OwKBgQDAcoy81hppNgEJj5L14O7w
Zs4bwUtxyjGYhfvKiwf+liCseOaYgcAOyM1cFNEkqHwhC+Ahe6328M2p8Jd3y6+D
XTJG6hdJjOwMYPnbiSkBjYFDJ9WCuEd7p1jzWZow7aTYgnasCHQx4lBgvS7aB8Yb
6kT4t+N1Mne8NtISMnP4YQKBgH0vIOzeJs6gNmNirqAk4Hc5h7mOZMWdH8aKy7cT
D7IA7VDKjYbo103zoiIYMs+GWQt/RlukNJRpL3TodNuWNQxCodtziU7WMrigdqzP
sTumrfWBOf7kVRzRHvOp0nbKe8rnGd+mKIlIIcB4zNs3y6X+kX8J+7fAqFiapbmF
TeA1AoGAKCpOkq9NiYU/mNBCZcVqaOZDLaQbxwjelIaGd5nw/Tn9Xdw07goAFbw2
mblWwETFT8f3xo/Pkjmp2n7CW9rmAA3eC252S/BkKKYqWHSjoNDnC7gvXep7US/H
5T/ysN0usAzrULMadB2V3zTj9j/0syJgGGUMDOskoMgg40MKJos=
-----END RSA PRIVATE KEY-----`;

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    let rawBody = '';

    req.on('data', chunk => {
      rawBody += chunk;
    });

    req.on('end', () => {
      try {
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const md = forge.md.sha256.create();
        md.update(rawBody, 'utf8');
        const signature = privateKey.sign(md);
        const signatureBase64 = forge.util.encode64(signature);

        return res.status(200).json({ signature: signatureBase64 });
      } catch (error) {
        return res.status(400).json({ error: 'Failed to sign body', details: error.message });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
}
