import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = ({ w, h }: { w?: number, h?: number }) => {
  return (
    <Link href={"/"}>
      <Image
        src="/pixelIDE.png"
        alt="logo"
        width={w ?? 120}
        height={h ?? 50}
      />
    </Link>
  )
}

export default Logo