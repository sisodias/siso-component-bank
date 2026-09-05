import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const CtaSection2 = () => {
  return (
    <section className='w-full py-16 sm:py-24'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <Card>
          <CardContent className='flex flex-col gap-6 py-6 sm:py-8'>
            <div className='flex flex-col gap-2 text-center'>
              <h2 className='text-4xl font-bold'>Subscribe to Our Community</h2>
              <p className='text-muted-foreground mx-auto max-w-2xl'>
                Get exclusive access to cutting-edge tech insights, industry trends, and expert advice delivered
                straight to your inbox. Join our growing community today!
              </p>
            </div>

            <div className='mx-auto flex max-sm:w-full flex-col gap-3 sm:flex-row'>
              <Input type='email' className='h-9 max-sm:w-full w-78' placeholder='Enter your email here' />
              <Button className="h-9 px-4 py-2 cursor-pointer">Join Now</Button>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-2'>
              <div className='*:ring-background flex -space-x-2 *:size-8 *:ring-2'>
                <Avatar className='bg-muted'>
                  <AvatarImage src='https://notion-avatars.netlify.app/api/avatar?preset=male-1' alt='User 1' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className='bg-muted'>
                  <AvatarImage src='https://notion-avatars.netlify.app/api/avatar?preset=female-5' alt='User 2' />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar className='bg-muted'>
                  <AvatarImage src='https://notion-avatars.netlify.app/api/avatar?preset=male-2' alt='User 3' />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <Avatar className='bg-muted'>
                  <AvatarImage src='https://notion-avatars.netlify.app/api/avatar?preset=female-3' alt='User 4' />
                  <AvatarFallback>DG</AvatarFallback>
                </Avatar>
              </div>
              <span className='text-sm'>5,000+ happy members</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CtaSection2
