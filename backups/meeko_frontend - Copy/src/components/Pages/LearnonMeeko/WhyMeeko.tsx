import whymeeko from '../../../assets/images/learnmeeko_images/why-meeko2.png';
import why1 from '../../../assets/images/learnmeeko_images/why1.png';
import why2 from '../../../assets/images/learnmeeko_images/why2.png';
import why3 from '../../../assets/images/learnmeeko_images/why (3).png';
import why4 from '../../../assets/images/learnmeeko_images/why_1.png';

import wave from '../../../assets/images/learnmeeko_images/wave-1.png';




function WhyMeeko() {
    return (
        <div>
            <div className="whymeeko_container bg-gray-100 px-10 py-10">
                <div className="whymeeko_title justify-center flex mb-6">
                    <img src={whymeeko} className='' alt="" />
                </div>
                <div className="grid grid-cols-12 gap-4 items-center min-h-[500px]">
                    <div className="col-span-4 flex">
                        <div className='flex flex-col items-end justify-end   w-full h-full'>
                            <div className="relative w-[300px] h-[300px] m-3"> {/* Adjust size as needed */}
                                <img src={wave} className="absolute top-0 left-0 w-70 h-70 object-contain rounded-3xl" alt="Wave Background" />
                                <img src={why1} className="w-50 h-50 absolute top-1/4 left-1/4 w-1/2 h-1/2 object-contain" alt="Why1 Overlay" />
                            </div>
                            <div className='flex flex-col items-end justify-end   w-full h-full'>
                                <img src={why3} className="object-contain" alt="Why1 Overlay" />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4  m-5 p-2">
                        <div className='flex flex-col items-end justify-end space-y-10  w-full h-full'>
                            <div className="text-center">
                                <p className="text-3xl  font-bold text-gray-700">
                                    Avatars & Accessories for a personalized experience
                                </p>
                            </div>
                            <p className="text-3xl  font-bold text-gray-700">
                                Avatars & Accessories for a personalized experience
                            </p>
                        </div>
                    </div>
                    <div className="col-span-4 ">
                        <div className='flex flex-col items-start justify-start   w-full h-full'>
                            <img src={why2} className="m-3 object-contain" alt="Why2 Overlay" />
                        </div>
                          <div className='flex flex-col items-end justify-end   w-full h-full'>
                            
                            <img src={why4} className="m-3 w-40 y-40 object-contain" alt="Why2 Overlay" />
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhyMeeko