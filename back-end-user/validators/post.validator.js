const yup = require("yup");


const createNewPostValidator = yup.object().shape({
    content: yup
      .string("فقط فرمت رشته قابل قبول می باشد")
      .transform(value => value.trim())
      .required("محتوای پست الزامی می‌باشد")
      .min(6, "محتوای پست نباید کمتر از 6 کاراکتر باشد")
      .max(300, "محتوای پست نباید بیشتر از 300 کاراکتر باشد"),
});


const getOnePostValidator = yup.object().shape({
    id: yup
      .string("فقط فرمت رشته قابل قبول می باشد")
      .transform(value => value.trim())
      .required("شناسه پست الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه پست معتبر نیست"),
});


const getMyPostValidator = yup.object().shape({
    id: yup
      .string("فقط فرمت رشته قابل قبول می باشد")
      .transform(value => value.trim())
      .required("شناسه پست الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه پست معتبر نیست"),
});


const updateMyPostValidator = yup.object().shape({
    id: yup
      .string("فقط فرمت رشته قابل قبول می باشد")
      .transform(value => value.trim())
      .required("شناسه پست الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه پست معتبر نیست"),
    content: yup
      .string("فقط فرمت رشته قابل قبول می باشد")
      .transform(value => value.trim())
      .required("محتوای پست الزامی می‌باشد")
      .min(6, "محتوای پست نباید کمتر از 6 کاراکتر باشد")
      .max(300, "محتوای پست نباید بیشتر از 300 کاراکتر باشد"),
});


const deleteMyPostValidator = yup.object().shape({
    id: yup
      .string("فقط فرمت رشته قابل قبول می باشد")
      .transform(value => value.trim())
      .required("شناسه پست الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه پست معتبر نیست"),
});


module.exports = {
    createNewPostValidator,
    getOnePostValidator,
    getMyPostValidator,
    updateMyPostValidator,
    deleteMyPostValidator,
};
