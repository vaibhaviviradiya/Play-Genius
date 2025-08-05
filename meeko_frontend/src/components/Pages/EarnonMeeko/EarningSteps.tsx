import i1 from '../../../assets/images/ear_on_meeko/icon1.png'
import i2 from '../../../assets/images/ear_on_meeko/icon2.png'
import i3 from '../../../assets/images/ear_on_meeko/icon3.png'
import i4 from '../../../assets/images/ear_on_meeko/icon4.png'
import { useCourses } from '../../../Hooks/useCourses'
import type { Course } from '../../../Hooks/useCourses'

function EarningSteps() {
    
    const bgcolors = ['bg-green-300', 'bg-pink-300', 'bg-blue-200', 'bg-red-300', 'bg-orange-300', 'bg-pink-500', 'bg-purple-300'];
    const {data : course=[],isLoading,error}=useCourses();
    if(isLoading) return <div>Loading...</div>;
    if(error) return <div>Error loading courses</div>;

    const steps = [
        {
            icon: i1,
            text: 'Create your independent educator profile',
        },
        {
            icon: i2,
            text: 'Make your fee-based classes',
        },
        {
            icon: i3,
            text: 'Host live online classes on Meeko',
        },
        {
            icon: i4,
            text: 'Receive payment directly in your bank account',
        },
    ];

    return (
        <div>
            <div className="py-12 px-4 bg-white text-center relative">
                <div className="absolute top-10 right-10 w-16 h-16 bg-[#00b2dd] opacity-10 rounded-full"></div>
                <div className="absolute bottom-20 left-10 w-20 h-20 bg-[#f9b017] opacity-10 rounded-full"></div>
                <div className="absolute top-32 left-1/4 w-12 h-12 bg-[#00b2dd] opacity-5 rounded-full"></div>
                <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-[#f9b017] opacity-5 rounded-full"></div>


                <h2 className="text-4xl font-bold text-black mb-2 relative z-10 flex items-center justify-center gap-2">
                    <span>Earn in</span>
                    <span className="inline-flex bg-[#00b2dd] text-white rounded-full w-12 h-12 items-center justify-center text-2xl font-bold">
                        <div className='text-center'>4</div>
                    </span>
                    <span className="text-[#00b2dd]">Easy Steps</span>
                </h2>
                <div className="w-26 h-1 bg-[#f9b017] mx-auto rounded-full mb-16 relative z-10"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-[#eafafd] to-[#d1f2f7] rounded-full flex items-center justify-center mb-6 shadow-lg relative">
                                <div className="text-4xl">
                                    <img className='object-contain w-15 h-15' src={step.icon} alt="" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#00b2dd] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                            </div>
                            <p className="text-[#033342] text-lg font-medium text-center max-w-56 leading-relaxed">
                                {step.text}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-[#00b2dd] opacity-30"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="earn_row_banner">
                <div className="flex justify-center items-center py-4">
                    <h2 className="text-4xl text-[#00b2dd] font-bold flex items-center justify-center">
                        What you can teach?
                    </h2>
                </div>
            </div>
            <div className="courses_categories_outer">
                <div className="courses_categories_inner">
                    <div className="flex flex-wrap justify-center">
                      {
                        course.map((item: Course, index: number) => (
                            <div key={index} className={`course_category_card ${bgcolors [index % bgcolors.length]} shadow-2xl rounded-lg p-4 m-5 w-64 h-80`}>
                                <img 
                                    src={`http://localhost:3000/images/${item.course_image}`} 
                                    alt={item.course_name} 
                                    className="w-20 h-20 m-auto object-contain rounded-t-lg"
                                />
                                <h3 className="text-xl text-center text-white font-bold mt-2">{item.course_name}</h3>
                                <p className="text-white-600 text-center mt-1">{item.course_description}</p>
                            </div>
                        ))
                      }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EarningSteps;