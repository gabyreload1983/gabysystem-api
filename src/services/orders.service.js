import Customers from "../dao/sqlManager/customers.js";
import Orders from "./../dao/sqlManager/orders.js";
import sendMail from "./../nodemailer/config.js";

const orderManager = new Orders();
const customersManager = new Customers();

const addingProductsInOrders = async (orders) => {
  for (let order of orders) {
    order.products = await orderManager.getProductsInOrder(order.nrocompro);
  }
  return orders;
};

const getInProcess = async () => {
  const orders = await orderManager.getInProcess();
  return await addingProductsInOrders(orders);
};

const getToDeliver = async () => {
  const orders = await orderManager.getToDeliver();
  return await addingProductsInOrders(orders);
};

const getFinalDisposition = async () => {
  const orders = await orderManager.getFinalDisposition();
  return await addingProductsInOrders(orders);
};

const getPendings = async (sector) => {
  const orders = await orderManager.getPendings(sector);
  return await addingProductsInOrders(orders);
};

const getInProgressByTechnical = async (code_technical) => {
  const orders = await orderManager.getInProgressByTechnical(
    code_technical.toUpperCase()
  );
  return await addingProductsInOrders(orders);
};

const getOrder = async (nrocompro) => {
  const order = await orderManager.getById(nrocompro);
  if (order.length === 0) return null;
  order[0].products = await orderManager.getProductsInOrder(nrocompro);
  return order;
};

const take = async (nrocompro, code_technical) =>
  await orderManager.take(nrocompro, code_technical);

const update = async (nrocompro, diagnostico, costo, code_technical) =>
  await orderManager.update(nrocompro, diagnostico, costo, code_technical);

const close = async (
  nrocompro,
  diagnostico,
  costo,
  code_technical,
  diag,
  notification
) => {
  const result = await orderManager.close(
    nrocompro,
    diagnostico,
    costo,
    code_technical,
    diag
  );
  if (notification) {
    const order = await orderManager.getById(nrocompro);
    const customer = await customersManager.getByCode(order[0].codigo);
    console.log(customer[0]);
    const info = await sendMail(
      customer[0].mail,
      "ORDEN REPARACION",
      "Notificacion Servicio Tecnico",
      `<p>La orden de reparacion ${nrocompro} esta finalaizada. ya la puede retirar. Servicio tecnico Sinapsis</p>`
    );
    return info;
  }
  return result;
};

const free = async (nrocompro) => {
  const order = await orderManager.getById(nrocompro);
  if (order.length === 0)
    return { status: "error", message: "No se encontro orden!" };

  if (order[0].ubicacion === 22)
    return { status: "error", message: "La orden ya fue entregada!" };

  return await orderManager.free(nrocompro);
};

export {
  getInProcess,
  getToDeliver,
  getFinalDisposition,
  getPendings,
  getInProgressByTechnical,
  getOrder,
  take,
  update,
  close,
  free,
};
