import React from 'react'

export default function Loader() {
  return (
    <div className='position-absolute w-100 h-100 d-flex justify-content-center align-items-center'>
      <div className='text-center' style={{ width: 100, height: 100, fontSize: 14, }}>
        <img src="loader.gif" alt="" style={{ width: "40px" }} />
        <br />
        Please wait...</div>
    </div>
  )
}
