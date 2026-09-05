import { Toast, Toaster, createToaster } from '@ark-ui/react/toast'
import { XIcon } from 'lucide-react'

const toaster = createToaster({
  placement: 'bottom-end',
  overlap: true,
  gap: 24,
})

export const Basic = () => {
  return (
    <div className="p-6 space-y-4 text-center">
      {/* Section Title + Description */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Toast Notifications
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 w-80 py-3">
          Click the button below to trigger a sample toast notification with a title and description.
        </p>
      </div>

      {/* Button */}
      <button
        type="button"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md 
                   hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        onClick={() =>
          toaster.create({
            title: 'Action Completed',
            description: 'Your request has been processed successfully.',
            type: 'info',
          })
        }
      >
        Add Toast
      </button>

      {/* Toaster */}
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            className="rounded-xl shadow-lg p-4 mb-2 w-80 
                       bg-white text-gray-900 
                       dark:bg-gray-800 dark:text-gray-100 
                       border border-gray-200 dark:border-gray-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <Toast.Title className="font-semibold text-base">
                  {toast.title || 'Notification'}
                </Toast.Title>
                <Toast.Description className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {toast.description || 'No additional details provided.'}
                </Toast.Description>
              </div>
              <Toast.CloseTrigger
                className="text-gray-500 hover:text-gray-700 
                           dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                <XIcon className="w-5 h-5" />
              </Toast.CloseTrigger>
            </div>
          </Toast.Root>
        )}
      </Toaster>
    </div>
  )
}
