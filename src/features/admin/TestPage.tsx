import React from 'react'
import HigherOrderComponent from '../../hoc/HigherOrderComponent'
import { Suspense } from 'react';
function TestPage() {
  return (
   <>
   <Suspense  >
  <p>Test page</p>

   </Suspense>
   </>
  )
}

export default TestPage;