const imdb = require('imdb-api')
const cli = new imdb.Client({ apiKey: process.env.OMDB_APIKEY });

module.exports = {
  /**
   * Return all the episodes for the specified show
   * in the query param 't'
   */
  getEpisodes: async (req, res) => {
    try {
      //console.log("Get Episodes for", req.params.t);
      const show = await cli.get({ name: req.params.t }, { timeout: 30000 });
      const episodes = await show.episodes();
      //console.log(episodes);
      res.json(episodes);
    } catch (err) {
      console.log("Error Getting Episodes", err);
      res.status(422).json(err);
    }
  },
}