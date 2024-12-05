import React, { useState , useContext } from "react";
import * as Yup from 'yup';
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";
import { useFormik } from "formik";

import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';

import "./UserPanelChangePassword.css";


const validationSchemaForChangeUserPassword = Yup.object().shape({
  currentPassword: Yup
    .string()
    .transform(value => value.trim())
    .required("کلمه عبور فعلی الزامی است"),
  password: Yup
    .string()
    .transform(value => value.trim())
    .required("کلمه عبور جدید الزامی است")
    .min(8, "کلمه عبور حداقل باید 8 کاراکتر باشد")
    .max(10, "کلمه عبور حداکثر باید 10 کاراکتر باشد")
    .matches(/[a-z]/, "کلمه عبور حداقل باید شامل یک حرف کوچک باشد")
    .matches(/[A-Z]/, "کلمه عبور حداقل باید شامل یک حرف بزرگ باشد")
    .matches(/[0-9]/, "کلمه عبور حداقل باید شامل یک عدد باشد")
    .matches(/[^a-zA-Z0-9]/, "کلمه عبور حداقل باید شامل یک کاراکتر خاص باشد"),
  confirmPassword: Yup
    .string()
    .transform(value => value.trim())
    .required("تکرار کلمه عبور جدید الزامی است")
    .oneOf([Yup.ref('password'), null], "کلمه عبور و تکرار آن باید یکسان باشند"),
});


function UserPanelChangePassword() {

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  const authContext = useContext(AuthContext);

  const [passwordInputType, setPasswordInputType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);
  const [currentPasswordInputType, setCurrentPasswordInputType] = useState("password");
  const [currentPasswordIcon, setCurrentPasswordIcon] = useState(eyeOff);
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState("password");
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(eyeOff);
  
  // const [editedUserCurrentPassword, setEditedUserCurrentPassword] = useState("");
  // const [editedUserPassword, setEditedUserPassword] = useState("");
  // const [editedUserConfirmPassword, setEditedUserConfirmPassword] = useState("");

  // const [errorsForCurrentPassword, setErrorsForCurrentPassword] = useState({});
  // const [errorsForChangeUserPassword, setErrorsForChangeUserPassword] = useState({});
  // const [errorsForChangeUserConfirmPassword, setErrorsForChangeUserConfirmPassword] = useState({});

  const passwordInputHandler = () => {
    if(passwordInputType === "password"){
      setPasswordInputType("text");
      setPasswordIcon(eye);
    }else{
      setPasswordInputType("password");
      setPasswordIcon(eyeOff);
    }
  }

  const currentPasswordInputHandler = () => {
    if(currentPasswordInputType === "password"){
      setCurrentPasswordInputType("text");
      setCurrentPasswordIcon(eye);
    }else{
      setCurrentPasswordInputType("password");
      setCurrentPasswordIcon(eyeOff);
    }
  }

  const confirmPasswordInputHandler = () => {
    if(confirmPasswordInputType === "password"){
      setConfirmPasswordInputType("text");
      setConfirmPasswordIcon(eye);
    }else{
      setConfirmPasswordInputType("password");
      setConfirmPasswordIcon(eyeOff);
    }
  }

  // const validateInputsForChangeUserPassword = async () => {
  //   try {
  //     await validationSchemaForChangeUserPassword.validate({
  //       currentPassword: editedUserCurrentPassword,
  //       password: editedUserPassword,
  //       confirmPassword: editedUserConfirmPassword,
  //     });
  //     setErrorsForCurrentPassword({}); // Clear errors if validation passes
  //     setErrorsForChangeUserPassword({}); // Clear errors if validation passes
  //     setErrorsForChangeUserConfirmPassword({}); // Clear errors if validation passes
  //     return true; // Validation passed
  //   } catch (err) {
  //     setErrorsForCurrentPassword({
  //       currentPassword: err.path === 'currentPassword' ? err.message : undefined,
  //     });
  //     setErrorsForChangeUserPassword({
  //       password: err.path === 'password' ? err.message : undefined,
  //     });
  //     setErrorsForChangeUserConfirmPassword({
  //       confirmPassword: err.path === 'confirmPassword' ? err.message : undefined,
  //     });
  //     return false; // Validation failed
  //   }
  // }

  const form = useFormik({

    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },

    onSubmit: (values, { setSubmitting }) => {

      changeUserPasswordHandler(values);

      setTimeout(() => {
        setSubmitting(false);
      }, 500);

    },

    validationSchema: validationSchemaForChangeUserPassword,

  });

  const changeUserPasswordHandler = (values) => {

    try{

      if(authContext.userInfos.isBan){
        swal({
          title: "دسترسی شما محدود شده است",
          icon: "error",
          buttons: "متوجه شدم",
        });
        return;
      }

      if(!authContext.userInfos.isEmailVerified){
        swal({
          title: "لطفا ابتدا ایمیل خود را تایید کنید",
          icon: "error",
          buttons: "متوجه شدم",
        });
        return;
      }

      const editedUser = {
        currentPassword: values.currentPassword,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      fetch("http://localhost:4000/users/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify(editedUser)
      })
        .then((res) => {
          if(res.status===452){
            swal({
              title: "رمز عبور فعلی نادرست است",
              icon: "error",
              buttons: "متوجه شدم",
            });
            throw new Error('current password is not correct !');
          }
          else{
            if (!res.ok) throw new Error('Failed to change user password !');
            return res.json()
            .then((result) => {
              // console.log(result);
              authContext.setUserInfos(result.data)
            })
            .then(() => {
                swal({
                  title: "تغییر رمز عبور کاربر با موفقیت انجام شد",
                  icon: "success",
                  buttons: "باشه",
                })
              })
            // .then(() => {
            //   setEditedUserCurrentPassword("");
            //   setEditedUserPassword("");
            //   setEditedUserConfirmPassword("");
            // })
          }
        })

    }catch(error){
      swal({
        title: "خطایی در تغییر رمز عبور کاربر رخ داده است",
        icon: "error",
        buttons: "تلاش دوباره",
      });
    }

  }


  return (
    <div className="edit">
      <form className="edit__form" onSubmit={form.handleSubmit}>
        <div className="edit__personal">
          <div className="row">

            <div className="col-12 ">
              <label className="edit__label">رمز عبور فعلی *</label>
              <div className="user-panel__password">
                <input
                  className="edit__input"
                  type={currentPasswordInputType}
                  name="currentPassword"
                  value={form.values.currentPassword}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <span className="user-panel__password-icon" onClick={currentPasswordInputHandler} ><Icon icon={currentPasswordIcon} size={25} /></span>
              </div>
              <div className="error-message">
                {form.errors.currentPassword && form.touched.currentPassword && form.errors.currentPassword}
              </div>
            </div>

            <div className="col-12">
              <label className="edit__label">رمز عبور جدید *</label>
              <div className="user-panel__password">
                <input
                  className="edit__input"
                  type={passwordInputType}
                  name="password"
                  value={form.values.password}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <span className="user-panel__password-icon" onClick={passwordInputHandler} ><Icon icon={passwordIcon} size={25} /></span>
            </div>
            <div className="error-message">
              {form.errors.password && form.touched.password && form.errors.password}
            </div>
            </div>

            <div className="col-12">
              <label className="edit__label">تکرار رمز عبور جدید *</label>
              <div className="user-panel__password">
                <input
                  className="edit__input"
                  type={confirmPasswordInputType}
                  name="confirmPassword"
                  value={form.values.confirmPassword}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <span className="user-panel__password-icon" onClick={confirmPasswordInputHandler} ><Icon icon={confirmPasswordIcon} size={25} /></span>
              </div>
              <div className="error-message">
                {form.errors.confirmPassword && form.touched.confirmPassword && form.errors.confirmPassword}
              </div>
            </div>

          </div>
        </div>

        <button className="edit__btn" type="submit">
          {form.isSubmitting ? "در حال ارسال ..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );

}

export default UserPanelChangePassword;
