'use client'

import { useState } from 'react';
import { toast } from "sonner";

interface FormProps {
  onSuccess?: () => void;
}

export default function Form({ onSuccess }: FormProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error("請填寫完整資料");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("請填寫有效的電子郵件地址");
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        // First, attempt to send the email
        const mailResponse = await fetch("/api/mail", {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstname: name, email }),
        });

        if (!mailResponse.ok) {
          if (mailResponse.status === 429) {
            reject("Rate limited");
          } else {
            reject("Email sending failed");
          }
          return; // Exit the promise early if mail sending fails
        }

        // If email sending is successful, proceed to insert into Notion
        const notionResponse = await fetch("/api/notion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });

        if (!notionResponse.ok) {
          if (notionResponse.status === 429) {
            reject("Rate limited");
          } else {
            reject("Notion insertion failed");
          }
        } else {
          resolve({ name });
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "正在將您加入等待名單... ",
      success: (data) => {
        setName("");
        setEmail("");
        onSuccess?.();
        return "感謝您加入等待名單!";
      },
      error: (error) => {
        if (error === "Rate limited") {
          return "您嘗試得太多了。請稍後再試。";
        } else if (error === "Email sending failed") {
          return "發送電子郵件失敗。請稍後再試。";
        } else if (error === "Notion insertion failed") {
          return "保存您的詳細資料失敗。請稍後再試。";
        }
        return "發生錯誤。請稍後再試。";
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="max-w-md mx-auto flex justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="您的姓名"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A9CEB] focus:border-transparent outline-none transition-all text-[#7A9CEB] placeholder-gray-400"
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="您的電子郵件"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A9CEB] focus:border-transparent outline-none transition-all text-[#7A9CEB] placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7A9CEB] hover:bg-[#6B8CD9] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          {loading ? "處理中..." : "加入等待名單"}
        </button>
      </form>
    </div>
  );
}