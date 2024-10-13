import React, { useState, useEffect } from 'react';
import { Icon } from '@tldraw/tldraw';

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
        <Icon icon="edit" />
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
