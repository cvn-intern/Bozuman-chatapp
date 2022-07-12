import express from 'express';

class Auth {

  public async register (req: express.Request, res: express.Response) {
    res.json({message: "login success"});
  }

}
export {Auth};