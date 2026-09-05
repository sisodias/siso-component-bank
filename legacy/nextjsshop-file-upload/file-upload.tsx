'use client';

import { cn } from "../_utils/cn";
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload as IconUpload, X } from 'lucide-react';
import { useDropzone } from "react-dropzone";

const mainVariant = {
	initial: {
		x: 0,
		y: 0,
	},
	animate: {
		x: 20,
		y: -20,
		opacity: 0.9,
	},
};

export function FileUpload({
	onChange,
	maxSize = 5 * 1024 * 1024, // 5MB default
	accept = 'image/*,.pdf,.doc,.docx',
}: {
	onChange?: (files: File[]) => void;
	maxSize?: number;
	accept?: string;
}) {
	const [files, setFiles] = useState<File[]>([]);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (newFiles: File[]) => {
		setError(null);
		const validFiles = newFiles.filter((file) => file.size <= maxSize);

		if (validFiles.length < newFiles.length) {
			setError(
				`Some files exceeded the maximum size of ${(maxSize / (1024 * 1024)).toFixed(0)}MB`
			);
		}

		if (validFiles.length > 0) {
			setFiles((prevFiles) => [...prevFiles, ...validFiles]);
			onChange && onChange(validFiles);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const { getRootProps, isDragActive } = useDropzone({
		multiple: false,
		noClick: true,
		onDrop: handleFileChange,
		onDropRejected: () => {
			setError('Invalid file type or size');
		},
		accept: accept
			? accept.split(',').reduce(
					(acc, type) => {
						acc[type.trim()] = [];
						return acc;
					},
					{} as Record<string, string[]>
				)
			: undefined,
		maxSize,
	});

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div
			className="w-full"
			{...getRootProps()}
		>
			<motion.div
				onClick={handleClick}
				whileHover="animate"
				className="p-8 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
			>
				<input
					ref={fileInputRef}
					id="file-upload-handle"
					type="file"
					onChange={(e) =>
						e.target.files && handleFileChange(Array.from(e.target.files))
					}
					className="hidden"
					accept={accept}
				/>
				<div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
					<GridPattern />
				</div>
				<div className="flex flex-col items-center justify-center relative z-10">
					<p className="font-medium text-zinc-800 dark:text-zinc-200 text-base">
						Upload file
					</p>
					<p className="font-normal text-zinc-500 dark:text-zinc-400 text-sm mt-1">
						Drag or drop your files here or click to upload
					</p>
					<p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
						Supported: {accept.split(',').join(', ')}
					</p>

					{error && <p className="text-sm text-red-500 mt-2">{error}</p>}

					<div className="relative w-full mt-6 max-w-xl mx-auto">
						{files.length > 0 ? (
							files.map((file, idx) => (
								<motion.div
									key={'file' + idx}
									layoutId={'file-' + idx}
									className={cn(
										'relative overflow-hidden z-40 bg-zinc-100 dark:bg-zinc-800 flex flex-col items-start justify-start p-4 w-full mx-auto rounded-md',
										'shadow-sm border border-zinc-200 dark:border-zinc-700 mb-2'
									)}
								>
									<div className="flex justify-between w-full items-center gap-4">
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											layout
											className="text-sm text-zinc-800 dark:text-zinc-200 truncate max-w-xs"
										>
											{file.name}
										</motion.p>
										<motion.button
											onClick={(e) => {
												e.stopPropagation();
												removeFile(idx);
											}}
											className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100"
										>
											<X className="h-4 w-4" />
										</motion.button>
									</div>

									<div className="flex text-xs w-full mt-2 justify-between text-zinc-600 dark:text-zinc-400">
										<span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
										<span>{file.type || 'Unknown type'}</span>
									</div>
								</motion.div>
							))
						) : (
							<motion.div
								layoutId="file-upload"
								variants={mainVariant}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 20,
								}}
								className={cn(
									'relative group-hover/file:shadow-md z-40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center h-24 w-full max-w-[7rem] mx-auto rounded-md',
									'border border-dashed border-zinc-300 dark:border-zinc-700',
									isDragActive && 'border-zinc-400 dark:border-zinc-500'
								)}
							>
								{isDragActive ? (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="text-zinc-600 dark:text-zinc-300 flex flex-col items-center text-sm"
									>
										Drop here
										<IconUpload className="h-4 w-4 mt-1" />
									</motion.p>
								) : (
									<IconUpload className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
								)}
							</motion.div>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

function GridPattern() {
	const columns = 41;
	const rows = 11;
	return (
		<div className="flex bg-zinc-50 dark:bg-zinc-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
			{Array.from({ length: rows }).map((_, row) =>
				Array.from({ length: columns }).map((_, col) => {
					const index = row * columns + col;
					return (
						<div
							key={`${col}-${row}`}
							className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
								index % 2 === 0
									? 'bg-zinc-100 dark:bg-zinc-900'
									: 'bg-zinc-100 dark:bg-zinc-900 shadow-[0px_0px_1px_3px_rgba(255,255,255,0.1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,0.3)_inset]'
							}`}
						/>
					);
				})
			)}
		</div>
	);
}
