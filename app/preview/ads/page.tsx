import { notFound } from 'next/navigation'
import AdsPreview from './AdsPreview'

export default function PreviewAdsPage() {
  if (process.env.VERCEL_ENV === 'production') {
    notFound()
  }
  return <AdsPreview />
}
