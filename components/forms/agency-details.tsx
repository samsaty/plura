import { Agency } from '@prisma/client'
import React, { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/router'
import { AlertDialog } from '@radix-ui/react-alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, useForm } from 'react-hook-form'
import * as z from 'zod'

type Props = {
    data?: Partial<Agency>
}
const FormSchema = z.object({
    name: z.string().min(2, { message: 'Agency name must two word ' })
})

const AgencyDetails = (pops: Props) => {
    const { toast } = useToast()
    const router = useRouter()
    const [deletingAgency, setDeletingAgency] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>()

    return <AlertDialog>
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Agency Information</CardTitle>
                <CardDescription>
                    Lets create an agency for your business. You can edit agency settings later from the agency settings tab.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form></Form>
            </CardContent>
        </Card>
    </AlertDialog>

}
export default AgencyDetails