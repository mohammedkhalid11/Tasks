import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormModel from "../../components/FormModel/FormModel"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { RegisterSchema } from "./Register.Schema"
import styles from "./Register.module.css"
import { registerUser } from "../../services/RegisterService"

import {useNavigate,Link}from"react-router"
const Register = () => {
  const navigate =useNavigate()
  const [submitError, setSubmitError] = useState("")
  const {

    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "all",
    defaultValues: { firstName: "", lastName: "", username: "", email: "", password: "" },
  })

  const onSubmit =async (data) => {
    try {
      setSubmitError("")
      await registerUser(data)
      navigate("/")
    } catch (error){
      console.error("Error during Register:",error)
      setSubmitError("فشل إنشاء الحساب، تحقق من البيانات أو جرّب مرة أخرى")
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
            label="الاسم الأول"
            type="text"
            placeholder="أدخل الاسم الأول"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="اسم العائلة"
            type="text"
            placeholder="أدخل اسم العائلة"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <Input
            label="اسم المستخدم"
            type="text"
            placeholder="أدخل اسم المستخدم"
            error={errors.username?.message}
            {...register("username")}
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
          {submitError && <p className={styles.submitError}>{submitError}</p>}
          <Button 
            type="submit" 
            text={isSubmitting ? "جاري التسجيل..." : "انشاء حساب"} 
            disabled={isSubmitting} 
          />
           <div className={styles.link}><Link to="/">لديك حساب بالفعل؟ سجل دخولك</Link></div>
        </form>
      </FormModel>
    </section>
  )
}

export default Register