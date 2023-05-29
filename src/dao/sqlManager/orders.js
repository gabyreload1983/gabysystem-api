import logger from "../../logger/logger.js";
import { connectionUrbano } from "../dbMySqlConfig.js";

export default class Orders {
  constructor() {
    logger.info("Working Orders with DB in MySQL");
  }

  getFromUrbano = (querySelect) => {
    return new Promise((resolve, reject) => {
      connectionUrbano.query(querySelect, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  };

  getInProcess = async () =>
    await this.getFromUrbano(
      `SELECT * FROM trabajos WHERE estado = 22 ORDER BY tecnico`
    );

  getToDeliver = async (from = "1 YEAR") =>
    await this.getFromUrbano(
      `SELECT * FROM trabajos WHERE 
      ingresado BETWEEN DATE_ADD(NOW(),INTERVAL - ${from}) AND NOW() AND
      codigo != 'ANULADO' AND estado = 23  AND diag = 22 AND ubicacion = 21
      ORDER BY ingresado DESC`
    );

  getFinalDisposition = async () =>
    await this.getFromUrbano(
      `SELECT * FROM trabajos WHERE 
    ingresado < DATE_ADD(NOW(),INTERVAL - 1 YEAR) AND codigo != 'ANULADO' AND 
    estado = 23  AND diag = 23 AND ubicacion = 21 
    ORDER BY ingresado DESC LIMIT 100`
    );

  getPendings = async (sector) =>
    await this.getFromUrbano(
      `SELECT * FROM trabajos 
      WHERE  codiart = ".${sector}" AND estado = 21 AND codigo != "ANULADO"
      ORDER BY prioridad DESC`
    );

  getInProgressByTechnical = async (code_technical) =>
    await this.getFromUrbano(
      `SELECT * FROM trabajos 
      WHERE tecnico="${code_technical}" AND estado = 22 AND codigo != "ANULADO"
      ORDER BY prioridad DESC`
    );

  getById = async (nrocompro) =>
    await this.getFromUrbano(
      `SELECT * FROM trabajos WHERE nrocompro = '${nrocompro}'`
    );

  getProductsInOrder = async (nrocompro) =>
    await this.getFromUrbano(
      `SELECT * FROM trrenglo INNER JOIN articulo ON trrenglo.codart = articulo.codigo
     WHERE trrenglo.nrocompro = '${nrocompro}'`
    );

  take = async (nrocompro, code_technical) =>
    await this
      .getFromUrbano(`UPDATE trabajos SET estado = 22, tecnico = '${code_technical}', costo = 1
    WHERE nrocompro = '${nrocompro}'`);

  update = async (nrocompro, diagnostico, costo, code_technical) =>
    await this
      .getFromUrbano(`UPDATE trabajos SET diagnostico = '${diagnostico}', costo = ${costo}, pendiente = ${costo}, 
      tecnico = '${code_technical}', diagnosticado = NOW()
      WHERE nrocompro = '${nrocompro}'`);

  close = async (nrocompro, diagnostico, costo, code_technical, diag) =>
    await this.getFromUrbano(
      `UPDATE trabajos SET estado = 23, diag = ${diag}, 
      diagnostico = '${diagnostico}', costo = ${costo}, pendiente = ${costo}, 
      diagnosticado = NOW(), tecnico = '${code_technical}'
      WHERE nrocompro = '${nrocompro}'`
    );

  free = async (nrocompro) =>
    await this
      .getFromUrbano(`UPDATE trabajos SET estado = 21, diag = 21, tecnico = '', diagnosticado = NOW() 
    WHERE nrocompro = '${nrocompro}'`);
}
