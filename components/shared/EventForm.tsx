'use client'
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator"
import { eventDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { Textarea } from "../ui/textarea"
import { FileUploader } from "./FileUploader"
import Image from "next/image"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox"
import { useUploadThing } from "@/lib/uploadthing"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { IEvent } from "@/lib/database/models/event.model"

type EventFormType = {
    userId: string,
    type: 'create' | 'update',
    event?: IEvent,
    eventId?: string
}

async function EventForm({ userId, type, event, eventId }: EventFormType) {

    const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();

    // Inituial values for the Form
    const initialValue = event && type === 'update' ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime)
    } : eventDefaultValues;

    const { startUpload } = useUploadThing('imageUploader')

    // 1. Define your form.
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialValue,
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        let uploadedImageUrl = values.imageUrl;

        // Getting the image from the form
        if(files.length > 0) {
            const uploadedImage = await startUpload(files);

            if(!uploadedImage){
                return
            }

            uploadedImageUrl = uploadedImage[0].url;
        }

        // Check if type is create and create a new event
        if(type === 'create'){
            try {
                const newEvent = await createEvent({
                    event: {...values, imageUrl: uploadedImageUrl},
                    userId,
                    path: '/profile'
                })

                if(newEvent){
                    form.reset();
                    router.push(`/events/${newEvent._id}`);
                }

            } catch (error) {
                console.log(error);
            }
        }

        // Check if its Update the events
        if(type === 'update'){
            if(!eventId){
                router.back()
                return;
            }

            try {
                const updatedEvent = await updateEvent({
                    userId,
                    event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
                    path: `/events/${eventId}`
                });

                if(updatedEvent) {
                    form.reset();
                    router.push(`/events/${updatedEvent._id}`)
                  }
                
            } catch (error) {
                console.log(error);
            }
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl>
                                    <Input placeholder="Event Title" {...field} className="input-field" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl>
                                    <Dropdown onChangeHandler={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl className="h-64">
                                    <Textarea placeholder="Event Description" {...field} className="textarea rounded-2xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl className="h-64">
                                    <FileUploader
                                        onFieldChange={field.onChange}
                                        imageUrl={field.value}
                                        setFiles={setFiles}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                        <Image src='/assets/icons/location-grey.svg' alt="location image" width={24} height={24} />
                                        <Input placeholder="Event Location or Online" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                        <Image src='/assets/icons/calendar.svg' alt="calendar" width={24} height={24} className="filter-grey" />
                                        <p className="ml-3 whitespace-nowrap text-grey-600">Sart Date:</p>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            showTimeSelect
                                            timeInputLabel="Time:"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            wrapperClassName="datePicker"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                        <Image src='/assets/icons/calendar.svg' alt="calendar" width={24} height={24} className="filter-grey" />
                                        <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            showTimeSelect
                                            timeInputLabel="Time:"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            wrapperClassName="datePicker"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                        <Image src='/assets/icons/dollar.svg' alt="dollar" width={24} height={24} className="filter-grey" />
                                        <p className="ml-3 whitespace-nowrap text-grey-600">Price:</p>
                                        <Input type="number" placeholder="price" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />

                                        <FormField
                                            control={form.control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free Ticket</label>
                                                            <Checkbox
                                                                id="isFree"
                                                                onCheckedChange={field.onChange}
                                                                checked={field.value}
                                                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className="w-full ">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                        <Image src='/assets/icons/link.svg' alt="url" width={24} height={24} />
                                        <Input placeholder="Url" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <Button 
                    type="submit" 
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    className="button col-span-2 w-full capitalize"
                >{form.formState.isSubmitting ? ('Submitting...') : `${type} Event`}</Button>
            </form>
        </Form>
    )
}

export default EventForm