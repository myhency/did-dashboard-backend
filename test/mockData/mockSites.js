const sites = [];

insertSite(1, "현대카드", new Date(2019, 3, 26), null);
insertSite(2, "애플", new Date(2019, 2, 28), null);

function insertSite(siteId, name, openDate, logoFileName) {
  sites.push({
    siteId,
    name,
    openDate,
    logoFileName
  })
}

export default sites;
