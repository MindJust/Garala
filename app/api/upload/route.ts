import { uploadListingImage } from '@/components/features/listings/listings.actions'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const result = await uploadListingImage(formData)

        if ('error' in result) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            )
        }

        return NextResponse.json({ url: result.url })
    } catch (error) {
        console.error('Upload API error:', error)
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        )
    }
}
