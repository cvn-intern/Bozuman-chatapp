const { Database } = require('../configs/db.config');

class AuthModel extends Database {

  constructor() {
    super();
  }

  public register = () => {
    
    return {message: "register complete"};
  }

}

module.exports = {AuthModel};