import React , { useContext , useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";

import "./UserPanelUploadResume.css"


const validationSchemaForUploadResume = Yup.object().shape({
  file: Yup
    .mixed()
    .required("لطفا یک فایل انتخاب کنید")
    .test("fileSize", "حجم فایل نباید بیشتر از 3 مگابایت باشد", value => {
      return value && value.size <= 3000000;
    })
    .test("fileType", "فرمت فایل باید pdf باشد", value => {
      return value && value.type === "application/pdf";
    }),
});


const UserPanelUploadResume = () => {

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  const authContext = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const form = useFormik({

    initialValues: { file: null },

    onSubmit: (values, { setSubmitting }) => {

      uploadResumeHandler(values);

      setTimeout(() => {
        setSubmitting(false);
      }, 500);

    },

    validationSchema: validationSchemaForUploadResume,

  });


    const uploadResumeHandler = async (values)=> {

      console.log(values);

      // if(authContext.userInfos.isBan){
      //     return swal({
      //         title: "دسترسی شما محدود شده است",
      //         icon: "error",
      //         buttons: "متوجه شدم",
      //     });
      // }

      // if(!authContext.userInfos.isEmailVerified){
      //     return swal({
      //         title: "لطفا ابتدا ایمیل خود را تایید کنید",
      //         icon: "error",
      //         buttons: "متوجه شدم",
      //     });
      // }

      // const formData = new FormData();

      // formData.append("file", values.file);

      // setLoading(true);

      // try {
      //     await fetch("http://localhost:4000/users/update-avatar", {
      //         method: "PATCH",
      //         headers: {
      //             "Authorization": `Bearer ${loggedInUser.token}`,
      //         },
      //         body: formData,
      //     })
      //     .then((res) => {
      //       if (!res.ok) throw new Error('Failed to update user avatar !');
      //       return res.json();
      //     })
      //     .then((result) => {
      //         // console.log(result);
      //         authContext.setUserInfos(result.data)
      //     })
      //     .then(() => {
      //       swal({
      //         title: "ویرایش عکس پروفایل کاربر با موفقیت انجام شد",
      //         icon: "success",
      //         buttons: "باشه",
      //     });
      //     })
      // } catch (error) {
      //     console.log(error);
      //     swal({
      //         title: "خطایی در ویرایش عکس پروفایل کاربر رخ داده است",
      //         icon: "error",
      //         buttons: "تلاش دوباره",
      //     });
      // } finally {
      //     setLoading(false);
      // }
  }


  return (
    <div className="edit">
        <form className="edit__form" onSubmit={form.handleSubmit}>

            <div className="edit__personal">
                <div className="row">

                    <div className="col-12">
                        <label className="edit__label">فایل رزومه *</label>
                        <input
                            className="edit__input"
                            type="file"
                            name="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              form.setFieldValue("file", e.currentTarget.files[0]);
                            }}
                            onBlur={form.handleBlur}
                        />
                    </div>

                    <div className="error-message">
                      {form.errors.file && form.touched.file && form.errors.file}
                    </div>

                </div>
            </div>

            <button className="edit__btn" type="submit" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm"></span>}
                {loading ? "در حال بارگزاری..." : "ذخیره رزومه"}
            </button>

        </form>
    </div>
    );  

};

export default UserPanelUploadResume;
