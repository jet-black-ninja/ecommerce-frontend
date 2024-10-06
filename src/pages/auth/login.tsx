import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState } from "react";
import {loginFormControls} from '@/config/config';
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { Link } from "react-router-dom";
import CommonForm from "@/components/common/form";
const initialData={
    email:"",
    password:"",
}

function AuthLogin() {
    const [formData, setFormData] = useState(initialData);
    const dispatch = useDispatch();
    const{toast} = useToast();
    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event?.preventDefault();
        dispatch(loginUser(formData)).then((data) => {
            if(data?.payload?.success){
                toast({
                    title:data?.payload?.message,
                })
            } else {
                toast({
                    title: data?.payload?.message,
                    variant: "destructive",
                });
            }
        });
    }
    
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Sign in to your account
            </h1>
            <p className="mt-2">
                Don't have an account? 
                <Link className="font-medium ml-2 text-primary hover:underline"
                to="/auth/register">
                Register
                </Link>
            </p>
        </div>
        <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        />
    </div>
  )
}

export default AuthLogin;
