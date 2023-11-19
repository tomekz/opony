import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob';
import { getAuthKey } from '../../utils';
import xlsx from 'node-xlsx';
const soap = require('soap');

function augmentData(xlsData : any[], apiResults : any[])  {
  const newData = xlsData.slice(1).map((row, i) => {

    console.log({row: row[i], i});
    const match = apiResults.filter((item : any) => {
        const pCode = row[1];
        const productCodes  = item.product_code['$value']?.split(',');
        const isMatch = productCodes?.includes(pCode);
        console.log({pCode, productCodes, includes: isMatch});
        return isMatch;
    })

    let augment = [] as any[];
    if (match.length > 0) {
        console.log("matches found ", match.length);
        augment = [match[0].price['$value'], match[0].amount['$value']]
    }

    return [...row, ...augment];
  });

  return newData;
}

export async function POST(request: NextRequest) {

    const url = 'https://platformaopon.pl/webapi.wsdl'; 
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const data = await request.formData()
    const blob = data.get('file') as Blob

    const producer  = data.get('producer')
    const season  = data.get('season')
    const fileContents = await blob.arrayBuffer()

    const workSheets = xlsx.parse(fileContents);
    const input = workSheets[0].data;

    const promise = new Promise((resolve, reject) => {

        soap.createClient(url, {}, function(err :any, client: any) {
          if (err) {
            reject(err);
          }

          const hash = getAuthKey("searchOffers", currentTimeInSeconds.toString());

          console.info("searchOffersAsync begin", {producer, season, currentTimeInSeconds})

          client.searchOffersAsync({
                  authorization: {
                      login: "motoabc",
                      hash: hash,
                      key: currentTimeInSeconds.toString(),
                  } ,
                  searchParams: {
                      producer,
                      season,
                      category: 'tyre',
                      perPage: 1000
                  }
                }, async function(err: any, result: any) {
                if (err) {
                    console.log("init request failed ",{err});
                    reject(err);
                }
                    const results = []
                    const { count: {pagesCount}, offers : {item}  } = result;
                    const pagesCountVal = Number.parseInt(pagesCount["$value"])
                    console.log({pagesCountVal});

                    if (pagesCountVal !== 0) {
                        results.push(...item);
                        for (let i = 1; i < pagesCountVal; i++) {
                            try {

                                const [ pageResults ] = await client.searchOffersAsync({
                                    authorization: {
                                        login: "motoabc",
                                        hash: hash,
                                        key: currentTimeInSeconds.toString(),
                                    } ,
                                    searchParams: {
                                        producer,
                                        season,
                                        category: 'tyre',
                                        perPage: 1000,
                                        page: i
                                    }
                                });
                                results.push(...pageResults.offers.item);
                            } catch (err) {
                                console.log("failed request for page", {i, err});
                                reject(err)
                            }
                        }
                    }
                    const output = augmentData(input, results);
                    const buffer = xlsx.build([{name: "mySheetName", data: output, options: {}}]);
                    const blob = await put("output_" + new Date().toLocaleDateString() + new Date().toLocaleTimeString() + ".xls", buffer, { access: 'public' });
                    resolve(blob);
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
