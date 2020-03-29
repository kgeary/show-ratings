const router = require("express").Router();
const searchController = require("../../controllers/searchController");

// matches /api/episodes
router.route("/episodes/:t")
  .get(searchController.getEpisodes);

module.exports = router;
