const sites = [];

insertSite(1, "현대카드", new Date(2019, 3, 26), null);
insertSite(2, "애플", new Date(2019, 2, 28), null);
insertSite(3, "농협은행", new Date(2018, 12, 25), null);
insertSite(4, "삼성전자", new Date(2017, 1, 1), null);

function insertSite(id, name, openDate, logoFileName) {
  sites.push({
    id,
    name,
    openDate,
    logoFileName
  })
}

export default sites;
