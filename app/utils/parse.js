const data =  [
    [ 'NAZWA', 'EAN / SAP', 'ILOSC', 'CENA NETTO' ],
    [
      'ZIMA 195/65R15 91H TRACMAX X-PRIVILO S130',
      6958460916796,
      30,
      117.38
    ],
    [
      'ZIMA 225/65R16C 112/110R TRACMAX X-PRIVILO VS450',
      6958460917076,
      24,
      193.32
    ],
    [
      'ZIMA 185/65R15 88H TRACMAX X-PRIVILO S130',
      6958460916857,
      24,
      111.83
    ],
    [
      'ZIMA 225/45R18 95VXL TRACMAX X-PRIVILO S330',
      6958460920502,
      24,
      159.01
    ],
    [
      'ZIMA 245/45R18 100VXL TRACMAX ICE-PLUS S210',
      6956647609509,
      20,
      187.31
    ],
    [
      'CAŁOROCZNE 195/65R15 95H TRACMAX AS TRAC SAVER',
      6958460900443,
      18,
      133.21
    ],
    [
      'CAŁOROCZNE 225/65R16C 112/110S TRACMAX A/S VAN SAVER',
      'VSR1610',
      12,
      197.49
    ],
    [
      'CAŁOROCZNE 205/65R16C 107/105T TRACMAX A/S VAN SAVER',
      'VSR1605',
      12,
      178.43
    ],
]

function augmentData(data)  {
  const newData = data.map((row, key ) => {
      console.log(key);
    return [...row, row[1] * 2];
  });
  return newData;
}

console.log(augmentData(data));
