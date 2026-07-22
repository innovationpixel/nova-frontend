import { IMAGE_BASE_URL } from "./config";
import Swal from "sweetalert2";
import { parseNovaDate } from "./novaDateUtils";

export const getToken = (navigate, toast) => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/auth-signin");
    return;
  }
  return token;
};

/**
 * Get User from local storage
*/
export const getUser = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
};

/**
 * Make Error as well validation error of laravel
*/
export const makeError = (error) => {
  const errorBag = error?.response?.data?.errors || error?.response?.data?.error;
  const errorMessage = error?.response?.data?.message || error?.message;
  if (errorBag && typeof errorBag === "object") {
    Object.keys(errorBag).forEach((key) => {
      const messages = Array.isArray(errorBag[key])
        ? errorBag[key]
        : [errorBag[key]];

      messages.forEach((msg) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: msg,
          timer: 3000,
          showConfirmButton: false,
        });
      });
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: errorMessage || "Internal Server Error, Please try again",
      timer: 3000,
      showConfirmButton: false,
    });
  }
};

/**
 * format date to 2026/01/01
 */
export const formatYYYYMMDD = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

/**
 * get today date
 */
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * showImage by path if path is not available then show static image
 */
export const showImage = (path) => {
  if (!path) {
    return "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
  }
  return `${IMAGE_BASE_URL}${path}`;
};

/**
 * handle yup validation errors
*/
export const handleYupErrors = (err, initialErrors, setErrors) => {
  if (!err || !err.inner) return;

  const errorObj = { ...initialErrors };

  err.inner.forEach((error) => {
    if (error.path) {
      errorObj[error.path] = error.message;
    }
  });

  setErrors(errorObj);
};

/**
 * Normalize Labels
*/
export const normalizeStatusLabel = (status) => {
  if (!status) return "N/A";
  return String(status)
    .replace(/_/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * get full name handling tevau and all possible way for now
*/
export const getFullName = (item) => {
  const first = item?.first_name_en || item?.first_name || item?.postal_address?.first_name || "";
  const last = item?.last_name_en || item?.last_name || item?.postal_address?.last_name || "";
  return `${first} ${last}`.trim() || "N/A";
};

/**
 * get email handling tevau and all possible way for now
*/
export const getEmail = (item) =>
  item.identity_card_email ||
  item.email ||
  item?.tevau_user?.user?.email || item?.tevau_user?.user?.email_address ||
  "N/A";

  /**
   *  Get Full Address
  */
  export const getFullAddress = (item) =>{
    const address = `${item?.postal_address?.address} (${item.postal_address.city})-(${item.postal_address.province})` || "N/A";
    return address;
  }

  /**
   * Get City Name
  */

  export const getCityName = (item) => item?.postal_address?.city || "N/A";

  /**
   * Get Phone Number
  */

  export const getPhoneNumber = (item) => item?.order_details?.dial_code + " " + item?.order_details?.phone_number || "N/A";

  /**
   * get Country
  */
export const getCountryName = (item) => item.postal_address.country_area || 'N/A';

/**
 * format date time
*/
export const formatDateTime = (value) => {
  const date = value instanceof Date ? value : parseNovaDate(value);
  return date
    ? date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })
    : "N/A";
};

/**
 * format date
 * @abstract parseNovaDate
 * @returns formatDate
*/
export const formatDate = (value) => {
  const date = value instanceof Date ? value : parseNovaDate(value);
  return date
    ? date.toLocaleDateString("en-US", { dateStyle: "medium" })
    : "N/A";
};

/**
 * get User Roles
*/
export const getUserRole = (row) =>
  row?.tevau_user?.user?.role
    ? normalizeStatusLabel(row.tevau_user.user.role)
    : "N/A";

/**
 * get display value
*/
export const getDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return value;
};

/**
 * format money
*/
export const formatMoney = (value, currency = "") => {
  if (value === null || value === undefined || value === "") return "N/A";
  const numeric = Number(value);
  const formatted = Number.isNaN(numeric)
    ? String(value)
    : numeric.toLocaleString();
  return currency ? `${formatted} ${currency}` : formatted;
};

/**
 * Normalize Card Type
*/
export const normalizeCardType = (value) => {
  if (!value) return "";
  const text = String(value).toLowerCase();
  if (text.includes("virtual")) return "Virtual";
  if (text.includes("physical")) return "Physical";
  return normalizeStatusLabel(value);
};

/**
 * format card money
*/
export const formatCardMoney = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "N/A";
  return `$${numeric.toLocaleString()}`;
};

/**
 * Get Currency Prefix
*/
export const currencyPrefix = (currency) => {
  const c = String(currency || "").toUpperCase();
  if (c === "USD") return "$";
  if (c === "PKR") return "₨";
  if (c === "EUR") return "€";
  if (c === "GBP") return "£";
  return ""; // fallback
};