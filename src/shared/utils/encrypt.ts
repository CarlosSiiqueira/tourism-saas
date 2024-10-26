import * as crypto from 'crypto';

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
};

function sha512(password: string, salt: string) {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);

  const hashPassword = hash.digest('hex');

  return {
    salt,
    hashPassword,
  };
};

export function generatePassword(password: string) {
  const salt = generateSalt();
  const passwordESalt = sha512(password, salt);

  return {
    salt: passwordESalt.salt,
    password: passwordESalt.hashPassword
  }
}

export function verifyPassword(loginPassword: string, saltDatabase: string, hashDatabase: string) {
  const passwordESalt = sha512(loginPassword, saltDatabase);
  return hashDatabase === passwordESalt.hashPassword
}