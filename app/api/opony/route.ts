import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob';
import { getAuthKey } from '../../utils';
import xlsx from 'node-xlsx';
const soap = require('soap');

function augmentData(xlsData : any[], apiResults : any[])  {
  const newData = xlsData.slice(1).map((row, i) => {

    const match = apiResults.filter((item : any) => {
        const pCode = row[1];
        const productCodes  = item.product_code['$value']?.split(',');
        const isMatch = productCodes?.includes(pCode);
        console.log({pCode, productCodes, includes: isMatch});
        return isMatch;
    })

    let augment = [] as any[];
    if (match.length > 0) {
        augment = [match[0].price['$value'], match[0].amount['$value']]
    }

    return [...row, ...augment];
  });

  return newData;
}

export async function POST(request: NextRequest, res: NextResponse) {

    const url = 'https://platformaopon.pl/webapi.wsdl'; 
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const data = await request.formData()
    const blob = data.get('file') as Blob

    const file  = data.get('file') as File
    const producer  = data.get('producer')
    // const shipment  = data.get('shipment')

    const fileContents = await blob.arrayBuffer()

    const workSheets = xlsx.parse(fileContents);
    const input = workSheets[0].data;

    const promise = new Promise((resolve, reject) => {

        soap.createClient(url, {}, function(err :any, client: any) {
          if (err) {
            reject(err);
          }

          const hash = getAuthKey("searchOffers", currentTimeInSeconds.toString());

          client.searchOffersAsync({
                  authorization: {
                      login: "motoabc",
                      hash: hash,
                      key: currentTimeInSeconds.toString(),
                  } ,
                  searchParams: {
                      producer,
                      perPage: 1000
                  }
                }, async function(err: any, result: any) {
                if (err) {
                    reject(err);
                }
                    console.log({result});
                    console.log({count: result.count});
                    const { offers : {item}  } = result;
                    const output = augmentData(input, item);

                    const buffer = xlsx.build([{name: "mySheetName", data: output}]); // Returns a buffer
                    const blob = await put("output_" + Date.now().toString() + ".xls", buffer, { access: 'public' });
                    console.log({blob});
                    resolve(blob);
                    // return NextResponse.json({ success: true , url: res.url })
                });
            });
    });

    try {
        const blob = await promise as any; 
        return NextResponse.json({ success: true , url: blob.url })
    }
    catch (err) {
        console.log({err});
        return NextResponse.json({ success: false , error: err })
    }

}
