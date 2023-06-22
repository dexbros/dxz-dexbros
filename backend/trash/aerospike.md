<!-- @format -->

- Importing Aerosike Client:-
  const client = await getAerospikeClient();

- Creating Aerospike key:-
  const key = new Aerospike.Key("CLUSTER_NAME", YOUR_SET_NAME, TABLE_IINDEX)

* Create Aerospike bins:-
  const bins = {
  key_name: value
  }

* Save data in Aerospike:-
  const data = await client.put(key, bins);

* Get specific data from table:-
  const data = await client.get(key);

* How to update a field value:-

  i. First create key
  const key = new Aerospike.Key("CLUSTER_NAME", YOUR_SET_NAME, TABLE_IINDEX);

  ii. Create new bins
  const ops = [Aerospike.operations.write("FIELD_VALUE", VALUE)];

  iii. updateing value
  client.operate(key, ops, (err, result) => {
  if(err) {
  // throw error
  } else {

        }
      })
