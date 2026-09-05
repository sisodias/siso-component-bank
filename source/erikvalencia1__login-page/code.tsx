'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
	AppleIcon,
	AtSignIcon,
	ChevronLeftIcon,
	GithubIcon,
	Grid2x2PlusIcon,
} from 'lucide-react';
import { Dithering } from '@paper-design/shaders-react';

export function LoginScreen() {
	const [darkTheme, setDarkTheme] = useState(true);

	return (
		<main className="relative w-full md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			{/* Left panel with dithering animation */}
			<div className="relative hidden h-full flex-col border-r p-10 lg:flex">
				{/* Gradient overlay for better text readability */}
				<div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />

				{/* Branding */}
				<div className="z-10 flex items-center gap-2">
					<Grid2x2PlusIcon className="size-6" />
					<p className="text-xl font-semibold">Brand</p>
				</div>

				

				{/* Dither background */}
				<div className="absolute inset-0">
					<Dithering
						style={{ height: '100%', width: '100%' }}
						colorBack={darkTheme ? 'hsl(0, 0%, 0%)' : 'hsl(0, 0%, 95%)'}
						colorFront={darkTheme ? 'hsl(220, 100%, 70%)' : 'hsl(320, 100%, 70%)'}
						shape="waves"
						type="4x4"
						pxSize={3}
						offsetX={0}
						offsetY={0}
						scale={0.9}
						rotation={0}
						speed={0.12}
					/>
				</div>
			</div>

			{/* Right panel: login form */}
			<div className="relative flex min-h-screen flex-col justify-center p-4">
				<Button variant="ghost" className="absolute top-7 left-5" asChild>
					<a href="#">
						<ChevronLeftIcon className="size-4 me-2" />
						Home
					</a>
				</Button>

				<div className="mx-auto space-y-4 sm:w-sm">
					{/* Branding (mobile) */}
					<div className="flex items-center gap-2 lg:hidden">
						<Grid2x2PlusIcon className="size-6" />
						<p className="text-xl font-semibold">Asme</p>
					</div>

					{/* Title + subtitle */}
					<div className="flex flex-col space-y-1">
						<h1 className="font-heading text-2xl font-bold tracking-wide">
							Sign In or Join Now!
						</h1>
						<p className="text-muted-foreground text-base">
							Login or create your Asme account.
						</p>
					</div>

					{/* Social buttons */}
					<div className="space-y-2">
						<Button type="button" size="lg" className="w-full">
							<GoogleLogo className="size-4 me-2" />
							Continue with Google
						</Button>
						<Button type="button" size="lg" className="w-full">
							<AppleIcon className="size-4 me-2" />
							Continue with Apple
						</Button>
						<Button type="button" size="lg" className="w-full">
							<GithubIcon className="size-4 me-2" />
							Continue with GitHub
						</Button>
					</div>

					<DividerWithText />

					{/* Email form */}
					<form className="space-y-2">
						<p className="text-muted-foreground text-start text-xs">
							Enter your email address to sign in or create an account
						</p>
						<div className="relative h-max">
							<Input
								placeholder="your.email@example.com"
								className="peer ps-9"
								type="email"
							/>
							<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
								<AtSignIcon className="size-4" aria-hidden="true" />
							</div>
						</div>

						<Button type="button" className="w-full">
							<span>Continue With Email</span>
						</Button>
					</form>

					{/* Terms */}
					<p className="text-muted-foreground mt-8 text-sm">
						By clicking continue, you agree to our{' '}
						<a
							href="#"
							className="hover:text-primary underline underline-offset-4"
						>
							Terms of Service
						</a>{' '}
						and{' '}
						<a
							href="#"
							className="hover:text-primary underline underline-offset-4"
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}

const GoogleLogo = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);

const DividerWithText = () => {
	return (
		<div className="flex w-full items-center justify-center">
			<div className="bg-border h-px w-full" />
			<span className="text-muted-foreground px-2 text-xs">OR</span>
			<div className="bg-border h-px w-full" />
		</div>
	);
};
