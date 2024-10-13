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
      <div>
        <button onClick={() => setIsEditing(true)}>Edit System Message</button>
      </div>
    );
  }

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={handleSave}>Save</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </div>
  );
}
