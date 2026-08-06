import Link from 'next/link'

const COLUMNS = [
  {
    title: 'HamStore',
    links: ['ของที่ซื้อได้', 'คลัง Unity Asset', 'ของมาใหม่', 'ของลดราคา'],
  },
  {
    title: 'เรียนกับเรา',
    links: ['หลักสูตรทั้งหมด', 'เส้นทางนักพัฒนาเกม', 'โปรเจกต์ตัวอย่าง', 'ใบรับรอง'],
  },
  {
    title: 'HamCoin',
    links: ['วิธีสะสมเหรียญ', 'ภารกิจประจำวัน', 'อันดับผู้เรียน', 'ประวัติการแลก'],
  },
  {
    title: 'ช่วยเหลือ',
    links: ['คำถามที่พบบ่อย', 'ติดต่อทีมงาน', 'แจ้งปัญหา', 'สถานะระบบ'],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-mist text-[12px] leading-relaxed text-slate">
      <div className="shell py-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-b border-hairline pb-10 sm:grid-cols-4">
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h3 className="mb-3 text-[12px] font-semibold text-graphite">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <span className="cursor-default transition-colors hover:text-graphite">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2569 HamsterHub — ตัวอย่างงานออกแบบ ไม่ใช่ร้านค้าจริง</p>
          <nav className="flex gap-5">
            <Link href="/" className="transition-colors hover:text-graphite">
              ของที่ซื้อได้
            </Link>
            <Link href="/library" className="transition-colors hover:text-graphite">
              คลัง Unity Asset
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
