import { NextResponse } from 'next/server'
import avatars from '../../config/avatars.json'

export async function GET() {
  // Return the static avatars list so the client can fetch it via /api/avatars
  return NextResponse.json(avatars)
}
