import React from 'react';

interface ProgramCardProps {
  title: string;
  description: string;
  difficulty: string;
  difficultyColor: string;
  difficultyBgColor: string;
  level: string;
  studentCount: string;
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
  altText?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  difficulty,
  difficultyColor,
  difficultyBgColor,
  level,
  studentCount,
  imageSrc,
  gradientFrom,
  gradientTo,
  altText
}) => {
  return (
    <div className="bg-white hover:shadow-lg transition-all duration-300 
    rounded-xl overflow-hidden group cursor-pointer">
      {/* Upper Half - Image */}
      <div className={`relative h-48 bg-gradient-to-br from-${gradientFrom} to-${gradientTo} overflow-hidden`}>
        <img 
          src={imageSrc} 
          alt={altText || `${title} 課程`} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        />
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold drop-shadow-lg">{title}</h3>
          </div>
        </div>
        {/* Arrow indicator */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Lower Half - Content */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-medium ${difficultyColor} ${difficultyBgColor} px-3 py-1 rounded-full`}>
            {difficulty}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{level}</span>
        </div>
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{studentCount} 學生</span>
          </div>
          <span className="text-[#7A9CEB] font-medium">Mathy Official</span>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
