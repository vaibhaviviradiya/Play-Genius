import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Play, ChevronDown, ChevronUp } from "lucide-react";

interface Session {
  _id: string;
  session_name: string;
  description: string;
  start_time: string;
  end_time: string;
  date: string;
  is_active: boolean;
}

interface Batch {
  _id: string;
  batch_name: string;
  sessions: Session[];
}

interface ClassData {
  _id: string;
  educator_name: string;
  course_name: string;
  class_name: string;
  description: string;
  class_language: string;
  class_images: string;
  class_size: number;
  price_per_session: number;
  is_free: boolean;
  is_popular: boolean;
  created_at: string;
  batches: Batch[];
}

const MyClasses = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/educator/getallclasssesofeducator", {
      headers: { Authorization: token || "" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setClasses(data.data);
      })
      .catch((err) => console.error("Error fetching classes:", err));
  }, []);

  if (!classes.length) {
    return <div className="p-6 text-gray-500">No classes found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
        <button
          onClick={() => navigate("/educator/dashboard/createclass")}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-600 transition"
        >
          + Create New Class
        </button>
      </div>

      {/* Loop through all classes */}
      {classes.map((classData, index) => (
        <>
          <div key={classData._id} className="space-y-6">
            {/* Class Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex gap-6">
                <img
                  src={classData.class_images}
                  alt={classData.class_name}
                  className="w-40 h-40 object-cover rounded-xl border"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">{classData.class_name}</h2>
                  <p className="text-gray-500 mb-2">{classData.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <p><strong>Language:</strong> {classData.class_language}</p>
                    <p><strong>Course:</strong> {classData.course_name}</p>
                    <p><strong>Class Size:</strong> {classData.class_size}</p>
                    <p><strong>Price:</strong> {classData.is_free ? "Free" : `$${classData.price_per_session}`}</p>
                    <p><strong>Popular:</strong> {classData.is_popular ? "Yes ⭐" : "No"}</p>
                    <p><strong>Created:</strong> {new Date(classData.created_at).toDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Batches */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Batches & Sessions</h3>

              {classData.batches.map((batch) => (
                <div key={batch._id} className="bg-white rounded-xl shadow-sm border">
                  {/* Batch Header */}
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setExpandedBatch(expandedBatch === batch._id ? null : batch._id)
                    }
                  >
                    <h4 className="font-semibold text-gray-700">{batch.batch_name}</h4>
                    {expandedBatch === batch._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  {/* Sessions */}
                  {expandedBatch === batch._id && (
                    <div className="divide-y">
                      {batch.sessions.map((session) => (
                        <div
                          key={session._id}
                          className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                        >
                          <div>
                            <h5 className="font-medium text-gray-800">{session.session_name}</h5>
                            <p className="text-sm text-gray-500">{session.description}</p>
                            <div className="flex gap-4 mt-2 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(session.date).toDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Play className="w-4 h-4" />
                                {session.start_time} - {session.end_time}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-0">
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${
                                session.is_active
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {session.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {index !== classes.length - 1 && <hr className="my-10 border-t-4 border-cyan-300" />}
        </>
      ))}
    </div>
  );
};

export default MyClasses;
