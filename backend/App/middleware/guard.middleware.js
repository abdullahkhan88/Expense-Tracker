import jwt from "jsonwebtoken";

const verifyTokenGuard = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization)
            return res.status(400).send({
                message: "Bad request"
            });
        const [type, token] = authorization.split(" ");
        if(type !== "Bearer")
            return res.status(400).send({message:"Bad request"});
        const payload = await jwt.verify(token,process.env.FORGOT_TOKEN_SECRET);
        req.user = payload;
        next();
    } catch (err) {
       return res.status(401).send({
            message: "Invalid or expire token"
        })
    }
};

const invalid = async (res) =>{
    res.cookie('AuthToken', null, {
        httpOnly:true,
        secure: process.env.ENVIRONMENT !== "DEV",
        sameSite: process.ENVIRONMENT === "DEV" ? "lax" : "none",
        path: "/",
        domain: undefined,
        maxAge:0
    });
    res.status(400).send({message:"Bad Request"})
}


const AdminUserGuard = async (req, res, next) => {
    const {AuthToken} = req.cookies;
    if(!AuthToken){
        return invalid(res); // function defined above side
    }
    const payload = await jwt.verify(AuthToken,process.env.AUTH_SECRET);
    if(payload.role !== "user" && payload.role !== "admin"){
        return invalid(res);
    }
    req.user = payload;
    next();
    
};


export {AdminUserGuard,verifyTokenGuard}
