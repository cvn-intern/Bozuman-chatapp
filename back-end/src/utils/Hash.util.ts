import crypto from 'crypto';
class Hash {
  private key: Buffer;
  private iv: Buffer;

  constructor() {
    this.iv = crypto.randomBytes(16);
    const salt = 'foobar';
    const hash = crypto.createHash('sha1');

    hash.update(salt);

    // `hash.digest()` returns a Buffer by default when no encoding is given
    this.key = hash.digest().slice(0, 16);
  }

  public encode = (data: string) => {
    const mykey = crypto.createCipheriv('aes-128-cbc', this.key, this.iv);
    let mystr = mykey.update(data, 'utf8', 'hex');
    mystr += mykey.final('hex');
    return mystr;
  };

  public decode = (data: string) => {
    const mykey = crypto.createDecipheriv('aes-128-cbc', this.key, this.iv);
    let mystr = mykey.update(data, 'hex', 'utf8');
    mystr += mykey.final('utf8');
    return mystr;
  };
}

export const HashClass = new Hash();
