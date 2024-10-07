import { useEffect, useRef } from "react";
import axios from "axios";
import { Label } from "../ui/label";
function ProductImageUpload({
    imageFile,
    setImageFile,
    imageLoadingState,
    uploadedImageUrl,
    setUploadedImageUrl,
    setImageLoadingState,
    isCustomStyling = false,
}) {
    const inputRef = useRef(null);

    function handleImageFileChange(event) {
        const selectedFile = event.target.files?.[0];
        if(selectedFile) setImageFile(selectedFile);
    }

    function DragOver(event){
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if(droppedFile) setImageFile(droppedFile);
    }

    function handleRemoveImage() {
        setImageFile(null);
        if(inputRef.current) {
            inputRef.current.value = null;
        }
    }

    async function uploadImageToCloudinary () {
        setImageLoadingState(true);
        const data = new FormData();
        data.append('my_file', imageFile);
        const response = await axios.post(
            `${process.env.VITE_SERVER_URL}/api/admin/products/upload-image`,
            data
        );
        console.log(response, 'response');
        if(response?.data?.success){
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false);
        }
    }

    useEffect(() => {
        if(imageFile !== null) uploadImageToCloudinary();
    },[imageFile]);

    return (
        <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
            <Label className="text-lg font-semibold mb-2 block"> Upload Image</Label>
        </div>
    )
}
export default ProductImageUpload;