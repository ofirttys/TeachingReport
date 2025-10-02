// Configuration
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzBZJbzV687UQFxRMjYIDAXS-odukDu5wcX_b0dqEqisMFsmPbqXbBS5eNebh7fsEApjQ/exec'
};

// Activity type definitions
const activityTypes = [
    { id: 'lecture', name: 'Lectures/Seminars', icon: '📚' },
    { id: 'clinical', name: 'Clinical Supervision', icon: '🩺' },
    { id: 'rounds', name: 'Teaching Rounds', icon: '👥' },
    { id: 'research', name: 'Research Supervision', icon: '📋' },
    { id: 'exam', name: 'Examinations', icon: '✍️' },
    { id: 'other', name: 'Other Activities', icon: '🏆' }
];

const learnerLevels = [
    'Medical Student',
    'Undergraduate MD',
    'Postgraduate MD (Resident)',
    'Fellow',
    'Faculty',
    'Other'
];

const academicYears = [
    '2020-2021', '2021-2022', '2022-2023', '2023-2024',
    '2024-2025', '2025-2026', '2026-2027'
];

let currentActivityType = null;
let formData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderActivityButtons();
    setupEventListeners();
});

// Render activity type selection buttons
function renderActivityButtons() {
    const container = document.getElementById('activitySelection');
    container.innerHTML = '';

    activityTypes.forEach(activity => {
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-name">${activity.name}</div>
        `;
        card.addEventListener('click', () => selectActivity(activity.id));
        container.appendChild(card);
    });
}

// Handle activity selection
function selectActivity(activityId) {
    currentActivityType = activityId;
    formData = {};

    const activity = activityTypes.find(a => a.id === activityId);
    document.getElementById('formTitle').textContent = activity.name;

    document.getElementById('activitySelection').style.display = 'none';
    document.getElementById('formContainer').style.display = 'block';

    renderForm(activityId);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('activityForm').addEventListener('submit', handleSubmit);
    document.getElementById('cancelBtn').addEventListener('click', cancelForm);
}

// Cancel and return to activity selection
function cancelForm() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('activitySelection').style.display = 'grid';
    currentActivityType = null;
    formData = {};
}

// Render the appropriate form based on activity type
function renderForm(activityId) {
    const container = document.getElementById('dynamicFields');
    container.innerHTML = '';

    // Add common fields first
    container.appendChild(createCommonFields());

    // Add activity-specific fields
    switch (activityId) {
        case 'lecture':
            container.appendChild(createLectureFields());
            break;
        case 'clinical':
            container.appendChild(createClinicalFields());
            break;
        case 'rounds':
            container.appendChild(createRoundsFields());
            break;
        case 'research':
            container.appendChild(createResearchFields());
            break;
        case 'exam':
            container.appendChild(createExamFields());
            break;
        case 'other':
            container.appendChild(createOtherFields());
            break;
    }
}

// Create common fields used in all forms
function createCommonFields() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="form-group">
            <label>Academic Year *</label>
            <select name="academicYear" required>
                <option value="">Select year...</option>
                ${academicYears.map(year => `<option value="${year}">${year}</option>`).join('')}
            </select>
        </div>

        <div class="form-group">
            <label>Status *</label>
            <select name="status" required>
                <option value="">Select status...</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Planned">Planned</option>
            </select>
        </div>

        <div class="form-group">
            <label>Institution/Department *</label>
            <input type="text" name="institution" required placeholder="e.g., University of Toronto, Mount Sinai">
        </div>
    `;
    return div;
}

// Create lecture-specific fields
function createLectureFields() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="form-group">
            <label>Date *</label>
            <input type="date" name="date" required>
        </div>

        <div class="form-group">
            <label>Title *</label>
            <input type="text" name="title" required placeholder="e.g., IVF Protocol Updates">
        </div>

        <div class="form-group">
            <label>Course/Program (optional)</label>
            <input type="text" name="course" placeholder="e.g., OB/GYN Residency Program">
        </div>

        <div class="form-group">
            <label>Learner Levels * (check all that apply)</label>
            <div class="checkbox-group">
                ${learnerLevels.map(level => `
                    <label class="checkbox-label">
                        <input type="checkbox" name="learnerLevels" value="${level}">
                        ${level}
                    </label>
                `).join('')}
            </div>
        </div>

        <div class="form-group">
            <label>Location *</label>
            <input type="text" name="location" required placeholder="e.g., Main Auditorium, Online">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Hours *</label>
                <input type="number" name="hours" step="0.5" required>
            </div>

            <div class="form-group">
                <label>Number of Learners *</label>
                <input type="number" name="numLearners" required>
            </div>
        </div>

        <div class="form-group">
            <label>Recurring?</label>
            <select name="recurring">
                <option value="no">No - One time</option>
                <option value="weekly">Yes - Weekly</option>
                <option value="monthly">Yes - Monthly</option>
                <option value="quarterly">Yes - Quarterly</option>
                <option value="annually">Yes - Annually</option>
            </select>
        </div>

        <div class="form-group">
            <label>Description (optional)</label>
            <textarea name="description" rows="3" placeholder="Brief description of lecture content or context"></textarea>
        </div>

        <div class="form-group">
            <label>Teaching Evaluation Score (optional)</label>
            <input type="text" name="evaluation" placeholder="e.g., 4.5/5.0">
        </div>
    `;
    return div;
}

// Create clinical supervision fields
function createClinicalFields() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Start Date *</label>
                <input type="date" name="startDate" required>
            </div>

            <div class="form-group">
                <label>End Date (if different)</label>
                <input type="date" name="endDate">
            </div>
        </div>

        <div class="form-group">
            <label>Supervision Type *</label>
            <select name="supervisionType" required>
                <option value="">Select type...</option>
                <option value="Clinic Supervisor">Clinic Supervisor</option>
                <option value="Consult Attending">Consult Attending</option>
                <option value="Operating Room Supervisor">Operating Room Supervisor</option>
                <option value="Procedures Supervisor">Procedures Supervisor</option>
            </select>
        </div>

        <div class="form-group">
            <label>Learner Name(s) *</label>
            <input type="text" name="learnerNames" required placeholder="e.g., Dr. Jane Smith (comma-separated if multiple)">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Learner Level *</label>
                <select name="learnerLevel" required>
                    <option value="">Select level...</option>
                    ${learnerLevels.map(level => `<option value="${level}">${level}</option>`).join('')}
                </select>
            </div>

            <div class="form-group">
                <label>Year (optional)</label>
                <input type="text" name="learnerYear" placeholder="e.g., PGY-6">
            </div>
        </div>

        <div class="form-group">
            <label>Location *</label>
            <input type="text" name="location" required placeholder="e.g., Fertility Clinic">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Number of Learners *</label>
                <input type="number" name="numLearners" required>
            </div>

            <div class="form-group">
                <label>Total Hours *</label>
                <input type="number" name="hours" step="0.5" required>
            </div>
        </div>

        <div class="form-group">
            <label>Unit Type</label>
            <select name="unitType">
                <option value="">Select unit type...</option>
                <option value="Half-day clinic">Half-day clinic</option>
                <option value="Full-day clinic">Full-day clinic</option>
                <option value="Week of clinic">Week of clinic</option>
                <option value="Half-day procedures">Half-day procedures</option>
                <option value="Full-day procedures">Full-day procedures</option>
            </select>
        </div>

        <div class="form-group">
            <label>Recurring Pattern</label>
            <select name="recurring">
                <option value="one-time">One-time</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
        </div>

        <div class="form-group">
            <label>Notes (optional)</label>
            <textarea name="notes" rows="3" placeholder="Any additional context or notes"></textarea>
        </div>
    `;
    return div;
}

// Create teaching rounds fields
function createRoundsFields() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="form-group">
            <label>Type *</label>
            <select name="roundsType" required>
                <option value="">Select type...</option>
                <option value="Formal">Formal (Scheduled Centrally)</option>
                <option value="Informal">Informal (Scheduled by You)</option>
            </select>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Start Date *</label>
                <input type="date" name="startDate" required>
            </div>

            <div class="form-group">
                <label>End Date (if different)</label>
                <input type="date" name="endDate">
            </div>
        </div>

        <div class="form-group">
            <label>Title *</label>
            <input type="text" name="title" required placeholder="e.g., Fertility Teaching Rounds">
        </div>

        <div class="form-group">
            <label>Learner Levels * (check all that apply)</label>
            <div class="checkbox-group">
                ${learnerLevels.map(level => `
                    <label class="checkbox-label">
                        <input type="checkbox" name="learnerLevels" value="${level}">
                        ${level}
                    </label>
                `).join('')}
            </div>
        </div>

        <div class="form-group">
            <label>Location *</label>
            <input type="text" name="location" required placeholder="e.g., Clinic Conference Room">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Number of Sessions *</label>
                <input type="number" name="numSessions" required>
            </div>

            <div class="form-group">
                <label>Hours per Session *</label>
                <input type="number" name="hoursPerSession" step="0.5" required>
            </div>
        </div>

        <div class="form-group">
            <label>Total Learners *</label>
            <input type="number" name="numLearners" required>
        </div>

        <div class="form-group">
            <label>Description (optional)</label>
            <textarea name="description" rows="3" placeholder="Brief description of teaching rounds"></textarea>
        </div>
    `;
    return div;
}

// Create research supervision fields
function createResearchFields() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Start Date *</label>
                <input type="date" name="startDate" required>
            </div>

            <div class="form-group">
                <label>Completion Date</label>
                <input type="date" name="completionDate">
            </div>
        </div>

        <div class="form-group">
            <label>Student Name *</label>
            <input type="text" name="studentName" required placeholder="e.g., Dr. Jane Smith">
        </div>

        <div class="form-group">
            <label>Your Role *</label>
            <select name="role" required>
                <option value="">Select role...</option>
                <option value="Primary Supervisor">Primary Supervisor</option>
                <option value="Co-Supervisor">Co-Supervisor</option>
                <option value="Secondary Supervisor">Secondary Supervisor</option>
                <option value="Thesis Committee Member">Thesis Committee Member</option>
                <option value="Thesis Examiner">Thesis Examiner</option>
            </select>
        </div>

        <div class="form-group">
            <label>Degree/Program *</label>
            <select name="degree" required>
                <option value="">Select degree...</option>
                <option value="Masters">Masters</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Postdoctoral Training">Postdoctoral Training</option>
                <option value="Project Student">Project Student</option>
                <option value="Summer Student">Summer Student</option>
                <option value="CREMS">CREMS</option>
            </select>
        </div>

        <div class="form-group">
            <label>Project Title *</label>
            <input type="text" name="projectTitle" required placeholder="Research project or thesis title">
        </div>

        <div class="form-group">
            <label>Project Status *</label>
            <select name="projectStatus" required>
                <option value="">Select status...</option>
                <option value="Proposal">Proposal Stage</option>
                <option value="Data Collection">Data Collection</option>
                <option value="Analysis">Analysis</option>
                <option value="Writing">Writing</option>
                <option value="Defended">Defended</option>
                <option value="Completed">Completed</option>
            </select>
        </div>

        <div class="form-group">
            <label>Student's Current Institution</label>
            <input type="text" name="studentInstitution" placeholder="Where student currently works/studies">
        </div>

        <div class="form-group">
            <label>Total Hours Invested *</label>
            <input type="number" name="hours" step="0.5" required placeholder="Estimated total supervision hours">
        </div>

        <div class="form-group">
            <label>Collaborators (optional)</label>
            <input type="text" name="collaborators" placeholder="Other supervisors or collaborators">
        </div>

        <div class="form-group">
            <label>Student Awards (optional)</label>
            <textarea name="studentAwards" rows="2" placeholder="Any awards or recognition student received"></textarea>
        </div>

        <div class="form-group">
            <label>Notes (optional)</label>
            <textarea name="notes" rows="3" placeholder="Additional context or notes"></textarea>
        </div>
    `;
    return div;
}

// Create examination fields
function createExamFields() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="form-group">
            <label>Date *</label>
            <input type="date" name="date" required>
        </div>

        <div class="form-group">
            <label>Examination Type *</label>
            <select name="examType" required>
                <option value="">Select type...</option>
                <option value="OSCE">OSCE</option>
                <option value="Written Exam">Written Exam</option>
                <option value="Oral Exam">Oral Exam</option>
                <option value="Practical Exam">Practical Exam</option>
                <option value="Final Exam">Final Exam</option>
            </select>
        </div>

        <div class="form-group">
            <label>Your Role *</label>
            <select name="role" required>
                <option value="">Select role...</option>
                <option value="Question Writer">Question Writer</option>
                <option value="Examiner">Examiner</option>
                <option value="Grader">Grader</option>
                <option value="OSCE Station Designer">OSCE Station Designer</option>
                <option value="Exam Coordinator">Exam Coordinator</option>
            </select>
        </div>

        <div class="form-group">
            <label>Course/Program *</label>
            <input type="text" name="course" required placeholder="e.g., OB/GYN Residency Final Exam">
        </div>

        <div class="form-group">
            <label>Learner Level *</label>
            <select name="learnerLevel" required>
                <option value="">Select level...</option>
                ${learnerLevels.map(level => `<option value="${level}">${level}</option>`).join('')}
            </select>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Number of Students *</label>
                <input type="number" name="numStudents" required>
            </div>

            <div class="form-group">
                <label>Hours *</label>
                <input type="number" name="hours" step="0.5" required>
            </div>
        </div>

        <div class="form-group">
            <label>Description (optional)</label>
            <textarea name="description" rows="3" placeholder="Brief description of your examination role"></textarea>
        </div>
    `;
    return div;
}

// Create other activities fields
function createOtherFields() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="form-group">
            <label>Activity Type *</label>
            <select name="otherType" required>
                <option value="">Select type...</option>
                <option value="Presentation">Conference Presentation</option>
                <option value="Award">Teaching Award</option>
                <option value="Committee">Committee Service</option>
                <option value="Innovation">Teaching Innovation</option>
                <option value="Publication">Educational Publication</option>
            </select>
        </div>

        <div class="form-group">
            <label>Date *</label>
            <input type="date" name="date" required>
        </div>

        <div class="form-group">
            <label>Title *</label>
            <input type="text" name="title" required placeholder="e.g., Best Teacher Award, Grand Rounds Presentation">
        </div>

        <div class="form-group">
            <label>Location/Organization *</label>
            <input type="text" name="location" required placeholder="e.g., Canadian Fertility Society, Department of OB/GYN">
        </div>

        <div class="form-group">
            <label>Hours (if applicable)</label>
            <input type="number" name="hours" step="0.5">
        </div>

        <div class="form-group">
            <label>Description *</label>
            <textarea name="description" rows="4" required placeholder="Describe the activity, your role, and any impact or outcomes"></textarea>
        </div>
    `;
    return div;
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formDataObj = new FormData(form);
    
    // Convert FormData to object
    const data = {
        activityType: currentActivityType,
        entryDate: new Date().toISOString()
    };

    // Handle regular fields
    for (let [key, value] of formDataObj.entries()) {
        if (key === 'learnerLevels') {
            // Handle checkboxes - collect all values
            if (!data[key]) data[key] = [];
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }

    // Join learner levels if it's an array
    if (Array.isArray(data.learnerLevels)) {
        data.learnerLevels = data.learnerLevels.join(', ');
    }

    console.log('Submitting data:', data);

    try {
        // Send to Google Apps Script
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Show success message
        showSuccessMessage();

        // Reset form and return to selection
        setTimeout(() => {
            cancelForm();
        }, 1500);

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please check the console for details.');
    }
}

// Show success message
function showSuccessMessage() {
    const msg = document.getElementById('successMessage');
    msg.style.display = 'block';

    setTimeout(() => {
        msg.style.display = 'none';
    }, 3000);
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}