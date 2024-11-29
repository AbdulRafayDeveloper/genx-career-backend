import Contact from "../models/contactModel.js";

const findContactByEmail = async (data) => {
  return await Contact.findOne(data);
};

const createContact = async (data) => {
  const contact = new Contact(data);
  await contact.save();
  return contact;
};

const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

const updateContactMessages = async (email, newMessage) => {
  return await Contact.findOneAndUpdate(
    { email },
    { $push: { messages: { message: newMessage } } },
    { new: true }
  );
};

const deleteContact = async (id) => {
  const deletedContact = await Contact.findByIdAndDelete(id);
  return deletedContact;
};

const countContacts = async (query) => {
  return await Contact.countDocuments(query);
};

const listContacts = async (query, skip, limit) => {
  return await Contact.find(query)
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
