import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormModel from "../../components/FormModel/FormModel"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { loginSchema } from "./loginSchema"
import styles from "./Login.module.css"
import{login}from"../../services/LoginService"
import {useNavigate,Link}from"react-router"
const Login = () => {
  const navigate =useNavigate()
  const {

    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: { email: "", password: "" },
  })

  const onSubmit =async (data) => {
    try {
      const response = await login (data)
      console.log(response)
      localStorage.setltme("token", response.token)
      navigate("/genres")
    } catch (error){
      console.error("Error during login:",error)
    }
  }

  return (
    <section className={styles.page} aria-label="تسجيل الدخول">
      <h1 className={styles.title}>تسجيل الدخول</h1>
      <FormModel>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@mail.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button 
            type="submit" 
            text={isSubmitting ? "جاري التسجيل..." : "تسجيل الدخول"} 
            disabled={isSubmitting} 
          />
          
          <div className={styles.link}><Link to="/register">انشاء حساب جديد</Link></div>

        </form>
      </FormModel>
    </section>
  )
}

export default Login
