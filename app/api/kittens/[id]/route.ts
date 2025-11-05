import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await adminDb.collection('kittens').doc(params.id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Kitten not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching kitten:', error);
    return NextResponse.json(
      { error: 'Failed to fetch kitten' }, 
      { status: 500 }
    );
  }
}