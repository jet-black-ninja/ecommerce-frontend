import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProductImageUpload from '@/components/admin-view/imageUpload';
import { Button } from '@/components/ui/button';
import { addFeatureImage, getFeatureImages } from '@/store/common-slice';
import { AppDispatch, RootState } from '@/store/store';
function AdminDashboard() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { featureImageList } = useSelector((state: RootState) => state.common);

  // console.log(uploadedImageUrl, 'uploadedImageUrl');

  function handleUploadFeatureImage() {
    
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      //@ts-ignore
      if (data?.payload.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl('');
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // console.log(featureImageList, 'featureImageList');

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        isEditMode={false}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImgItem) => (
            <div className="relative" key={featureImgItem._id}>
              <img
                src={featureImgItem.image}
                className="w-full h-[300px] object-cover rounded-t-lg"
              />
            </div>
          ))
        ) : (
          <div className="flex text-center flex-col">No Images</div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
