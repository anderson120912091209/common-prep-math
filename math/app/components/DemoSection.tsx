'use client'

interface DemoSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  buttonText: string;
  onButtonClick?: () => void;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
}

export default function DemoSection({
  title,
  description,
  imageSrc,
  imageAlt,
  buttonText,
  onButtonClick,
  backgroundImageSrc,
  backgroundImageAlt
}: DemoSectionProps) {
  return (
    <section className="bg-white py-2 md:py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div 
          className="rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-lg relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f1f3f8 0%, #e8f0fe 50%, #dce7f7 100%)'
          }}
        >
          {/* Background image positioned in the red circled area - top-right corner */}
          {backgroundImageSrc && (
            <img 
              src={backgroundImageSrc} 
              alt={backgroundImageAlt || "Background elements"} 
              className="absolute hidden md:block top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 xl:top-10 xl:right-10 opacity-40 
              w-24 h-16 md:w-32 md:h-20 lg:w-40 lg:h-24 xl:w-48 xl:h-32 pointer-events-none z-0"
            />
          )}
          
          {/* Inner container with better spacing */}
          <div className="max-w-full md:max-w-5xl xl:max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left - Demo Image */}
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <div className="max-w-sm md:max-w-lg xl:max-w-xl">
                  <img 
                    src={imageSrc} 
                    alt={imageAlt} 
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Right - Description with more space */}
              <div className="order-1 lg:order-2 space-y-6 lg:space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[#2B2B2B] leading-tight">
                    {title}
                  </h2>
                  <p className="text-sm md:text-base lg:text-lg text-[#2B2B2B] font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                    {description}
                  </p>
                </div>

                <div className="pt-2">
                  <button 
                    className="bg-[#7A9CEB] hover:bg-[#6B8CD9] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium transition-colors text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    onClick={onButtonClick}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
