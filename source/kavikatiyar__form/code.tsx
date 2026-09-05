import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Interface for the image props
interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

// Interface for the main component props
interface AuthFormWithImageCollageProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  form: React.ReactNode;
  footer: React.ReactNode;
  images: ImageProps[];
}

const AuthFormWithImageCollage = React.forwardRef<
  HTMLDivElement,
  AuthFormWithImageCollageProps
>(({ className, logo, title, description, form, footer, images, ...props }, ref) => {
  // Animation variants for the container and individual images
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className={cn("w-full min-h-screen grid grid-cols-1 md:grid-cols-2", className)}
      ref={ref}
      {...props}
    >
      {/* Left Panel: Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-background">
        <div className="mx-auto grid w-[450px] gap-6">
          <div className="grid gap-2">
            {logo && <div className="mb-4">{logo}</div>}
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {form}
          <div className="mt-4 text-center text-sm">{footer}</div>
        </div>
      </div>

      {/* Right Panel: Image Collage with Animation */}
      <motion.div
        className="hidden md:grid md:grid-cols-2 md:grid-rows-3 gap-4 p-8 bg-muted/40"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={cn(
              "relative overflow-hidden rounded-lg",
              image.className // Allow custom grid span/row span
            )}
            variants={itemVariants}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

AuthFormWithImageCollage.displayName = "AuthFormWithImageCollage";

export { AuthFormWithImageCollage };