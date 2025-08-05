import { useEffect, useState } from "react"
import i1 from '../../assets/images/Home_images/4.jpg'
import i2 from '../../assets/images/Home_images/6.jpg'
import i3 from '../../assets/images/Home_images/7.jpg'

function HomeSlider() {

    const slideData = [
        { id: 1, img: i1, text: "Play while you Learn , Learn while you play" },
        { id: 2, img: i2, text: "Experience Planet in Meeko Metaverse" },
        { id: 3, img: i3, text: "Freedom to Choose Your Educator" },
    ]
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slideData.length - 1 : prev - 1))
    }
    const nextSlide = () => {
        setCurrentIndex(prev => (prev === slideData.length - 1 ? 0 : prev + 1))
    }
    const [currentIndex, setCurrentIndex] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div>
            <div className="home-slider w-full flex ">
                
                    <div  className={`w-full h-145`}>
                        <div  className="flex items-center justify-center h-full">
                            {/* <h1 className="text-2xl font-bold">{slide.text}</h1> */}
                            <img src={slideData[currentIndex].img} className="w-full h-125 object-cover" alt="" />
                        </div>
                    </div>
            
            </div>
            {/* Buttons */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-blue-500/40 hover:bg-blue-500/70 text-white px-3 py-1 rounded-full transition"
            >
                ❮
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-500/40 hover:bg-blue-500/70 text-white px-3 py-1 rounded-full transition"
            >
                ❯
            </button>
        </div>
    )
}

export default HomeSlider