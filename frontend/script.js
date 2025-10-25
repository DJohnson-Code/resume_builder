let educationCount = 1;
let experienceCount = 1;

function addEducation() {
  const container = document.getElementById("educationContainer");
  const newEducation = document.createElement("div");
  newEducation.className = "dynamic-item";
  newEducation.innerHTML = `
    <button type="button" class="remove-button" onclick="removeItem(this)">×</button>
    <div class="form-row">
      <div class="form-group">
        <label>Degree/Certification</label>
        <input type="text" name="education[${educationCount}][degree]" placeholder="e.g., Bachelor of Science in Computer Science">
      </div>
      <div class="form-group">
        <label>Institution</label>
        <input type="text" name="education[${educationCount}][institution]" placeholder="University/School name">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Graduation Year</label>
        <input type="text" name="education[${educationCount}][year]" placeholder="2023">
      </div>
      <div class="form-group">
        <label>GPA (Optional)</label>
        <input type="text" name="education[${educationCount}][gpa]" placeholder="3.8/4.0">
      </div>
    </div>
  `;
  container.appendChild(newEducation);
  educationCount++;

  newEducation.style.opacity = "0";
  newEducation.style.transform = "translateY(20px)";
  setTimeout(() => {
    newEducation.style.transition = "all 0.3s ease";
    newEducation.style.opacity = "1";
    newEducation.style.transform = "translateY(0)";
  }, 10);
}

function addExperience() {
  const container = document.getElementById("experienceContainer");
  const newExperience = document.createElement("div");
  newExperience.className = "dynamic-item";
  newExperience.innerHTML = `
    <button type="button" class="remove-button" onclick="removeItem(this)">×</button>
    <div class="form-row">
      <div class="form-group">
        <label>Job Title</label>
        <input type="text" name="experience[${experienceCount}][title]" placeholder="e.g., Software Developer">
      </div>
      <div class="form-group">
        <label>Company</label>
        <input type="text" name="experience[${experienceCount}][company]" placeholder="Company name">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Start Date</label>
        <input type="text" name="experience[${experienceCount}][startDate]" placeholder="MM/YYYY">
      </div>
      <div class="form-group">
        <label>End Date</label>
        <input type="text" name="experience[${experienceCount}][endDate]" placeholder="MM/YYYY or Present">
      </div>
    </div>
    <div class="form-group">
      <label>Job Description (AI will create professional bullet points)</label>
      <textarea name="experience[${experienceCount}][description]" placeholder="Describe your key responsibilities and achievements..."></textarea>
    </div>
  `;
  container.appendChild(newExperience);
  experienceCount++;

  newExperience.style.opacity = "0";
  newExperience.style.transform = "translateY(20px)";
  setTimeout(() => {
    newExperience.style.transition = "all 0.3s ease";
    newExperience.style.opacity = "1";
    newExperience.style.transform = "translateY(0)";
  }, 10);
}

function removeItem(button) {
  const item = button.parentElement;
  item.style.transition = "all 0.3s ease";
  item.style.opacity = "0";
  item.style.transform = "translateX(-100%)";
  setTimeout(() => {
    item.remove();
  }, 300);
}

document.getElementById("resumeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const resumeData = {};

  // Parse form data
  for (let [key, value] of formData.entries()) {
    if (key.includes("[")) {
      const match = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const [, section, index, field] = match;
        if (!resumeData[section]) resumeData[section] = [];
        if (!resumeData[section][index]) resumeData[section][index] = {};
        resumeData[section][index][field] = value;
      }
    } else {
      resumeData[key] = value;
    }
  }

  // Transform frontend data to match backend API format
  const apiPayload = transformToApiFormat(resumeData);

  const button = document.querySelector(".generate-button");
  const originalText = button.innerHTML;
  button.innerHTML = "⏳ Generating Your AI-Powered Resume...";
  button.disabled = true;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/resume/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to validate resume");
    }

    const result = await response.json();
    console.log("Resume validated successfully:", result);
    
    // Show success message with warnings if any
    let message = "✅ Resume validated successfully!";
    if (result.warnings && result.warnings.length > 0) {
      message += "\n\n⚠️ Warnings:\n" + result.warnings.join("\n");
    }
    alert(message);

  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error validating resume: " + error.message);
  } finally {
    button.innerHTML = originalText;
    button.disabled = false;
  }
});

// Transform frontend form data to match backend API format
function transformToApiFormat(data) {
  const payload = {
    name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
    email: data.email || "",
    phone: data.phone || "",
    skills: [],
    urls: [],
    experience: [],
    education: [],
    certifications: []
  };

  // Add location if provided
  if (data.location) {
    const locationParts = data.location.split(",").map(part => part.trim());
    payload.location = {
      city: locationParts[0] || "",
      state: locationParts[1] || "",
      country: "US", // Default to US
      zip: ""
    };
  }

  // Add URLs
  if (data.linkedin) payload.urls.push(data.linkedin);

  // Process skills
  if (data.technicalSkills) {
    payload.skills.push(...data.technicalSkills.split(",").map(s => s.trim()).filter(s => s));
  }
  if (data.softSkills) {
    payload.skills.push(...data.softSkills.split(",").map(s => s.trim()).filter(s => s));
  }

  // Process education
  if (data.education) {
    for (const edu of data.education) {
      if (edu.degree && edu.institution) {
        payload.education.push({
          school: edu.institution,
          degree: edu.degree,
          start_date: "2020-01-01", // Default start date
          graduation_date: edu.year ? `${edu.year}-01-01` : null,
          gpa: edu.gpa ? parseFloat(edu.gpa) : null
        });
      }
    }
  }

  // Process experience
  if (data.experience) {
    for (const exp of data.experience) {
      if (exp.title && exp.company) {
        payload.experience.push({
          company: exp.company,
          position: [exp.title],
          start_date: exp.startDate ? parseDate(exp.startDate) : "2020-01-01",
          end_date: exp.endDate && exp.endDate.toLowerCase() !== "present" ? parseDate(exp.endDate) : null,
          description: exp.description ? [exp.description] : [],
          location: ""
        });
      }
    }
  }

  return payload;
}

// Simple date parser for MM/YYYY format
function parseDate(dateStr) {
  if (!dateStr) return "2020-01-01";
  
  // Handle MM/YYYY format
  if (dateStr.includes("/")) {
    const [month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-01`;
  }
  
  // Handle YYYY format
  if (dateStr.match(/^\d{4}$/)) {
    return `${dateStr}-01-01`;
  }
  
  return "2020-01-01";
}

document.querySelectorAll(".form-section").forEach((section, index) => {
  section.style.animationDelay = `${index * 0.1}s`;
});
