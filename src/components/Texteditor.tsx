// components/RichTextEditor.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};

export default RichTextEditor;
