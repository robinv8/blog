import ProjectCard from '@/components/ProjectCard'

const ProjectsGrid = ({ projects }) => {
  if (!projects?.length) return null
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </div>
  )
}

export default ProjectsGrid
