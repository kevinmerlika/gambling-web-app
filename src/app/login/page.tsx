import Image from "next/image";
import LoginForm from "../components/forms/loginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Login() {

    const session = await getServerSession(authOptions)

    if(session?.user){
        redirect('dashboard')
    }

  return (
      <LoginForm/>
  );
}
