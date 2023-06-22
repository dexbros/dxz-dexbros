/** @format */

const Aerospike = require("aerospike");
const { defineAerospikeClient, getAerospikeClient } = require("../aerospike");

const fetch = require("node-fetch");

async function saveNewsData() {
  const client = await getAerospikeClient();
  var axios = require("axios");

  var config = {
    method: "get",
    url: "https://cryptopanic.com/api/v1/posts/?auth_token=0c74984167f9695a162629b8799ba7cbbb2e05f7&metadata=true",
    headers: {},
  };

  axios(config)
    .then(async function (response) {
      for (let i = 0; i < response.data.results.length; i++) {
        // console.log(response.data.results[i].metadata ? "Have" : "NOT HAVE**")
        // console.log(i);
        const news_key = new Aerospike.Key(
          "test",
          "news",
          response.data.results[i].id.toString()
        );
        // var imageData = await download(response.data.results[i].metadata.image)

        const news_bins = {
          id: response.data.results[i].id.toString(),
          kind: response.data.results[i].kind,
          p_t: response.data.results[i].published_at,
          title: response.data.results[i].title,
          source: response.data.results[i].source,
          isNews: true,
          votes: {
            negative: response.data.results[i].votes.negative,
            positive: response.data.results[i].votes.positive,
            likes: 0,
            dislikes: 0,
            toxic: response.data.results[i].votes.toxic,
          },
          // currencies: response.data.results[i].currencies,
          source: response.data.results[i].source,
          url: response.data.results[i].url,
          image: response.data.results[i].metadata
            ? response.data.results[i].metadata.image
              ? response.data.results[i].metadata.image
              : ""
            : "",
          des: response.data.results[i].metadata
            ? response.data.results[i].metadata.description.slice(0, 200)
            : "",
        };
        const newsData = await client.put(news_key, news_bins);
        console.log("Save...");
      }
      return;
    })
    .catch(function (error) {
      console.log(error);
    });
}

saveNewsData();
