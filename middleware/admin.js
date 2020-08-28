const admin = (req,res,next) => {
	if(req.user.id !== process.env.CVHS_ADMIN_ID){
		res.status(401).send("Permission Denied");
	}else{
		next()
	}
}

module.exports = admin;