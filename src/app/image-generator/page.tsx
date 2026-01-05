"use client";

import Generate from "./components/Generate/Index";

export default function ImageGeneratorPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-base-content mb-8">
          AI Image Generator
        </h1>
        <Generate />
      </div>
    </div>
  );
}
