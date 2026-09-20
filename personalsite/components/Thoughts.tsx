import ContentList from "./ContentList";

export default function Thoughts() {
    return(
        <section className="block-panel border-t-4 border-t-purple" aria-labelledby="thoughts-heading">
            <h2 id="thoughts-heading">Thoughts</h2>
            <ContentList kind="thoughts" />
        </section>
    )
}
