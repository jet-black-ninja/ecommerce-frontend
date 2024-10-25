import { useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import axios from 'axios';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react'; // Importing from react instead of @reduxjs/toolkit

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface Props {
  imageFile: File | null;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  imageLoadingState: boolean;
  uploadedImageUrl?: string | null;
  setUploadedImageUrl: Dispatch<SetStateAction<string | null>>;
  setImageLoadingState: Dispatch<SetStateAction<boolean>>;
  isEditMode: boolean;
  isCustomStyling?: boolean;
}

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const serverURL = import.meta.env.VITE_SERVER_URL;

  function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(() => selectedFile); // Using functional update form
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(() => droppedFile); // Using functional update form
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {// @ts-ignore
      inputRef.current.value = null;
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();// @ts-ignore
    data.append('my-file', imageFile);
    try {
      const response = await axios.post(`${serverURL}/api/admin/products/upload-image`, data);
      if (response?.data?.success) {
        setUploadedImageUrl(() => response.data.result.url); // Using functional update form
        setImageLoadingState(() => false); // Using functional update form
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageLoadingState(() => false); // Using functional update form
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? 'opacity-60' : ''} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? 'cursor-not-allowed' : ''} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & Drop or Click to Upload Image</span>
          </Label>
        ) : !imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
