import CryptoJS from 'crypto-js'
// 加密工具类, todo: 该工具类需要重构
const keyStr = '-mall4j-password' // 解密用的key


export function encrypt(word) {
  const time = Date.now()

  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Utf8.parse(time + word) // 加密方式: 时间戳 + 密文
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}


const aes = "test1234test1234";
const key = CryptoJS.enc.Utf8.parse(aes);
const iv = CryptoJS.enc.Utf8.parse(aes);
const MOD = {
  iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
};

export function decrypt2(data = "") {
  if (!data) return "";
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const raw = CryptoJS.AES.decrypt(srcs, key, MOD);
  const rawStr = raw.toString(CryptoJS.enc.Utf8);
  if (rawStr.startsWith("{")) {
    return JSON.parse(rawStr);
  } else {
    return rawStr;
  }
}

export function encrypt2(raw = "") {
  if (!raw) return "";
  let encrypted = "";
  let e = raw;
  if (typeof raw === "string") {
    const srcs = CryptoJS.enc.Utf8.parse(e);
    encrypted = CryptoJS.AES.encrypt(srcs, key, MOD);
  } else if (typeof raw === "object") {
    e = JSON.stringify(raw);
  }
  const srcs = CryptoJS.enc.Utf8.parse(e);
  encrypted = CryptoJS.AES.encrypt(srcs, key, MOD);
  return encrypted.ciphertext.toString();
}
