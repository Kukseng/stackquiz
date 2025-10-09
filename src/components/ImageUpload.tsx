// // components/ImageUpload.tsx
// "use client";

// import React, { useRef, useState, useCallback } from "react";

// interface ImageUploadProps {
//   questionId: number;
//   imageUrl?: string | null;
//   onUploadStart?: () => void;
//   onUploadComplete?: (url: string | null) => void;
//   onError?: (err: string) => void;
// }

// export default function ImageUpload({ questionId, imageUrl, onUploadStart, onUploadComplete, onError }: ImageUploadProps) {
//   const [preview, setPreview] = useState<string | null>(imageUrl || null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState<number | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const handleFile = useCallback(async (file: File) => {
//     if (!file) return;
//     // preview
//     const reader = new FileReader();
//     reader.onload = () => {
//       const result = reader.result as string;
//       setPreview(result);
//     };
//     reader.readAsDataURL(file);

//     // upload as base64 to /api/upload
//     try {
//       setUploading(true);
//       setProgress(0);
//       onUploadStart?.();

//       const freader = new FileReader();
//       freader.onload = async () => {
//         const base64 = freader.result as string; // data:<mime>;base64,...
//         // send to server
//         const res = await fetch("/api/upload", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ data: base64, filename: file.name }),
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(text || "Upload failed");
//         }

//         const json = await res.json();
//         const uploadedUrl = json.url as string;
//         setUploading(false);
//         setProgress(100);
//         onUploadComplete?.(uploadedUrl);
//         setPreview(uploadedUrl);
//       };
//       freader.readAsDataURL(file);
//     } catch (err: any) {
//       setUploading(false);
//       onError?.(err.message || "Upload error");
//     }
//   }, [onUploadComplete, onUploadStart, onError]);

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file) handleFile(file);
//   };

//   const handleChooseFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) handleFile(file);
//   };

//   const openFilePicker = () => inputRef.current?.click();

//   return (
//     <div>
//       <div
//         className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer relative"
//         onDrop={handleDrop}
//         onDragOver={(e) => e.preventDefault()}
//         onClick={openFilePicker}
//         aria-label="Upload image"
//       >
//         {preview ? (
//           <div className="w-full h-48 relative">
//             {/* show preview image */}
//             {/* Use next/image if you prefer; dynamic local base64 works with img tag */}
//             <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md" />
//             <div className="absolute top-2 right-2 bg-white/70 px-2 py-1 rounded-md text-sm">Change</div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-600">
//             <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
//               <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="1.5"></path>
//             </svg>
//             <div className="font-medium">Drag & drop an image, or click to browse</div>
//             <div className="text-xs text-gray-400">Supports jpg, png. Will upload to cloud.</div>
//           </div>
//         )}

//         {uploading && (
//           <div className="absolute bottom-2 left-4 right-4">
//             <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
//               <div className="h-2 bg-blue-500" style={{ width: `${progress ?? 10}%` }} />
//             </div>
//             <div className="text-xs mt-1 text-white">{progress ?? 0}%</div>
//           </div>
//         )}

//         <input
//           ref={inputRef}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleChooseFile}
//         />
//       </div>
//     </div>
//   );
// }
