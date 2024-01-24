'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import { handleError } from '@/lib/utils'

import { CreateUserParams, UpdateUserParams } from '@/types'

// Server side action that creates a new user
export const createUser = async (user: CreateUserParams) => {
    try{
        await connectToDatabase();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch(err){
        handleError(err);
    }
}

export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
    try {
      await connectToDatabase()
  
      const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })
  
      if (!updatedUser) throw new Error('User update failed')
      return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
      handleError(error)
    }
  }

export const deleteUser = async (clerkId: string) => {
    try {
        await connectToDatabase()

        // find user to delete

        const userToDelete = await User.findOne({clerkId});

        if(!userToDelete){
            throw new Error('User not Found') 
        }

        // Unlink relationships
        await Promise.all([
            // Update the 'events' collection to remove refrence of the user

            Event.updateMany(
                { _id: {$in: userToDelete.events} },
                { $pull: {organizer: userToDelete._id} }
            ),

            Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
        ])

        const deletedUser = await User.findOneAndDelete(userToDelete._id)
        revalidatePath('/')

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null

    } catch (error) {
        handleError(error)
    }
}