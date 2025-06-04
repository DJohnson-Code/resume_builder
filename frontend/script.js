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

document.getElementById("resumeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const resumeData = {};

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

  const button = document.querySelector(".generate-button");
  const originalText = button.innerHTML;
  button.innerHTML = "⏳ Generating Your AI-Powered Resume...";
  button.disabled = true;

  setTimeout(() => {
    console.log("Resume data collected:", resumeData);
    alert(
      "Resume data collected! In a real implementation, this would be sent to your Python backend for AI processing and resume generation."
    );
    button.innerHTML = originalText;
    button.disabled = false;
  }, 2000);
});

document.querySelectorAll(".form-section").forEach((section, index) => {
  section.style.animationDelay = `${index * 0.1}s`;
});
