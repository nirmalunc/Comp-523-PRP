// Announcements.js

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
});

const Event = mongoose.model('Event', EventSchema);

async function createEvent(title, start, end) {
  try {
    // Ensure start and end are Date objects
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Check if dates are valid
    // if (isNaN(startDate) || isNaN(endDate)) {
    //   throw new Error('Invalid date format for start or end');
    // }
    const newEvent = new Event({ title, start: startDate, end: endDate });
    await newEvent.save();
    console.log(newEvent)
    return newEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Error creating event');
  }
}

async function getAllEvents() {
  try {
    const events = await Event.find();
    return events;
  } catch (error) {
    throw new Error('Error fetching events');
  }
}

module.exports = {
  Event,
  createEvent,
  getAllEvents
};
