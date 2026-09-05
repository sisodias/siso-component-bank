export default function stubHook(..._args: unknown[]): unknown {
  return null
}
export const useMediaQuery = () => true
export const useToast = () => ({ toast: (..._: unknown[]) => {} })
export const useIsMobile = () => false
