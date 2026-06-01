import { PlayCircle, FolderOpen, ShieldCheck } from 'lucide-react'
import { FeatureItem } from './FeatureItem'

export function FeatureList() {
  return (
    <div className="flex gap-7 mt-7">
      <FeatureItem icon={PlayCircle}  title="วิดีโอสอน"    sub="50+ บทเรียน" />
      <FeatureItem icon={FolderOpen}  title="โปรเจกต์จริง" sub="สร้างพอร์ต" />
      <FeatureItem icon={ShieldCheck} title="ใบรับรอง"     sub="เมื่อเรียนจบ" />
    </div>
  )
}
