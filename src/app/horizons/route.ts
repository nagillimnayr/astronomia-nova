import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { ValidationError, fromZodError } from 'zod-validation-error';
import { getElementTable, getVectorTable } from '@/lib/horizons/getEphemerides';
import { saveEphemeris } from '@/lib/horizons/saveEphemerides';

import {
  ElementTableSchema,
  ElementTable,
} from '@/lib/horizons/types/ElementTable';
import {
  VectorTableSchema,
  VectorTable,
} from '@/lib/horizons/types/VectorTable';

const GetRequestSchema = z.object({
  method: z.string(),
  header: z.object({
    'content-type': z.string(),
  }),
  body: z.string(),
});
const FormData = z.object({
  bodyCode: z.string(),
  ephemerisType: z.union([z.literal('elements'), z.literal('vectors')]),
});

export async function POST(request: NextRequest) {
  // parse the request
  const req = (await request.json()) as unknown;
  console.log(req);
  const parsedReq = await FormData.safeParseAsync(req);
  if (!parsedReq.success) {
    const validationError = fromZodError(parsedReq.error);
    console.error(validationError);
    return NextResponse.json({ error: validationError });
  }

  const { bodyCode, ephemerisType } = parsedReq.data;

  if (ephemerisType === 'elements') {
    const elementTable = await getElementTable(bodyCode);
    try {
      const writeRes = await saveEphemeris(elementTable);
      console.log(writeRes.path);
      return NextResponse.json({ ephemeris: elementTable });
    } catch (e) {
      return NextResponse.json({ error: e });
    }
  } else if (ephemerisType === 'vectors') {
    const vectorTable = await getVectorTable(bodyCode);
    try {
      const writeRes = await saveEphemeris(vectorTable);
      console.log(writeRes.path);
      return NextResponse.json({ ephemeris: vectorTable });
    } catch (e) {
      return NextResponse.json({ error: e });
    }
  }
}
