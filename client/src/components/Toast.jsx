import React, { useEffect, useState } from 'react';
import './Toast.css';

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 1800);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className={`toast ${visible ? 'toast--visible' : 'toast--hidden'}`}>
      {message}
    </div>
  );
}
