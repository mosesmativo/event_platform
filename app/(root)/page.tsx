import Collections from "@/components/shared/Collections";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const events = await getAllEvents({
    query: "",
    category: "",
    page: 1,
    limit: 6,
  });

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-3 md:py-6">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="text-2xl font-bold leading-loose text-gray-900 sm:text-4xl ">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-18">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button
              size="lg"
              asChild
              className="button w-full sm:w-fit p-medium-12">
              <Link href="#events" className="flex items-center gap-2">
                Explore <ExternalLink />
              </Link>
            </Button>
          </div>
          <Image
            src="/assets/images/hero.png"
            alt="hero banner"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">
          {" "}
          Trusted By <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col-gap-5 md:flex-row">
          Search <br />
          Category
          <br />
          Filter
          <br />
        </div>

        <Collections
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={1}
          totalPages={10}
        />
      </section>
    </>
  );
}
