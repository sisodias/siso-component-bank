const BlogCard = ({ title, date, description }) => {
    return (
        <div className='text-white w-full h-20 p-4 space-y-1 blog-card group hover:cursor-pointer'>
            <div className='flex justify-center gap-1 items-end relative'>
                <div className="md:text-2xl text-xl font-serif whitespace-nowrap dark:text-neutral-100 text-neutral-700 group-hover:text-[#ce624c] dark:group-hover:text-[#ce624c] transition-all duration-500 ease-out">{title}</div>
                <span className="w-full border-b-[0.5px] border-dashed dark:border-neutral-600 border-neutral-400 group-hover:border-[#ce624c] dark:group-hover:border-[#ce624c] mb-[6px]"></span>
                <div className='dark:text-neutral-400 text-neutral-500 whitespace-nowrap uppercase group-hover:text-[#ce624c] dark:group-hover:text-[#ce624c] font-mono md:text-base text-xs'>{date}</div>
            </div>
            <div className="dark:text-neutral-400 text-neutral-500 md:text-lg group-hover:text-[#ce624c] dark:group-hover:text-[#ce624c] md:max-w-full max-w-sm">{description}</div>
        </div>
    )
}

export default BlogCard