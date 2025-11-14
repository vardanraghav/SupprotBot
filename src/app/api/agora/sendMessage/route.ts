// src/app/api/agora/sendMessage/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Note: This endpoint only stores the message in Firestore.
// The real-time broadcasting would be handled on the client-side using the Agora RTM SDK.
// The client sends the message via Agora, and on successful send, calls this API to persist it.

export async function POST(request: Request) {
  try {
    const { channelId, userId, message } = await request.json();

    if (!channelId || !userId || !message) {
      return NextResponse.json({ error: 'channelId, userId, and message are required' }, { status: 400 });
    }

    const messageRef = await addDoc(collection(db, 'collaborationChannels', channelId, 'messages'), {
      userId,
      message,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({
      message: 'Message stored successfully',
      messageId: messageRef.id,
    }, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
