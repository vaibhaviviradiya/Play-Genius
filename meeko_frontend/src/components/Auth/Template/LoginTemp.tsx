import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginTempProps {
  images: string[];
  logo: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  loginUrl: string;
  redirectUrl: string;
}

function LoginTemp({ images, logo, welcomeTitle, welcomeSubtitle, loginUrl, redirectUrl }: LoginTempProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Initial values
  const initialValues = {
    email: "",
    password: "",
  };

  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log("Login Values:", values);
      try {
        const response = await axios.post(loginUrl, values);
        console.log("Login Response:", response.data);

        if (response.data.status) {
          navigate(redirectUrl); // Redirect after successful login
        } else {
          alert("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login Error:", error);
      }
    },
  });

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="edu-login-banner" style={{ background: "#f1f2f7" }}>
      <div className="w-full p-15">
        <div className="login-grid flex gap-20">

          {/* Image Slider */}
          <div className="sign-up-banner w-full">
            <div className="sign-up-images flex">
              <img
                className="object-contain h-[400px] w-auto"
                src={images[currentIndex]}
                height={400}
                width={400}
                alt="signup"
              />
            </div>
            {/* Slider Dots */}
            <div className="signup-img-btns flex p-10 justify-center">
              {images.map((_, index) => (
                <div key={index} className="img-change-btn m-5 flex align-center">
                  <button
                    onClick={() => setCurrentIndex(index)}
                    className={`rounded-full h-2 w-20 transition-colors duration-300 ${currentIndex === index ? "bg-cyan-400" : "bg-gray-300"
                      }`}
                  ></button>
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="parent-login-box w-full bg-[#F5F6FA] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <div className="login-box-inner">
              {/* Welcome Section */}
              <div className="welcome-grid flex justify-between items-center">
                <div className="welcome-right">
                  <h1 className="text-6xl mb-5 font-bold text-sky-400">{welcomeTitle}</h1>
                  <h3 className="text-gray-700 text-xl font-semibold text-sky-400">
                    {welcomeSubtitle}
                  </h3>
                </div>
                <div className="welcome-left">
                  <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
                </div>
              </div>

              {/* Form */}
              <form className="mt-6" onSubmit={formik.handleSubmit}>
                {/* Email Field */}
                <div className="mb-4 mt-15 flex items-center bg-white rounded-full p-2 shadow-sm">
                  <input
                    name="email"
                    type="text"
                    placeholder="Email / Username"
                    className="flex-1 border-none outline-none px-3 bg-transparent text-gray-700"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.errors.email && formik.touched.email ? (
                  <div className="text-red-500 text-sm mb-4">{formik.errors.email}</div>
                ) : null}

                {/* Password Field */}
                <div className="mb-4 mt-2 flex items-center bg-white rounded-full p-2 shadow-sm">
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="flex-1 border-none outline-none px-3 bg-transparent text-gray-700"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.errors.password && formik.touched.password ? (
                  <div className="text-red-500 text-sm mb-4">{formik.errors.password}</div>
                ) : null}

                {/* Additional Links */}
                      <div className="login-otp-div flex justify-between">
                        <div className="login-otp-div"><a href="">Login with OTP?</a></div>
                        <div className="login-forget-pass"><a href="">Forgot Password?</a></div>
                      </div><br />
                {
                  redirectUrl.includes("parent") ? (
                    <div>
                      <p>
                        Don’t have an account? Ask your parents to{" "}
                        <a href="/parent/signup" className="text-sky-400 font-medium">create an account</a> for you
                      </p>
                    </div>

                  ) : (
                    <p>
            
                      <a href="" className="text-sky-400 font-medium">Sign up </a> for Free
                    </p>
                  )
                }
            
                {/* Submit Button */}
                <div className="login-btn flex justify-center">
                  <button
                    className="mt-10 bg-cyan px-15 py-3 cursor-pointer rounded-4xl"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginTemp;
