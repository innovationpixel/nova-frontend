import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { otpValidationSchema } from "../../../utils/validate/validate";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { makeError } from "../../../utils";
import logo from "../../..//assets/images/nova/logo-main.png";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const { verifyOTP, getOTP } = useContext(AuthContext);
    const [isResending, setIsResending] = useState(false);

    const formik = useFormik({
        initialValues: {
            otp: "",
        },
        validationSchema: otpValidationSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const response = await verifyOTP(values.otp);

                if (response.isError) {
                    makeError(response.message || "Invalid OTP");
                    resetForm();
                    navigate("/login");
                } else {
                    resetForm();
                    navigate("/");
                }
            } catch (err) {
                makeError("Something went wrong. Please try again.");
            } finally {
                setSubmitting(false);
            }
        },
    });

    const resendOTP = async () => {
        if (isResending) return;

        try {
            setIsResending(true);
            const response = await getOTP();
            if (response.isError) {
                makeError(response.message || "Unable to resend OTP");
            } else {
                makeError("OTP resent successfully");
            }
        } catch (error) {
            makeError("Something went wrong. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="fix-wrapper">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-6">
                        <div className="card mb-0 h-auto">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-center mb-4">
                                    <img src={logo} alt="logo" width="150" />
                                </div>

                                <h4 className="text-center mb-4">Verify OTP</h4>

                                <form onSubmit={formik.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label text-center d-block">
                                            Enter 6-digit OTP
                                        </label>

                                        <input
                                            type="text"
                                            name="otp"
                                            maxLength="6"
                                            className={`form-control text-center ${formik.touched.otp && formik.errors.otp ? "is-invalid" : ""
                                                }`}
                                            value={formik.values.otp}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="______"
                                            style={{
                                                letterSpacing: "10px",
                                                fontSize: "20px",
                                            }}
                                        />

                                        {formik.touched.otp && formik.errors.otp && (
                                            <div className="invalid-feedback text-center">
                                                {formik.errors.otp}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block"
                                            disabled={formik.isSubmitting || isResending}
                                        >
                                            {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
                                        </button>

                                    </div>

                                    <div className="text-center mt-3">
                                        <span className="text-muted">
                                            Didn’t receive OTP?{" "}
                                            <span
                                                onClick={!isResending ? resendOTP : undefined}
                                                className={`text-primary ${isResending ? "opacity-50 pointer-events-none" : "cursor-pointer"
                                                    }`}
                                            >
                                                {isResending ? "Resending..." : "Resend"}
                                            </span>

                                        </span>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
