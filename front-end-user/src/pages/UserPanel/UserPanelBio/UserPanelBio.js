import React, { useContext } from "react";
import * as Yup from 'yup';
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";
import { useFormik } from "formik";

import "./UserPanelBio.css"


const validationSchemaForEditBio = Yup.object().shape({
    bio: Yup
      .string()
      .transform(value => value.trim())
      .min(5, "بیوگرافی حداقل باید 5 کاراکتر باشد")
      .max(15, "بیوگرافی حداکثر باید 15 کاراکتر باشد")
      .required("بیوگرافی الزامی است"),
});


function UserPanelBio() {
  
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const authContext = useContext(AuthContext);

    const form = useFormik({

        initialValues: {
            bio: authContext.userInfos.bio,
        },

        onSubmit: (values, { setSubmitting }) => {

        editBioHandler(values);

        setTimeout(() => {
            setSubmitting(false);
        }, 500);

        },

        validationSchema: validationSchemaForEditBio,

    });

    const editBioHandler = (values) => {

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
            bio: values.bio,
        };

        fetch("http://localhost:4000/users/update-bio", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${loggedInUser.token}`,
            },
            body: JSON.stringify(editedUser)
        })
        .then((res) => {
            if (!res.ok) throw new Error('Failed to update bio!');
            return res.json();
        })
        .then((result) => {
            // console.log(result);
            authContext.setUserInfos(result.data)
        })
        swal({
            title: "ویرایش بیوگرافی با موفقیت انجام شد",
            icon: "success",
            buttons: "باشه",
        })
        .catch((err) => {
            swal({
            title: "خطایی در ویرایش بیوگرافی رخ داده است",
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
                            <label className="edit__label">بیوگرافی *</label>

                            {/* <input
                                className="edit__input"
                                type="text"
                                name="bio"
                                value={form.values.bio}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                            /> */}

                            <textarea
                                className="edit__input bio"
                                name="bio"
                                // value={form.values.bio}
                                value={form.values.bio ? form.values.bio : ""}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                rows="4"
                                placeholder="بیوگرافی خود را بنویسید ... "
                            />

                        </div>
                    </div>
                </div>
                <div className="error-message">
                    {form.errors.bio && form.touched.bio && form.errors.bio}
                </div>

                <button className="edit__btn" type="submit">
                    {form.isSubmitting ? "در حال ارسال ..." : "ذخیره تغییرات"}
                </button>

            </form>
        </div>
    );

}

export default UserPanelBio;
