import { useState } from "react"
import PendingStudents from "../components/users/PendingStudents"
import AllStudents from "../components/users/AllStudents"
import { Clock, Users } from "lucide-react"

const ManageUsers=()=>
{
    const [tab,setTab]=useState('pending')
    return(
        <div className="space-y-6">
            <div className="flex w-full gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-lg shadow-text/5 sm:w-fit">
                <button onClick={()=>setTab('pending')} className={`inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition sm:flex-none ${tab==='pending' ? 'bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to text-white shadow-md shadow-primary/25' : 'text-muted hover:bg-primary-light hover:text-primary'}`}><Clock className={`size-4 ${tab==='pending' ? '' : 'text-amber-500'}`} />ממתינים לאישור</button>
                <button onClick={()=>setTab('all')} className={`inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition sm:flex-none ${tab==='all' ? 'bg-linear-to-l from-gradient-from via-gradient-via to-gradient-to text-white shadow-md shadow-primary/25' : 'text-muted hover:bg-primary-light hover:text-primary'}`}><Users className={`size-4 ${tab==='all' ? '' : 'text-sky-500'}`} />כל התלמידים</button>
            </div>
            {tab==='pending'&&<PendingStudents />}
            {tab==='all'&& <AllStudents/>}
        </div>
    )
}
export default ManageUsers
