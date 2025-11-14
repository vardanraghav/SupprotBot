// src/app/api/agora/createChannel/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { channelName, members } = await request.json();

    if (!channelName) {
      return NextResponse.json({ error: 'channelName is required' }, { status: 400 });
    }

    const channelRef = await addDoc(collection(db, 'collaborationChannels'), {
      channelName,
      members: members || [],
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      message: 'Channel created successfully',
      channelId: channelRef.id,
      channelName,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 });
  }
}
