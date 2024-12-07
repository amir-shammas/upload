const bcrypt = require("bcrypt");
const userModel = require("./../models/user.model");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailer");
const path = require("path");
const fs = require("fs");


exports.updateUser = async (req, res, next) => {

  try{

    const { name, username, email } = req.body;

    const id = String(req.user._id);

    await userModel.updateValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: id }
    });

    if (userExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        username,
        email,
      },
      { new: true }, // This option returns the updated document
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user updated successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.changeUserPassword = async (req, res, next) => {

  try{

    const { currentPassword, password, confirmPassword } = req.body;
    
    const id = String(req.user._id);

    const currentUser = await userModel.findById(id);

    if (!currentUser) {
      return res.status(401).json("There is no user with this id !");
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, String(currentUser.password));

    if (!isCurrentPasswordCorrect) {
      return res.status(452).json({ message: "current password is not correct !" });
    }

    await userModel.changePasswordValidation_ByUser({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }, // This option returns the updated document
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "password changed successfully !", data: user});

  }catch(error){
    next(error);
  }
};


exports.sendLinkForVerifyEmail = async (req, res, next) => {

  try{

    const token = jwt.sign({ id: String(req.user._id) }, process.env.JWT_SECRET, {
      expiresIn: "5 minutes",
    });

    const verifyEmailLink = `http://localhost:3000/my-account/verify-email/${token}`;

    sendEmail(
      String(req.user.email),
      String(req.user.username),
      "تایید ایمیل",
      `
        برای تایید ایمیل روی لینک زیر کلیک کنید
        <br>
        <a href="${verifyEmailLink}">لینک تایید ایمیل</a>
      `
    );

    return res.status(200).json({ message: "Reset link mailed successfully !" });
    // return res.status(200).json({ message: "verifyEmail link mailed successfully !" , token: token });

  }catch(error){
    next(error);
  }

};


exports.verifyEmail = async (req, res, next) => {

  try{

    const token = req.params.token;

    if (!token) {
      return res.status(401).json({
        message: "Token is required !",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({
        message: "Token is not verified !",
      });
    }

    const user = await userModel.findOne({ _id: decodedToken.id });

    if (!user) {
      return res.status(404).json("user not found !");
    }

    user.isEmailVerified = true;

    await user.save();

    res.status(200).json({ message: "email verified successfully !" });

  }catch(error){
    next(error);
  }

};


exports.uploadAvatar = async (req, res, next) => {
  
  const id = String(req.user._id);

  const user = await userModel.findById(id);

  let fileName = "";

  if(req.files === null){

    return res.json({ error: "عکسی انتخاب نکردید" });

  }else{

    const file = req.files.file;
    const fileSize = file.size;
    const ext = path.extname(file.name);
    let dateNow = Math.round(Date.now());
    fileName = dateNow + ext;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())){
      return res.json("jpeg jpg png عکس معتبر نیست * فرمت های مجاز ");
    }

    if(fileSize > 50000) return res.json("حجم عکس نباید بیشتر از 50 کیلوبایت باشد");
    
    if(user.avatarName){
      const filePath = `./public/images/avatars/${user.avatarName}`;
      fs.unlinkSync(filePath);
    }

    file.mv(`./public/images/avatars/${fileName}`, (err)=> {
      if(err) return res.json({msg: err.message})
    })
  
  }

  const url = `http://localhost:4000/images/avatars/${fileName}`

  try {

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        avatarName: fileName,
        avatarUrl: url,
      },
      { new: true }, // This option returns the updated document
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "avatar updated successfully !", data: user});

  } catch (error) {
      console.log(error);
      next(error);
  }
};


exports.downloadAvatar = async (req, res, next) => {

  const id = String(req.user._id);

  const user = await userModel.findById(id);

  if(!user.avatarName){
    return res.status(404).json("file not found !");
  }

  const filePath = `./public/images/avatars/${user.avatarName}`;

  try{

    await res.download(filePath, (err) => {

      if (err) {
          console.error('Error downloading file:', err);
          res.status(500).send('Error downloading file');
      }
    });

  }catch(error){
    console.log(error);
    next(error);
  }
  
};


exports.deleteAvatar = async (req, res, next) => {
  
  const id = String(req.user._id);

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).json("user not found !");
  }

  if(!user.avatarName){
    return res.json({ error: "عکسی انتخاب نکردید" });
  }

  const filePath = `./public/images/avatars/${user.avatarName}`;

  fs.unlinkSync(filePath);

  try {

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        avatarName: null,
        avatarUrl: null,
      },
      { new: true }, // This option returns the updated document
    );

    return res.status(200).json({status: 200, message: "avatar deleted successfully !", data: user});

  } catch (error) {
      console.log(error);
      next(error);
  }
};


exports.uploadResume = async (req, res, next) => {
  
  const id = String(req.user._id);

  const user = await userModel.findById(id);

  let fileName = "";

  if(req.files === null){

    return res.json({ error: "please select a file !" });

  }else{

    const file = req.files.file;
    const fileSize = file.size;
    const ext = path.extname(file.name);
    let dateNow = Math.round(Date.now());
    fileName = dateNow + ext;
    const allowedType = [".pdf"];

    if(!allowedType.includes(ext.toLowerCase())){
      return res.json("only pdf files are accepted !");
    }

    if(fileSize > 3000000) return res.json("file size must be lower than 3 MB !");
    
    if(user.resumeName){
      const filePath = `./public/resumes/${user.resumeName}`;
      fs.unlinkSync(filePath);
    }

    file.mv(`./public/resumes/${fileName}`, (err)=> {
      if(err) return res.json({msg: err.message})
    })
  
  }

  const url = `http://localhost:4000/resumes/${fileName}`

  try {

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        resumeName: fileName,
        resumeUrl: url,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "resume uploaded successfully !", data: user});

  } catch (error) {
      console.log(error);
      next(error);
  }
};


exports.downloadResume = async (req, res, next) => {

  const id = String(req.user._id);

  const user = await userModel.findById(id);

  if(!user.resumeName){
    return res.status(404).json("file not found !");
  }

  const filePath = `./public/resumes/${user.resumeName}`;

  try{

    await res.download(filePath, (err) => {

      if (err) {
          console.error('Error downloading file:', err);
          res.status(500).send('Error downloading file');
      }
    });

  }catch(error){
    console.log(error);
    next(error);
  }
  
};
