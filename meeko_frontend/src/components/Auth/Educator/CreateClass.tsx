import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

// Course interface to match API response
interface Course {
  _id: string;
  course_name: string;
  // Add other course properties as needed
}

const validationSchema = Yup.object().shape({
  course_id: Yup.string().required("Course selection is required"),
  class_name: Yup.string().required("Class name is required").min(3, "Class name must be at least 3 characters long"),
  description: Yup.string().required("Description is required"),
  class_language: Yup.string().required("Language is required"),
  class_size: Yup.number().required("Class size is required").typeError("Class size must be a number").positive("Class size must be greater than 0"),
  price_per_session: Yup.number().required("Price is required").typeError("Price must be a number").min(0, "Price cannot be negative"),
  keyword: Yup.array().of(Yup.string().required("Keyword is required")),
  tools_material: Yup.array().of(Yup.string().required("Tool/Material is required")),
  parential_guidance: Yup.string().required("Parental guidance is required"),
  is_free: Yup.boolean().required("Is free is required"),
  is_popular: Yup.boolean().required("Is popular is required"),
});

const steps = ["Class Details", "Materials & Media", "Batches & Sessions"];

interface ClassFormValues {
  course_id: string;
  class_name: string;
  description: string;
  class_language: string;
  class_size: number | "";
  price_per_session: number | "";
  keyword: string[];
  tools_material: string[];
  parential_guidance: string;
  is_free: boolean;
  is_popular: boolean;
  class_images: File | null;
  class_videos: File | null;
  class_certificate: File | null;
  class_documents: File[] | null;
}

// Define SubmitStatus type
type SubmitStatus = {
  type: "success" | "error";
  message: string;
};

const CreateClass = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [createdClassId, setCreatedClassId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch("http://localhost:3000/users/getcourses");
        
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        
        const data = await response.json();
        setCourses(data.data || data); // Adjust based on your API response structure
      } catch (error) {
        console.error("Error fetching courses:", error);
        setSubmitStatus({
          type: "error",
          message: "Failed to load courses. Please refresh the page."
        });
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle File Upload
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
    fieldName: keyof ClassFormValues
  ) => {
    const files = event.currentTarget.files;
    if (!files) return;
    if (fieldName === "class_documents") {
      setFieldValue(fieldName, Array.from(files));
    } else {
      setFieldValue(fieldName, files[0]);
    }
  };

  const handleSubmit = async (values: ClassFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData();
      
      // Find selected course to get course_name
      const selectedCourse = courses.find(course => course._id === values.course_id);
      
      // Add course_name to the form data
      if (selectedCourse) {
        formData.append("course_name", selectedCourse.course_name);
      }

      Object.keys(values).forEach((key) => {
        const value = values[key as keyof ClassFormValues];
        if (
          !(value instanceof File) &&
          !Array.isArray(value)
        ) {
          formData.append(key, String(value));
        } else if (
          Array.isArray(value) &&
          value.length > 0 &&
          typeof value[0] === "string"
        ) {
          formData.append(key, value.join(","));
        }
      });

      if (values.class_images)
        formData.append("class_images", values.class_images);
      if (values.class_videos)
        formData.append("class_videos", values.class_videos);
      if (values.class_certificate)
        formData.append("class_certificate", values.class_certificate);
      if (values.class_documents) {
        values.class_documents.forEach((file) =>
          formData.append("class_documents", file)
        );
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/educator/createclass",
        {
          method: "POST",
          headers: { Authorization: token || "" },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to create class");

      const data = await response.json();
      console.log("Class created successfully:", data);
      setSubmitStatus({
        type: "success",
        message: "Class created successfully!",
      });

      const classId = data.data._id;
      setCreatedClassId(classId);
      console.log("class id >>>>>>>>>>>", createdClassId);

      // Move to step 2 (Batches & Sessions)
      setStep(2);
    } catch (error) {
      console.error("Error creating class", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to create class. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 mt-20 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Class</h1>
          <p className="text-gray-600">Set up your class with batches and sessions</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((stepName, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${index <= step ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                {index + 1}
              </div>
              <span className={`ml-2 font-medium ${index <= step ? 'text-indigo-600' : 'text-gray-400'}`}>
                {stepName}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${index < step ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </div>

        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {submitStatus.message}
          </div>
        )}

        <Formik
          initialValues={{
            course_id: "",
            class_name: "",
            description: "",
            class_language: "",
            class_size: "",
            price_per_session: "",
            keyword: [],
            tools_material: [],
            parential_guidance: "",
            is_free: false,
            is_popular: false,
            class_images: null,
            class_videos: null,
            class_certificate: null,
            class_documents: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-8">
              {/* Step 1: Class Details */}
              {step === 0 && (
                <div className="space-y-6">
                  {/* Course Selection Dropdown */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Course *
                    </label>
                    {loadingCourses ? (
                      <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                        Loading courses...
                      </div>
                    ) : (
                      <Field
                        as="select"
                        name="course_id"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">-- Select a course --</option>
                        {courses.map((course) => (
                          <option key={course._id} value={course._id}>
                            {course.course_name}
                          </option>
                        ))}
                      </Field>
                    )}
                    <ErrorMessage
                      name="course_id"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class Title *
                      </label>
                      <Field
                        name="class_name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter class name"
                      />
                      <ErrorMessage name="class_name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class Description *
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter detailed description"
                      />
                      <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
                      <Field
                        as="select"
                        name="class_language"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Hindi">Hindi</option>
                      </Field>
                      <ErrorMessage name="class_language" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class Size *</label>
                      <Field
                        type="number"
                        name="class_size"
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Maximum students"
                      />
                      <ErrorMessage name="class_size" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Session *</label>
                      <Field
                        type="number"
                        name="price_per_session"
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="₹ 0.00"
                      />
                      <ErrorMessage name="price_per_session" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parental Guidance</label>
                      <Field
                        name="parential_guidance"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Any special instructions for parents"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <Field type="checkbox" name="is_free" className="mr-2 h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Free Class</span>
                    </label>
                    <label className="flex items-center">
                      <Field type="checkbox" name="is_popular" className="mr-2 h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
                    </label>
                  </div>

                  {/* Display selected course info */}
                  {values.course_id && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Selected Course:</h4>
                      <p className="text-blue-700">
                        {courses.find(c => c._id === values.course_id)?.course_name}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Materials & Media */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                    <Field
                      name="keyword"
                      placeholder="Enter keywords separated by commas (e.g., art, painting, creative)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('keyword', e.target.value.split(',').map(k => k.trim()))}
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate multiple keywords with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tools & Materials</label>
                    <Field
                      name="tools_material"
                      placeholder="Enter required tools/materials separated by commas (e.g., pencil, paper, colors)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('tools_material', e.target.value.split(',').map(t => t.trim()))}
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate multiple items with commas</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setFieldValue, 'class_images')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class Video</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, setFieldValue, 'class_videos')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Template</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setFieldValue, 'class_certificate')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class Documents</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={(e) => handleFileChange(e, setFieldValue, 'class_documents')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">You can select multiple PDF/DOC files</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Batches & Sessions (Placeholder) */}
              {step === 2 && (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Class Created Successfully!</h3>
                    <p className="text-gray-600 mb-6">Your class has been created. Now you can add batches and sessions.</p>
                  </div>

                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8">
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">Ready to Add Batches & Sessions</h4>
                    <p className="text-gray-500 mb-4">You will be redirected to the batches and sessions management page where you can:</p>
                    <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        Create multiple batches for your class
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        Schedule sessions with dates and times
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        Upload batch-specific documents
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        Manage class capacity and enrollment
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                {step > 0 && step < 2 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}

                {step === 0 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
                    disabled={isSubmitting || loadingCourses}
                  >
                    Next
                  </button>
                )}

                {step === 1 && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Class...
                      </>
                    ) : (
                      'Create Class & Continue'
                    )}
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Redirecting to batches & sessions page...");
                      console.log("Navigating with classId:", createdClassId);
                      navigate('/educator/dashboard/batches_sessions', { state: { classId: createdClassId } });
                    }}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                  >
                    Continue to Batches & Sessions
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateClass;