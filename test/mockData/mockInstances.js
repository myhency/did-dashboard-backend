const instances = [];

insertInstance(1, "재직증명서 발급 서비스 인스턴스 #1", "http://10.10.101.1:8080", true, 1);
insertInstance(2, "재직증명서 발급 서비스 인스턴스 #2", "http://10.10.101.2:8080", true, 1);
insertInstance(3, "법인카드 발급 서비스 인스턴스 #1", "http://10.10.101.3:8080", true, 2);
insertInstance(4, "법인카드 발급 서비스 인스턴스 #2", "http://10.10.101.4:8080", true, 2);
insertInstance(5, "전자사원증 발급 서비스 인스턴스 #1", "http://10.10.101.5:8080", true, 3);
insertInstance(6, "전자사원증 발급 서비스 인스턴스 #2", "http://10.10.101.6:8080", true, 3);
insertInstance(7, "갑근세영수증 발급 서비스 인스턴스 #1", "http://10.10.101.7:8080", true, 4);
insertInstance(8, "갑근세영수증 발급 서비스 인스턴스 #2", "http://10.10.101.8:8080", false, 4);

function insertInstance(id, name, endpoint, status, serviceId) {
  instances.push({
    id,
    name,
    endpoint,
    status,
    serviceId
  })
}

export default instances;
