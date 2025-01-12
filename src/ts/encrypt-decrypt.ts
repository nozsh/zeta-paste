/*
  Copyright 2025 Zeta Paste Authors.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import CryptoJS from "crypto-js";
import LZString from "lz-string";

const KEY_SIZE_BITS = 256;
const IV_SIZE_BYTES = 128 / 8;
const KEY_SIZE_WORDS = KEY_SIZE_BITS / 32;

// Parse, validate and scale iterations value
export const parseIterations = (input: string): number => {
  const parsedValue = parseFloat(input.replace(",", ".").trim());

  // Check if value is valid
  if (isNaN(parsedValue) || parsedValue < 1) {
    throw new Error("Incorrect iterations value");
  }

  // Scale value (actual iterations count)
  return Math.round(parsedValue * 100000);
};

// Generate key using PBKDF2
const generateKey = (password: string, salt: string, iterations: number): CryptoJS.lib.WordArray => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE_WORDS, // 256-bit key size
    iterations: iterations, // Number of iterations
  });
};

// Encryption
export const encryptMessage = (message: string, password: string, iterations: number): string => {
  // Generate random salt
  const salt = CryptoJS.lib.WordArray.random(IV_SIZE_BYTES).toString();

  // Compress the message before encryption
  const compressedMessage = LZString.compressToUint8Array(message);

  // Convert Uint8Array to WordArray (for CryptoJS)
  const messageWordArray = CryptoJS.lib.WordArray.create(compressedMessage);

  // Generate key with user password, salt and iterations using PBKDF2
  const key = generateKey(password, salt, iterations);

  // Encrypt data using AES-256
  const iv = CryptoJS.lib.WordArray.random(IV_SIZE_BYTES); // Random IV
  const encrypted = CryptoJS.AES.encrypt(messageWordArray, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Return salt, IV, and encrypted data as string
  return salt + ":" + iv.toString() + ":" + encrypted.toString();
};

// Decryption
export const decryptMessage = (encryptedMessage: string, password: string, iterations: number): string => {
  // Split salt, IV, and encrypted data with ":"
  const [salt, iv, encrypted] = encryptedMessage.split(":");

  // Generate key (for decryption) with user password, salt and iterations using PBKDF2
  const key = generateKey(password, salt, iterations);

  // Decrypt data
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert WordArray to Uint8Array
  const decryptedArray = new Uint8Array(decrypted.sigBytes);
  for (let i = 0; i < decrypted.sigBytes; i++) {
    decryptedArray[i] = (decrypted.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  // Decompress the data
  return LZString.decompressFromUint8Array(decryptedArray);
};
