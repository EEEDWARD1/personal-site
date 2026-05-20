import { Project } from "@/lib/api";
import CardCarousel from "@/components/ui/card-carousel";
import ProjectCard from "./ProjectCard";

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  return (
    <CardCarousel className="desktop-grid-3" label="Featured projects">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </CardCarousel>
  );
}
