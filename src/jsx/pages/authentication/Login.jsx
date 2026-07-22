import { useContext, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { loginValidationSchema } from "../../../utils/validate/validate";
import { handleYupErrors, makeError } from "../../../utils";
import logo from "../../..//assets/images/nova/logo-main.png";
import novaCards from "../../../assets/images/nova-cards.png";

function Login(props) {
  const date = new Date();
  const navigate = useNavigate();
  
  const { login } = useContext(AuthContext);
  let errorsObj = { email: "", password: "" };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(errorsObj);
  const [loading, setLoading] = useState(false);
  
  const onLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors({ email: "", password: "" });
      await loginValidationSchema.validate(
        { email, password },
        { abortEarly: false }
      );
      const res = await login(email, password);
      if (!res.isError) {
        navigate("/verify-otp");
        setEmail("");
        setPassword("");
      }else{
        makeError(res.error); 
      }
      
    } catch (err) {
      handleYupErrors(err, errorsObj, setErrors);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="fix-wrapper nova-login">
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-contain-center">
          <div className="col-xl-12">
            <div className="card main-width nova-login-card">
              <div className="card-body  p-0">
                <div className="row m-0">
                  <div className="col-xl-5 col-lg-5 nova-login-form">
                    <div className="card h-100">
                      <div className="card-body nova-form-body">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          <img src={logo} alt="logo" width="150" />
                        </div>
                        <h2 className="mb-2">Hi, Welcome Back!</h2>
                        <p className="nova-subtitle">
                          Sign in to continue to your dashboard.
                        </p>
                        {props.errorMessage && (
                          <div className="text-danger p-1 my-2">
                            {props.errorMessage}
                          </div>
                        )}
                        {props.successMessage && (
                          <div className="text-danger p-1 my-2">
                            {props.successMessage}
                          </div>
                        )}
                        <form className="mt-4" onSubmit={onLogin}>
                          <div className="form-group mb-4">
                            <label htmlFor="exampleInputEmail1">
                              Email address
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Type Your Email Address"
                            />
                            {errors.email && (
                              <div className="text-danger fs-12">
                                {errors.email}
                              </div>
                            )}
                          </div>
                          <div className="form-group mb-4">
                            <label htmlFor="exampleInputPassword1">
                              Password
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              value={password}
                              placeholder="Type Your Password"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                              <div className="text-danger fs-12">
                                {errors.password}
                              </div>
                            )}
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-block text-white mb-4 nova-login-btn"
                            style={{
                              backgroundColor: "#285e7f",
                            }}
                          >
                            <i className="fa-solid fa-lock text-white me-2" />
                            Sign In
                          </button>
                        </form>
                        {/* <div className="nova-form-footer">
                          <span>New here?</span>
                          <Link to="/page-register">Create an account</Link>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-7 position-relative nova-login-aside login-border">
                    <div className="d-flex flex-column justify-content-between h-100 nova-aside-inner">
                      <div className="nova-aside-hero">
                        <h2 className="text-white mb-2">
                          Nova in your pocket.
                        </h2>
                        <p className="text-white nova-aside-text">
                          Download the app and manage everything with secure,
                          fast access.
                        </p>
                        <div className="nova-downloads">
                          <a
                            className="nova-store-btn"
                            href="https://apps.apple.com/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa-brands fa-apple" />
                            <span>
                              <small>Download on the</small>
                              <strong>App Store</strong>
                            </span>
                          </a>
                          <a
                            className="nova-store-btn"
                            href="https://play.google.com/store"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa-brands fa-google-play" />
                            <span>
                              <small>Get it on</small>
                              <strong>Google Play</strong>
                            </span>
                          </a>
                        </div>
                      </div>
                      <div className="nova-aside-art" aria-hidden="true">
                        <img
                          className="nova-aside-image"
                          src={novaCards}
                          alt=""
                        />
                        {/* <div className="nova-orb" /> */}
                      </div>
                      <div className="d-flex align-items-center justify-content-between text-white pb-3 px-3">
                        <span className="text-center w-100">
                          Designed &amp; Developed{" "}
                          <a
                            className="text-white"
                            href="https://innovationpixel.com/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Innovationpixel
                          </a>{" "}
                          {date.getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Login);
