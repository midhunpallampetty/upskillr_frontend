import React from 'react'
import { Suspense } from 'react'

function HigherOrderComponent(WrappedComponent: React.ComponentType) {
  return (

    <>
    
    <Suspense fallback={<div>Loading...</div>}>
      <div>Higher Order Component Loading......</div>

    </Suspense>
    </>
  )
}

export default HigherOrderComponent