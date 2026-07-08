import { jsPDF } from "jspdf";

export async function generateResumePDF() {
  try {
    const res = await fetch("/api/resume/check");
    const data = await res.json();
    if (data.exists) {
      const a = document.createElement("a");
      a.href = "/api/resume/download";
      a.download = "Sameera_Jayakodi_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
  } catch (e) {
    console.error("Failed to check CV existence", e);
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let y = 18;

  // Helper to check page boundary and insert page
  const checkPageBoundary = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - 15) {
      doc.addPage();
      y = 18;
      return true;
    }
    return false;
  };

  // Header Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text("SAMEERA JAYAKODI", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.text("Associate Software Engineer | Full-Stack Developer", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  const contacts = "Homagama, Sri Lanka  |  +94 770 309 842  |  sameerajayakodi456@gmail.com";
  doc.text(contacts, margin, y);
  y += 4;

  const links = "GitHub: github.com/sameerajayakodi  |  LinkedIn: linkedin.com/sameera-jayakodi";
  doc.text(links, margin, y);
  y += 6;

  // Horizontal divider
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // Function to add a section header
  const addSectionHeader = (title: string) => {
    checkPageBoundary(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;
  };

  // 1. Professional Summary
  addSectionHeader("Professional Summary");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // Slate 700
  const summaryText = "Full-Stack Software Engineer with a passion for delivering production web and mobile applications end-to-end from requirement gathering and system design through development, deployment, and support. Shipped five+ systems spanning fleet management, compliance, e-learning, HR, and bidding domains using React, Node.js, Spring Boot, and both relational and NoSQL databases. Extended into AI/automation with secured MCP server integrations, an AI-driven WhatsApp CRM, and a no-code chatbot flow builder. Comfortable with AWS, Docker, and Linux-based deployment. Thrives in agile teams and client-facing delivery.";
  
  const wrappedSummary = doc.splitTextToSize(summaryText, contentWidth);
  wrappedSummary.forEach((line: string) => {
    checkPageBoundary(5);
    doc.text(line, margin, y);
    y += 4.2;
  });
  y += 3;

  // 2. Areas of Expertise
  addSectionHeader("Areas of Expertise");
  const expertise = [
    { label: "Languages", value: "JavaScript, TypeScript, Java, Python, SQL, Dart" },
    { label: "Frontend", value: "React.js, React Native, Flutter, HTML/CSS, Tailwind CSS, Figma" },
    { label: "Backend", value: "Node.js, Express.js, Spring Boot, ASP.NET, PHP" },
    { label: "Databases", value: "MySQL, MongoDB, SQL Server (Relational & Non-Relational)" },
    { label: "Cloud & DevOps", value: "AWS (EC2, S3), Docker, Linux, Git, GitHub, GitLab, Vercel, CI/CD" },
    { label: "AI & Automation", value: "OpenCV, Gemini API, n8n, MCP Servers, Chatbot Integration" },
  ];

  expertise.forEach((item) => {
    checkPageBoundary(6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(item.label + ": ", margin, y);
    
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(item.label + ": ");
    doc.text(item.value, margin + labelWidth + 1, y);
    y += 4.5;
  });
  y += 3;

  // 3. Work Experience
  addSectionHeader("Work Experience");
  
  // Job Title & Company
  checkPageBoundary(15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Software Engineer (Trainee) / Full-Stack Intern", margin, y);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const duration = "Aug 2025 - Present";
  const durationWidth = doc.getTextWidth(duration);
  doc.text(duration, margin + contentWidth - durationWidth, y);
  y += 4.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Adeona Technologies (Pvt) Ltd", margin, y);
  y += 5;

  // Bullet points
  const bullets = [
    "Delivered full-stack features across five production systems (fleet management, compliance, e-learning, HR, bidding) supporting teams of 15-20 users each, from requirement gathering through development, deployment, and support.",
    "Implemented secure authentication and role-based access control across 4 user roles, plus PDPA-aligned data handling for HR platforms covering 100+ employee records.",
    "Built 30+ REST API endpoints across React/Node.js and Spring Boot, working with MySQL, SQL Server, and MongoDB; containerized with Docker and deployed to AWS EC2/S3 within a 6-person agile team on 2-week sprints.",
    "Collaborated with QA, design, and product stakeholders through sprint ceremonies; explored AI/ML tooling (OpenCV, n8n, MCP servers) for internal automation proof-of-concepts."
  ];

  bullets.forEach((bullet) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    
    // Split bullet text to fit
    const bulletText = doc.splitTextToSize("• " + bullet, contentWidth - 4);
    bulletText.forEach((line: string, index: number) => {
      checkPageBoundary(5);
      // Indent subsequent lines of a bullet point for better layout
      const xPos = index === 0 ? margin : margin + 3;
      doc.text(line, xPos, y);
      y += 4.2;
    });
    y += 1.5;
  });
  y += 3;

  // 4. Projects
  addSectionHeader("Key Projects Delivered");
  
  const projects = [
    { name: "Vehicle Management System", desc: "Real-time GPS tracking with live status updates and fleet telemetry." },
    { name: "AdGree - Consent Management Platform", desc: "PDPA-aligned consent collection, encrypted ledger, and storage." },
    { name: "Adeona HR Management System", desc: "End-to-end employee leave, timesheet logging, and attendance tracking." },
    { name: "AI WhatsApp CRM - Lead Management", desc: "n8n WhatsApp bot integration with automated lead capture." },
    { name: "MCP Server Integrations", desc: "OAuth-secured Model Context Protocol servers for dialog eSMS and ADA Digital." },
    { name: "No-Code Chatbot Flow Builder", desc: "Drag-and-drop workflow visualizer for programming custom Meta chatbot flows." }
  ];

  projects.forEach((proj) => {
    checkPageBoundary(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(proj.name, margin, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const wrappedDesc = doc.splitTextToSize(proj.desc, contentWidth);
    wrappedDesc.forEach((line: string) => {
      checkPageBoundary(5);
      doc.text(line, margin, y);
      y += 4;
    });
    y += 2.5;
  });
  y += 2;

  // 5. Education
  addSectionHeader("Education");
  
  const eduItems = [
    { title: "BSc (Hons) Computer Science", institution: "NSBM Green University", date: "Oct 2022 - Dec 2026", details: "Focus on Software Engineering, Systems Design, Algorithms, and Databases." },
    { title: "Advanced Fullstack Developer Program", institution: "ACPT (Academy of Computer Programming)", date: "Jun 2024 - Dec 2024", details: "Intensive training in modern JavaScript, React, Node.js, and cloud architectures." }
  ];

  eduItems.forEach((edu) => {
    checkPageBoundary(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(edu.title, margin, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const dateWidth = doc.getTextWidth(edu.date);
    doc.text(edu.date, margin + contentWidth - dateWidth, y);
    y += 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(edu.institution, margin, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(edu.details, margin, y);
    y += 5.5;
  });

  // Save the PDF
  try {
    doc.save("Sameera_Jayakodi_Resume.pdf");
  } catch (err) {
    console.error("Error saving PDF: ", err);
    // Fallback to txt
    window.location.href = "/api/resume/download";
  }
}
