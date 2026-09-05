import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {cn} from '@/lib/utils';

export type User = {
	id: string;
	name: string;
	image: string;
};

export type ReplyType = {
	id: string;
	content: string;
	commentId: string;
	createdAt: Date;
	user: User;
};

export type CommentType = {
	id: string;
	content: string;
	createdAt: Date;
	user: User;
	repliesCount: number;
};

type CardLayoutProps = React.ComponentProps<'div'> & {
	data: CommentType | ReplyType;
	onDelete: (id: string) => void;
	currentUser: User;
};

function CardLayout({
	onDelete,
	data,
	currentUser,
	className,
	children,
	...props
}: CardLayoutProps) {
	const { id, user, createdAt } = data;

	return (
		<div
			className={cn('flex gap-2 rounded-md border px-4 py-2', className)}
			{...props}
		>
			<Avatar>
				<AvatarImage src={user.image || ''} alt={user.name || ''} />
				<AvatarFallback>{getInitialChar(user.name || '')}</AvatarFallback>
			</Avatar>
			<div className="w-full pt-2.5">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2 text-sm">
						<p className="font-medium">{user.name}</p>
						<div className="bg-muted h-1 w-1 rounded-full" />
						<p className="text-muted-foreground">{getTimeAgo(createdAt)}</p>
					</div>
					{currentUser?.id === user.id && (
						<Button
							variant="ghost"
							className="h-7 w-7 text-muted-foreground"
							type="button"
							onClick={() => onDelete(id)}
						>
							<span className="sr-only">Delete It</span>
							<TrashIcon className='h-4 w-4' />
						</Button>
					)}
				</div>
				{children}
			</div>
		</div>
	);
}

type CommentCardProps = CardLayoutProps & {
	data: CommentType;
};

export function CommentCard({ data, ...props }: CommentCardProps) {
	const { id, content } = data;

	let take = 5;
	const [showReplies, setShowReplies] = React.useState(false);
	const [replies, setReplies] = React.useState<ReplyType[]>([]);
	const [repliesCount, setRepliesCount] = React.useState<number>(0);

	React.useEffect(() => {
		setRepliesCount(data.repliesCount);
	}, [data]);

	const setData = (data: ReplyType) => {
		setReplies([data, ...replies]);
		setRepliesCount(repliesCount + 1);
		take = take + 1;
		setShowReplies(true);
	};

	const handleDeleteReply = (replyId: string) => {
		const filteredReplies = replies.filter((reply) => reply.id !== replyId);
		setReplies(filteredReplies);
		setRepliesCount(repliesCount - 1);
	};

	const fetchReplies = async () => {
		await delay(1000);
		setReplies(repliesData.filter((reply) => reply.commentId === id));
	};

	const handleShowReplies = () => {
		if (!showReplies) {
			setShowReplies(true);
			if (replies.length === 0 && repliesCount > 0) {
				fetchReplies();
			}
		} else {
			setShowReplies(false);
		}
	};

	return (
		<CardLayout data={data} {...props}>
			<div className="text-muted-foreground px-1 py-3 text-sm">
				<p>{content}</p>
			</div>
			<button
				className="text-muted-foreground hover:text-foreground my-2 flex items-center gap-1 text-xs duration-200 hover:cursor-pointer [&_svg]:h-3.5 [&_svg]:w-4.5"
				onClick={handleShowReplies}
			>
				{showReplies ? <ChevronUpIcon /> : <ChevronDownIcon />}
				{repliesCount > 0
					? `${repliesCount === 1 ? 'reply' : 'replies'} (${repliesCount})`
					: 'Reply'}
			</button>
			{showReplies && (
				<div className="w-full space-y-4 rounded-tl-md border-t border-l pl-5">
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="mt-2 w-full"
					>
						<CommentForm
							setData={setData}
							commentId={id}
							currentUser={props.currentUser}
						/>
					</motion.div>

					{replies.length === 0 && repliesCount > 0
						? Array.from({
								length: repliesCount > take ? take : repliesCount,
							}).map((_, index) => <SkeletonCard isReply key={index} />)
						: replies.map((reply, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									<ReplyCard
										onDelete={handleDeleteReply}
										data={reply}
										currentUser={props.currentUser}
									/>
								</motion.div>
							))}
				</div>
			)}
		</CardLayout>
	);
}

type ReplyCardProps = {
	data: ReplyType;
	onDelete: (id: string) => void;
	currentUser: User;
};

export function ReplyCard({ data, ...props }: ReplyCardProps) {
	const { content } = data;

	return (
		<CardLayout data={data} {...props}>
			<div className="text-muted-foreground px-1 py-3 text-sm">
				<p>{content}</p>
			</div>
		</CardLayout>
	);
}

interface CommentFormProps {
	currentUser: User;
	commentId?: string;
	setData: (data: any) => void;
}

export function CommentForm({
	currentUser,
	commentId,
	setData,
}: CommentFormProps) {
	const [value, setValue] = React.useState<string>('');

	const handleSubmit = async () => {
		try {
			if (value.trim() === '') return;
			const id = crypto.randomUUID();

			if (commentId) {
				setData({
					id,
					content: value,
					createdAt: new Date(),
					commentId,
					user: currentUser,
				} as ReplyType);
			} else {
				setData({
					id,
					repliesCount: 0,
					content: value,
					createdAt: new Date(),
					replies: [],
					user: currentUser,
				} as CommentType);
			}

			setValue('');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="my-5 w-full space-y-2">
			<div className="flex w-full gap-x-2">
				<Avatar>
					<AvatarImage src={currentUser.image} />
					<AvatarFallback>{getInitialChar(currentUser.name)}</AvatarFallback>
				</Avatar>
				<Textarea
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder={commentId ? 'Leave a Reply' : 'Enter Your Comment'}
				/>
			</div>

			<Button
				disabled={value.trim() === ''}
				type="submit"
				className="w-full"
				onClick={handleSubmit}
			>
				{commentId ? 'Post Reply' : 'Post Comment'}
			</Button>
		</div>
	);
}

export function SkeletonCard({
	className,
	isReply,
	...props
}: React.ComponentProps<'div'> & {
	isReply?: boolean;
}) {
	return (
		<div
			className={cn('flex gap-2 rounded-md border px-4 py-2', className)}
			{...props}
		>
			<div>
				<Skeleton className="h-10 w-10 rounded-full" />
			</div>
			<div className="w-full pt-2.5">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2 text-sm">
						<Skeleton className="h-4 w-24" />
						<div className="bg-muted h-1 w-1 rounded-full" />
						<Skeleton className="h-4 w-12" />
					</div>
				</div>
				<div className="px-1 py-3">
					<Skeleton className="h-3.5 w-2/3" />
				</div>
				{!isReply && (
					<div className="py-2">
						<Skeleton className="h-3.5 w-16" />
					</div>
				)}
			</div>
		</div>
	);
}



export const getInitialChar = (value: string) => {
	return value
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase())
		.slice(0, 2)
		.join('');
};

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getTimeAgo = (timestamp: number | Date): string => {
	const date = new Date(timestamp);
	const now = new Date();
	const timeDifference = now.getTime() - date.getTime();

	const seconds = Math.floor(timeDifference / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(months / 12);

	if (seconds < 60) {
		return `Just Now`;
	} else if (minutes < 60) {
		return `${minutes} min. ago`;
	} else if (hours < 24) {
		return `${hours} hr. ago`;
	} else if (days < 30) {
		return `${days} day${days === 1 ? '' : 's'} ago`;
	} else if (months < 12) {
		return `${months}mo ago`;
	} else {
		return `${years} yr. ago`;
	}
};


export const repliesData: ReplyType[] = [
	{
		id: '101',
		content: 'Totally agree with you!',
		user: {
			id: '3',
			name: 'Usman',
			image: 'https://avatar.vercel.sh/usman',
		},
		createdAt: new Date('2025-07-19T10:15:00Z'),
		commentId: '1',
	},
	{
		id: '102',
		content: 'Yup, same here!',
		user: {
			id: '4',
			name: 'Hira',
			image: 'https://avatar.vercel.sh/hira',
		},
		createdAt: new Date('2025-07-19T11:00:00Z'),
		commentId: '1',
	},
	{
		id: '201',
		content: 'Good catch! I’ll fix that.',
		user: {
			id: '1',
			name: 'Shaban',
			image: 'https://avatar.vercel.sh/shaban',
		},
		createdAt: new Date('2025-07-18T16:30:00Z'),
		commentId: '2',
	},
	{
		id: '301',
		content: 'Thanks for pointing this out!',
		user: {
			id: '2',
			name: 'Ayesha',
			image: 'https://avatar.vercel.sh/ayesha',
		},
		createdAt: new Date('2025-07-17T11:00:00Z'),
		commentId: '3',
	},
	{
		id: '302',
		content: 'Really useful!',
		user: {
			id: '5',
			name: 'Ali',
			image: 'https://avatar.vercel.sh/ali',
		},
		createdAt: new Date('2025-07-17T11:40:00Z'),
		commentId: '3',
	},
	{
		id: '303',
		content: 'Recursion is tricky but worth it.',
		user: {
			id: '3',
			name: 'Usman',
			image: 'https://avatar.vercel.sh/usman',
		},
		createdAt: new Date('2025-07-17T12:10:00Z'),
		commentId: '3',
	},
	{
		id: '501',
		content: 'Can’t agree more!',
		user: {
			id: '6',
			name: 'Zara',
			image: 'https://avatar.vercel.sh/zara',
		},
		createdAt: new Date('2025-07-21T08:20:00Z'),
		commentId: '5',
	},
	{
		id: '502',
		content: 'Amazing content indeed.',
		user: {
			id: '7',
			name: 'Fahad',
			image: 'https://avatar.vercel.sh/fahad',
		},
		createdAt: new Date('2025-07-21T09:00:00Z'),
		commentId: '5',
	},
	{
		id: '601',
		content: 'You’re right — context matters.',
		user: {
			id: '8',
			name: 'Nimra',
			image: 'https://avatar.vercel.sh/nimra',
		},
		createdAt: new Date('2025-07-22T12:45:00Z'),
		commentId: '6',
	},
];
