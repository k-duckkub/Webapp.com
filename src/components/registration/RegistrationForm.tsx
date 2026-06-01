import { User, Calendar, Phone, Tag } from 'lucide-react'
import { FormField } from './FormField'

export function RegistrationForm() {
  return (
    <form className="flex flex-col gap-[14px]" noValidate>
      <FormField no="1." label="ชื่อจริง"          icon={User}     placeholder="กรอกชื่อจริง" />
      <FormField no="2." label="ชื่อเล่น"           icon={User}     placeholder="กรอกชื่อเล่น" />
      <FormField no="3." label="อายุ"               icon={Calendar} placeholder="กรอกอายุ" suffix="ปี" type="number" />
      <FormField no="4." label="เบอร์โทรศัพท์"       icon={Phone}    placeholder="กรอกเบอร์โทรศัพท์" type="tel" />
      <FormField no="5." label="โค้ดพิเศษ (ถ้ามี)"  icon={Tag}      placeholder="กรอกโค้ดพิเศษ (optional)" optional />
    </form>
  )
}
