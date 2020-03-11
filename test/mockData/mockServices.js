import Role from "../../enums/Role";

const services = [];

insertService(1, "재직증명서 발급", Role.ISSUER, new Date(2019, 3, 26), "http://", 1);
insertService(2, "법인카드 발급", Role.VERIFIER, new Date(2018, 4, 15), "http://", 1);
insertService(3, "전자사원증 발급", Role.ISSUER, new Date(2017, 11, 4), "http://", 1);
insertService(4, "갑근세영수증 발급", Role.VERISSUER, new Date(2019, 2, 28), "http://", 1);

function insertService(serviceId, name, role, openDate, endpoint, siteId) {
  services.push({
    serviceId,
    name,
    role,
    openDate,
    endpoint,
    siteId
  })
}

export default services;
