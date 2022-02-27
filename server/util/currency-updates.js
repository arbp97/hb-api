const axios = require("axios");

const getNewestRates = async (req) => {
  try {
    const response = await axios.get(
      "https://freecurrencyapi.net/api/v2/latest?apikey=2ee230e0-9803-11ec-bd2a-db779118af45"
    );
    req = response.data;
    //console.log(body.data);
    return req.data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getNewestRates };
