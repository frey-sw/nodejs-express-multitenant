const crypto = require("crypto");

// AES encryption
const algorithm = "aes-256-cbc";
let secretKey = crypto
  .createHash("sha256")
  .update(String(process.env.tenant_secret))
  .digest("base64")
  .substr(0, 32);

// Cipher function
function encrypt(message) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

// Decrypt function
function decrypt(hash) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
}

module.exports = {
  encrypt,
  decrypt,
};
