// import React, { useState, useContext } from "react";
// import swal from "sweetalert";
// import AuthContext from "../../../context/authContext";
// import { useFormik } from "formik";

// import "./UserPanelUpdateAvatar.css";


// function UserPanelUpdateAvatar() {

//     const loggedInUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

//     const authContext = useContext(AuthContext);

//     const [file, setFile] = useState([]);

//     const [loading, setLoading] = useState(false);

//     const updateAvatarHandler = async(data)=> {

//         if(authContext.userInfos.isBan){
//             return swal({
//                 title: "دسترسی شما محدود شده است",
//                 icon: "error",
//                 buttons: "متوجه شدم",
//             });
//         }

//         if(!authContext.userInfos.isEmailVerified){
//             return swal({
//                 title: "لطفا ابتدا ایمیل خود را تایید کنید",
//                 icon: "error",
//                 buttons: "متوجه شدم",
//             });
//         }

//         const formData = new FormData();

//         if (!data.file.name) {
//             swal({ 
//                 title: "لطفا یک عکس انتخاب کنید",
//                 icon: "warning",
//                 buttons: "متوجه شدم",
//             });
//             return;
//         }

//         if (data.file.size > 50000) {
//             swal({ 
//                 title: "حجم عکس نباید بیشتر از 50 کیلوبایت باشد",
//                 icon: "warning",
//                 buttons: "متوجه شدم",
//             });
//             return;
//         }

//         const ext = data.file.name.split(".")[1];

//         const allowedType = ["png", "jpg", "jpeg"];

//         if(!allowedType.includes(ext.toLowerCase())){
//             swal({ 
//                 title: "jpeg jpg png عکس معتبر نیست * فرمت های مجاز ",
//                 icon: "warning",
//                 buttons: "متوجه شدم",
//             });
//             return;
//         }

//         formData.append("file", data.file);

//         setLoading(true);

//         try {
//             const response = await fetch("http://localhost:4000/users/update-avatar", {
//                 method: "PATCH",
//                 headers: {
//                     "Authorization": `Bearer ${loggedInUser.token}`,
//                 },
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message);
//             };

//             await response.json()
//                 .then((result) => {
//                     // console.log(result);
//                     authContext.setUserInfos(result.data)
//                 });
//             swal({
//                 title: "ویرایش عکس پروفایل کاربر با موفقیت انجام شد",
//                 icon: "success",
//                 buttons: "باشه",
//             });

//         } catch (error) {
//             console.log(error);
//             swal({
//                 title: "خطایی در ویرایش عکس پروفایل کاربر رخ داده است",
//                 icon: "error",
//                 buttons: "تلاش دوباره",
//             });
//         } finally {
//             setLoading(false);
//         }
//     }

//     const formik = useFormik({
//         initialValues: {
//           file: "",
//         },
//         onSubmit: (values) => {
//             if (!file) {
//                 swal({ 
//                     title: "لطفا یک عکس انتخاب کنید",
//                     icon: "warning",
//                     buttons: "متوجه شدم",
//                 });
//                 return;
//             }
//             updateAvatarHandler({ file });
//         },
//       });

//     return (
//         <div className="edit">
//             <form className="edit__form" onSubmit={formik.handleSubmit}>

//                 <div className="edit__personal">
//                     <div className="row">

//                         <div className="col-12">
//                             <label className="edit__label">عکس پروفایل*</label>
//                             <input
//                                 className="edit__input"
//                                 type="file"
//                                 onChange={(e) => setFile(e.target.files[0])}
//                                 // accept="image/*" // restrict file type
//                             />
//                         </div>

//                     </div>
//                 </div>

//                 <button className="edit__btn" type="submit" disabled={loading}>
//                     {loading && <span className="spinner-border spinner-border-sm"></span>}
//                     {loading ? "در حال بارگزاری..." : "ذخیره عکس پروفایل"}
//                 </button>

//             </form>
//         </div>
//     );
// };

// export default UserPanelUpdateAvatar;


import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const ImageUploadForm = () => {
  // Validation schema
  const validationSchema = Yup.object().shape({
    image: Yup.mixed()
      .required('A file is required')
      .test('fileSize', 'File size is too large', value => {
        return value && value.size <= 20000; // Limit size to 20 kb
      })
      .test('fileType', 'Unsupported File Format', value => {
        return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      }),
  });

  return (
    <Formik
      initialValues={{ image: null }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log('Form data', values);
        // Handle form submission, e.g., send to server
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <div>
            <label htmlFor="image">Upload Image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                setFieldValue('image', file);
              }}
            />
            <ErrorMessage name="image" component="div" style={{ color: 'red' }} />
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default ImageUploadForm;
