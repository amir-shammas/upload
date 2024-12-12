import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import AuthContext from "../../../context/authContext";
import Modal from "../../../Components/Modal/Modal";

import "./UserPanelAvatar.css";


const validationSchemaForUploadAvatar = Yup.object().shape({
  file: Yup.mixed()
    .required("لطفا یک عکس انتخاب کنید")
    .test("fileSize", "حجم عکس نباید بیشتر از 50 کیلوبایت باشد", (value) => {
      return value && value.size <= 50000;
    })
    .test(
      "fileType",
      "فرمت عکس باید یکی از این موارد باشد: jpg, jpeg, png",
      (value) => {
        return (
          value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
        );
      }
    ),
});


const UserPanelAvatar = () => {

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  const authContext = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(""); // State to store the current avatar URL

  const form = useFormik({

    initialValues: { file: null },

    onSubmit: (values, { setSubmitting }) => {

      uploadAvatarHandler(values);

      setTimeout(() => {
        setSubmitting(false);
      }, 500);
    },

    validationSchema: validationSchemaForUploadAvatar,
  });

  const uploadAvatarHandler = async (values) => {

    if (authContext.userInfos.isBan) {
      return swal({
        title: "دسترسی شما محدود شده است",
        icon: "error",
        buttons: "متوجه شدم",
      });
    }

    if (!authContext.userInfos.isEmailVerified) {
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
      await fetch("http://localhost:4000/users/upload-avatar", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: formData,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to upload avatar !");
          return res.json();
        })
        .then((result) => {
          // console.log(result);
          authContext.setUserInfos(result.data);
        })
        .then(() => {
          swal({
            title: "آپلود عکس پروفایل با موفقیت انجام شد",
            icon: "success",
            buttons: "باشه",
          });
        });
    } catch (error) {
      console.log(error);
      swal({
        title: "خطایی در آپلود عکس پروفایل رخ داده است",
        icon: "error",
        buttons: "تلاش دوباره",
      });
    } finally {
      setLoading(false);
    }
  };


  const downloadAvatarHandler = async () => {

    if (authContext.userInfos.isBan) {
      return swal({
        title: "دسترسی شما محدود شده است",
        icon: "warning",
        buttons: "متوجه شدم",
      });
    }

    if (!authContext.userInfos.isEmailVerified) {
      return swal({
        title: "لطفا ابتدا ایمیل خود را تایید کنید",
        icon: "warning",
        buttons: "متوجه شدم",
      });
    }

    if (!authContext.userInfos.avatarName) {
      return swal({
        title: "هنوز عکس پروفایل آپلود نشده است",
        icon: "warning",
        buttons: "متوجه شدم",
      });
    }

    try {
      const response = await fetch(
        "http://localhost:4000/users/download-avatar",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Failed to download avatar!");
      }

      // Handle the response as a blob for file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = authContext.userInfos.avatarName.split(".")[1];
      a.download = `${authContext.userInfos.username}_avatar.${ext}`; // Specify the filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Show success message
      swal({
        title: "دانلود عکس پروفایل با موفقیت انجام شد",
        icon: "success",
        buttons: "باشه",
      });
    } catch (error) {
      console.error(error);
      swal({
        title: "خطایی در دانلود عکس پروفایل رخ داده است",
        icon: "error",
        buttons: "تلاش دوباره",
      });
    }
  };


  const showAvatarHandler = async () => {

    if (authContext.userInfos.isBan) {
      return swal({
        title: "دسترسی شما محدود شده است",
        icon: "error",
        buttons: "متوجه شدم",
      });
    }

    if (!authContext.userInfos.isEmailVerified) {
      return swal({
        title: "لطفا ابتدا ایمیل خود را تایید کنید",
        icon: "error",
        buttons: "متوجه شدم",
      });
    }

    if (!authContext.userInfos.avatarName) {
      return swal({
        title: "هنوز عکس پروفایل آپلود نشده است",
        icon: "warning",
        buttons: "متوجه شدم",
      });
    }

    setCurrentAvatarUrl(authContext.userInfos.avatarUrl); // Get the current avatar URL

    setIsModalOpen(true); // Open the modal
  };


  const deleteAvatarHandler = async () => {

    if (authContext.userInfos.isBan) {
      return swal({
        title: "دسترسی شما محدود شده است",
        icon: "error",
        buttons: "متوجه شدم",
      });
    }

    if (!authContext.userInfos.isEmailVerified) {
      return swal({
        title: "لطفا ابتدا ایمیل خود را تایید کنید",
        icon: "error",
        buttons: "متوجه شدم",
      });
    }

    if (!authContext.userInfos.avatarName) {
      return swal({
        title: "هنوز عکس پروفایل آپلود نشده است",
        icon: "warning",
        buttons: "متوجه شدم",
      });
    }

    try {
      await swal({
        title: "عکس پروفایل حذف شود؟",
        icon: "warning",
        buttons: ["خیر", "بله"],
      }).then(async (result) => {
        if (result) {
          await fetch("http://localhost:4000/users/delete-avatar", {
            method: "delete",
            headers: {
              Authorization: `Bearer ${loggedInUser.token}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to delete avatar !");
              return res.json();
            })
            .then((result) => {
              // console.log(result);
              authContext.setUserInfos(result.data);
            })
            .then(() => {
              swal({
                title: "حذف عکس پروفایل با موفقیت انجام شد",
                icon: "success",
                buttons: "باشه",
              });
            });
        }
      });
    } catch (error) {
      console.log(error);
      swal({
        title: "خطایی در حذف عکس پروفایل رخ داده است",
        icon: "error",
        buttons: "تلاش دوباره",
      });
    }
  };


  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  

  return (
    <div className="edit">
      <form className="edit__form" onSubmit={form.handleSubmit}>
        <div className="edit__personal">
          <div className="row">
            <div className="col-12">
              <label className="edit__label">
                عکس پروفایل جدید را انتخاب کنید :{" "}
              </label>
              <input
                className="edit__input"
                type="file"
                name="file"
                // accept="image/*"
                accept="image/jpeg, image/jpg, image/png"
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
          {loading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          {loading ? "در حال آپلود ... " : "آپلود عکس پروفایل جدید"}
        </button>
      </form>

      <div>
        <button className="edit__btn" onClick={downloadAvatarHandler}>
          دانلود عکس پروفایل فعلی
        </button>
      </div>

      <div>
        <button className="edit__btn" onClick={showAvatarHandler}>
          مشاهده عکس پروفایل فعلی
        </button>
      </div>

      <div>
        <button className="edit__btn" onClick={deleteAvatarHandler}>
          حذف عکس پروفایل فعلی
        </button>
      </div>

      {/* Modal for displaying the current avatar */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={currentAvatarUrl}
      />
    </div>
  );
};

export default UserPanelAvatar;
