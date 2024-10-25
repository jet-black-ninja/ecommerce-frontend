import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CommonForm from '../common/form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { addressFormControls } from '@/config/config';
import {
  addNewAddress,
  editAddress,
  deleteAddress,
  fetchAllAddresses,
} from '@/store/shop/address-slice';
import AddressCard from './address-card';
import { useToast } from '@/hooks/use-toast';
import { AppDispatch, RootState } from '@/store/store';

interface IFormData {
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
}
const initialAddressFormData: IFormData = {
  address: '',
  city: '',
  phone: '',
  pincode: '',
  notes: '',
};
/*@ts-ignore*/
function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const { addressList } = useSelector((state: RootState) => state.shopAddress);
  /*@ts-ignore*/
  function handleManageAddress(event) {
    event.preventDefault();
    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: 'You can at max add 3 addresses',
        variant: 'destructive',
      });
      return;
    }
    if (currentEditedId !== null) {
      dispatch(
        editAddress({
          /*@ts-ignore*/
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          /*@ts-ignore*/
          dispatch(fetchAllAddresses(user?.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast({
            title: 'Address Updated Successfully',
          });
        }
      });
    } else {
      dispatch(
        /*@ts-ignore*/
        addNewAddress({
          ...formData,
          userId: user?.id,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          /*@ts-ignore*/
          dispatch(fetchAllAddresses(user?.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast({
            title: 'Address Added Successfully',
          });
        }
      });
    }
  } /*@ts-ignore*/
  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  } /*@ts-ignore*/
  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      /*@ts-ignore*/
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        /*@ts-ignore*/
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: 'Address Deleted Successfully',
        });
      }
    });
  }
  function isFormValid() {
    return Object.keys(formData) /*@ts-ignore*/
      .map((key) => formData[key].trim() !== '')
      .every((item) => item);
  }
  useEffect(() => {
    /*@ts-ignore*/
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((addressItem) => (
              <AddressCard
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={addressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={
                  setCurrentSelectedAddress
                } /*@ts-ignore*/
                key={addressItem._id}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? 'Edit Address' : 'Add New Address'}
        </CardTitle>
        <CardContent className="space-y-3">
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
          />
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export default Address;
