import bluewave from '../../../assets/images/learnmeeko_images/blue-wave.png';
import relax from '../../../assets/images/learnmeeko_images/relax.png';
import trueicon from '../../../assets/images/learnmeeko_images/true-icon.png';
import banner from '../../../assets/images/learnmeeko_images/row_banner.png';

interface Benefit {
    id: number;
    text: string;
    bgColor: string;
}

function ParentBenefitsHero() {
    const leftBenefits: Benefit[] = [
        {
            id: 1,
            text: "Makes your kid's screen time more productive",
            bgColor: "bg-purple-300"
        },
        {
            id: 2,
            text: "Choose from 1000+ courses",
            bgColor: "bg-green-300"
        },
        {
            id: 3,
            text: "Talk about your queries with educators",
            bgColor: "bg-pink-300"
        }
    ];

    const rightBenefits: Benefit[] = [
        {
            id: 4,
            text: "Talk about your queries with educators",
            bgColor: "bg-pink-300"
        },
        {
            id: 5,
            text: "Connect with fellow Meekonians",
            bgColor: "bg-orange-300"
        },
        {
            id: 6,
            text: "Regular updates of your kid's progress",
            bgColor: "bg-teal-300"
        }
    ];

    const renderBenefitBox = (benefit: Benefit, justifyClass: string = "justify-start") => (
        <div key={benefit.id} className={`flex ${justifyClass}`}>
            <div className={`benefit_box ${benefit.bgColor} rounded-3xl px-6 py-4 shadow-lg max-w-sm transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                <div className="flex items-center gap-3">
                    <img src={trueicon} alt="check" className="w-6 h-6 flex-shrink-0" />
                    <p className="text-white font-semibold text-lg leading-tight">
                        {benefit.text}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="relax_moms_dad_container bg-gray-100 px-10 py-10">
                <div className="relax_moms_dad_title flex justify-center text-gray-500 text-3xl font-bold mb-4">
                    Relax Moms & Dads
                </div>
                <div className='flex justify-center'>
                    <img src={bluewave} className='' alt="" />
                </div>

                <div className="relax_moms_dad_content relative max-w-7xl mx-auto">
                    <div className="grid grid-cols-12 gap-4 items-center min-h-[500px]">

                        {/* Left Side Benefits */}
                        <div className="col-span-4 space-y-8">
                            {leftBenefits.map((benefit) => (
                                <div key={benefit.id}>
                                    {renderBenefitBox(benefit, "justify-end")}
                                </div>
                            ))}
                        </div>

                        {/* Center Image */}
                        <div className="col-span-4 flex justify-center">
                            <div className="relative">
                                <img src={relax} className='max-w-full h-auto' alt="family relaxing" />
                            </div>
                        </div>

                        {/* Right Side Benefits */}
                        <div className="col-span-4 space-y-6">
                            {rightBenefits.map((benefit) => renderBenefitBox(benefit, "justify-start"))}
                        </div>
                    </div>
                </div>
                <div className='join-for-free flex justify-center'>
                    <button className='bg-yellow-200 px-6 py-4 rounded-lg font-bold text-white' style={{ backgroundColor: ' #efc623' }}>Join For FREE</button>
                </div>
                    <div className="benefits_banner_row mt-15 relative flex">
                        <img src={banner} alt="Benefits Banner" className="w-full h-full object-cover rounded-3xl" />
                         <h1 className="align-center absolute font-black left-4 bottom-2 -translate-y-1/2 text-white p-5 text-3xl"><span style={{color:'#efc623'}}>Chill</span> while your child busy studying with us</h1>
                    </div>
                
            </div>
        </div>

    )
}

export default ParentBenefitsHero