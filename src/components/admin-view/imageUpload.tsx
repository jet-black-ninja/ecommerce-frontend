import { useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import axios from 'axios';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Dispatch, SetStateAction } from '@reduxjs/toolkit';
interface Props {
  imageFile: File | null;
  setImageFile: SetStateAction<File | null>;
  imageLoadingState: boolean;
  uploadedImageUrl: string | null;
  setUploadedImageUrl: Dispatch<SetStateAction<string | null>>;
  isEditMode: boolean;
  isCustomStyling?: boolean;
}
//TODO add props
function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}: Props) {
  const inputRef = useRef(null);
  const serverURL = import.meta.env.VITE_SERVER_URL;
  function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append('my-file', imageFile);
    const response = await axios.post(
      `${serverURL}/api/admin/products/upload-image`,
      data
    );
    // console.log(response, 'response');
    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <Label className="text-lg font-semibold mb-2 block"> Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? 'opacity-60' : ''} border-2 border-dashed rounded-lg p-4  `}
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
            className={`${isEditMode ? 'cursor-not-allowed' : ''}
                        flex flex-col items-center justify-center h-32 cursor-pointer
                    }`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span> Darg & Drop or Click to Upload Image</span>
          </Label>
        ) : !imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex ic justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="tex-sm font-medium">{imageFile.name}</p>
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
