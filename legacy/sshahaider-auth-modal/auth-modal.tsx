'use client';
import React from 'react';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalTitle,
} from "./modal";
import Link from 'next/link';
import { Button } from './button';
import { Input } from './input';
import { AtSignIcon } from 'lucide-react';

type AuthModalProps = Omit<React.ComponentProps<typeof Modal>, 'children'>;

export function AuthModal(props: AuthModalProps) {
	return (
		<Modal {...props}>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Sign In or Join Now!</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<Button
						type="button"
						variant="outline"
						className="animate-in fade-in w-full duration-300"
					>
						<GoogleIcon className="w-4 h-4 me-2" />
						<span>Continue With Google</span>
					</Button>

					<div className="relative my-5">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background text-muted-foreground px-4 text-lg">
								OR
							</span>
						</div>
					</div>
					<p className="text-muted-foreground mb-2 text-start text-xs">
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

					<Button
						type="button"
						variant="outline"
						className="animate-in fade-in mt-4 w-full duration-300"
					>
						<span>Continue With Email</span>
					</Button>
				</ModalBody>
				<div className="p-4">
					<p className="text-muted-foreground text-center text-xs">
						By clicking Continue, you agree to our{' '}
						<Link className="text-foreground hover:underline" href="/policy">
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</ModalContent>
		</Modal>
	);
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
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
