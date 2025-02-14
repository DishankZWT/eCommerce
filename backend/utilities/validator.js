const yup = require("yup");

async function checkCredentials(dataBody) {
  const userSchema = yup.object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    role: yup.mixed().oneOf(["admin", "customer"]).required(),
  });
  const validation = await userSchema.validate(dataBody, { abortEarly: false });
  return validation;
}

async function productCredentials(dataBody) {
  const productSchema = yup.object({
    name: yup.string().required(),
    price: yup.number().required(),
    category_id: yup.number().integer().required(),
  });
  const validation = await productSchema.validate(dataBody, {
    abortEarly: false,
  });
  return validation;
}

async function updateProfile(dataBody) {
  const updateSchema = yup.object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
  });
  const validation = await updateSchema.validate(dataBody, {
    abortEarly: false,
  });
  return validation;
}

module.exports = { checkCredentials, productCredentials, updateProfile };
