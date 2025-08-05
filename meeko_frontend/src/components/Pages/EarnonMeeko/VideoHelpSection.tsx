import React, { useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';
import i1 from '../../../assets/images/ear_on_meeko/first-thumbnail.jpg'
import i2 from '../../../assets/images/ear_on_meeko/second-thumbnail.jpg'
import i3 from '../../../assets/images/ear_on_meeko/third-thumbnail.jpg'

interface VideoOption {
  id: number;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  frameTitle: string;
}

const VideoHelpSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoOption | null>(null);
  const [activeFrame, setActiveFrame] = useState<VideoOption | null>(null);

  const helpOptions: VideoOption[] = [
    {
      id: 1,
      title: "What is Meeko for educators?",
      description: "Learn the basics of Meeko platform",
      videoId: "FdF5VBNVU2E",
      thumbnail: "https://img.youtube.com/vi/FdF5VBNVU2E/maxresdefault.jpg",
      frameTitle: "How Meeko WORKS",
    },
    {
      id: 2,
      title: "Guide to Meeko?",
      description: "Complete walkthrough guide",
      videoId: "6ryNe2_c8gk",
      thumbnail: "https://img.youtube.com/vi/6ryNe2_c8gk/maxresdefault.jpg",
      frameTitle: "Meeko GUIDE",
    },
    {
      id: 3,
      title: "How to make a class?",
      description: "Step-by-step class creation",
      videoId: "1Ywacg_Iluc",
      thumbnail: "https://img.youtube.com/vi/1Ywacg_Iluc/maxresdefault.jpg",
      frameTitle: "How To Make CLASS",
    }
  ];

  // Set initial active frame to first option
  React.useEffect(() => {
    setActiveFrame(helpOptions[0]);
  }, []);

  // Change frame content when left button is clicked
  const changeFrame = (video: VideoOption) => {
    setActiveFrame(video);
  };

  // Open full video modal when play button is clicked
  const openVideoModal = (video: VideoOption) => {
    setSelectedVideo(video);
  };

  // Close video modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const openInYouTube = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="start_teaching_btn flex justify-center m-15">
        <div className="start_teach_inner_btn">
          <button className='p-5 rounded-xl w-275 text-white font-bold text-4xl' style={{ backgroundColor: '#efc623' }}>
            Start Teaching
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side - Help Options */}
        <div className="flex-1 max-w-md">
          <h2 className="text-4xl font-bold text-cyan-400 mt-20  mb-8">Find out more</h2>

          <div className="space-y-5">
            {helpOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => changeFrame(option)}
                className={`rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group ${activeFrame?.id === option.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-cyan-300 hover:to-blue-400'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-lg transition-colors ${activeFrame?.id === option.id
                    ? 'text-white group-hover:text-yellow-200'
                    : 'text-gray-700 group-hover:text-white'
                    }`}>
                    {option.title}
                  </h3>
                  <Play className={`w-6 h-6 transition-colors ${activeFrame?.id === option.id
                    ? 'text-white group-hover:text-yellow-200'
                    : 'text-gray-700 group-hover:text-white'
                    }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Dynamic Video Frame */}
        {activeFrame && (
          <div className="flex-1 max-w-2xl">
            <div className="relative bg-gradient-to-br flex from-cyan-500 to-blue-600 rounded-2xl p-8 overflow-hidden h-100">

              <div className="">

                {/* Perfect Image Positioning */}
                {activeFrame && (
                  <div className="flex justify-center items-center h-full">
                    <div
                      className="cursor-pointer hover:scale-120 transition-transform duration-300"
                      onClick={() => openVideoModal(activeFrame)}
                    >
                      <img
                        src={
                          activeFrame.id === 1 ? i3 :
                            activeFrame.id === 2 ? i2 :
                              i1
                        }
                        alt={activeFrame.title}
                        className="w-160 h-80 object-cover justify-center align-center rounded-xl shadow-2xl border-4 border-white/20"
                      />
                    </div>
                  </div>
                )}
  
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">{selectedVideo.title}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openInYouTube(selectedVideo.videoId)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in YouTube
                </button>
                <button
                  onClick={closeVideoModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoHelpSection;