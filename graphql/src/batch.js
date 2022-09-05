const axios = require('axios');

exports.batchDiceSeeds = async (seedIds) => {
  const seeds = await axios.post(`http://dice/get-seeds`, { seedIds });
  const map = {};
  seeds.data.forEach((seed) => {
    map[seed.id] = seed;
  });

  return seedIds.map((id) => map[id]);
};

exports.batchWheelSeeds = async (seedIds) => {
  const seeds = await axios.post(`http://wheel/get-seeds`, { seedIds });
  const map = {};
  seeds.data.forEach((seed) => {
    map[seed.id] = seed;
  });

  return seedIds.map((id) => map[id]);
};
