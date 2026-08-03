import React from "react";

export default function ProjectAccordion({ projects, activeProject, onSelectProject }) {
  return (
    <div className="flex h-full min-h-[460px] lg:min-h-[520px] w-full border-l border-black bg-[#F5F4F0]">
      {projects.map((proj) => {
        const isActive = proj.id === activeProject.id;
        return (
          <button
            key={proj.id}
            onClick={() => onSelectProject(proj)}
            className={`flex-1 flex flex-col justify-between items-center py-6 px-1 border-r border-black transition-all duration-300 relative group cursor-pointer ${
              isActive ? "bg-black text-white" : "hover:bg-neutral-200/80 text-black"
            }`}
          >
            <div className="text-sm font-light select-none tracking-widest pt-1">
              {isActive ? "—" : "+"}
            </div>

            <div className="my-auto py-8">
              <span
                className={`inline-block [writing-mode:vertical-rl] rotate-180 text-xs sm:text-sm tracking-wide uppercase font-medium whitespace-nowrap transition-transform duration-300 group-hover:-translate-y-1 ${
                  isActive ? "text-white font-bold" : "text-neutral-800"
                }`}
              >
                {proj.title}
              </span>
            </div>

            <div className="text-[10px] font-mono opacity-60 pb-1">
              {proj.year}
            </div>

            {isActive && (
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-white"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
