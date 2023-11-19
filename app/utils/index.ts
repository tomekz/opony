const md5 = require('md5')

export function getAuthKey (action: string, timestamp: string){
  const login = process.env.LOGIN

  if (!login) {
    throw new Error('LOGIN is not defined')
  }
  const last4Chars = login.slice(-4)

  return md5(login + timestamp + action + last4Chars)
}

export function checkSecret(secret: any) {
    console.log({secret, envSecret: process.env.SECRET});
    return secret === process.env.SECRET;
}
