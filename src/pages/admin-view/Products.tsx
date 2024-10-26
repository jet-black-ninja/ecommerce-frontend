import { FormEvent, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { addProductFormElements } from '@/config/config';
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from '@/store/admin/products-slice';
import { AppDispatch, RootState } from '@/store/store';
import ProductImageUpload from '@/components/admin-view/imageUpload';
import AdminProductTile from '@/components/admin-view/product-tile';
interface FromDataProps {
  image: File | null;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number | null;
  salePrice: number | null;
  totalStock: number | null;
  averageReview: number;
}

const initialFormData: FromDataProps = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: null,
  salePrice: null,
  totalStock: null,
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<FromDataProps>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  const { productList } = useSelector((state: RootState) => state.adminProduct);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductDialog(false);
          setCurrentEditedId(null);
        }
      });
    } else {
      // @ts-ignore
      dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: 'Product added successfully',
            });
          }
        }
      );
    }
  }

  function handleDelete(getCurrentProductId: string) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: 'Product deleted successfully',
        });
      }
    });
  }
  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== 'averageReview') //@ts-ignore
      .map((key) => formData[key] !== '')
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <div>
      <Fragment>
        <div className="mb-5 w-full flex justify-end">
          <Button onClick={() => setOpenCreateProductDialog(true)}>
            Add New Product{' '}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cold-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <AdminProductTile 
                  key={productItem._id}
                  setFormData={setFormData}
                  setOpenCreateProductDialog={setOpenCreateProductDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  product={productItem}
                  handleDelete={handleDelete}
                />
              ))
            : null}
        </div>

        <Sheet
          open={openCreateProductDialog}
          onOpenChange={() => {
            setOpenCreateProductDialog(false);
            setCurrentEditedId(null);
            setFormData(initialFormData);
          }}
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>
                {currentEditedId ? 'Edit Product' : 'Add New Product'}
              </SheetTitle>
            </SheetHeader>
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />
            <div className="py-6">
              <CommonForm
                formData={formData}
                onSubmit={onSubmit}
                setFormData={setFormData}
                buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
                formControls={addProductFormElements}
                isBtnDisabled={!isFormValid()}
              />
            </div>
          </SheetContent>
        </Sheet>
      </Fragment>
    </div>
  );
}

export default AdminProducts;
