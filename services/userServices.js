import User from "../models/usersModel.js";

const findUser = async (data) => {
  const user = await User.exists(data);
  return user;
};

const findOneUser = async (data) => {
  const user = await User.findOne(data);
  return user;
};

const createUser = async (data) => {
  const user = new User(data);
  await user.save();
  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};

const countUsers = async (query) => {
  return await User.countDocuments(query);
};

const listUsers = async (query, skip, limit) => {
  return await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
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
