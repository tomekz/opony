import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob';
import { getAuthKey } from '../../utils';
import xlsx from 'node-xlsx';
const soap = require('soap');

function augmentData(xlsData : any[], apiResults : any[])  {
  const newData = xlsData.slice(1,-1).map((row, i) => {

    const productCode = row[1].toString().trim();
    console.log({productCode, i});
    const match = apiResults.filter((item : any) => {
        const pCode = row[1].toString().trim();
        const productCodes  = item.product_code['$value']?.split(',').map((code : string) => code.trim());
        const isMatch = productCodes?.includes(pCode);
        return isMatch;
    })

    let augment = [] as any[];
    if (match.length > 0) {
        console.log("matches found ", match.length, {productCode});
        const lowestPricedOffer = match.reduce((prev : any, current : any) => {
            return (Number.parseFloat(prev.price['$value']) < Number.parseFloat(current.price['$value'])) ? prev : current
        })

        console.log({lowestPricedOffer: lowestPricedOffer.url['$value']});
        augment = [
            lowestPricedOffer.price['$value'],
            lowestPricedOffer.amount['$value'],
            lowestPricedOffer.seller['$value'],
            lowestPricedOffer.name['$value'],
            lowestPricedOffer.url['$value']
        ]
    }
    else {
        augment = ["nie znaleziono ofert" ];
    }

    return [ ...row, ...augment];
  });

  const header = [
    "nazwa",
    "EAN/SAP",
    "ilość",
    "cena netto",
    "najniższa cena", // augmented
    "ilosc", // augmented
    "dostawca", // augmented
    "nazwa oferty", // augmented
    "link do oferty" // augmented
];

  newData.unshift(header);

  return newData;
}

export async function POST(request: NextRequest) {

    const url = 'https://platformaopon.pl/webapi.wsdl'; 
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const data = await request.formData()
    const blob = data.get('file') as Blob

    const producer  = data.get('producer')
    const season  = data.get('season')
    const size  = data.get('size')
    const type  = data.get('type')
    const amount  = data.get('amount')
    const fileContents = await blob.arrayBuffer()

    const workSheets = xlsx.parse(fileContents);
    const input = workSheets[0].data;

    const promise = new Promise((resolve, reject) => {

        soap.createClient(url, {}, function(err :any, client: any) {
          if (err) {
            reject(err);
          }

          const hash = getAuthKey("searchOffers", currentTimeInSeconds.toString());

          console.info("searchOffersAsync begin", {producer, season, size, type, amount, category: 'tyre', currentTimeInSeconds})

          client.searchOffersAsync({
                  authorization: {
                      login: "motoabc",
                      hash: hash,
                      key: currentTimeInSeconds.toString(),
                  } ,
                  searchParams: {
                      producer,
                      season,
                      size,
                      type,
                      amount,
                      category: 'tyre',
                      perPage: 1000
                  }
                }, async function(err: any, result: any) {
                if (err) {
                    console.log("init request failed ",{err});
                    reject(err);
                }
                    const results = []
                    const { count , offers : {item}  } = result;
                    const pagesCountVal = Number.parseInt(count.pagesCount["$value"])
                    console.log({ count });

                    if(item)
                    {
                        results.push(...item);
                    } else {
                        console.log("no results found");
                        reject("no results found");
                    }


                    if (pagesCountVal !== 0) {
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
                                        size,
                                        type,
                                        amount,
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
                    
                    console.log("augmented data", {output});
                    const options = {'!cols': [{wch: 5}, {wch: 5}, {wch: 10}, {wch: 20}]};
                    const buffer = xlsx.build([{name: "wyniki", data: output, options }]);
                    const blob = await put("wyniki_" + Date.now().toString() + ".xls", buffer, { access: 'public' });
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
