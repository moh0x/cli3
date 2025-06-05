const {User} = require('../model/auth_user')
const httpStatus = require('../constant/httpStatus')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const { Admin } = require('../model/admin_model')
const { Client } = require('../model/client_model')
const { Voyage } = require('../model/voyage_model')
const { Mard } = require('../model/marad_model')
const { Analyse } = require('../model/analyse_model')
const changeUserStates =  async(req,res)=>{
  try {
    const token = req.headers.token;
       const user = await User.findOne({token:token})
       console.log(user);
     if (!user) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(user.id,{
      $set:{
        status:user.status =='online'?'offline': 'online'
      }
     })
     await user.save();
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user});

  } catch (error) {

    res.status(500).json({ error: "Internal Server Error" });
  }
}
const ban =  async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    const{_id,banned}=req.body;
    console.log(_id);
    
       const user = await User.findOne({_id:_id})
       console.log(user);
       
     if (!user) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(user.id,{
      $set:{
        isBanned:true,
        banned:banned
      }
     })
     await user.save();
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const disBan =  async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    const{_id}=req.body;
  
       const user = await User.findOne({_id:_id})
       console.log(user);
       
     if (!user) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(user.id,{
      $set:{
        isBanned:false
      }
     })
     await user.save();
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const signUp =async(req,res)=>{
    try {
        const valid = validationResult(req)
        if (!valid.isEmpty()) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
        }
        const {username,email,password,role} = req.body      
        const user = await User.findOne({email:email});
        if (user) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"user already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword =await bcrypt.hash(password,salt)
        const token = jwt.sign({email:email,username:username},"token")
        const newUser = new User({
          username:username,
            email:email,
            password:hashPassword,
            token:token,
            role:role
           
        })
        await newUser.save()  
              res.status(200).json({"status":httpStatus.SUCCESS,"data":newUser})     
    } catch (error) {
        console.log(error);
          res.status(400).json({"status":httpStatus.ERROR,"message":"error"})  
    }
}
const login =async(req,res)=>{
  try {
    const{email,password} = req.body
  const user = await User.findOne({email : email},{__v:false});
 const valid = validationResult (req);

if (valid.isEmpty()) {
if (user) {
   
 const passwordMatch = await bcrypt.compare(password,user.password);
    if (passwordMatch == true) {
            const userRet = await User.findOne({email : email},{__v:false,password:false});
            res.status(200).json({"status":httpStatus.SUCCESS,"data":userRet});
        
    } else {
        res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"password not match"});
    }
   } else {
    res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this email"});
   }
} else {
res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
 } catch (error) {
  console.log(error);
  
    res.status(400).json({"status":httpStatus.ERROR,"data":null,"message":"error"});
 }

}

const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const updateProfile =  async (req, res) => {
	try {
		const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
    const{logtitude,latitude,isOnline,status,email,isAssurance,city,fullname,date,matricule,baladiya,onwan} = req.body
  await User.findByIdAndUpdate(user._id,{ 
    $set:{
      logtitude:logtitude,
      latitude:latitude,
      isOnline:isOnline ?? user.isOnline,
      status:status ?? user.status,
      email:email ?? user.email,
      isAssurance:isAssurance ?? user.isAssurance,
      city:city ?? user.city,
      fullname:fullname ?? user.fullname,
	    date:date ??user.date,
	    matricule:matricule ??user.matricule,
      baladiya:baladiya ?? user.baladiya,
      onwan:onwan ?? user.onwan
    }
  })
  await user.save()
  res.status(200).json({"status":httpStatus.SUCCESS,"data":user})  
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const userInfo = async (req,res)=>{
  try {
    const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user})
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const updateNotificationToken =  async (req, res) => {
	try {
		const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
    const{tokenNotificatin} = req.body
  await User.findByIdAndUpdate(user._id,{ 
    $set:{
      tokenNotificatin:tokenNotificatin
    }
  })
  res.status(200).json({"status":httpStatus.SUCCESS,"data":user})  
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const deleteUser = async (req,res)=>{
  try {
    const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
       await User.findByIdAndDelete(user._id); 
       res.status(200).json({"status":httpStatus.SUCCESS,"data":null });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const getInActiveUsers = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    
       const inActiveUsers = await User.find({isVerified:false}).sort({createdAt:-1})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":inActiveUsers});
      
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const activeUser = async(req,res)=>{
  try {
    const _id=req.body._id;
       const inActiveUser = await User.findOne({_id:_id})
       console.log(inActiveUser);
       
     if (!inActiveUser) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(inActiveUser.id,{
      $set:{
        isVerified:true,
        isBanned:false,
        banned:null
      }
     })
     await inActiveUser.save();
       const retUser = await User.findOne({_id:_id})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":retUser});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const getActiveUsers = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    
       const activeUsers = await User.find({isVerified:true}).sort({createdAt:-1})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":activeUsers});
      
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const inActiveUser = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    const{_id}=req.body._id;
       const activeUser = await User.findOne({id:_id})
     if (!activeUser) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(activeUser.id,{
      $set:{
        isVerified:false
      }
     })
     await activeUser.save();
       const retUser = await User.findOne({id:_id})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":retUser});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const addClient = async (req,res) => {
  try {
    const token = req.headers.token;
  const {email,password,username,userWork,userWorkName,nif,phoneNumber,numberOfNif,typeOfProduit,quntityPaid,quntityDisponible,tax,img,longitutude,latitude,notes} = req.body;
  const eng = await User.findOne({token:token})
  if (eng.role != "eng") {
    return   res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
    const tokenCli = jwt.sign({email:email,username:username},"token")
  const client = new Client({
    token:tokenCli,
    email:email,
    password:password,
    username:username ,
    userWork:userWork  ,
    userWorkName:userWorkName,
    nif:nif,
    phoneNumber:phoneNumber,
    numberOfNif:numberOfNif,
    typeOfProduit:typeOfProduit,
    quntityPaid:quntityPaid,
    quntityDisponible:quntityDisponible,
    tax:tax,
    img:img,
    longitutude:longitutude,
    latitude:latitude,
    notes:notes});
 const clientRet =  await client.save();
   res.status(200).json({"status":httpStatus.SUCCESS,"data":clientRet});
  } catch (error) {
     console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const addVoyage = async (req,res) => {
  try {
    const token = req.headers.token;
  const {username,voyageType,address,img,notes,longitutude,latitude} = req.body;
  const eng = await User.findOne({token:token})
  if (eng.role != "eng") {
    return   res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
  const voyage = new Voyage({
    username:username ,
    voyageType:voyageType,
        address:address,
        latitude:latitude,
    img:img,
    longitutude:longitutude,
    notes:notes});
 const voyageRet =  await voyage.save();
   res.status(200).json({"status":httpStatus.SUCCESS,"data":voyageRet});
  } catch (error) {
     console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const clientInfo = async (req,res)=>{
  try {
    const token = req.headers.token;
    const user = await Client.findOne({token:token},{password:false})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user})
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const addMarad = async (req,res) => {
  try {
    const token = req.headers.token;
  const {address,longtitude,latitude,notes,typeName} = req.body;
  const client = await Client.findOne({token:token})
  if (!client) {
    return   res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
  const mard = new Mard({
    username:client.username ,
    typeName:typeName,
    userId:client._id,
    longtitude:longtitude,
    latitude:latitude,
    address:address,
    notes:notes});
 const mardRet =  await mard.save();
   res.status(200).json({"status":httpStatus.SUCCESS,"data":mardRet});
  } catch (error) {
     console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const addAnalyse = async (req,res) => {
  try {
    const token = req.headers.token;
  const {address,longtitude,latitude,notes,typeName} = req.body;
  const client = await Client.findOne({token:token})
  if (!client) {
    return   res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
  const analyse = new Analyse({
    username:client.username ,
    typeName:typeName,
    userId:client._id,
    longtitude:longtitude,
    latitude:latitude,
    address:address,
    notes:notes});
 const analyseRet =  await analyse.save();
   res.status(200).json({"status":httpStatus.SUCCESS,"data":analyseRet});
  } catch (error) {
     console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const mardClient = async (req,res) => {
  try {
    const token = req.headers.token;
  const client = await Client.findOne({token:token})
  if (!client) {
    return   res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
  const mards = await Mard.find({userId:client._id})
   res.status(200).json({"status":httpStatus.SUCCESS,"data":mards});
  } catch (error) {
     console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const analyseClient = async (req,res) => {
  try {
    const token = req.headers.token;
  const client = await Client.findOne({token:token})
  if (!client) {
    return   res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
  const analyses = await Analyse.find({userId:client._id})
   res.status(200).json({"status":httpStatus.SUCCESS,"data":analyses});
  } catch (error) {
     console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const voyagesClient = async (req,res) => {
  try {
    const token = req.headers.token;
  const client = await Client.findOne({token:token})
  if (!client) {
    return   res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
  const voyages = await Voyage.find({username:client.username})
   res.status(200).json({"status":httpStatus.SUCCESS,"data":voyages});
  } catch (error) {
     console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const loginClient = async (req,res) => {
  try {
    const {email,password} = req.body
  const client = await Client.findOne({email:email,password:password});

  if (!client) {
    return   res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
    const tokenCli = jwt.sign({email:email,username:username},"token")
  await Client.findByIdAndUpdate(client._id,{$set:{
    token:tokenCli
  }})
  await client.save();
  const cliRet = await Client.findOne({email:email,password:password});
     res.status(200).json({"status":httpStatus.SUCCESS,"data":cliRet});
  } catch (error) {
     console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {signUp,login,logout,updateProfile,userInfo,updateNotificationToken,deleteUser,getInActiveUsers,activeUser,getActiveUsers,inActiveUser,ban,disBan,changeUserStates,addClient,addVoyage,clientInfo,addMarad,addAnalyse,mardClient,analyseClient,voyagesClient,loginClient}
