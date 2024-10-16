import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Label } from '../ui/label';

function addressCard({
  selectedId,
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  key,
}) {
  return (
    <Card
      onClick={() => setCurrentSelectedAddress(addressInfo)}
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? 'border-red-900 border-[4px]'
          : 'border-black'
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button
          onClick={() => handleDeleteAddress(addressInfo)}
          variant="destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default addressCard;
