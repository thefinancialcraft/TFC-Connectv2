const SECRET_KEY = 'TfcV2_Secure_9Xk2Lp5Nm8Qj4Rs7Vw1Zy3Bd6G';

function decryptPhone(phone) {
  if (!phone) return "";
  if (phone.startsWith("__enc__")) {
    try {
      const base64Data = phone.substring(7);
      const encrypted = Buffer.from(base64Data, 'base64').toString('binary');
      const decrypted = encrypted.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
      ).join('');
      return decrypted;
    } catch (e) {
      return phone;
    }
  }
  return phone;
}

const samples = [
  "__enc__bFNTZQJnYlBQQA==",
  "__enc__bVFabwFqYFRUTA==",
  "__enc__Y1RVZQprZVBRRA==",
  "__enc__Y1ZQYgptalRSRg=="
];

samples.forEach(s => console.log(s, '->', decryptPhone(s)));
