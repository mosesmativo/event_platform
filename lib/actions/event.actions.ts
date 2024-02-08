'use server';

import { CreateEventParams, GetAllEventsParams } from "@/types";
import { connectToDatabase } from "../database"
import { handleError } from "../utils"
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import Category from "../database/models/category.model";

const populateEvent = async (query: any) => {
    return query
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
    try {
      await connectToDatabase()
  
      const organizer = await User.findById(userId)
      if (!organizer) throw new Error('Organizer not found')
  
      const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
   
      return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
      handleError(error)
    }
}

// GET Event by ID
export const getEventById = async (eventId: string) => {
  try {
      await connectToDatabase();

      const event = await populateEvent(Event.findById(eventId));
      if (!event) throw new Error('Event not found')

      return JSON.parse(JSON.stringify(event));

  } catch (error) {
    handleError(error);
  }
}

// GET All Events
export const getAllEvents = async ({query, limit = 6, page, category}: GetAllEventsParams) => {
  try {
      await connectToDatabase();

      // setting up conditions for the query
      const conditions = {};
      const eventQuery = Event.find(conditions)
        .sort({ createdAt: 'desc'})
        .skip(0)
        .limit(limit);

      // Fetch all the Events
      const events = await populateEvent(eventQuery);

      // Get the number of returned events
      const eventsCount = await Event.countDocuments(conditions);

      return {
        data: JSON.parse(JSON.stringify(events)),
        totalPages: Math.ceil(eventsCount / limit),
      };

  } catch (error) {
    handleError(error);
  }
}