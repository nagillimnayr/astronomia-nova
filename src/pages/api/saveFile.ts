export default async function handler(request: Request, response: Response) {
  const body = request.body;
  console.log('Post request body:', body);

  if (!body || !body.first || !body.last) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: 'First or last name not found' });
  }

  // Found the name.
  // Sends a HTTP success code
  res.status(200).json({ data: `${body.first} ${body.last}` });
}
