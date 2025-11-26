import { NextResponse } from 'next/server';
import { getCachedOrFetchSeries } from '../../../lib/fred';

export async function GET(
  request: Request,
  context: { params: Promise<{ seriesId: string }> }
) {
  try {
    const { seriesId } = await context.params;
    const data = await getCachedOrFetchSeries(seriesId);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series data' },
      { status: 500 }
    );
  }
}
