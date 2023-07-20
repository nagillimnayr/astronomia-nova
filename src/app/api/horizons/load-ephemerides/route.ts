import { loadEphemerides } from '@/lib/horizons/loadEphemerides';
import { type NextRequest, NextResponse } from 'next/server';

// !!! Going to replace with a tRPC procedure.
export async function GET(request: NextRequest) {
  // Get 'name' parameter from query string.
  const name = request.nextUrl.searchParams.get('name');
  if (!name) {
    // If parameter not found, return error code.

    return NextResponse.json(
      {
        error: "Error: no 'name' parameter found.",
      },
      { status: 400 }
    );
  }

  try {
    // Load ephemerides from file and return the result.
    const ephemerides = await loadEphemerides(name);
    return (
      NextResponse.json({
        data: ephemerides,
      }),
      { status: 200 }
    );
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      {
        error: e,
      },
      { status: 404 }
    );
  }
}
