import { useState } from 'react'
import { Navbar } from './Navbar'
import { StoreTab } from './StoreTab'
import { UnityTab } from './UnityTab'

export function StorePage() {
  const [activeTab, setActiveTab] = useState('store')

  return (
    <div style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'store' ? <StoreTab /> : <UnityTab />}
    </div>
  )
}
