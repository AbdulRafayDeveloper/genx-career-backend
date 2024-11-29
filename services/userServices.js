import usersModel from "../models/usersModel.js";

const findUser = async (data) => {
  const user = await usersModel.exists(data);
  return user;
};

const findOneUser = async (data) => {
  const user = await usersModel.findOne(data);
  return user;
};

const createUser = async (data) => {
  const user = new User(data);
  await usersModel.save();
  return user;
};

const getAllUsers = async () => {
  const users = await usersModel.find();
  return users;
};

const getUserById = async (id) => {
  const user = await usersModel.findById(id);
  return user;
};

const deleteUser = async (id) => {
  const deletedUser = await usersModel.findByIdAndDelete(id);
  return deletedUser;
};

const countUsers = async (query) => {
  return await usersModel.countDocuments(query);
};

const listUsers = async (query, skip, limit) => {
  return await usersModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
};
export {
  findUser,
  findOneUser,
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  countUsers,
  listUsers,
};
