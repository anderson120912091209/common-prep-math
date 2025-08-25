'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface OnboardingData {
  mathInterests: string[];
  currentLevel: string;
  studyTime: string;
  learningGoals: string;
}

const mathFields = [
  { id: 'algebra', label: '代數' },
  { id: 'geometry', label: '幾何' },
  { id: 'calculus', label: '微積分' },
  { id: 'statistics', label: '統計學' },
  { id: 'linear_algebra', label: '線性代數' },
  { id: 'trigonometry', label: '三角函數' },
  { id: 'probability', label: '機率論' },
  { id: 'number_theory', label: '數論' },
  { id: 'competition_math', label: '競賽數學' },
  { id: 'applied_math', label: '應用數學' }
];

const currentLevels = [
  { id: 'beginner', label: '初學者', description: '剛開始學習數學' },
  { id: 'intermediate', label: '中等程度', description: '有基礎數學知識' },
  { id: 'advanced', label: '進階程度', description: '數學基礎紮實' },
  { id: 'expert', label: '專家級', description: '數學專業或競賽選手' }
];

const studyTimes = [
  { id: '30min', label: '30分鐘/天', description: '每天半小時' },
  { id: '1hour', label: '1小時/天', description: '每天一小時' },
  { id: '2hours', label: '2小時/天', description: '每天兩小時' },
  { id: '3plus', label: '3小時以上/天', description: '每天三小時以上' },
  { id: 'weekend', label: '週末集中學習', description: '主要在週末學習' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    mathInterests: [],
    currentLevel: '',
    studyTime: '',
    learningGoals: ''
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error('Auth error:', error);
          router.push('/waitlist');
          return;
        }

        setUser(user);
        
        // Check if user has already completed onboarding
        const { data: existingUser } = await supabase
          .from('waitlist')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        if (existingUser?.onboarding_completed) {
          router.push('/waitlist/success');
          return;
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/waitlist');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleMathInterestToggle = (fieldId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      mathInterests: prev.mathInterests.includes(fieldId)
        ? prev.mathInterests.filter(id => id !== fieldId)
        : [...prev.mathInterests, fieldId]
    }));
  };

  const handleLevelSelect = (levelId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      currentLevel: levelId
    }));
  };

  const handleStudyTimeSelect = (timeId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      studyTime: timeId
    }));
  };

  const handleGoalsChange = (goals: string) => {
    setOnboardingData(prev => ({
      ...prev,
      learningGoals: goals
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.mathInterests.length > 0;
      case 2:
        return onboardingData.currentLevel !== '';
      case 3:
        return onboardingData.studyTime !== '';
      case 4:
        return onboardingData.learningGoals.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      // Add user to waitlist with onboarding data
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert([
          {
            email: user.email,
            name: user.user_metadata?.name || user.user_metadata?.full_name,
            provider: user.app_metadata?.provider || 'oauth',
            avatar_url: user.user_metadata?.avatar_url,
            user_id: user.id,
            math_interests: onboardingData.mathInterests,
            current_level: onboardingData.currentLevel,
            study_time: onboardingData.studyTime,
            learning_goals: onboardingData.learningGoals,
            onboarding_completed: true
          }
        ])
        .select()
        .single();

      if (waitlistError && !waitlistError.message.includes('duplicate')) {
        console.error('Waitlist error:', waitlistError);
        throw new Error('Failed to save onboarding data');
      }

      router.push('/waitlist/success');
    } catch (error) {
      console.error('Error:', error);
      alert('發生錯誤，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A9CEB] mx-auto mb-4"></div>
          <p className="text-gray-600">正在載入...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo2.svg" alt="Mathy Logo" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              步驟 {currentStep} / 4
            </span>
            <Link href="/" className="text-gray-600 hover:text-[#2B2B2B] font-medium transition-colors">
              返回首頁
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-gray-100 h-2">
        <div 
          className="bg-[#7A9CEB] h-2 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Math Interests */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#2B2B2B] mb-4">
                  您想學習哪些數學領域？
                </h1>
                <p className="text-lg text-gray-600">
                  選擇您感興趣的數學領域，我們將為您推薦相關的學習內容
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mathFields.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => handleMathInterestToggle(field.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      onboardingData.mathInterests.includes(field.id)
                        ? 'border-[#7A9CEB] bg-[#7A9CEB]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{field.icon}</div>
                    <div className="text-sm font-medium text-[#2B2B2B]">
                      {field.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Current Level */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#2B2B2B] mb-4">
                  您目前的數學程度如何？
                </h1>
                <p className="text-lg text-gray-600">
                  這將幫助我們為您提供適合的學習內容
                </p>
              </div>

              <div className="space-y-4">
                {currentLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleLevelSelect(level.id)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                      onboardingData.currentLevel === level.id
                        ? 'border-[#7A9CEB] bg-[#7A9CEB]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg text-[#2B2B2B] mb-1">
                      {level.label}
                    </div>
                    <div className="text-gray-600">
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Study Time */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#2B2B2B] mb-4">
                  您每天可以投入多少時間學習？
                </h1>
                <p className="text-lg text-gray-600">
                  這將幫助我們制定適合您的學習計劃
                </p>
              </div>

              <div className="space-y-4">
                {studyTimes.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => handleStudyTimeSelect(time.id)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                      onboardingData.studyTime === time.id
                        ? 'border-[#7A9CEB] bg-[#7A9CEB]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg text-[#2B2B2B] mb-1">
                      {time.label}
                    </div>
                    <div className="text-gray-600">
                      {time.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Learning Goals */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#2B2B2B] mb-4">
                  您的學習目標是什麼？
                </h1>
                <p className="text-lg text-gray-600">
                  告訴我們您希望通過學習數學達到什麼目標
                </p>
              </div>

              <div>
                <textarea
                  value={onboardingData.learningGoals}
                  onChange={(e) => handleGoalsChange(e.target.value)}
                  placeholder="例如：我想在學測中取得好成績、我想參加數學競賽、我想提升邏輯思維能力..."
                  className="w-full p-6 rounded-xl border-2 border-gray-200 focus:border-[#7A9CEB] focus:ring-2 focus:ring-[#7A9CEB]/20 outline-none transition-all resize-none"
                  rows={6}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-600 hover:text-[#2B2B2B] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 1 ? '返回' : '上一步'}
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || submitting}
              className="px-8 py-3 bg-[#7A9CEB] hover:bg-[#6B8CD9] disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {submitting ? '處理中...' : currentStep === 4 ? '完成' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
