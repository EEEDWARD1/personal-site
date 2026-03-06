import Card from "../components/ui/card"

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <Card>
        <div>
          <h1>About me</h1>
          <hr/>
          <img 
            src="myself.png" 
            alt="Eduard" 
            className="float-right ml-4 mb-2 w-28 h-28 rounded-full object-cover"
          />
          <p>Hi, I'm Eduard, a final year Computer Science student from the United Kingdom.</p>
          <br></br>
            <p>Since I've started programming, I've developed an addiction, whether it's working in Python, Web, Java. I'm constantly exploring new ways to solve problems and bring ideas to life.</p>
        </div>
      </Card>
      <Card>
        <h1>Projects</h1>
      </Card>
      <Card>
        <h1>Blog</h1>
      </Card>
      <Card>
        <h1>Contacts</h1>
      </Card>
    </main>
  );
}
