import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  class_name: Yup.string().required("Class name is required"),
  description: Yup.string().required("Description is required"),
  class_language: Yup.string().required("Language is required"),
  class_size: Yup.number().required("Class size is required"),
  price_per_session: Yup.number().required("Price is required"),
  batches: Yup.array().of(
    Yup.object().shape({
      batch_name: Yup.string().required("Batch name is required"),
      sessions: Yup.array().of(
        Yup.object().shape({
          session_name: Yup.string().required("Session name is required"),
          description: Yup.string().required("Description is required"),
          start_time: Yup.string().required("Start time is required"),
          end_time: Yup.string().required("End time is required"),
          date: Yup.date().required("Date is required"),
        })
      ).min(1, "At least one session is required"),
    })
  ).min(1, "At least one batch is required"),
});

const steps = ["Class Details", "Materials & Media", "Batches & Sessions"];

interface SessionValues {
  session_name: string;
  description: string;
  start_time: string;
  end_time: string;
  date: string;
}

interface BatchValues {
  batch_name: string;
  documents: File | null;
  sessions: SessionValues[];
}

interface ClassFormValues {
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
  batches: BatchValues[];
}

// Define SubmitStatus type
type SubmitStatus = {
  type: "success" | "error";
  message: string;
};
const CreateClass = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

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

  // Submit handler


     const handleSubmit = async (values: ClassFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // -------- STEP 1: Create Class --------
      // The class ID is obtained here and used in the next step.
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        const value = values[key as keyof ClassFormValues];
        // Skip nested arrays and file objects as they need special handling
        if (
          key !== "batches" &&
          !(value instanceof File) &&
          !Array.isArray(value)
        ) {
          formData.append(key, String(value));
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
          // Handle string arrays like keywords and tools_material
          formData.append(key, value.join(","));
        }
      });

       // Append files to formData
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
      const classResponse = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
        body: formData,
      });

      if (!classResponse.ok) throw new Error("Failed to create class");

      const classData = await classResponse.json();
      // Safely access the class ID
      const classId = classData.data._id;
      console.log("Class created with ID:", classId);

       // -------- STEP 2: Create Batches + Sessions --------
      // The batch ID is obtained in this loop and used for sessions.
      for (const batch of values.batches) {
        const batchFormData = new FormData();
        batchFormData.append("class_id", classId);
        batchFormData.append("batch_name", batch.batch_name);
        if (batch.documents)
          batchFormData.append("documents", batch.documents);

        const batchResponse = await fetch("http://localhost:5000/api/batch", {
          method: "POST",
          headers: { Authorization: token || "" },
          body: batchFormData,
        });

        if (!batchResponse.ok) throw new Error("Failed to create batch");

        const batchData = await batchResponse.json();
        const batchId = batchData.data._id;
        console.log("Batch created with ID:", batchId);

         // Sessions inside batch
        for (const session of batch.sessions) {
          // The batch ID is attached to each session here.
          const sessionResponse = await fetch(
            "http://localhost:5000/api/session",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token || "",
              },
              body: JSON.stringify({ ...session, batch: batchId }),
            }
          );

          if (!sessionResponse.ok) throw new Error("Failed to create session");
          console.log("Session created.");
        }
      }
// -------- SUCCESS --------
      setSubmitStatus({
        type: "success",
        message: "Class created successfully with batches and sessions!",
      });

      setTimeout(() => window.location.reload(), 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create class";
      setSubmitStatus({
        type: "error",
        message: errorMessage,
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
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <Formik
          initialValues={{
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
            batches: [
              {
                batch_name: "",
                documents: null,
                sessions: [
                  {
                    session_name: "",
                    description: "",
                    start_time: "",
                    end_time: "",
                    date: "",
                  },
                ],
              },
            ],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-8">
              {/* Step 1: Class Details */}
              {step === 0 && (
                <div className="space-y-6">
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

              {/* Step 3: Batches + Sessions */}
              {step === 2 && (
                <FieldArray name="batches">
                  {({ push: pushBatch, remove: removeBatch }) => (
                    <div className="space-y-6">
                      {values.batches.map((batch, batchIndex) => (
                        <div
                          key={batchIndex}
                          className="border-2 border-gray-200 p-6 rounded-xl bg-gray-50"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                              Batch {batchIndex + 1}
                            </h3>
                            {batchIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => removeBatch(batchIndex)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Remove Batch
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Batch Name *
                              </label>
                              <Field
                                name={`batches[${batchIndex}].batch_name`}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter batch name"
                              />
                              <ErrorMessage
                                name={`batches[${batchIndex}].batch_name`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Batch Documents
                              </label>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const files = e.target.files;
                                  setFieldValue(`batches[${batchIndex}].documents`, files && files[0] ? files[0] : null);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>

                          {/* Sessions inside batch */}
                          <FieldArray name={`batches[${batchIndex}].sessions`}>
                            {({ push: pushSession, remove: removeSession }) => (
                              <div>
                                <h4 className="text-lg font-medium text-gray-700 mb-4">Sessions</h4>
                                {batch.sessions.map((_, sessionIndex) => (
                                  <div
                                    key={sessionIndex}
                                    className="bg-white border border-gray-200 p-4 rounded-lg mb-4 shadow-sm"
                                  >
                                    <div className="flex justify-between items-center mb-3">
                                      <h5 className="font-medium text-gray-800">
                                        Session {sessionIndex + 1}
                                      </h5>
                                      {sessionIndex > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => removeSession(sessionIndex)}
                                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
                                        >
                                          Remove
                                        </button>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="md:col-span-2 lg:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Session Name *
                                        </label>
                                        <Field
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].session_name`}
                                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                          placeholder="Session name"
                                        />
                                        <ErrorMessage
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].session_name`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>

                                      <div className="md:col-span-2 lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Description *
                                        </label>
                                        <Field
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].description`}
                                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                          placeholder="Session description"
                                        />
                                        <ErrorMessage
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].description`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Start Time *
                                        </label>
                                        <Field
                                          type="time"
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].start_time`}
                                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <ErrorMessage
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].start_time`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          End Time *
                                        </label>
                                        <Field
                                          type="time"
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].end_time`}
                                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <ErrorMessage
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].end_time`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Date *
                                        </label>
                                        <Field
                                          type="date"
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].date`}
                                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <ErrorMessage
                                          name={`batches[${batchIndex}].sessions[${sessionIndex}].date`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() =>
                                    pushSession({
                                      session_name: "",
                                      description: "",
                                      start_time: "",
                                      end_time: "",
                                      date: "",
                                    })
                                  }
                                  className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
                                >
                                  <span className="mr-2">+</span> Add Session
                                </button>
                              </div>
                            )}
                          </FieldArray>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          pushBatch({
                            batch_name: "",
                            documents: null,
                            sessions: [
                              {
                                session_name: "",
                                description: "",
                                start_time: "",
                                end_time: "",
                                date: "",
                              },
                            ],
                          })
                        }
                        className="w-full mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <span className="mr-2">+</span> Add New Batch
                      </button>
                    </div>
                  )}
                </FieldArray>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
                    disabled={isSubmitting}
                  >
                    Next
                  </button>
                ) : (
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
                      'Create Class'
                    )}
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