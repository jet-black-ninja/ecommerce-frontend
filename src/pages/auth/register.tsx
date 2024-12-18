import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import CommonForm from '@/components/common/form';
import { useToast } from '@/hooks/use-toast';
import { registerFormControls } from '../../config/config';
import { registerUser } from '@/store/auth-slice';
import { AppDispatch } from '@/store/store';

interface IState {
  username: string;
  email: string;
  password: string;
}
const initialState:IState = {
  username: '',
  email: '',
  password: '',
};

export default function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data:any) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate('/auth/login');
      } else {
        toast({
          title: data?.payload?.message,
          variant: 'destructive',
        });
      }
    });
  }
  // console.log(formData); debugging purposes
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
        <p className="mt-2">
          Already have an account ?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={'Sign Up'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
