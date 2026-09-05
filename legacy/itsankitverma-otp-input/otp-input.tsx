import { PinInput } from '@ark-ui/react/pin-input'

export const Basic = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 w-full">
      <div className="max-w-md w-full space-y-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-8 text-center">
        
        {/* Title and Description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enter Your Verification Code
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We’ve sent a 4-digit code to your email. Please enter it below to continue.
          </p>
        </div>

        {/* PIN Input */}
        <PinInput.Root
          onValueComplete={(e) => alert(`Entered: ${e.valueAsString}`)}
        >
          <PinInput.Label className="sr-only">Verification Code</PinInput.Label>
          <PinInput.Control className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((id, index) => (
              <PinInput.Input
                key={id}
                index={index}
                className="w-12 h-14 text-center text-xl font-semibold 
                           border-b-2 border-gray-400 dark:border-gray-500 
                           bg-transparent text-gray-900 dark:text-white 
                           focus:border-blue-500 dark:focus:border-blue-400 
                           focus:ring-0 outline-none 
                           transition-all duration-200"
              />
            ))}
          </PinInput.Control>
          <PinInput.HiddenInput />
        </PinInput.Root>

        {/* Extra Info */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Didn’t receive the code?{" "}
          <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
            Resend
          </span>
        </div>
      </div>
    </div>
  )
}
