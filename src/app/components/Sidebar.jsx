import Image from "next/image";
import Link from "next/link";

export default function Sidebar(){
    return(
        <>
        <div className="flex flex-col space-y-4 bg-teal-800 text-zinc-100 text-2xl ">
            <Link href="/" className="hover:text-blue-300 hover:shadow-blue-100"> 
            <div className="flex"><Image src="/home.svg" width={20} height={10} alt=""/>  Home</div>
            </Link>
            <Link href="/Consult" className="hover:text-blue-300 hover:shadow-blue-100"> 
            <div className="flex"><Image src="/consult.svg" width={20} height={10}alt=""/>  Consult</div>
            </Link>
            <Link href="/Status" className="hover:text-blue-300 hover:shadow-blue-100"> 
            <div className="flex"><Image src="/status.svg" alt="" width={20} height={10}/> Status</div>
            </Link>

        </div>
        </>
    )
}