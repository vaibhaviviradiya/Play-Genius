import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";

const validationSchema = Yup.object().shape({
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

interface BatchSessionFormValues {
  class_id: string; // This should be passed from the previous page or stored
  batches: BatchValues[];
}

type SubmitStatus = {
  type: "success" | "error";
  message: string;
};

const BatchesSessions: React.FC = () => {
  const location = useLocation()
  const classId = location.state?.classId || "";
    console.log("Received classId in BatchesSessions:", classId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [createdBatches, setCreatedBatches] = useState<string[]>([]);

  // Handle File Upload for batch documents
  const handleBatchFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
    batchIndex: number
  ) => {
    const files = event.currentTarget.files;
    if (files && files[0]) {
      setFieldValue(`batches[${batchIndex}].documents`, files[0]);
    }
  };

  // Create a single batch
const createBatch = async (batchData: BatchValues, classId: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("batch_name", batchData.batch_name);
    formData.append("class_id", classId);

    if (batchData.documents) {
      formData.append("documents", batchData.documents);
    }

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/educator/createbatch", {
      method: "POST",
      headers: { Authorization: token || "" },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to create batch");

    const data = await response.json();
    console.log("Batch created successfully:", data);

    // ✅ use the correct key from backend response
    return data.data._id;  
  } catch (error) {
    console.error("Error creating batch:", error);
    throw error;
  }
};


  // Create a single session
const createSession = async (sessionData: SessionValues, batchId: string): Promise<void> => {
  try {
    const sessionPayload = {
      session_name: sessionData.session_name,
      description: sessionData.description,
      start_time: sessionData.start_time,
      end_time: sessionData.end_time,
      date: new Date(sessionData.date).toISOString(), // ✅ ensure proper Date
      batch: batchId, // ✅ correct key
    };

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/educator/createsession", {
      method: "POST",
      headers: { 
        Authorization: token || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to create session: ${errText}`);
    }

    const data = await response.json();
    console.log("Session created successfully:", data);
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};


  const handleSubmit = async (values: BatchSessionFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    const batchIds: string[] = [];

    try {
      // Create each batch and its sessions
      for (let i = 0; i < values.batches.length; i++) {
        const batch = values.batches[i];
        
        // Create batch
        const batchId = await createBatch(batch, classId);
        if (!batchId) throw new Error(`Failed to get batch ID for batch ${i + 1}`);
        
        batchIds.push(batchId);
        setCreatedBatches([...batchIds]);

        // Create all sessions for this batch
        for (const session of batch.sessions) {
          await createSession(session, batchId);
        }
      }

      setSubmitStatus({
        type: "success",
        message: `Successfully created ${values.batches.length} batches and ${values.batches.reduce((total, batch) => total + batch.sessions.length, 0)} sessions!`,
      });

      // Completion callback can be added here if needed in the future

    } catch (error) {
      console.error("Error creating batches and sessions:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to create some batches or sessions. Please try again.",
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Batches & Sessions</h1>
          <p className="text-gray-600">Create batches and schedule sessions for your class</p>
          {classId && (
            <p className="text-sm text-gray-500 mt-1">Class ID: {classId}</p>
          )}
        </div>

        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {submitStatus.message}
          </div>
        )}

        {createdBatches.length > 0 && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
            <p className="font-medium">Progress: {createdBatches.length} batches created</p>
          </div>
        )}

        <Formik
          initialValues={{
            class_id: classId,
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
                            {createdBatches.length > batchIndex && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                Created
                              </span>
                            )}
                          </h3>
                          {batchIndex > 0 && (
                            <button
                              type="button"
                              onClick={() => removeBatch(batchIndex)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              disabled={isSubmitting}
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
                              disabled={isSubmitting}
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
                              onChange={(e) => handleBatchFileChange(e, setFieldValue, batchIndex)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    >
                      <span className="mr-2">+</span> Add New Batch
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* Submit Button */}
              <div className="flex justify-center pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting || !classId}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Batches & Sessions...
                    </>
                  ) : (
                    'Create All Batches & Sessions'
                  )}
                </button>
              </div>

              {!classId && (
                <div className="text-center text-red-600 text-sm">
                  Class ID is required to create batches and sessions
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BatchesSessions;