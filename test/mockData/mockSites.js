const sites = [];

insertSite(1, "현대카드", new Date(2019, 2, 26), null);
insertSite(2, "애플", new Date(2019, 1, 28), null);

function insertSite(id, name, openDate, logoFileName) {
  sites.push({
    id,
    name,
    openDate,
    logoFileName
  })
}

export default sites;
