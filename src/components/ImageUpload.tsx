"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";
// import "@uploadthing/react/styles.css";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endPoint: "postImage";
}

const ImageUpload = ({ endPoint, onChange, value }: ImageUploadProps) => {
  if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          alt="upload"
          className="rounded-md size-40 object-cover"
        />
        <button
          onClick={() => onChange("")}
          type="button"
          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm cursor-pointer"
        >
          <XIcon className="size-4 text-white" />
        </button>
      </div>
    );
  }
  return (
    <>
      <UploadDropzone
        endpoint={endPoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </>
  );
};

export default ImageUpload;
