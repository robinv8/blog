// https://react-svgr.com/playground/
import * as React from 'react'
import Image from 'next/image'
import avatar from '@/public/avatar.webp'

const Logo = (props) => (
  <Image
    {...props}
    src={avatar}
    style={{
      height: '3rem',
      width: '3rem',
      borderRadius: '50%'
    }}
    alt='logo'
  />
)

export default Logo
