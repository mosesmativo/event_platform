import EventForm from '@/components/shared/EventForm'
import { auth } from '@clerk/nextjs'
import React from 'react'

function CreateEvent() {

    // Getting the id fron the session
    const { sessionClaims } = auth();

    const userId = sessionClaims?.userId as string;
    const userMyId = sessionClaims?.userMyId as string;

    console.log(`ID is ${userId}`);
    console.log(`User my ID is ${userMyId}`);

  return (
<>
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <h3 className='wrapper h3-bold text-center sm:text-left'>Create Event</h3>
    </section>
    <div className="wrapper my-8">
        <EventForm userId={userId} type="create"/>
    </div>
</>
  )
}

export default CreateEvent