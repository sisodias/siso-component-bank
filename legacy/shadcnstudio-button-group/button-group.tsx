import { DownloadIcon } from 'lucide-react'

import { Button } from "./button"

const ButtonGroupDownloadDemo = () => {
  return (
    <div className='inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse'>
      <Button variant='outline' className='btn rounded-none rounded-l-md shadow-none focus-visible:z-10'>
        <DownloadIcon className="icon"/>
        Download
      </Button>
      <span className='bg-background dark:border-input dark:bg-input/30 flex items-center rounded-r-md border px-3 text-sm font-medium'>
        15k
      </span>
    </div>
  )
}

export default ButtonGroupDownloadDemo
