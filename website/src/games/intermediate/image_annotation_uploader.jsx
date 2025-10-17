import ImageHighlighter from "../image_highlighter.jsx";

export default function ImageAnnotationUploader() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-6">
      <header className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-purple-700">Image Annotation Uploader</h1>
        <p className="mt-2 text-gray-700">
          Upload an image, mark areas of interest directly on the canvas, and download your annotated copy.
        </p>
      </header>
      <ImageHighlighter />
    </div>
  );
}

