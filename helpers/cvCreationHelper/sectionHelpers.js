export const renderOrEmpty = (data, renderFn) =>
  data && data.length ? renderFn(data) : "";

export const projectsToHtml = (projects = []) =>
  renderOrEmpty(
    projects,
    (projects) => `
    <h2>Projects</h2>
    <div class="section-content">
      ${projects
        .map((project) => {
          const techs = (project.technologies || []).join(", ");
          const linkHtml = project.link
            ? `<p><a href='${project.link}' target='_blank'>${project.link}</a></p>`
            : "";

          return `
            <div class="project-item">
              <h3>${project.name || "Unnamed Project"}</h3>
              <p>Technologies: ${techs}</p>
              ${linkHtml}
            </div>`;
        })
        .join("")}
    </div>`
  );

export const certificatesToHtml = (certificates = []) =>
  renderOrEmpty(
    certificates,
    (certificates) => `
    <h2>Certificates</h2>
    <div class="section-content">
      ${certificates
        .map(
          (cert) =>
            `<p>${cert.name || "Unnamed Certificate"} (${cert.date || "No Date Provided"
            })</p>`
        )
        .join("")}
    </div>`
  );

export const languagesToHtml = (languages = []) =>
  renderOrEmpty(
    languages,
    (languages) => `
    
    <div class="section-content">
      ${languages
        .map((lang) => `<p>${lang.language} - ${lang.proficiency}</p>`)
        .join("")}
    </div>`
  );

export const educationToHtml = (education = []) =>
  renderOrEmpty(
    education,
    (education) => `
    
    <div class="section-content">
      ${education
        .map(
          (edu) => `
          <div class="education-item">
            <h3>${edu.degree}</h3>
            <p>${edu.institution}</p>
            <p>${edu.year}</p>
            <p>CGPA: ${edu.cgpa}</p>
          </div>`
        )
        .join("")}
    </div>`
  );

export const experienceToHtml = (experiences = []) =>
  renderOrEmpty(
    experiences,
    (experiences) => `
    <h2>Work Experience</h2>
    <div class="section-content">
      ${experiences
        .map(
          (exp) => `
          <div class="experience-item">
            <h3 style="margin: 4px 0;">${exp.company}</h3>
            <h5 style="margin: 2px 0;">${exp.title || "Position Not Mention"}</h5>
            <p style="margin: 2px 0;">${exp.description || "No Description Provided"}</p>
          </div>`
        )
        .join("")}
    </div>`
  );

export const interestsToHtml = (interests = []) =>
  renderOrEmpty(
    interests.filter((interest) => interest && interest.trim() !== ""),
    (cleanedInterests) => `
    <h2>Interests</h2>
    <div class="interests">
      ${cleanedInterests
        .map((interest) => `<span>${interest}</span>`)
        .join(" ")}
    </div>`
  );
