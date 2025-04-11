'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
import Button from '@mui/material/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='flex justify-center'>
     <div className='text-center'>
     <h2>Something went wrong!</h2>
      <Button
      className='m-4'
        onClick={
          () => reset()
        }
      >
        Try again
      </Button>
     </div>
    </div>
  )
}