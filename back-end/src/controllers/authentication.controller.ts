async function login (req: any, res: any, next: any) {
    // Call database
    
    res.json({message: "login success"});
}

export {login};