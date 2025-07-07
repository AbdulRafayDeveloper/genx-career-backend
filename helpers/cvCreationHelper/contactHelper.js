export const contactToHtml = (contact = {}) => {
  const { linkedin, github, email, phone, location } = contact;

  return `
	  <div style="display: flex; flex-wrap: wrap; gap: 15px; padding-top:12px">
		${`<div><a href="mailto:${email}" style="color: inherit; text-decoration: none;">${email}</a></div>`}
		${`<div> ${phone}</div>`}
		${`<div>${location}</div>`}
		${
      linkedin
        ? `<div> <a href="${linkedin}" target="_blank" style="color: inherit; text-decoration: none;">LinkedIn</a></div>`
        : ""
    }
		${
      github
        ? `<div> <a href="${github}" target="_blank" style="color: inherit; text-decoration: none;">GitHub</a></div>`
        : ""
    }
	  </div>`;
};

export const contactToHtml2 = (contact = {}) => {
  const { linkedin, github, email, phone, location } = contact;

  const contactItems = [
    email ? `<a href="mailto:${email}">${email}</a>` : "",
    phone || "",
    location || "",
    linkedin ? `<a href="${linkedin}" target="_blank">LinkedIn</a>` : "",
    github ? `<a href="${github}" target="_blank">GitHub</a>` : "",
  ].filter(Boolean); // Removes empty strings

  if (contactItems.length === 0) {
    return ""; // Return empty if no contact info is available
  }

  return `
    <p class="contact-info">
      ${contactItems.join(" · ")}
    </p>
  `;
};
