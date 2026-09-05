
import Link from "next/link";
import { Bubbles, Gift, Layout, Package, Tag } from "lucide-react";

const NavigationItem = ({ href = "/", children, icon=<Layout className="w-4 h-4 text-current"/>}) => {
    return (
        <Link href={href} className="px-4 py-4 flex flex-row gap-1.5 font-regular text-base text-[#888888] hover:text-[#282828] transition-all duration-100 ease-in leading-[100%]">
            {icon}
            {children}
        </Link>
    )
}

const NavigationOne = () => {
    return (
        <nav className="w-screen w-full my-5">
            <div className="max-w-4xl mx-auto bg-[#f3f3f4] rounded-xl flex flex-row justify-between items-center py-3 px-4">
                <div className="flex flex-row gap-0 items-center w-max">
                    <div className="flex flex-row gap-1 items-center justify-start w-max">
                        {/* ADD LOGO HERE */}
                        <Link href={"#"} className="font-black flex items-center justify-center py-2.5 px-4 text-3xl text-[#0038FF]">Clack</Link>
                    </div>
                <div className="flex flex-row">
                    <NavigationItem icon={<Gift className="w-4 h-4 text-current" />} href="#">Resource</NavigationItem>
                    <NavigationItem icon={<Package className="w-4 h-4 text-current"/>} href="#">Product</NavigationItem>
                    <NavigationItem icon={<Bubbles className="w-4 h-4 text-current"/>} href="#">Use Cases</NavigationItem>
                    <NavigationItem icon={<Tag className="w-4 h-4 text-current"/>} href="#">Pricing</NavigationItem>
                </div>
                </div>
                <button className="flex flex-row gap-2 text-base text-[#282828] py-3 px-5 font-medium rounded-xl bg-[#EDEDED]">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.37 6.648C15.256 6.736 13.26 7.861 13.26 10.363C13.26 13.257 15.8 14.281 15.876 14.307C15.865 14.369 15.473 15.709 14.536 17.074C13.702 18.275 12.83 19.474 11.504 19.474C10.178 19.474 9.837 18.704 8.306 18.704C6.814 18.704 6.284 19.5 5.071 19.5C3.857 19.5 3.011 18.388 2.038 17.023C0.911 15.42 0 12.93 0 10.566C0 6.775 2.465 4.764 4.891 4.764C6.181 4.764 7.255 5.611 8.064 5.611C8.834 5.611 10.036 4.714 11.502 4.714C12.058 4.714 14.055 4.764 15.369 6.648H15.37ZM10.806 3.108C11.413 2.389 11.842 1.39 11.842 0.392C11.842 0.254 11.83 0.113 11.805 0C10.818 0.037 9.644 0.657 8.935 1.478C8.38 2.11 7.861 3.108 7.861 4.121C7.861 4.273 7.887 4.425 7.898 4.474C7.961 4.485 8.062 4.499 8.164 4.499C9.049 4.499 10.162 3.906 10.806 3.109V3.108Z" fill="#282828"/>
                    </svg>
                    Download
                </button>
            </div>
        </nav>
    )
}

export default NavigationOne