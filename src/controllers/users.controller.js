import logger from "../logger/logger.js";
import * as userService from "../services/users.service.js";
import { generateToken } from "../utils.js";
import { createHash, validatePassword } from "../utils.js";

export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await userService.getUser(uid);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });

    res.send({ status: "success", user });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.send({ status: "success", users });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const getByCode = async (req, res) => {
  try {
    let { code_technical } = req.params;

    const user = await userService.getByCode(code_technical);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });

    res.send({ status: "success", user });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, code_technical, password, role } =
      req.body;

    if (!first_name || !last_name || !email || !code_technical || !password)
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values!" });

    const user = await userService.getByEmail(email);
    if (user) {
      return res
        .status(400)
        .send({ status: "error", message: "User already exists" });
    }

    const codeTechnical = await userService.getByCode(code_technical);
    if (codeTechnical) {
      return res
        .status(400)
        .send({ status: "error", message: "Code technical already exists" });
    }

    const newUser = {
      first_name,
      last_name,
      email,
      code_technical,
      password,
      role,
    };

    await userService.register(newUser);

    res.send({ status: "success", message: "user registered" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.getByEmail(email);

    if (!user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });
    }

    if (!validatePassword(user, password))
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });

    const usersLoginDto = await userService.login(user);

    const accessToken = generateToken(usersLoginDto);

    res.send({
      status: "success",
      message: "login success",
      accessToken,
      user: usersLoginDto,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const update = async (req, res) => {
  try {
    const { uid } = req.params;
    const { first_name, last_name, email, code_technical, role } = req.body;

    if (!first_name || !last_name || !email || !code_technical || !role)
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values!" });

    const user = await userService.getUser(uid);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });

    const response = await userService.update(uid, {
      first_name,
      last_name,
      email,
      code_technical,
      role,
    });

    res.send({ status: "success", response });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};
