import { User } from './models/User.js'

const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser || currentUser.role !== "student") {
  window.location.href = "login.html";
}

  const getRequests = () => JSON.parse(localStorage.getItem("studentRequests") || "[]")

  const saveRequests = (requests) => localStorage.setItem("studentRequests", JSON.stringify(requests || []))

  const getTotalSum = (dataArray) => dataArray.reduce((acc, { amount }) => acc + amount,0)


  const convertImageToBase64 = (inputElement) => {
  return new Promise((resolve, reject) => {
    const file = inputElement.files[0];
    if (!file) {
      return reject("No file selected");
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result); // Base64 string
    };

    reader.onerror = (error) => {
      reject("Error reading file: " + error);
    };

    reader.readAsDataURL(file);
  });
}

// const requestImageInput = document.getElementById("")
// const requestBase64 = await convertImageToBase64(requestImageInput)

// const newRequestData = {
//       "id": Date.now(),
//       "requestType": "",
//       "date": "",
//       "status": "Under Review",
//       "description": "", 
//       requestBase64,
//       "amount": ,
//       "studentId": id
// }


  const  renderRequests = async (userId) => {
    const requests = await User.findRequestByUserId(userId);

    const mainContent = document.getElementById("main-content");


    if(!requests.length){
      mainContent.innerHTML = `
      <h3>My Requests</h3>
      <h2>You havn't any request yet .</h3>
      `;
      return;
    }

    const rows = requests.map(({ requestType, date, status, description, amount }) => `
      <tr>
        <td>${requestType}</td>
        <td>${date}</td>
        <td><span class="badge ${status === 'Approved' ? 'bg-success' : status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}">${status}</span></td>
        <td>${description}</td>
        <td>$${amount}</td>
      </tr>
    `).join("");

    mainContent.innerHTML = `
      <h3>My Requests</h3>
        <div class="table-responsive mt-4">
          <table class="table table-hover bg-white mt-3 rounded-3 shadow-sm">
            <thead class="table-light">
              <tr>
                <th>Request</th>
                <th>Date</th>
                <th>Status</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      <div class="mt-3">
        <h6>Total Approved Funding: <strong>${getTotalSum(requests)}</strong></h6>
      </div>
    `;
  }

document.addEventListener("DOMContentLoaded", function () {
  const { username, id } = currentUser;


  document.getElementById("studentName").textContent = username;

  const mainContent = document.getElementById("main-content");
  const navLinks = document.querySelectorAll(".nav-link");
  const badgeRequests = document.getElementById("badgeRequests");



  function updateBadge() {
    const count = getRequests().length;
    badgeRequests.textContent = count > 0 ? count : "";
  }

  function renderHome() {
    mainContent.innerHTML = `
      <h3>Welcome, ${username}!</h3>
      <h5 class="mb-3">Your Funded Requests</h5>
      <div class="row g-4">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg rounded-3">
            <img src="https://via.placeholder.com/300x150?text=Scholarship" class="card-img-top" alt="Scholarship">
            <div class="card-body">
              <h5>Scholarship</h5>
              <p>Received funding for tuition fees.</p>
              <strong>$1,000</strong><br>
              <small>04/15/2024</small>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg rounded-3">
            <img src="https://via.placeholder.com/300x150?text=Course" class="card-img-top" alt="Course">
            <div class="card-body">
              <h5>Course</h5>
              <p>Python programming course.</p>
              <strong>$300</strong><br>
              <small>03/20/2024</small>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg rounded-3">
            <img src="https://via.placeholder.com/300x150?text=Supplies" class="card-img-top" alt="Supplies">
            <div class="card-body">
              <h5>Supplies</h5>
              <p>Received funds for school supplies.</p>
              <strong>$150</strong><br>
              <small>01/10/2024</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderNewRequest() {
    mainContent.innerHTML = `
      <h3>Submit a New Request</h3>
      <form id="newRequestForm" class="mt-4">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="requestName" class="form-label">Name</label>
            <input type="text" id="requestName" class="form-control" value="${username}" readonly />
          </div>
          <div class="col-md-6">
            <label for="requestAge" class="form-label">Age</label>
            <input type="number" id="requestAge" class="form-control" placeholder="Enter your age" required />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="requestType" class="form-label">Type of Request</label>
            <select id="requestType" class="form-select" required>
              <option value="" disabled selected>Select type</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Course">Course</option>
              <option value="Supplies">Supplies</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="requestVideo" class="form-label">Upload a Video</label>
            <input type="file" id="requestVideo" class="form-control" accept="video/*" />
          </div>
        </div>

        <div class="mb-3">
          <label for="requestReason" class="form-label">Why do you need this request?</label>
          <textarea id="requestReason" class="form-control" rows="3" required></textarea>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="requestDeadline" class="form-label">Deadline</label>
            <input type="date" id="requestDeadline" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label for="requestAmount" class="form-label">Amount Needed ($)</label>
            <input type="number" id="requestAmount" class="form-control" min="1" required />
          </div>
        </div>

        <button type="submit" class="btn btn-primary mt-3"><i class="bi bi-send"></i> Submit Request</button>
      </form>
    `;

    document.getElementById("newRequestForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const newRequest = {
        type: document.getElementById("requestType").value,
        date: new Date().toLocaleDateString(),
        status: "Pending",
        description: document.getElementById("requestReason").value,
        amount: parseFloat(document.getElementById("requestAmount").value).toFixed(2),
      };
      const requests = getRequests();
      requests.push(newRequest);
      saveRequests(requests);
      updateBadge();
      alert("Request submitted successfully!");
      setActiveNav("requests");
      renderRequests(id);
    });
  }

  function setActiveNav(section) {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.dataset.section === section);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      setActiveNav(section);
      if(section === "home") {
        renderHome()
      } else if(section === "requests") {
        await renderRequests(id)
      }else if(section === "new") {
        renderNewRequest()
      };
    });
  });

  updateBadge();
  renderHome();
});

        