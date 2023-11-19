
const soap = require('soap');
    const md5 = require('md5')


function getAuthKey (action, timestamp){
  const login = process.env.LOGIN

  if (!login) {
    throw new Error('LOGIN is not defined')
  }
  const last4Chars = login.slice(-4)

  return md5(login + timestamp + action + last4Chars)
}

async function search() {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const url = 'https://platformaopon.pl/webapi.wsdl'; 

   return new Promise((resolve, reject) => { 
        soap.createClient(url, {}, function(err, client ) {
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
                      // producer: "barum",
                      producer: "Tracmax",
                      // type: 'dostawcze',
                      category: 'tyre',
                      season: 'całoroczne',
                      size: '195/65R15',
                      perPage: 1000
                  }
                }, async function(err,  result) {
                if (err) {
                    reject(err);
                }
                    const results = []
                    const { count: {pagesCount}, offers : {item}  } = result;

                    const pagesCountVal = Number.parseInt(pagesCount["$value"])
                    console.log({pagesCountVal});

                    if (pagesCountVal !== 0) {
                        results.push(...item);

                        for (let i = 1; i < 3; i++) {
                            const [ pageResults ] = await client.searchOffersAsync({
                                authorization: {
                                    login: "motoabc",
                                    hash: hash,
                                    key: currentTimeInSeconds.toString(),
                                } ,
                                searchParams: {
                                    producer: "Tracmax",
                                    category: 'tyre',
                                    season: 'całoroczne',
                                    size: '195/65R15',
                                    perPage: 1000,
                                    page: i
                                }
                            });
                            results.push(...pageResults.offers.item);
                        }
                    }

                    // const output = augmentData(input, item);

                    // const buffer = xlsx.build([{name: "mySheetName", data: output, options: {}}]);
                    // const blob = await put("output_" + Date.now().toString() + ".xls", buffer, { access: 'public' });
                    // console.log({blob});
                    resolve(results);
                    // return NextResponse.json({ success: true , url: res.url })
                });
            })
   })
}

search().then((result) => {
    console.log(result.length);

    }).catch((err) => {
        console.log({err});
    })
