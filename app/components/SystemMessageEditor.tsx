import React, { useState, useEffect } from 'react';

interface SystemMessageEditorProps {
  initialMessage: string;
  onSave: (message: string) => void;
}

export function SystemMessageEditor({ initialMessage, onSave }: SystemMessageEditorProps) {
  const [message, setMessage] = useState(initialMessage);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);

  const handleSave = () => {
    onSave(message);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button className="system-message-editor-button" onClick={() => setIsEditing(true)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.5 2a2.5 2.5 0 0 1 3.5 3.5L6 14.5 2 15l.5-4L11.5 2z"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="system-message-editor">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={10}
        cols={50}
      />
      <div className="system-message-editor-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    </div>
  );
}
