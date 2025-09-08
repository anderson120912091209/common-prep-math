'use client';

import { useState, useEffect } from 'react';
import { createProblem, getCategories } from '@/lib/admin-db';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  display_name: string;
  color_hex: string;
}

export default function CreateProblemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    correct_answer: '',
    solution_explanation: '',
    difficulty_level: 1,
    problem_type: 'multiple_choice',
    estimated_time_minutes: 5,
    category_ids: [] as number[],
    options: [
      { content: '', is_correct: false, explanation: '' },
      { content: '', is_correct: false, explanation: '' },
      { content: '', is_correct: false, explanation: '' },
      { content: '', is_correct: false, explanation: '' }
    ],
    hints: [
      { content: '', hint_type: 'conceptual', title: '' }
    ]
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.content.trim()) {
        alert('請輸入問題內容');
        return;
      }

      if (!formData.correct_answer.trim()) {
        alert('請輸入正確答案');
        return;
      }

      // Check if at least one option is marked as correct for multiple choice
      if (formData.problem_type === 'multiple_choice') {
        const hasCorrectOption = formData.options.some(opt => opt.is_correct && opt.content.trim());
        if (!hasCorrectOption) {
          alert('請選擇一個正確答案選項');
          return;
        }
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        difficulty_level: formData.difficulty_level as 1 | 2 | 3 | 4 | 5, // Type assertion
        problem_type: formData.problem_type as 'multiple_choice' | 'free_response' | 'true_false' | 'fill_blank', // Type assertion
        category_ids: formData.category_ids.length > 0 ? formData.category_ids : [1], // Default to algebra
        options: formData.problem_type === 'multiple_choice' 
          ? formData.options.filter(opt => opt.content.trim()) 
          : undefined,
        hints: formData.hints
          .filter(hint => hint.content.trim())
          .map(hint => ({
            ...hint,
            hint_type: hint.hint_type as 'conceptual' | 'calculation' | 'strategy' | 'check'
          }))
      };

      const result = await createProblem(submitData);
      
      alert(`問題創建成功！ID: ${result.id}`);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error creating problem:', error);
      alert('創建問題時發生錯誤，請檢查控制台');
    } finally {
      setLoading(false);
    }
  };

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    // If marking this option as correct, unmark others
    if (field === 'is_correct' && value === true) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }
    
    setFormData({ ...formData, options: newOptions });
  };

  const updateHint = (index: number, field: string, value: any) => {
    const newHints = [...formData.hints];
    newHints[index] = { ...newHints[index], [field]: value };
    setFormData({ ...formData, hints: newHints });
  };

  const addHint = () => {
    setFormData({
      ...formData,
      hints: [...formData.hints, { content: '', hint_type: 'conceptual', title: '' }]
    });
  };

  const removeHint = (index: number) => {
    const newHints = formData.hints.filter((_, i) => i !== index);
    setFormData({ ...formData, hints: newHints });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📝 創建新問題</h1>
              <p className="text-gray-600">添加新的數學問題到資料庫</p>
            </div>
            <Link 
              href="/admin/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ← 返回管理面板
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本資訊</h2>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                問題標題 (選填)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如：二次方程式求解"
              />
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                問題內容 * <span className="text-red-500">必填</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="輸入數學問題的內容..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                提示：可以使用 LaTeX 語法，例如 $x^2 + 2x + 1 = 0$
              </p>
            </div>

            {/* Problem Type and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  問題類型
                </label>
                <select
                  value={formData.problem_type}
                  onChange={(e) => setFormData({ ...formData, problem_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="multiple_choice">選擇題</option>
                  <option value="free_response">自由作答</option>
                  <option value="true_false">是非題</option>
                  <option value="fill_blank">填空題</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  難度等級
                </label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 - 基礎</option>
                  <option value={2}>2 - 簡單</option>
                  <option value={3}>3 - 中等</option>
                  <option value={4}>4 - 困難</option>
                  <option value={5}>5 - 專家</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  預估時間 (分鐘)
                </label>
                <input
                  type="number"
                  value={formData.estimated_time_minutes}
                  onChange={(e) => setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="120"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分類標籤
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.category_ids.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            category_ids: [...formData.category_ids, category.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            category_ids: formData.category_ids.filter(id => id !== category.id)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{category.display_name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Answer Options (for multiple choice) */}
          {formData.problem_type === 'multiple_choice' && (
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">答案選項</h2>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3 p-3 border rounded-md">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={option.content}
                    onChange={(e) => updateOption(index, 'content', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`選項 ${String.fromCharCode(65 + index)}`}
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={option.is_correct}
                      onChange={() => updateOption(index, 'is_correct', true)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-600">正確</span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Correct Answer */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">正確答案</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                正確答案 * <span className="text-red-500">必填</span>
              </label>
              <input
                type="text"
                value={formData.correct_answer}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="輸入正確答案..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細解答 (選填)
              </label>
              <textarea
                value={formData.solution_explanation}
                onChange={(e) => setFormData({ ...formData, solution_explanation: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="提供詳細的解題步驟..."
              />
            </div>
          </div>

          {/* Hints */}
          <div className="border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">提示系統 (選填)</h2>
              <button
                type="button"
                onClick={addHint}
                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
              >
                + 添加提示
              </button>
            </div>
            
            {formData.hints.map((hint, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700">提示 {index + 1}</span>
                  {formData.hints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHint(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      移除
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={hint.title}
                    onChange={(e) => updateHint(index, 'title', e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="提示標題 (選填)"
                  />
                  <select
                    value={hint.hint_type}
                    onChange={(e) => updateHint(index, 'hint_type', e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="conceptual">概念提示</option>
                    <option value="calculation">計算提示</option>
                    <option value="strategy">策略提示</option>
                    <option value="check">檢查提示</option>
                  </select>
                </div>
                
                <textarea
                  value={hint.content}
                  onChange={(e) => updateHint(index, 'content', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="輸入提示內容..."
                />
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>創建中...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>創建問題</span>
                </>
              )}
            </button>
            
            <Link
              href="/admin/dashboard"
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              取消
            </Link>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 問題內容支援 LaTeX 數學公式，使用 $ 符號包圍公式</li>
            <li>• 選擇題至少需要2個選項，並標記正確答案</li>
            <li>• 提示系統可以幫助學生逐步解題</li>
            <li>• 創建後的問題會保存為草稿狀態，可以後續編輯和發布</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
