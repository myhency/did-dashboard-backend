const sites = [];

insertSite(1, "현대카드", new Date(2019, 3, 26), null);

function insertSite(siteId, name, openDate, logoFileName) {
  sites.push({
    siteId,
    name,
    openDate,
    logoFileName
  })
}

export default sites;
