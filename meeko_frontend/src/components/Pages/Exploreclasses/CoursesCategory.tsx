import bgimg from "../../../assets/images/Exploreclass_images/background.png"
import { useCourses } from '../../../Hooks/useCourses';
import type { Course } from "../../../Hooks/useCourses";

function CoursesCategory() {
    const { data: course=[], isLoading, error } = useCourses();
    const bgcolors = ['bg-green-300', 'bg-pink-300', 'bg-blue-200', 'bg-red-300', 'bg-orange-300', 'bg-pink-500', 'bg-purple-300'];
    const bgstyle = {
        backgroundImage: `url(${bgimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading courses</div>;

    return (
        <div>
            <div className="explore_class_container bg-red-100 px-20 py-20 ">
                <div className="explore_class_title flex justify-center text-3xl font-bold mb-10">
                    Browse From Classes
                </div>
                <div className="card_main_container flex flex-wrap justify-center  ">
                    {course.map((item:Course, index:number) => (
                        <div key={index} className="card_container bg-gray-100 border-4 border-white shadow-lg rounded-2xl p-4 m-2 transform transition-all duration-300  hover:shadow-xl cursor-pointer">
                            <div className='border-4 border-white rounded-2xl '>
                            <div className="overflow-hidden rounded-2xl ">
                                <div 
                                    style={bgstyle} 
                                    className={`card_inner w-50 ${bgcolors[index % bgcolors.length]} p-5 rounded-2xl transform transition-transform duration-500 hover:scale-130`}
                                >
                                    <div className="card_img flex justify-center border-white">
                                        <img 
                                            src={`http://localhost:3000/images/${item.course_image}`} 
                                            alt={item.course_name} 
                                            className='h-15 w-15 transform transition-transform duration-300 ' 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="course_name font-semibold flex p-2 justify-center mt-2 transition-colors duration-300 ">
                                {item.course_name}
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CoursesCategory