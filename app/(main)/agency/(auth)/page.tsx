import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs'
import { Plan } from '@prisma/client'
import { AlignVerticalJustifyStartIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({ searchParams }: { searchParams: { plan: Plan; state: string; code: string } }) => {

    const agencyId = await verifyAndAcceptInvitation()
    console.log(agencyId)



    //get user details
    const user = await getAuthUserDetails()
    if (agencyId) {
        if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
            return redirect('/subaccount')
        } else {
            if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
                if (searchParams.plan) {
                    return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
                }
                if (searchParams.state) {
                    const statePath = searchParams.state.split('_')[0];
                    const stateAgencyId = searchParams.state.split('__')[1];
                    if (!stateAgencyId) return <div>Not authorized</div>
                    return redirect(`/agency/${stateAgencyId}/$ {statepath}?code=${searchParams.code}`)
                }
                else return redirect(`/agency/${agencyId}`)
            } else {
                return <div>Not authorized</div>
            }
        }

        return <div>Agency</div>
    }
    const authUser = await currentUser()
    return
}
export default Page


