// src/utils/validation.js
import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

export const platformFeesSchema = Yup.object().shape({
  transfer: Yup.object().shape({
    value_type: Yup.string()
      .oneOf(["fixed", "percent"])
      .required("Transfer value type is required"),
    value: Yup.number()
      .min(0, "Transfer value must be at least 0")
      .required("Transfer value is required"),
  }),
  deposit: Yup.object().shape({
    value_type: Yup.string()
      .oneOf(["fixed", "percent"])
      .required("Deposit value type is required"),
    value: Yup.number()
      .min(0, "Deposit value must be at least 0")
      .required("Deposit value is required"),
  }),
  withdrawal: Yup.object().shape({
    value_type: Yup.string()
      .oneOf(["fixed", "percent"])
      .required("Withdrawal value type is required"),
    value: Yup.number()
      .min(0, "Withdrawal value must be at least 0")
      .required("Withdrawal value is required"),
  }),
});

export const cardFeeSchema = Yup.object().shape({
  virtualDetails: Yup.object().shape({
    name: Yup.string()
      .required("Virtual name is required")
      .min(3, "Name must be at least 3 characters"),

    description: Yup.string()
      .required("Virtual description is required")
      .min(5, "Description must be at least 5 characters"),

    currency: Yup.string()
      .required("Currency is required")
      .max(5, "Currency code should be short (e.g. USD)"),

    image_url: Yup.string().nullable(),
    image_file: Yup.mixed()
      .nullable()
      .test(
        "virtual-image-file",
        "Image must be a valid file",
        (value) => value == null || value instanceof File,
      ),
  }),
  
  physicalDetails: Yup.object().shape({
    name: Yup.string()
      .required("Physical name is required")
      .min(3, "Name must be at least 3 characters"),

    description: Yup.string()
      .required("Physical description is required")
      .min(5, "Description must be at least 5 characters"),

    currency: Yup.string()
      .required("Currency is required")
      .max(5, "Currency code should be short (e.g. USD)"),

    image_url: Yup.string().nullable(),
    image_file: Yup.mixed()
      .nullable()
      .test(
        "physical-image-file",
        "Image must be a valid file",
        (value) => value == null || value instanceof File,
      ),

    delivery: Yup.string()
      .required("Delivery is required")
      .min(2, "Delivery must be at least 2 characters"),

    availability: Yup.string()
      .oneOf(["available", "paused"], "Select availability")
      .required("Availability is required"),
  }),

  virtualFee: Yup.number()
    .required("Virtual fee is required")
    .min(0, "Fee cannot be negative"),

  virtualDiscount: Yup.number()
    .min(0, "Discount cannot be negative")
    .max(
      Yup.ref("virtualFee"),
      "Discount cannot be greater than Virtual Fee"
    ),

  physicalFee: Yup.number()
    .required("Physical fee is required")
    .min(0, "Fee cannot be negative"),

  physicalDiscount: Yup.number()
    .min(0, "Discount cannot be negative")
    .max(
      Yup.ref("physicalFee"),
      "Discount cannot be greater than Physical Fee"
    ),
});


const amount = Yup.number()
  .typeError("Must be a number")
  .min(0, "Must be 0 or greater")
  .required("Required");

export const rewardValidationSchema = Yup.object().shape({
  Physical: Yup.object().shape({
    cardAmount: amount,
    rewardAmount: amount,
  }),
  Virtual: Yup.object().shape({
    cardAmount: amount,
    rewardAmount: amount,
  }),
});
