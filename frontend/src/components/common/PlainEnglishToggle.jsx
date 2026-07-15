import React from "react";

export default function PlainEnglishToggle({
  enabled,
  onToggle,
  hasPlainVersion,
}) {
  if (!hasPlainVersion) {
    return (
      <span className="text-xs text-ink/40 italic">
        (Plain English version coming soon)
      </span>
    );
  }

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={enabled} onChange={onToggle} />
      <span className="toggle-slider"></span>
      <span className="ml-3 text-sm font-medium text-ink/70">
        {enabled ? "✨ Plain" : "⚖️ Legal"}
      </span>
    </label>
  );
}
