import { Loader2 } from 'lucide-react'

export default function AdminLoading () {
  return (
    <div className='flex items-center justify-center mt-10'>
      <Loader2 className='size-24 animate-spin' />
    </div>
  )
}
