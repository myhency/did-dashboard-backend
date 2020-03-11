const sites = [];

insertSite(1, "현대카드", new Date(2019, 3, 26), null);

function insertSite(siteId, name, openDate, logoImageName) {
  sites.push({
    siteId,
    name,
    openDate,
    logoImageName
  })
}

export default sites;
