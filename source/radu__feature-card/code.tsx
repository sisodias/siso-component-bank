import Image from 'next/image'

type FeatureCardProps = {
  image?: string
  demo?: React.ReactNode
  title: string
  description: string,
  extraStyles: string,
}

export const FeatureCard = ({ 
  extraStyles,
  image, 
  demo, 
  title, 
  description 
}: FeatureCardProps) => {
  return (
    <div className={`${extraStyles} flex md:hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-[-6px_6px_32px_8px_rgba(192,192,192,0.2)] min-w-80 flex-col gap-4 items-center justify-center max-w-xs bg-white px-3 pt-3 pb-6 rounded-2xl`}>
      <div className="bg-highlight/20 w-full h-60 rounded-2xl overflow-hidden">
        {image && (
          <Image src={image} alt={title} className='w-full h-full object-cover rounded-2xl' />
        )}
        {demo && !image && (
          <div className="w-full h-full">{demo}</div>
        )}
      </div>

      <div className='flex flex-col gap-2 items-center justify-start py-2'>
        <h3 className="whitespace-nowrap text-center text-xl md:text-xl font-sans font-medium text-base-content">{title}</h3>
        <p className='font-regular text-lg text-center px-1 text-neutral/50'>
          {description}
        </p>
      </div>
    </div>
  )
}

export default FeatureCard;