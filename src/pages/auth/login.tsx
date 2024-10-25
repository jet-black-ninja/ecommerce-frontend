import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { loginFormControls } from '@/config/config';
import { loginUser } from '@/store/auth-slice';
import CommonForm from '@/components/common/form';
import { AppDispatch } from '@/store/store';

interface FormData {
  email: string;
  password: string;
}
interface LoginResponse {
  payload: {
    success: boolean;
    message: string;
  };
}
const initialData: FormData = {
  email: '',
  password: '',
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialData);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    try {
      const data = (await dispatch(loginUser(formData))) as LoginResponse;
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: `An error occurred during login. ${error}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={'Sign In'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default AuthLogin;
