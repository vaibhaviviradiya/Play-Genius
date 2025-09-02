import { jwtDecode } from 'jwt-decode';
import { BarChart3, Calendar, Eye, Play, BookOpen, DollarSign, Star, MessageSquare, TrendingUp, Settings, Bell, User, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEducatorClasses } from '../../../Hooks/useEducatorClasses';

const EducatorDashboard = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [dateRange] = useState('21 Jan 2022 to 21 Feb 2022');
  const navigate = useNavigate()
  const { data: classes } = useEducatorClasses();
  console.log("total classses >> ",classes?.length);
  
  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3, active: true },
    { name: 'My Classes', icon: BookOpen, count: classes?.length || 0 },
    { name: 'Calendar', icon: Calendar },
    { name: 'My Space', icon: User },
    { name: 'Test', icon: MessageSquare },
    { name: 'Finance', icon: DollarSign },
    { name: 'Reviews & Rating', icon: Star },
    { name: 'Video Requests', icon: Play },
    { name: 'Class History', icon: BookOpen },
    { name: 'Meeko Journey', icon: TrendingUp },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Growth', icon: TrendingUp }
  ];

  const studentData = [
    { month: 'Jan', students: 1.5 },
    { month: 'Feb', students: 2.2 },
    { month: 'Mar', students: 1.8 },
    { month: 'Apr', students: 3.1 },
    { month: 'May', students: 2.8 },
    { month: 'Jun', students: 3.5 },
    { month: 'Jul', students: 4.2 },
    { month: 'Aug', students: 3.8 },
    { month: 'Sep', students: 4.5 },
    { month: 'Oct', students: 5.2 },
    { month: 'Nov', students: 4.8 },
    { month: 'Dec', students: 5.5 }
  ];
  const mytoken = localStorage.getItem("token");
  console.log("mytoken == ", mytoken);

  type DecodedToken = {
    educator_id?: string;
    educator_name?: string;
    educator_email?: string;
  };
  const [username, setUsername] = useState<string | undefined>("");
  useEffect(() => {
    if (mytoken) {
      const decoded = jwtDecode<DecodedToken>(mytoken);
      console.log("decoded token == ", decoded);
      setUsername(decoded.educator_name);
      console.log("username == ", username);
    } else {
      console.warn("No token found in localStorage.");
    }
  },[username,mytoken])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collapsible Sidebar */}
      <div className="group fixed left-0 top-0 h-screen z-10 transition-all duration-300 ease-in-out">
        {/* Sidebar Container */}
        <div className="w-16 group-hover:w-64 bg-gradient-to-b from-cyan-400 to-cyan-600 text-white h-full overflow-hidden transition-all duration-300 ease-in-out">
          <div className="p-2 h-full flex flex-col">
            <nav className="space-y-2 overflow-y-auto mt-20 flex-1 pr-1 scrollbar-hide">
              {sidebarItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${item.name === activeSection
                    ? 'bg-white text-black bg-opacity-20'
                    : 'hover:bg-white hover:text-cyan-600 hover:bg-opacity-10'
                    }`}
                  onClick={() => setActiveSection(item.name)}
                  title={item.name} // Tooltip for collapsed state
                >
                  <div className="flex items-center whitespace-nowrap">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.name}
                    </span>
                  </div>
                  {item.count && (
                    <span className="bg-gray bg-opacity-20 px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="ml-16 min-h-screen flex flex-col mt-20">

        {/* Header */}
        <div className="fixed bg-white shadow-sm border-b p-4 flex  items-center justify-between sticky">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">Welcome , {username}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm text-gray-600">{dateRange}</span>
              <ChevronDown className="w-4 h-4 ml-2 text-gray-600" />
            </div>
            <Bell className="w-5 h-5 text-gray-600" />
            <Settings className="w-5 h-5 text-gray-600" />
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {/* Class Progress Sidebar */}
          <div className="fixed right-6 top-43  w-64 bg-white rounded-3xl p-4 shadow-lg z-10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Class Progress</h4>
            </div>
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm mb-3">No class is in progress right now</div>
              <div className="text-sm text-gray-500">
                <span className="text-cyan-500">0.00</span> / <span className="text-cyan-500">1.00 GB</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Used</span>
                <span>Left</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid - More space for charts */}
          <div className="mr-72">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Students Enrolled Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Students Enrolled</h3>
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded mr-2"></div>
                    Total Students
                  </div>
                  <div className="text-2xl font-bold text-gray-800">1.5k</div>
                </div>

                {/* Chart Area - More space for future charts */}
                <div className="flex space-x-1 h-40 mb-4">
                  {studentData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="bg-cyan-400 rounded-sm w-full hover:bg-cyan-500 transition-colors cursor-pointer"
                        style={{ height: `${(data.students / 5.5) * 100}%` }}
                        title={`${data.month}: ${data.students}k students`}
                      ></div>
                    </div>
                  ))}
                </div>
                <h4>chart for enroll students </h4>

                <button className="text-cyan-500 text-sm hover:underline">View All</button>
              </div>

              {/* Profile Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Profile Status</h3>

                <div className="space-y-4 mt-7 mb-6">
                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Profile Views</span>
                    </div>
                    <span className="font-semibold text-gray-800">0</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                    <div className="flex items-center">
                      <Play className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Video Views</span>
                    </div>
                    <span className="font-semibold text-gray-800">0</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Class Views</span>
                    </div>
                    <span className="font-semibold text-gray-800">0</span>
                  </div>
                </div>

                <button onClick={() => navigate("/educator/dashboard/myclasses")} className="text-cyan-500 text-sm hover:underline">View All</button>
              </div>

              {/* Total classes */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">My Classes</h3>

                <div className="bg-gradient-to-r mt-10 from-yellow-100 to-orange-100 rounded-xl p-6 border-2 border-orange-200 mb-4">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Total Classes</div>
                    <div className="text-3xl font-bold text-gray-800"> {classes?.length || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">Created by you</div>
                  </div>
                </div>

                <button
                  className="text-cyan-500 text-sm hover:underline"
                  onClick={() => navigate("/educator/dashboard/myclasses")}
                >
                  View All
                </button>
              </div>

            </div>

            {/* Bottom Row - Larger Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Next Class */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Next Class</h3>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-gray-500 mb-4">
                    "You have no upcoming classes right now. Create more now."
                  </div>
                  <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-600 transition-colors"
                    onClick={() => navigate('/educator/dashboard/createclass')}
                  >
                    Create Class
                  </button>
                </div>
              </div>

              {/* Reviews & Ratings */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Reviews & Ratings</h3>

                <div className="space-y-4">
                  <div className="bg-cyan-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cyan-800">Average Rating</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-gray-800 ml-1">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-4 text-center">
                    <div className="text-white text-sm mb-1">Total Reviews</div>
                    <div className="text-white text-2xl font-bold">290</div>
                  </div>
                </div>
              </div>

              {/* My Space - Enhanced */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Classes</h3>
                  <span className="text-sm font-medium text-gray-500">My Space</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-50">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Active Classes</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">0</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Deactivated</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">0</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Draft Classes</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">0</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Storage Used</div>
                  <div className="text-2xl font-bold text-gray-800 mb-2">0</div>
                  <div className="text-sm text-gray-500">
                    <span className="text-cyan-500">0.00</span> / <span className="text-cyan-500">1.00 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorDashboard;