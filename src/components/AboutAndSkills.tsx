import React from "react";
import { BookOpen, Calendar, MapPin, Award, Terminal, Code2, Database, Cloud, Bot, Briefcase } from "lucide-react";
import { motion } from "motion/react";

export default function AboutAndSkills() {
  const skillsData = [
    {
      category: "Languages",
      icon: <Terminal className="h-5 w-5 text-neutral-600 dark:text-zinc-300" />,
      items: [
        { name: "JavaScript", proficiency: "Expert", years: "2+ Yrs" },
        { name: "Java", proficiency: "Advanced", years: "2 Yrs" },
        { name: "Python", proficiency: "Intermediate", years: "1 Yr" },
        { name: "SQL", proficiency: "Advanced", years: "2 Yrs" },
        { name: "Dart", proficiency: "Intermediate", years: "1 Yr" },
        { name: "HTML/CSS", proficiency: "Expert", years: "3 Yrs" }
      ]
    },
    {
      category: "Frontend Development",
      icon: <Code2 className="h-5 w-5 text-neutral-600 dark:text-zinc-300" />,
      items: [
        { name: "React.js", proficiency: "Expert", years: "1.5 Yrs" },
        { name: "React Native", proficiency: "Intermediate", years: "1 Yr" },
        { name: "Flutter", proficiency: "Intermediate", years: "1 Yr" },
        { name: "Tailwind CSS", proficiency: "Expert", years: "2 Yrs" },
        { name: "Figma (UI/UX)", proficiency: "Advanced", years: "2 Yrs" }
      ]
    },
    {
      category: "Backend Development",
      icon: <Code2 className="h-5 w-5 text-neutral-600 dark:text-zinc-300" />,
      items: [
        { name: "Node.js", proficiency: "Advanced", years: "1.5 Yrs" },
        { name: "Express.js", proficiency: "Advanced", years: "1.5 Yrs" },
        { name: "Spring Boot", proficiency: "Advanced", years: "1 Yr" },
        { name: "ASP.NET", proficiency: "Intermediate", years: "6 Mos" },
        { name: "PHP", proficiency: "Intermediate", years: "1 Yr" }
      ]
    },
    {
      category: "Databases & Storage",
      icon: <Database className="h-5 w-5 text-neutral-600 dark:text-zinc-300" />,
      items: [
        { name: "MySQL", proficiency: "Advanced", years: "2 Yrs" },
        { name: "MongoDB", proficiency: "Advanced", years: "1.5 Yrs" },
        { name: "SQL Server", proficiency: "Intermediate", years: "1 Yr" },
        { name: "Relational", proficiency: "Advanced", years: "2 Yrs" },
        { name: "Non-Relational", proficiency: "Advanced", years: "1.5 Yrs" }
      ]
    },
    {
      category: "Cloud & DevOps",
      icon: <Cloud className="h-5 w-5 text-neutral-600 dark:text-zinc-300" />,
      items: [
        { name: "AWS (EC2, S3)", proficiency: "Advanced", years: "1 Yr" },
        { name: "Docker", proficiency: "Intermediate", years: "1 Yr" },
        { name: "Linux", proficiency: "Advanced", years: "2 Yrs" },
        { name: "Git / GitHub / GitLab", proficiency: "Expert", years: "2+ Yrs" },
        { name: "Vercel", proficiency: "Advanced", years: "1.5 Yrs" },
        { name: "CI/CD", proficiency: "Intermediate", years: "1 Yr" }
      ]
    },
    {
      category: "AI & Automation",
      icon: <Bot className="h-5 w-5 text-neutral-600 dark:text-zinc-300" />,
      items: [
        { name: "OpenCV", proficiency: "Intermediate", years: "6 Mos" },
        { name: "Gemini API", proficiency: "Advanced", years: "1 Yr" },
        { name: "n8n Automation", proficiency: "Advanced", years: "1 Yr" },
        { name: "MCP Servers", proficiency: "Intermediate", years: "6 Mos" },
        { name: "Chatbot Integrations", proficiency: "Advanced", years: "1 Yr" }
      ]
    }
  ];

  const educationData = [
    {
      degree: "BSc (Hons) Computer Science",
      institution: "NSBM Green University",
      period: "Oct 2022 - Dec 2026",
      desc: "Focusing on Software Engineering, Advanced Algorithms, Databases, AI, Cybersecurity, and Cloud Computing."
    },
    {
      degree: "Advanced Fullstack Developer Program",
      institution: "Academy of Computer Programming and Training (ACPT)",
      period: "Jun 2024 - Dec 2024",
      desc: "Comprehensive hands-on training in web, mobile, and desktop application development frameworks."
    },
    {
      degree: "University of Moratuwa - Short Courses",
      institution: "University of Moratuwa, Sri Lanka",
      period: "Jun 2022 - Dec 2023",
      desc: "Specialized in Python Programming, Angular Front-End, and Node.js Backend architectures."
    }
  ];

  const experienceData = [
    {
      role: "Software Engineer (Trainee)",
      company: "Adeona Technologies (Pvt) Ltd",
      period: "Feb 2026 - Present",
      desc: "Leading requirement gathering, system architecture, REST API design, and delivering full-stack features."
    },
    {
      role: "Full-Stack Developer Intern",
      company: "Adeona Technologies (Pvt) Ltd",
      period: "Aug 2025 - Feb 2026",
      desc: "Built 30+ Spring Boot and React/Node API endpoints, worked in an agile team on 2-week sprints, and containerized deployments with Docker."
    }
  ];

  return (
    <div className="space-y-16">
      {/* Bio / Profile Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
        <div className="md:col-span-8 space-y-4">
          <h2 className="font-serif text-2xl font-normal text-neutral-900 dark:text-white sm:text-3xl">
            My Journey & Profile
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-zinc-300 font-light">
            <p>
              I am a results-driven Full-Stack Software Engineer who loves bridging the gap between elegant user experiences and secure, robust, backend architectures. With hands-on experience covering the entire software development lifecycle, I enjoy turning requirements into polished, deployable software.
            </p>
            <p>
              My expertise spans modern web architectures with <strong>React</strong> and <strong>Node.js</strong>, enterprise services with <strong>Spring Boot</strong>, and mobile applications with <strong>Flutter</strong> and <strong>React Native</strong>.
            </p>
            <p>
              Recently, I have focused heavily on **AI Automation**. I have built custom, OAuth-secured Model Context Protocol (MCP) servers, set up zero-latency WhatsApp lead capture flows using n8n and Gemini APIs, and engineered modular drag-and-drop conversational bot visualizers.
            </p>
          </div>
        </div>

        {/* Quick Facts Sidebar */}
        <div className="md:col-span-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 dark:border-white/10 dark:bg-white/1 space-y-4">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
            Professional Overview
          </h3>
          <ul className="space-y-3 text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-zinc-300">
            <li className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-zinc-400 dark:text-zinc-300" />
              <span>1 Year Industry Experience</span>
            </li>
            <li className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-zinc-400 dark:text-zinc-300" />
              <span>5+ Shipped Systems</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-zinc-400 dark:text-zinc-300" />
              <span>Homagama, Sri Lanka</span>
            </li>
            <li className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-zinc-400 dark:text-zinc-300" />
              <span>NSBM Green University</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Expertise & Skills Bento Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-normal text-neutral-900 dark:text-white sm:text-3xl">
            Area of Expertise
          </h2>
          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
            My technology toolset and specialties.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {skillsData.map((skill, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
              }}
              className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-neutral-900 hover:shadow-md dark:border-white/10 dark:bg-white/1 dark:hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 border-b border-neutral-100 pb-3 dark:border-white/10">
                <div className="rounded bg-neutral-50 p-2 dark:bg-white/5">
                  {skill.icon}
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-zinc-200">
                  {skill.category}
                </h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {skill.items.map((item, key) => (
                  <div key={key} className="group/tooltip relative flex items-center">
                    <span className="rounded-full bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600 border border-neutral-100 group-hover:border-neutral-950 dark:bg-white/5 dark:text-zinc-300 dark:border-white/10 dark:group-hover:border-white/20 transition-all cursor-help">
                      {item.name}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs scale-95 opacity-0 transition-all duration-200 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 pointer-events-none z-10 flex flex-col items-center">
                      <div className="bg-neutral-900 dark:bg-neutral-800 text-white text-[10px] uppercase tracking-wider font-semibold rounded-lg py-1.5 px-3 shadow-xl border border-neutral-800 dark:border-white/10 flex items-center space-x-2">
                        <span className="text-neutral-400">{item.years}</span>
                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                        <span>{item.proficiency}</span>
                      </div>
                      {/* Arrow */}
                      <div className="w-2 h-2 bg-neutral-900 dark:bg-neutral-800 rotate-45 -mt-1 border-b border-r border-neutral-800 dark:border-white/10"></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Work Experience & Education - Two Column Layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Experience Column */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="rounded border border-neutral-200 bg-neutral-50 p-2 dark:border-white/10 dark:bg-white/5">
              <Briefcase className="h-5 w-5 text-neutral-600 dark:text-zinc-300" />
            </div>
            <h2 className="font-serif text-xl font-normal text-neutral-900 dark:text-white">
              Work History
            </h2>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-y-1 before:left-[17px] before:w-0.5 before:bg-neutral-200 dark:before:bg-white/10">
            {experienceData.map((exp, idx) => (
              <div key={idx} className="relative pl-10">
                {/* Dot */}
                <div className="absolute left-[11px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-neutral-950 bg-white dark:border-white dark:bg-sophisticated-bg"></div>
                
                <div className="space-y-1">
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase tracking-wider text-neutral-600 dark:text-zinc-300 bg-neutral-100 dark:bg-white/5 border dark:border-white/10 px-2 py-0.5 rounded">
                    <Calendar className="h-3 w-3 mr-1" />
                    {exp.period}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-neutral-800 dark:text-white mt-1">
                    {exp.role}
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
                    {exp.company}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-zinc-400 mt-2 font-light">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Column */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="rounded border border-neutral-200 bg-neutral-50 p-2 dark:border-white/10 dark:bg-white/5">
              <BookOpen className="h-5 w-5 text-neutral-600 dark:text-zinc-300" />
            </div>
            <h2 className="font-serif text-xl font-normal text-neutral-900 dark:text-white">
              Education & Certifications
            </h2>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-y-1 before:left-[17px] before:w-0.5 before:bg-neutral-200 dark:before:bg-white/10">
            {educationData.map((edu, idx) => (
              <div key={idx} className="relative pl-10">
                {/* Dot */}
                <div className="absolute left-[11px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-neutral-950 bg-white dark:border-white dark:bg-sophisticated-bg"></div>
                
                <div className="space-y-1">
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase tracking-wider text-neutral-600 dark:text-zinc-300 bg-neutral-100 dark:bg-white/5 border dark:border-white/10 px-2 py-0.5 rounded">
                    <Calendar className="h-3 w-3 mr-1" />
                    {edu.period}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-neutral-800 dark:text-white mt-1">
                    {edu.degree}
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-zinc-400 mt-2 font-light">
                    {edu.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
