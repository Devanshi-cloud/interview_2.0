// app/(root)/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

// Define interface for LiveInterviewCard props
interface LiveInterviewCardProps {
  title: string;
  category: string;
  type: string;
  description: string;
  roomId: string;
}

// Live Interview Card Component 
function LiveInterviewCard({ title, category, type, description, roomId }: LiveInterviewCardProps) {
  return (
    <div className="border rounded-lg p-6 flex flex-col gap-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-gray-500 text-sm">{category} • {type}</p>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Live</span>
      </div>
      <p className="text-sm">{description}</p>
      <Button asChild className="mt-auto">
        <Link href={`/interview/live?roomID=${roomId}&role=Host`}>Join as Host</Link>
      </Button>
    </div>
  );
}

async function Home() {
  const user = await getCurrentUser();
  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);
  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  // Live interview data
  const liveInterviews = [
    {
      title: "JavaScript Live Interview",
      category: "Technical",
      type: "Frontend",
      description: "Practice your JavaScript skills with a live interviewer. Get real-time feedback and improve your coding abilities.",
      roomId: "js123"
    },
    {
      title: "React Technical Interview",
      category: "Technical",
      type: "Frontend",
      description: "Deep dive into React concepts, component architecture, and state management with live feedback.",
      roomId: "react456"
    },
    {
      title: "Node.js Backend Session",
      category: "Technical",
      type: "Backend",
      description: "Review backend concepts, API design, database integration, and server-side performance optimization.",
      roomId: "node789"
    }
  ];

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="btn-primary max-sm:flex-1">
              <Link href="/interview">Start an Interview</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white max-sm:flex-1">
              <Link href="/interview/live">Start Live Interview</Link>
            </Button>
          </div>
        </div>
        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between">
          <h2>Take Live Interviews</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/interview/live">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveInterviews.map((interview, index) => (
            <LiveInterviewCard
              key={index}
              title={interview.title}
              category={interview.category}
              type={interview.type}
              description={interview.description}
              roomId={interview.roomId}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;