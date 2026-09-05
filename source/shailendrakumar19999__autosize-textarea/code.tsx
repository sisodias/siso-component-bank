'use client';

import { cn } from "@/lib/utils";
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, User, Check, Sparkles,Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import { useImperativeHandle } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface UseAutosizeTextAreaProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
}

const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}: UseAutosizeTextAreaProps) => {
  const [init, setInit] = React.useState(true);
  React.useEffect(() => {
    const offsetBorder = 6;
    const textAreaElement = textAreaRef.current;
    if (textAreaElement) {
      if (init) {
        textAreaElement.style.minHeight = `${minHeight + offsetBorder}px`;
        if (maxHeight > minHeight) {
          textAreaElement.style.maxHeight = `${maxHeight}px`;
        }
        setInit(false);
      }
      textAreaElement.style.height = `${minHeight + offsetBorder}px`;
      const scrollHeight = textAreaElement.scrollHeight;
      if (scrollHeight > maxHeight) {
        textAreaElement.style.height = `${maxHeight}px`;
      } else {
        textAreaElement.style.height = `${scrollHeight + offsetBorder}px`;
      }
    }
  }, [textAreaRef.current, triggerAutoSize]);
};

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading = false, children, disabled, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        <Slottable>{children}</Slottable>
      </Comp>
    );
  }
);
LoadingButton.displayName = 'LoadingButton';

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, { message: 'Bio must be at least 10 characters.' })
    .max(160, { message: 'Bio must not be longer than 160 characters.' }),
});

export function AutosizeTextareaDemo() {

  const [loading, setLoading] = React.useState(false);

const [charCount, setCharCount] = React.useState(0);

   const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  
 
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const [triggerAutoSize, setTriggerAutoSize] = React.useState('');
  useAutosizeTextArea({
    textAreaRef,
    triggerAutoSize: triggerAutoSize,
    minHeight: 52,
    maxHeight: 200,
  });

  /** You can use `form.watch` to trigger auto sizing. */
  const bio = form.watch('bio');

    React.useEffect(() => {
    if (textAreaRef.current) {
      setTriggerAutoSize(bio);
      setCharCount(bio?.length || 0);
    }
  }, [bio]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
     alert(`Submitted:\n${JSON.stringify(data, null, 2)}`);
      form.reset();
    }, 1500);
  }

  return (
    <div className="min-h-screen w-full  flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
    

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-4 shadow-xl transform hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
            Tell Your Story
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Share something special about yourself
          </p>
        </div>

        {/* Form Card */}
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 p-4">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  {...field}
                  className="bg-white text-black"
                  ref={textAreaRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={loading} type="submit">
          Submit
        </LoadingButton>
      </form>
    </Form>
      </div>

    </div>
  )
}