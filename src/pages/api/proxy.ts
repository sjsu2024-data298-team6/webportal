import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, task } = req.query;
    const endpoint = `${process.env.NEXT_PUBLIC_LAMBDA_URL}?data=${data}&task=${task}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
    });

    const responseData = await response.json();
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request' });
  }
} 