import React , { useContext , useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";

import "./UserPanelResume.css"


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


const UserPanelResume = () => {

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

    if(authContext.userInfos.isBan){
        return swal({
            title: "دسترسی شما محدود شده است",
            icon: "error",
            buttons: "متوجه شدم",
        });
    }

    if(!authContext.userInfos.isEmailVerified){
        return swal({
            title: "لطفا ابتدا ایمیل خود را تایید کنید",
            icon: "error",
            buttons: "متوجه شدم",
        });
    }

    const formData = new FormData();

    formData.append("file", values.file);

    setLoading(true);

    try {
        await fetch("http://localhost:4000/users/upload-resume", {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${loggedInUser.token}`,
            },
            body: formData,
        })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to upload resume !');
          return res.json();
        })
        .then((result) => {
            // console.log(result);
            authContext.setUserInfos(result.data)
        })
        .then(() => {
          swal({
            title: "آپلود رزومه با موفقیت انجام شد",
            icon: "success",
            buttons: "باشه",
        });
        })
    } catch (error) {
        console.log(error);
        swal({
            title: "خطایی در آپلود رزومه رخ داده است",
            icon: "error",
            buttons: "تلاش دوباره",
        });
    } finally {
        setLoading(false);
    }
  }


  const downloadResumeHandler = async () => {
    if(authContext.userInfos.isBan){
      return swal({
          title: "دسترسی شما محدود شده است",
          icon: "warning",
          buttons: "متوجه شدم",
      });
    }

    if(!authContext.userInfos.isEmailVerified){
        return swal({
            title: "لطفا ابتدا ایمیل خود را تایید کنید",
            icon: "warning",
            buttons: "متوجه شدم",
        });
    }

    if(!authContext.userInfos.resumeName){
      return swal({
          title: "هنوز رزومه ای آپلود نشده است",
          icon: "warning",
          buttons: "متوجه شدم",
      });
    }

    try {
      const response = await fetch("http://localhost:4000/users/download-resume", {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${loggedInUser.token}`,
          },
      });

      // Check if the response is okay
      if (!response.ok) {
          throw new Error('Failed to download resume!');
      }

      // Handle the response as a blob for file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${authContext.userInfos.username}_resume.pdf`; // Specify the filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Show success message
      swal({
          title: "دانلود رزومه با موفقیت انجام شد",
          icon: "success",
          buttons: "باشه",
      });
    } catch (error) {
        console.error(error);
        swal({
            title: "خطایی در دانلود رزومه رخ داده است",
            icon: "error",
            buttons: "تلاش دوباره",
        });
    };

  };


  return (
    <div className="edit">
        <form className="edit__form" onSubmit={form.handleSubmit}>

            <div className="edit__personal">
                <div className="row">

                    <div className="col-12">
                        <label className="edit__label">فایل رزومه جدید را انتخاب کنید : </label>
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
                {loading ? "در حال آپلود ..." : "آپلود رزومه جدید"}
            </button>

        </form>

        <button className="edit__btn" onClick={downloadResumeHandler}>دانلود رزومه فعلی</button>

    </div>
    );  

};

export default UserPanelResume;
