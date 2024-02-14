import EventForm from '@/components/shared/EventForm'
import { getEventById } from '@/lib/actions/event.actions'
import { auth } from '@clerk/nextjs'
import React from 'react'

type UpdateEventProps = {
    params: {
      id: string
    }
  }
  

async function Updatevent({ params: { id }}: UpdateEventProps) {

    // Getting the id fron the session
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    // Get Event by its ID
    const event = await getEventById(id);
  return (
<>
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <h3 className='wrapper h3-bold text-center sm:text-left'>Update Event</h3>
    </section>
    <div className="wrapper my-8">
        <EventForm 
            userId={userId} 
            type="update"
            event={event}
            eventId={event._id}
        />
    </div>
</>
  )
}

export default Updatevent