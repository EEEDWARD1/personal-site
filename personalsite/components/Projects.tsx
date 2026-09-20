import ContentList from "./ContentList";

export default function Projects(){
    return(
        <section className="block-panel border-t-4 border-t-blue" aria-labelledby="projects-heading">
            <h2 id="projects-heading">Projects</h2>
            <ContentList kind="projects" />
        </section>
    )
}
