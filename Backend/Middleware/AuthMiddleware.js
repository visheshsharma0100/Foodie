import jwt from 'jsonwebtoken';
function AuthMiddleware(req,res,next){
    try{
    const token=req.headers.authorization?.split(" ")[1];
    // console.log(token);
    if (!token) {
        return res.status(401).json({
            message: "Token not found",
        });
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decoded);
    // console.log(process.env.JWT_SECRET);
     req.user=decoded;
     next();
    }
    catch(error){
        return res.status(401).json({
            message:"Invalid or expired token"
        });
    }
}

export default AuthMiddleware;