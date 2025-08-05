import { useState, useEffect } from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ParentsignupProps {
    images: string[];
    logo: string;
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    registerUrl: string;
    redirectUrl: string;
}

function RegisterTemp({ images, logo, welcomeSubtitle, welcomeTitle, registerUrl, redirectUrl }: ParentsignupProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Initial values
    const initialValues = {
        parentusername: "",
        email: "",
        contact: "",
        password: "",
        confirmpassword: "",
        childname: "",
        childusername: "",
        childpassword: "",
        childbirthdate: ""
    };
    const navigate = useNavigate();

    // Validation Schema
    const validationSchema = Yup.object({
        parentusername: Yup.string().required("Parent username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        contact: Yup.number().required("Contact is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('password')], "Passwords must match")
            .required("Confirm your Password"),
        childname: Yup.string().required("Child name is required"),
        childusername: Yup.string().required("Child username is required"),
        childpassword: Yup.string()
            .min(6, "atleast 6 characters required")
            .required("Child password is required"),
        childbirthdate: Yup.date().required("date of birth is required"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {

            console.log("Register Values:", values);
            try {

                const birthDate = new Date(values.childbirthdate);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--; // Adjust age if birthday hasn't occurred yet this year
                }

                const payload = {
                    username: values.parentusername,
                    email: values.email,
                    contact: values.contact,
                    password: values.password,
                    child_name: values.childname,
                    child_username: values.childusername,
                    child_password: values.childpassword,
                    date_of_birth: values.childbirthdate,
                    child_age: age
                };

                const response = await axios.post(registerUrl, payload);
                console.log("Register Response:", response.data);

                if (response.data.status) {
                    navigate(redirectUrl);
                    // Redirect after successful registration
                } else {
                    alert("Registration failed. Please check your details.");
                }
            } catch (error) {
                console.error("Registration Error:", error);
            }
        },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);
    return (
        <div className="edu-signup-banner" style={{ background: "#f1f2f7" }}>
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
                    {/* Form */}
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


                            <div className="signup-form-section">
                                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                                    <div className="div flex">
                                        <input type="text" placeholder="Parent username" value={formik.values.parentusername} onChange={formik.handleChange} name='parentusername' className=" w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                    </div>
                                    <div>
                                        <p className="text-red-500 text-sm">{formik.errors.parentusername}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <input type="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} name='email' className=" w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                        <input type="text" placeholder="Contact" value={formik.values.contact} onChange={formik.handleChange} name='contact' className="w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-1">
                                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                        <p className="text-red-500 text-sm">{formik.errors.contact}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <input type="text" placeholder="Password" name='password' value={formik.values.password} onChange={formik.handleChange} className=" w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                        <input type="text" placeholder="Confirm Password" name='confirmpassword' value={formik.values.confirmpassword} onChange={formik.handleChange} className="w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-1">
                                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                                        <p className="text-red-500 text-sm">{formik.errors.confirmpassword}</p>
                                    </div>
                                    <br />
                                    <hr />
                                    <div className="flex gap-4">
                                        <input type="text" placeholder="Child Name" name='childname' value={formik.values.childname} onChange={formik.handleChange} className=" w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                        <input type="text" placeholder="Child Username" name='childusername' value={formik.values.childusername} onChange={formik.handleChange} className="w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 mt-1'>
                                        <p className="text-red-500 text-sm leading-0">{formik.errors.childname}</p>
                                        <p className="text-red-500 text-sm leading-0">{formik.errors.childusername}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <input type="text" placeholder="Child Password" name='childpassword' value={formik.values.childpassword} onChange={formik.handleChange} className=" w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                        <input type="date" placeholder="Date of Birth" name='childbirthdate' value={formik.values.childbirthdate} onChange={formik.handleChange} className="w-full border-b border-gray-300 focus:border-sky-400 outline-none py-2 px-1" />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 mt-1'>
                                        <p className="text-red-500 text-sm leading-0">{formik.errors.childpassword}</p>
                                        <p className="text-red-500 text-sm leading-0">{formik.errors.childbirthdate}</p>
                                    </div>
                                    <br />
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full bg-sky-400 hover:bg-sky-500 text-white py-2 rounded-lg transition-all"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterTemp