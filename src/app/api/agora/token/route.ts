// src/app/api/agora/token/route.ts
import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const channelName = searchParams.get('channelName');
  const uid = searchParams.get('uid');

  if (!channelName || !uid) {
    return NextResponse.json({ 'error': 'channelName and uid are required' }, { status: 400 });
  }

  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  
  if (!appID || !appCertificate) {
    console.error('Agora App ID or Certificate is not set in environment variables.');
    return NextResponse.json({ 'error': 'Agora credentials not configured on the server.' }, { status: 500 });
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, Number(uid), role, privilegeExpiredTs);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating Agora token:', error);
    return NextResponse.json({ 'error': 'Failed to generate token' }, { status: 500 });
  }
}
