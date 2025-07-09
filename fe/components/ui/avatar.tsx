"use client"

import React from "react";

export function Avatar({ src, alt }: { src?: string; alt?: string }) {
  return src ? (
    <img
      src={src}
      alt={alt || "avatar"}
      className="w-8 h-8 rounded-full object-cover border"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 border">
      <span style={{ fontSize: 18 }}>👤</span>
    </div>
  );
}
