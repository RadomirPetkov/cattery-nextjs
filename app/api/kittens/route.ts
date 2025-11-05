import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('kittens')
      .where('available', '==', true)
      .limit(6)
      .get();

    const kittens = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(kittens);
  } catch (error) {
    console.error('Error fetching kittens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch kittens' }, 
      { status: 500 }
    );
  }
}