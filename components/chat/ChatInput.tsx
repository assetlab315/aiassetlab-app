"use client";

import { FormEvent, useState } from "react";

type Props = {
  onSubmit: (message: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSubmit, disabled = false }: Props) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim() || disabled) {
      return;
    }

    onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex gap-3">
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={disabled}
        placeholder="例：毎月3万円なら何から始めるべき？"
        className="min-h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 disabled:bg-slate-50"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="rounded-2xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        送信
      </button>
    </form>
  );
}
