import contactsModel from "../models/contactsModel.js";

const findContactByEmail = async (data) => {
  return await contactsModel.findOne(data);
};

const createContact = async (data) => {
  const contact = new Contact(data);
  await contactsModel.save();
  return contact;
};

const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

const getContactById = async (id) => {
  const contact = await contactsModel.findById(id);
  return contact;
};

const updateContactMessages = async (email, newMessage) => {
  return await contactsModel.findOneAndUpdate(
    { email },
    { $push: { messages: { message: newMessage } } },
    { new: true }
  );
};

const deleteContact = async (id) => {
  const deletedContact = await contactsModel.findByIdAndDelete(id);
  return deletedContact;
};

const countContacts = async (query) => {
  return await contactsModel.countDocuments(query);
};

const listContacts = async (query, skip, limit) => {
  return await contactsModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export {
  findContactByEmail,
  createContact,
  getAllContacts,
  getContactById,
  updateContactMessages,
  deleteContact,
  countContacts,
  listContacts,
};
