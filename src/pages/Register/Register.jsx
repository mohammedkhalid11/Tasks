import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormModel from "../../components/FormModel/FormModel"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { RegisterSchema } from "./Register.Schema"
import styles from "./Register.module.css"

// import{Register}from"../../services/RegisterService"
import {useNavigate,Link}from"react-router"
const Register = () => {
  const navigate =useNavigate()
  const {

    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "all",
    defaultValues: { name: "", phone: "", email: "", password: "" },
  })

  const onSubmit =async (data) => {
    try {
        console.log(data)   
    //   const response = await Register (data)
    //   console.log(response)
    //   localStorage.setltme("token", response.token)
      navigate("/genres")
    } catch (error){
      console.error("Error during Register:",error)
    }
  }

  return (
    <section className={styles.page} aria-label="انشاء حساب">
      <div className={styles.titleContainer}>
        <svg className={styles.titleImage} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 8V14" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 11H17" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className={styles.title}>انشاء حساب</h1>
      </div>
      <FormModel>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="الاسم الكامل"
            type="text"
            placeholder="أدخل اسمك الكامل"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="رقم الهاتف"
            type="text"
            placeholder="أدخل رقم هاتفك"
            error={errors.phone?.message}
            {...register("phone")}
          />
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
            text={isSubmitting ? "جاري التسجيل..." : "انشاء حساب"} 
            disabled={isSubmitting} 
          />
           <div className={styles.link}><Link to="/login">لديك حساب بالفعل؟ سجل دخولك</Link></div>
        </form>
      </FormModel>
    </section>
  )
}

export default Register