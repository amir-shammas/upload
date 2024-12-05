import React, { useContext } from "react";
import * as Yup from 'yup';
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";
import { useFormik } from "formik";

import "./UserPanelEditAccount.css";


const validationSchemaForEditUser = Yup.object().shape({
  name: Yup
    .string()
    .transform(value => value.trim())
    .min(3, "نام حداقل باید 3 کاراکتر باشد")
    .max(6, "نام حداکثر باید 6 کاراکتر باشد")
    .required("نام و نام خانوادگی الزامی است"),
  username: Yup
    .string()
    .transform(value => value.trim())
    .min(4, "نام کاربری حداقل باید 4 کاراکتر باشد")
    .max(7, "نام کاربری حداکثر باید 7 کاراکتر باشد")
    .required("نام کاربری الزامی است"),
  email: Yup
    .string()
    .transform(value => value.trim())
    .email("ایمیل وارد شده معتبر نمی‌باشد")
    .min(10, "ایمیل حداقل باید 10 کاراکتر باشد")
    .max(15, "ایمیل حداکثر باید 15 کاراکتر باشد")
    .required("ایمیل الزامی است"),
});


function UserPanelEditAccount() {

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  const authContext = useContext(AuthContext);

  const form = useFormik({

    initialValues: {
      name: authContext.userInfos.name,
      username: authContext.userInfos.username,
      email: authContext.userInfos.email,
    },

    onSubmit: (values, { setSubmitting }) => {

      editUserHandler(values);

      setTimeout(() => {
        setSubmitting(false);
      }, 500);

    },

    validationSchema: validationSchemaForEditUser,

  });

  const editUserHandler = (values) => {

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
      name: values.name,
      username: values.username,
      email: values.email,
    };

    fetch("http://localhost:4000/users/update-user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify(editedUser)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update user!');
        return res.json();
      })
      .then((result) => {
        // console.log(result);
        authContext.setUserInfos(result.data)
      })
      swal({
        title: "ویرایش کاربر با موفقیت انجام شد",
        icon: "success",
        buttons: "باشه",
      })
      .catch((err) => {
        swal({
          title: "خطایی در ویرایش کاربر رخ داده است",
          icon: "error",
          buttons: "تلاش دوباره",
        });
      });
  }


  return (
    <div className="edit">
      <form className="edit__form" onSubmit={form.handleSubmit}>
        <div className="edit__personal">
          <div className="row">

            <div className="col-12">
              <label className="edit__label">نام و نام خانوادگی *</label>
              <input
                className="edit__input"
                type="text"
                name="name"
                value={form.values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </div>
            <div className="error-message">
              {form.errors.name && form.touched.name && form.errors.name}
            </div>

            <div className="col-12">
              <label className="edit__label">نام کاربری *</label>
              <input
                className="edit__input"
                type="text"
                name="username"
                value={form.values.username}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </div>
            <div className="error-message">
              {form.errors.username && form.touched.username && form.errors.username}
            </div>

            <div className="col-12">
              <label className="edit__label">ایمیل *</label>
              <input
                className="edit__input"
                type="text"
                name="email"
                value={form.values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </div>
            <div className="error-message">
              {form.errors.email && form.touched.email && form.errors.email}
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

export default UserPanelEditAccount;
