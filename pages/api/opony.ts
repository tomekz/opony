import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}

type RequestData = {
    file: File | null;
    amount: number;
    shipment: number;
} 
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    console.log(req.body);
    const {  amount, shipment } = req.body as RequestData;
    res.status(200).json({ message: `ok ${amount} ${shipment}`})
}
