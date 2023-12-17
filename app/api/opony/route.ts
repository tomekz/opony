import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob';
import { getAuthKey, checkSecret } from '../../utils';
import xlsx from 'node-xlsx';
const soap = require('soap');

function augmentData(xlsData : any[], apiResults : any[])  {
  const newData = xlsData.slice(1,-1).map((row, i) => {

    if (row.length < 1) {
        return
    }
    const productCode = row[1].toString().trim();
    if (!productCode) {
        return
    }
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

        match.splice(match.indexOf(lowestPricedOffer), 1);

        const nextLowestPricedOffer = match.reduce((prev : any, current : any) => {
            return (Number.parseFloat(prev.price['$value']) < Number.parseFloat(current.price['$value'])) ? prev : current
        })

        console.log({lowestPricedOffer: lowestPricedOffer.url['$value'], nextLowestPricedOffer: nextLowestPricedOffer.url['$value']});

        augment = [
            lowestPricedOffer.price['$value'],
            lowestPricedOffer.amount['$value'],
            lowestPricedOffer.seller['$value'],
            lowestPricedOffer.name['$value'],
            lowestPricedOffer.url['$value'],
            nextLowestPricedOffer.price['$value'],
            nextLowestPricedOffer.amount['$value'],
            nextLowestPricedOffer.seller['$value'],
            nextLowestPricedOffer.name['$value'],
            nextLowestPricedOffer.url['$value'],
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
    "link do oferty", // augmented
    "nastepna najniższa cena", // augmented
    "nastepna ilosc", // augmented
    "nastepny dostawca", // augmented
    "nastepna nazwa oferty", // augmented
    "nastepny link do oferty" // augmented
];

  newData.unshift(header);

  return newData;
}


export async function POST(request: NextRequest) {
    const url = 'https://platformaopon.pl/webapi.wsdl'; 
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const data = await request.formData()
    const secret  = data.get('secret')
    if (!checkSecret(secret)) {
        return NextResponse.json({ success: false , error: "Niepoprawny sekret" })
    }

    const blob = data.get('file') as Blob
    const producer  = data.get('producer')
    const perPage = 1000
    const fileContents = await blob.arrayBuffer()

    const workSheets = xlsx.parse(fileContents);
    const input = workSheets[0].data;

    const promise = new Promise((resolve, reject) => {

        soap.createClient(url, {}, function(err :any, client: any) {
          if (err) {
            reject(err);
          }
          const hash = getAuthKey("searchOffers", currentTimeInSeconds.toString());

          console.info("searchOffersAsync begin", {producer, category: 'tyre', currentTimeInSeconds})

          const params =  { producer,category: 'tyre', perPage } 

          client.searchOffersAsync({
                  authorization: {
                      login: "motoabc",
                      hash: hash,
                      key: currentTimeInSeconds.toString(),
                  } ,
                  searchParams : {
                      ...params
                  }
                }, async function(err: any, result: any) {
                if (err) {
                    console.log("init request failed ",{err});
                    reject(err);
                }
                    let results = []
                    const { count , offers : {item}  } = result;
                    const pagesCountVal = Number.parseInt(count.pagesCount["$value"])
                    console.log({count})

                    if(item.length > 0)
                    {
                        results.push(...item);
                    } else {
                        console.log("no results found");
                        reject("no results found");
                    }


                    if (pagesCountVal !== 0) {
                        const promises = [];
                        for (let i = 1; i < pagesCountVal; i++) {
                                promises.push(client.searchOffersAsync({
                                    authorization: {
                                        login: "motoabc",
                                        hash: hash,
                                        key: currentTimeInSeconds.toString(),
                                    } ,
                                    searchParams: {
                                        ...params,
                                        page: i+1
                                    }
                                }))
                        }
                        await Promise.all(promises).then((values) => {
                            values.forEach(([ pageResults ] : any) => {
                                const {  offers : {item}  } = pageResults  ;
                                if(item)
                                {
                                    results.push(...item);
                                } else {
                                    console.log("no results found");
                                    reject("no results found");
                                }
                            })
                        })
                    }

                    const output = augmentData(input, results);
                    const sheetOptions = {'!cols': [{wch: 15}, {wch: 10}, {wch: 10}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 40}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 40}]};
                    const buffer = xlsx.build([{name: "wyniki", data: output, options: {}}], {sheetOptions});
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
