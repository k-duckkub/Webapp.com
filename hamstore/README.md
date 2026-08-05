# HamStore

ร้านค้าของ HamsterHub — เป็น Next.js app แยกต่างหาก อยู่ร่วมกับหน้า Vite เดิมใน repo นี้
(`registration.html`, `index.html`, `builder.html`, `hamster-camp.html` ยังใช้ Vite ที่ root เหมือนเดิม)

## สองหน้า

| Route | คืออะไร | อ้างอิงสไตล์ |
|---|---|---|
| `/` | **ของที่ซื้อได้** — ไอเทมในแพลตฟอร์ม: สกินแฮมสเตอร์, เพื่อนซี้, ธีมหน้าเว็บ, อิโมจิ, กรอบโปรไฟล์ ซื้อด้วย HamCoin | Minecraft.net (dark editorial) |
| `/library` | **คลัง Unity Asset** — asset ที่ซื้อไปแล้ว เป็น *library* ไม่ใช่หน้าร้าน: มีเวอร์ชัน, ขนาดไฟล์, วันที่ซื้อ, license, ปุ่มดาวน์โหลด/อัปเดต | Unity Asset Store (light grid) |

หน้าแรก **ไม่มี** Unity asset เลย — ของพวกนั้นอยู่ในหน้า `/library` อย่างเดียว

> เอาเฉพาะ layout กับภาษาทางภาพของสองเว็บนั้นมาเป็นแรงบันดาลใจ ไม่ได้ใช้โลโก้
> เครื่องหมายการค้า หรืองานภาพจริงของ Minecraft และ Unity — แบรนด์ทั้งหมดเป็นของ HamsterHub เอง

## Stack

- **Next.js 15** (App Router) + TypeScript
- **GSAP + ScrollTrigger** — timeline sequences และ pathway scroll
- **Framer Motion** — micro-interactions, hover states, layout transitions
- **Tailwind CSS**

## คำสั่ง

```bash
cd hamstore
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
```

## GSAP ที่ใช้ตรงไหนบ้าง

- `components/store/Hero.tsx` — timeline ตอนโหลด + parallax ตอน scroll ออก
- `components/store/Pathway.tsx` — **pathway scroll**: เส้นทางโค้งวาดตาม scroll (`strokeDashoffset` scrub) พร้อมตัวแฮมสเตอร์วิ่งตามเส้นด้วย `MotionPathPlugin` และจุดหมายที่ติดสว่างเมื่อเส้นวิ่งถึง
- `components/store/Showcase.tsx` — pinned horizontal scroll (desktop เท่านั้น)
- `components/store/CoinPacks.tsx` — stagger reveal + sparkle loop
- `components/library/LibraryHero.tsx` — count-up ตัวเลขสถิติ

หมายเหตุ: ใช้เฉพาะปลั๊กอิน GSAP ที่ฟรี (`ScrollTrigger`, `MotionPathPlugin`)
— ไม่ได้ใช้ `DrawSVGPlugin` ซึ่งเป็นของ GSAP Club จึงวาดเส้นด้วย `strokeDasharray`/`strokeDashoffset` เอง

## เรื่องที่ระวังไว้

- แอนิเมชันทุกตัวเคารพ `prefers-reduced-motion` ผ่าน `gsap.matchMedia()`
- start state ของ reveal ตั้งด้วย GSAP (ไม่ใช่ CSS `opacity:0`) ถ้า JS ไม่ทำงานเนื้อหาจะยังเห็นอยู่ ไม่หายไปทั้งหน้า
- pinned horizontal scroll ปิดบนจอเล็กและตอน reduced-motion เพราะมันยึด scroll ของผู้ใช้
- `outputFileTracingRoot` ตั้งไว้ใน `next.config.mjs` เพราะ repo root มี lockfile อีกอัน (ของฝั่ง Vite)
