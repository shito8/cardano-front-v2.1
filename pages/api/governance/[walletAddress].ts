import type { NextApiRequest, NextApiResponse } from "next";
import { BLOCKFROST_URL, CardanoNetwork } from "../../../utils/api";


const CARDANO_NETWORK = process.env.CARDANO_NETWORK;
const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
){


  if (req.method !== "GET") {
    return res.status(405).end();
  }

  if (!CARDANO_NETWORK || !BLOCKFROST_PROJECT_ID) {
    return res
      .status(500)
      .send("Server is not setup properly. Missing .env file");
  }

  const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Missing wallet parameter' });
  }

  const url = `${BLOCKFROST_URL[CARDANO_NETWORK as CardanoNetwork]}/addresses/${walletAddress}/total`;

  const headers = {
    project_id: BLOCKFROST_PROJECT_ID
  }


  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }


}
