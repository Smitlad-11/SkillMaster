const Contact = require('../models/Contact');

// @desc    Submit a contact message
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, role, message } = req.body;

    if (!name || !email || !role || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const contact = await Contact.create({
      name,
      email,
      role,
      message,
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Message submitted successfully',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Respond to a contact message
// @route   PUT /api/contacts/:id/respond
// @access  Private/Admin
const respondToContact = async (req, res) => {
  try {
    const { response } = req.body;
    if (!response) {
      return res.status(400).json({ success: false, message: 'Response text is required' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    contact.response = response;
    contact.respondedAt = Date.now();
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact,
      message: 'Response saved successfully',
    });
  } catch (error) {
    console.error('Respond to contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ email: req.user.email }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Get my contacts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  submitContact,
  getContacts,
  respondToContact,
  getMyContacts,
  deleteContact,
};
