import {
  getUsers as getUsersService,
  getUserByCode as getUserByCodeService,
  createUser as createUserService,
  getByEmail as getByEmailService,
} from "../services/users.service.js";
import { generateToken } from "../utils.js";
import { createHash, validatePassword } from "../utils.js";

const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const getUserByCode = async (req, res) => {
  try {
    let { code_technical } = req.params;

    const user = await getUserByCodeService(code_technical);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, code_technical, password } = req.body;

    const user = await getByEmailService(email);
    if (user) {
      return res
        .status(400)
        .send({ status: "error", message: "User already exists" });
    }

    const newUser = {
      first_name,
      last_name,
      email,
      code_technical: code_technical.toUpperCase(),
      password: createHash(password),
      role: "user",
    };

    await createUserService(newUser);

    res.send({ status: "success", message: "user registered" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getByEmailService(email);

    if (!user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });
    }

    if (!validatePassword(user, password))
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });

    user.password = "";

    const accessToken = generateToken(user);

    res
      .cookie("gabySystemCookieToken", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
      })
      .send({ status: "success", message: "login success" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export { getUsers, getUserByCode, createUser, loginUser };
