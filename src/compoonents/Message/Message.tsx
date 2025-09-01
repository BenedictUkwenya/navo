"use client";

import type React from "react";
import { useEffect } from "react";
import type { MessageType } from "../../types/exchange-rate";

interface MessageProps {
  message: MessageType | null;
  onClose: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`message message-${message.type}`}>{message.text}</div>
  );
};

export default Message;
