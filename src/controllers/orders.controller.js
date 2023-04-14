import {
  getInProcess as getInProcessService,
  getPendings as getPendingsService,
  getInProgressByTechnical as getInProgressByTechnicalService,
  getOrder as getOrderService,
} from "../services/orders.service.js";

const getInProcess = async (req, res) => {
  try {
    const orders = await getInProcessService();

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getPendings = async (req, res) => {
  try {
    const { sector } = req.params;
    const orders = await getPendingsService(sector);

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getInProgressByTechnical = async (req, res) => {
  try {
    const { code_technical } = req.params;
    const orders = await getInProgressByTechnicalService(code_technical);

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getOrder = async (req, res) => {
  try {
    const { nrocompro } = req.params;
    const order = await getOrderService(nrocompro);
    res.send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export { getInProcess, getPendings, getInProgressByTechnical, getOrder };